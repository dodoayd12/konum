import type { DocumentData, DocumentSnapshot } from 'firebase/firestore';

import type { MapPost, PostCategory } from '@/data/mockPosts';

function asCategory(v: unknown): PostCategory {
  if (v === 'bildiri' || v === 'etkinlik' || v === 'anlik') return v;
  return 'bildiri';
}

export function docToMapPost(doc: DocumentSnapshot<DocumentData>): MapPost | null {
  const d = doc.data();
  if (!d) return null;
  const lat = typeof d.latitude === 'number' ? d.latitude : Number(d.latitude);
  const lng = typeof d.longitude === 'number' ? d.longitude : Number(d.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    id: doc.id,
    latitude: lat,
    longitude: lng,
    title: String(d.title ?? ''),
    body: String(d.body ?? ''),
    imageUrl: String(d.imageUrl ?? ''),
    authorId: String(d.authorId ?? ''),
    authorName: String(d.authorName ?? ''),
    category: asCategory(d.category),
  };
}
