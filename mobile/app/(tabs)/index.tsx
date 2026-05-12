import * as Location from 'expo-location';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostDetailModal } from '@/components/PostDetailModal';
import { CategoryColors, KonumColors } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { MOCK_POSTS, type MapPost, type PostCategory } from '@/data/mockPosts';

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

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [selected, setSelected] = useState<MapPost | null>(null);
  const [locationReady, setLocationReady] = useState(false);

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

  const markers = useMemo(() => MOCK_POSTS, []);

  const onSelect = useCallback((p: MapPost) => setSelected(p), []);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webWrap, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.webTitle}>Harita</Text>
        <Text style={styles.webBody}>
          Bu ekran iOS ve Android için optimize edildi. Gerçek cihazda veya simülatörde haritayı görebilirsin.
        </Text>
        <Pressable onPress={() => signOut()} style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>Çıkış yap</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={locationReady}
        showsMyLocationButton={false}
        mapType="mutedStandard"
        userInterfaceStyle="dark">
        {markers.map((p) => (
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
          </View>
          <Pressable onPress={() => signOut()} hitSlop={10} style={styles.signOut}>
            <Text style={styles.signOutText}>Çıkış</Text>
          </Pressable>
        </View>
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
  webWrap: { flex: 1, backgroundColor: KonumColors.canvas, paddingHorizontal: 20, gap: 12 },
  webTitle: { color: KonumColors.text, fontSize: 28, fontWeight: '900' },
  webBody: { color: KonumColors.textMuted, fontSize: 15, lineHeight: 22 },
  outlineBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(62,232,196,0.45)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  outlineBtnText: { color: KonumColors.accent, fontWeight: '900' },
});
