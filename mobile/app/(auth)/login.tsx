import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KonumColors } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setBusy(true);
    try {
      await signIn(email, password, displayName);
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Giriş', e instanceof Error ? e.message : 'Bir hata oluştu.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <LinearGradient
      colors={['#070B12', '#0E1A2E', '#132A45']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.hero}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>KONUM</Text>
            </View>
            <Text style={styles.title}>Haritada paylaşım,</Text>
            <Text style={styles.titleAccent}>anlık ve etkinlik</Text>
            <Text style={styles.subtitle}>
              Yakınındaki bildirileri keşfet; paylaşımlara mesaj gönder, sohbeti başlat.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Görünen ad</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="ör. Ayşe"
              placeholderTextColor="rgba(244,246,251,0.35)"
              autoCapitalize="words"
              style={styles.input}
            />
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@posta.com"
              placeholderTextColor="rgba(244,246,251,0.35)"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.label}>Şifre</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(244,246,251,0.35)"
              secureTextEntry
              style={styles.input}
            />

            <Pressable
              onPress={onSubmit}
              disabled={busy}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryBtnPressed,
                busy && styles.primaryBtnDisabled,
              ]}>
              {busy ? (
                <ActivityIndicator color="#061018" />
              ) : (
                <Text style={styles.primaryBtnText}>Giriş yap</Text>
              )}
            </Pressable>

            <Text style={styles.hint}>Demo: herhangi bir dolu alanla giriş yapılır; veri cihazda saklanır.</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 22, justifyContent: 'space-between' },
  hero: { gap: 10 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: KonumColors.accentSoft,
    borderWidth: 1,
    borderColor: 'rgba(62,232,196,0.35)',
  },
  badgeText: {
    color: KonumColors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: { color: KonumColors.text, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  titleAccent: { color: KonumColors.accent, fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: KonumColors.textMuted, fontSize: 15, lineHeight: 22, maxWidth: 360 },
  card: {
    backgroundColor: 'rgba(18,27,46,0.72)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: KonumColors.border,
    gap: 10,
  },
  label: { color: KonumColors.textMuted, fontSize: 13, fontWeight: '600', marginTop: 4 },
  input: {
    backgroundColor: 'rgba(6,10,18,0.55)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: KonumColors.text,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    fontSize: 16,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: KonumColors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryBtnText: { color: '#061018', fontSize: 16, fontWeight: '800' },
  hint: { color: KonumColors.textMuted, fontSize: 12, lineHeight: 16, marginTop: 6 },
});
