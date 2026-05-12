import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryColors, KonumColors } from '@/constants/Theme';
import { useMessages, type ThreadMessage } from '@/context/MessagesContext';
import type { MapPost, PostCategory } from '@/data/mockPosts';

const categoryLabel: Record<PostCategory, string> = {
  bildiri: 'Bildiri',
  etkinlik: 'Etkinlik',
  anlik: 'Anlık',
};

type Props = {
  visible: boolean;
  post: MapPost | null;
  onClose: () => void;
};

export function PostDetailModal({ visible, post, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { threads, sendToPost } = useMessages();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<ThreadMessage>>(null);

  const thread = post ? threads[post.id] : undefined;
  const messages = thread?.messages ?? [];

  useEffect(() => {
    if (visible && messages.length) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [visible, messages.length]);

  if (!post) return null;

  const accent = CategoryColors[post.category];

  const send = () => {
    sendToPost(post, draft);
    setDraft('');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.root, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Kapat</Text>
          </Pressable>
          <View style={[styles.chip, { borderColor: accent }]}>
            <Text style={[styles.chipText, { color: accent }]}>{categoryLabel[post.category]}</Text>
          </View>
          <View style={{ width: 64 }} />
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.postBlock}>
              <Image source={{ uri: post.imageUrl }} style={styles.image} contentFit="cover" />
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.body}>{post.body}</Text>
              <Text style={styles.author}>@{post.authorName}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.bubbleRow, item.from === 'me' ? styles.bubbleRowMe : styles.bubbleRowThem]}>
              <View
                style={[
                  styles.bubble,
                  item.from === 'me' ? styles.bubbleMe : styles.bubbleThem,
                ]}>
                <Text style={item.from === 'me' ? styles.bubbleTextMe : styles.bubbleTextThem}>{item.text}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Henüz mesaj yok. İlk mesajı sen gönder.</Text>
          }
        />

        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Paylaşım sahibine yaz…"
            placeholderTextColor="rgba(244,246,251,0.35)"
            style={styles.composerInput}
            multiline
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              !draft.trim() && styles.sendBtnDisabled,
              pressed && draft.trim() && { opacity: 0.9 },
            ]}>
            <Text style={styles.sendBtnText}>Gönder</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KonumColors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: KonumColors.border,
  },
  headerBtn: { width: 64 },
  headerBtnText: { color: KonumColors.accent, fontWeight: '700', fontSize: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  postBlock: { paddingTop: 8, gap: 10 },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: KonumColors.border,
  },
  title: { color: KonumColors.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  body: { color: KonumColors.textMuted, fontSize: 15, lineHeight: 22 },
  author: { color: KonumColors.text, opacity: 0.85, fontWeight: '700', marginBottom: 8 },
  empty: { color: KonumColors.textMuted, marginTop: 10, fontSize: 14 },
  bubbleRow: { marginTop: 10, width: '100%' },
  bubbleRowMe: { alignItems: 'flex-end' },
  bubbleRowThem: { alignItems: 'flex-start' },
  bubble: { maxWidth: '86%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16 },
  bubbleMe: { backgroundColor: KonumColors.accent },
  bubbleThem: { backgroundColor: KonumColors.surfaceElevated, borderWidth: 1, borderColor: KonumColors.border },
  bubbleTextMe: { color: '#061018', fontSize: 15, lineHeight: 20 },
  bubbleTextThem: { color: KonumColors.text, fontSize: 15, lineHeight: 20 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: KonumColors.border,
    backgroundColor: KonumColors.surface,
  },
  composerInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: KonumColors.text,
    backgroundColor: 'rgba(6,10,18,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sendBtn: {
    backgroundColor: KonumColors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  sendBtnDisabled: { opacity: 0.35 },
  sendBtnText: { color: '#061018', fontWeight: '900' },
});
