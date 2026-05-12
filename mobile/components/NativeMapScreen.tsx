import * as Location from 'expo-location';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
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

const initialRegion = {
  latitude: 41.03,
  longitude: 28.98,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export default function NativeMapScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { posts, loading, error } = useFirestorePosts();
  const [selected, setSelected] = useState<MapPost | null>(null);
  const [locationReady, setLocationReady] = useState(false);
  const [seeding, setSeeding] = useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!cancelled) setLocationReady(status === 'granted');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSelect = useCallback((p: MapPost) => setSelected(p), []);

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
    <View style={styles.root}>
      {error ? (
        <View style={[styles.banner, { top: insets.top + 8 }]}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      ) : null}

      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={locationReady}
        showsMyLocationButton={false}
        mapType="mutedStandard"
        userInterfaceStyle="dark">
        {posts.map((p) => (
          <Marker key={p.id} coordinate={{ latitude: p.latitude, longitude: p.longitude }} onPress={() => onSelect(p)}>
            <View style={styles.markerOuter}>
              <View style={[styles.markerInner, { borderColor: CategoryColors[p.category] }]} />
            </View>
          </Marker>
        ))}
      </MapView>

      <View pointerEvents="box-none" style={[styles.topChrome, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <View style={styles.brandPill}>
            <Text style={styles.brandText}>Konum</Text>
            <Text style={styles.greet} numberOfLines={1}>
              Merhaba, {user?.displayName ?? 'misafir'}
            </Text>
            {loading ? <ActivityIndicator color={KonumColors.accent} style={{ marginTop: 8 }} /> : null}
          </View>
          <Pressable onPress={() => signOut()} hitSlop={10} style={styles.signOut}>
            <Text style={styles.signOutText}>Çıkış</Text>
          </Pressable>
        </View>
        {!loading && posts.length === 0 && user ? (
          <Pressable
            onPress={onSeed}
            disabled={seeding}
            style={[styles.seedBtn, seeding && { opacity: 0.6 }]}>
            <Text style={styles.seedBtnText}>{seeding ? 'Ekleniyor…' : 'Örnek paylaşımları ekle'}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.legend, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {(Object.keys(categoryLabel) as PostCategory[]).map((key) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CategoryColors[key] }]} />
            <Text style={styles.legendText}>{categoryLabel[key]}</Text>
          </View>
        ))}
      </View>

      <PostDetailModal visible={!!selected} post={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KonumColors.canvas },
  banner: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 3,
    backgroundColor: 'rgba(255,80,80,0.2)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,120,120,0.5)',
  },
  bannerText: { color: KonumColors.text, fontSize: 13 },
  markerOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(6,10,18,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: KonumColors.text,
    borderWidth: 3,
  },
  topChrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: 14,
    gap: 10,
  },
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
  seedBtn: {
    alignSelf: 'flex-start',
    backgroundColor: KonumColors.accentSoft,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(62,232,196,0.35)',
  },
  seedBtnText: { color: KonumColors.accent, fontWeight: '800', fontSize: 14 },
  legend: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: KonumColors.overlay,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: KonumColors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: KonumColors.text, fontSize: 12, fontWeight: '700' },
});
