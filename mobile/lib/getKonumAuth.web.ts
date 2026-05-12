import { getAuth, type Auth } from 'firebase/auth';

import { app } from '@/lib/firebaseApp';

let authSingleton: Auth | null = null;

export function getKonumAuth(): Auth {
  if (!authSingleton) {
    authSingleton = getAuth(app);
  }
  return authSingleton;
}
