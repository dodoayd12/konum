import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { MapPost } from '@/data/mockPosts';

export type ThreadMessage = {
  id: string;
  from: 'me' | 'author';
  text: string;
  createdAt: number;
};

export type MessageThread = {
  post: MapPost;
  messages: ThreadMessage[];
};

type MessagesContextValue = {
  threads: Record<string, MessageThread>;
  sendToPost: (post: MapPost, text: string) => void;
};

const MessagesContext = createContext<MessagesContextValue | undefined>(undefined);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Record<string, MessageThread>>({});

  const sendToPost = useCallback((post: MapPost, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const msg: ThreadMessage = {
      id,
      from: 'me',
      text: trimmed,
      createdAt: Date.now(),
    };
    setThreads((prev) => {
      const existing = prev[post.id];
      if (existing) {
        return {
          ...prev,
          [post.id]: { ...existing, messages: [...existing.messages, msg] },
        };
      }
      return {
        ...prev,
        [post.id]: { post, messages: [msg] },
      };
    });

    setTimeout(() => {
      const reply: ThreadMessage = {
        id: `auto-${Date.now()}`,
        from: 'author',
        text: `${post.authorName}: Mesajın için teşekkürler! En kısa sürede dönüş yapacağım.`,
        createdAt: Date.now(),
      };
      setThreads((prev) => {
        const t = prev[post.id];
        if (!t) return prev;
        return {
          ...prev,
          [post.id]: { ...t, messages: [...t.messages, reply] },
        };
      });
    }, 1500);
  }, []);

  const value = useMemo(() => ({ threads, sendToPost }), [threads, sendToPost]);

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
}
