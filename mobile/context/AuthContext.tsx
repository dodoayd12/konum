import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getKonumAuth } from '@/lib/firebase';

export type AuthUser = {
  id: string;
  displayName: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  firebaseUser: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapUser(u: User | null): AuthUser | null {
  if (!u) return null;
  return {
    id: u.uid,
    displayName: (u.displayName || u.email || 'Kullanıcı').trim(),
    email: (u.email || '').trim(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getKonumAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (email: string, password: string, displayName: string) => {
    const auth = getKonumAuth();
    const em = email.trim();
    const pw = password.trim();
    const name = displayName.trim();
    if (!em || !pw) throw new Error('E-posta ve şifre gerekli.');
    try {
      const cred = await createUserWithEmailAndPassword(auth, em, pw);
      if (name) await updateProfile(cred.user, { displayName: name });
    } catch (e: unknown) {
      const code = e && typeof e === 'object' && 'code' in e ? String((e as { code: string }).code) : '';
      if (code === 'auth/email-already-in-use') {
        await signInWithEmailAndPassword(auth, em, pw);
      } else {
        throw e instanceof Error ? e : new Error('Giriş başarısız.');
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(getKonumAuth());
  }, []);

  const user = useMemo(() => mapUser(firebaseUser), [firebaseUser]);

  const value = useMemo(
    () => ({ user, firebaseUser, isLoading, signIn, signOut }),
    [user, firebaseUser, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
