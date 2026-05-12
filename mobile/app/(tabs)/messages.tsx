import { useRouter } from 'expo-router';
import { collectionGroup, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostDetailModal } from '@/components/PostDetailModal';
import { CategoryColors, KonumColors } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import type { MapPost, PostCategory } from '@/data/mockPosts';
import { db } from '@/lib/firebase';

type Row = { post: MapPost; preview: string; time: number };

function asCategory(v: unknown): PostCategory {
  if (v === 'bildiri' || v === 'etkinlik' || v === 'anlik') return v;
  return 'bildiri';
}

function postFromMessageDoc(postId: string, data: Record<string, unknown>): MapPost {
  return {
    id: postId,
    title: String(data.postTitle ?? ''),
    body: String(data.postBody ?? ''),
    imageUrl: String(data.postImageUrl ?? ''),
    authorName: String(data.postAuthorName ?? ''),
    authorId: String(data.postAuthorId ?? ''),
    category: asCategory(data.postCategory),
    latitude: Number(data.postLatitude ?? 0),
    longitude: Number(data.postLongitude ?? 0),
  };
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, firebaseUser } = useAuth();
  const [openPost, setOpenPost] = useState<MapPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<{ id: string; postId: string; data: Record<string, unknown> }[]>([]);

  useEffect(() => {
    if (!firebaseUser) {
      setDocs([]);
      setLoading(false);
      return;
    }
    const q = query(
      collectionGroup(db, 'messages'),
      where('senderId', '==', firebaseUser.uid),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next = snap.docs.map((d) => {
          const parent = d.ref.parent;
          const postRef = parent?.parent;
          const postId = postRef?.id ?? '';
          return { id: d.id, postId, data: d.data() as Record<string, unknown> };
        });
        setDocs(next);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [firebaseUser]);

  const rows: Row[] = useMemo(() => {
    const byPost = new Map<string, Row>();
    for (const { postId, data } of docs) {
      if (!postId || byPost.has(postId)) continue;
      const text = String(data.text ?? '');
      const t =
        data.createdAt && typeof data.createdAt === 'object' && 'toMillis' in data.createdAt
          ? (data.createdAt as { toMillis: () => number }).toMillis()
          : 0;
      byPost.set(postId, {
        post: postFromMessageDoc(postId, data),
        preview: text,
        time: t,
      });
    }
    return [...byPost.values()].sort((a, b) => b.time - a.time);
  }, [docs]);

  if (!user) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.muted}>Giriş yapılmadı.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesajlar</Text>
        <Text style={styles.subtitle}>Gönderdiğin mesajlar paylaşım başlığına göre gruplanır.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={KonumColors.accent} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.post.id}
          contentContainerStyle={rows.length ? styles.list : styles.listEmpty}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Henüz mesaj yok</Text>
              <Text style={styles.emptyBody}>Haritada bir pine dokun, paylaşımı aç ve sohbeti başlat.</Text>
              <Pressable onPress={() => router.push('/(tabs)')} style={styles.primaryMini}>
                <Text style={styles.primaryMiniText}>Haritaya git</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setOpenPost(item.post)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
              <View style={[styles.accentBar, { backgroundColor: CategoryColors[item.post.category] }]} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.post.title}
                </Text>
                <Text style={styles.rowPreview} numberOfLines={2}>
                  {item.preview}
                </Text>
                <Text style={styles.rowMeta}>@{item.post.authorName}</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <PostDetailModal visible={!!openPost} post={openPost} onClose={() => setOpenPost(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KonumColors.canvas },
  center: { alignItems: 'center', justifyContent: 'center' },
  muted: { color: KonumColors.textMuted },
  header: { paddingHorizontal: 16, paddingBottom: 10, gap: 6 },
  title: { color: KonumColors.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.4 },
  subtitle: { color: KonumColors.textMuted, fontSize: 14, lineHeight: 20 },
  list: { paddingHorizontal: 14, paddingBottom: 24, gap: 12 },
  listEmpty: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    backgroundColor: KonumColors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: KonumColors.border,
  },
  accentBar: { width: 5 },
  rowBody: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, gap: 6 },
  rowTitle: { color: KonumColors.text, fontSize: 16, fontWeight: '800' },
  rowPreview: { color: KonumColors.textMuted, fontSize: 14, lineHeight: 18 },
  rowMeta: { color: KonumColors.text, opacity: 0.65, fontSize: 12, fontWeight: '700' },
  empty: {
    backgroundColor: KonumColors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: KonumColors.border,
    gap: 10,
  },
  emptyTitle: { color: KonumColors.text, fontSize: 18, fontWeight: '900' },
  emptyBody: { color: KonumColors.textMuted, fontSize: 14, lineHeight: 20 },
  primaryMini: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: KonumColors.accent,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryMiniText: { color: '#061018', fontWeight: '900' },
});
