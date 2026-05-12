import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostDetailModal } from '@/components/PostDetailModal';
import { CategoryColors, KonumColors } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import type { MapPost, PostCategory } from '@/data/mockPosts';
import { useFirestorePosts } from '@/hooks/useFirestorePosts';
import { seedDemoPosts } from '@/lib/seedDemoPosts';

const categoryLabel: Record<PostCategory, string> = {
  bildiri: 'Bildiri',
  etkinlik: 'Etkinlik',
  anlik: 'Anlık',
};

export default function MapScreenWeb() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { posts, loading, error } = useFirestorePosts();
  const [selected, setSelected] = useState<MapPost | null>(null);
  const [seeding, setSeeding] = useState(false);

  const onSeed = async () => {
    if (!user) return;
    setSeeding(true);
    try {
      await seedDemoPosts(user.id, user.displayName);
      Alert.alert('Tamam', 'Örnek paylaşımlar eklendi.');
    } catch (e) {
      Alert.alert('Hata', e instanceof Error ? e.message : 'Yükleme başarısız.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
      {error ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.topRow}>
        <View style={styles.brandPill}>
          <Text style={styles.brandText}>Konum (web)</Text>
          <Text style={styles.greet} numberOfLines={1}>
            Merhaba, {user?.displayName ?? 'misafir'}
          </Text>
          {loading ? <ActivityIndicator color={KonumColors.accent} style={{ marginTop: 8 }} /> : null}
        </View>
        <Pressable onPress={() => signOut()} style={styles.signOut}>
          <Text style={styles.signOutText}>Çıkış</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>
        Web’de etkileşimli harita yerine paylaşım listesi gösteriliyor (Firebase ile aynı veri). Mobil uygulamada
        harita tamdır.
      </Text>

      {!loading && posts.length === 0 && user ? (
        <Pressable onPress={onSeed} disabled={seeding} style={[styles.seedBtn, seeding && { opacity: 0.6 }]}>
          <Text style={styles.seedBtnText}>{seeding ? 'Ekleniyor…' : 'Örnek paylaşımları ekle'}</Text>
        </Pressable>
      ) : null}

      <View style={styles.legend}>
        {(Object.keys(categoryLabel) as PostCategory[]).map((key) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CategoryColors[key] }]} />
            <Text style={styles.legendText}>{categoryLabel[key]}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)} style={styles.row}>
            <View style={[styles.accentBar, { backgroundColor: CategoryColors[item.category] }]} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.rowMeta}>
                @{item.authorName} · {item.latitude.toFixed(3)}, {item.longitude.toFixed(3)}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>Henüz paylaşım yok. Yukarıdaki düğmeyle örnekleri ekleyebilirsin.</Text>
          ) : null
        }
      />

      <PostDetailModal visible={!!selected} post={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KonumColors.canvas, paddingHorizontal: 14 },
  banner: {
    backgroundColor: 'rgba(255,80,80,0.2)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,120,120,0.5)',
  },
  bannerText: { color: KonumColors.text, fontSize: 13 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brandPill: {
    flex: 1,
    backgroundColor: KonumColors.overlay,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: KonumColors.border,
  },
  brandText: { color: KonumColors.accent, fontWeight: '900', letterSpacing: 1.2, fontSize: 12 },
  greet: { color: KonumColors.text, fontWeight: '700', fontSize: 16, marginTop: 4 },
  signOut: {
    backgroundColor: KonumColors.overlay,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: KonumColors.border,
  },
  signOutText: { color: KonumColors.text, fontWeight: '800' },
  note: { color: KonumColors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 10 },
  seedBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: KonumColors.accentSoft,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(62,232,196,0.35)',
  },
  seedBtnText: { color: KonumColors.accent, fontWeight: '800', fontSize: 14 },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: KonumColors.overlay,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: KonumColors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: KonumColors.text, fontSize: 12, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    backgroundColor: KonumColors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: KonumColors.border,
  },
  accentBar: { width: 4 },
  rowBody: { flex: 1, padding: 12, gap: 4 },
  rowTitle: { color: KonumColors.text, fontSize: 16, fontWeight: '800' },
  rowMeta: { color: KonumColors.textMuted, fontSize: 12 },
  empty: { color: KonumColors.textMuted, marginTop: 16, textAlign: 'center' },
});
