import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { MOCK_POSTS } from '@/data/mockPosts';

/** Yazar olarak mevcut kullanıcıyla örnek pinleri Firestore’a yazar. */
export async function seedDemoPosts(authorId: string, authorName: string) {
  const col = collection(db, 'posts');
  for (const p of MOCK_POSTS) {
    await addDoc(col, {
      title: p.title,
      body: p.body,
      imageUrl: p.imageUrl,
      latitude: p.latitude,
      longitude: p.longitude,
      category: p.category,
      authorId,
      authorName,
      createdAt: serverTimestamp(),
    });
  }
}
