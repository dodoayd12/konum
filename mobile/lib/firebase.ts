import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { app } from '@/lib/firebaseApp';

export { app } from '@/lib/firebaseApp';
export { getKonumAuth } from '@/lib/getKonumAuth';

export const db = getFirestore(app);
export const storage = getStorage(app);
