import type { Auth } from 'firebase/auth';
import { Platform } from 'react-native';

export function getKonumAuth(): Auth {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getKonumAuth: g } = require('./getKonumAuth.web') as typeof import('./getKonumAuth.web');
    return g();
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getKonumAuth: g } = require('./getKonumAuth.native') as typeof import('./getKonumAuth.native');
  return g();
}
