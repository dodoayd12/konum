import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebase';
import { docToMapPost } from '@/lib/firestorePosts';
import type { MapPost } from '@/data/mockPosts';

export function useFirestorePosts() {
  const [posts, setPosts] = useState<MapPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: MapPost[] = [];
        for (const doc of snap.docs) {
          const m = docToMapPost(doc);
          if (m) next.push(m);
        }
        setPosts(next);
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { posts, loading, error };
}
