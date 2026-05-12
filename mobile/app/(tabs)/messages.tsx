import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostDetailModal } from '@/components/PostDetailModal';
import { CategoryColors, KonumColors } from '@/constants/Theme';
import { useMessages } from '@/context/MessagesContext';
import type { MapPost } from '@/data/mockPosts';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { threads } = useMessages();
  const [openPost, setOpenPost] = useState<MapPost | null>(null);

  const rows = useMemo(() => {
    return Object.values(threads)
      .map((t) => {
        const last = t.messages[t.messages.length - 1];
        return { post: t.post, preview: last?.text ?? '', time: last?.createdAt ?? 0 };
      })
      .sort((a, b) => b.time - a.time);
  }, [threads]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesajlar</Text>
        <Text style={styles.subtitle}>Paylaşımlara gönderdiğin mesajlar burada listelenir.</Text>
      </View>

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
          <Pressable onPress={() => setOpenPost(item.post)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
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

      <PostDetailModal visible={!!openPost} post={openPost} onClose={() => setOpenPost(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KonumColors.canvas },
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
