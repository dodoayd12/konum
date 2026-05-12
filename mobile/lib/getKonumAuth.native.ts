import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Auth } from 'firebase/auth';

import { app } from '@/lib/firebaseApp';

// Metro RN çözümlemesi: @firebase/auth RN girişi (web tiplerinde yok)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rn = require('@firebase/auth/dist/rn/index.js') as {
  initializeAuth: (a: typeof app, opts: { persistence: unknown }) => Auth;
  getReactNativePersistence: (s: typeof AsyncStorage) => unknown;
};

let authSingleton: Auth | null = null;

export function getKonumAuth(): Auth {
  if (!authSingleton) {
    authSingleton = rn.initializeAuth(app, {
      persistence: rn.getReactNativePersistence(AsyncStorage),
    });
  }
  return authSingleton;
}
