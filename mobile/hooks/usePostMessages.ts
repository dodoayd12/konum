import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '@/lib/firebase';

export type ThreadMessage = {
  id: string;
  from: 'me' | 'them';
  text: string;
  createdAt: number;
};

function toMillis(v: unknown): number {
  if (v && typeof v === 'object' && 'toMillis' in v && typeof (v as { toMillis: () => number }).toMillis === 'function') {
    return (v as { toMillis: () => number }).toMillis();
  }
  if (typeof v === 'number') return v;
  return Date.now();
}

export function usePostMessages(postId: string | null, uid: string | null, authorId: string | null) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);

  useEffect(() => {
    if (!postId || !uid) {
      setMessages([]);
      return;
    }

    const base = collection(db, 'posts', postId, 'messages');

    if (authorId && uid === authorId) {
      const q = query(base, orderBy('createdAt', 'asc'));
      return onSnapshot(q, (snap) => {
        setMessages(
          snap.docs.map((d) => {
            const data = d.data();
            const sid = String(data.senderId ?? '');
            return {
              id: d.id,
              from: sid === uid ? 'me' : 'them',
              text: String(data.text ?? ''),
              createdAt: toMillis(data.createdAt),
            };
          }),
        );
      });
    }

    const q1 = query(base, where('senderId', '==', uid), orderBy('createdAt', 'asc'));
    const q2 = query(base, where('audienceUid', '==', uid), orderBy('createdAt', 'asc'));

    let m1: ThreadMessage[] = [];
    let m2: ThreadMessage[] = [];

    const merge = () => {
      const byId = new Map<string, ThreadMessage>();
      for (const m of [...m1, ...m2]) byId.set(m.id, m);
      setMessages([...byId.values()].sort((a, b) => a.createdAt - b.createdAt));
    };

    const u1 = onSnapshot(q1, (snap) => {
      m1 = snap.docs.map((d) => {
        const data = d.data();
        const sid = String(data.senderId ?? '');
        return {
          id: d.id,
          from: sid === uid ? 'me' : 'them',
          text: String(data.text ?? ''),
          createdAt: toMillis(data.createdAt),
        };
      });
      merge();
    });
    const u2 = onSnapshot(q2, (snap) => {
      m2 = snap.docs.map((d) => {
        const data = d.data();
        const sid = String(data.senderId ?? '');
        return {
          id: d.id,
          from: sid === uid ? 'me' : 'them',
          text: String(data.text ?? ''),
          createdAt: toMillis(data.createdAt),
        };
      });
      merge();
    });

    return () => {
      u1();
      u2();
    };
  }, [postId, uid, authorId]);

  return messages;
}
