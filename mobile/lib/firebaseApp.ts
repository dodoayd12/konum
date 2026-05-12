import { getApps, initializeApp } from 'firebase/app';

import { firebaseConfig } from '@/constants/firebaseConfig';

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
