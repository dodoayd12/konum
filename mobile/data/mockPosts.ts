export type PostCategory = 'bildiri' | 'etkinlik' | 'anlik';

export type MapPost = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  body: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  category: PostCategory;
};

/** İstanbul çevresi — örnek paylaşımlar (Unsplash görselleri) */
export const MOCK_POSTS: MapPost[] = [
  {
    id: '1',
    latitude: 41.0082,
    longitude: 28.9784,
    title: 'Sultanahmet çevresinde sokak müziği',
    body: 'Bu akşam 19:00’da küçük bir unplugged performans var. Katılmak isteyenler yorum bıraksın.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    authorId: 'u1',
    authorName: 'Deniz K.',
    category: 'etkinlik',
  },
  {
    id: '2',
    latitude: 41.0369,
    longitude: 28.985,
    title: 'Kadıköy’de yol çalışması',
    body: 'Moda istikametinde tek şerit kapalı; alternatif olarak Bahariye tarafını kullanın.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    authorId: 'u2',
    authorName: 'Şehir Notları',
    category: 'anlik',
  },
  {
    id: '3',
    latitude: 41.0422,
    longitude: 29.01,
    title: 'Boğaz manzaralı fotoğraf noktası',
    body: 'Gün batımında ışık harika; tripod alanlar için küçük bir platform var.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    authorId: 'u3',
    authorName: 'Lara',
    category: 'bildiri',
  },
  {
    id: '4',
    latitude: 41.025,
    longitude: 28.974,
    title: 'Kitap takası buluşması',
    body: 'Cumartesi öğleden sonra Karaköy’de; getirdiğin kitap kadar götürürsün.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c305e0a081?w=800&q=80',
    authorId: 'u4',
    authorName: 'Okuma Kulübü',
    category: 'etkinlik',
  },
  {
    id: '5',
    latitude: 41.06,
    longitude: 28.955,
    title: 'Metro yoğunluğu',
    body: 'Şu an T1 hattında beklenenden fazla kalabalık; mümkünse 10 dk sonra deneyin.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    authorId: 'u5',
    authorName: 'Anlık',
    category: 'anlik',
  },
];
