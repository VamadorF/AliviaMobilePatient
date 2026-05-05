import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Card, EmptyState, OptionPill, Screen } from '@/shared/components';
import { useCommunityStore } from '@/features/community/store/community.store';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type {
  CommunityPost,
  CommunityPostCategory,
} from '@/shared/types/domain';
import type { CommunityStackParamList } from '@/shared/types/navigation';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

const categories: { id: CommunityPostCategory; label: string }[] = [
  { id: 'experiencias', label: 'Experiencias' },
  { id: 'preguntas', label: 'Preguntas' },
  { id: 'logros', label: 'Logros' },
  { id: 'recursos', label: 'Recursos' },
  { id: 'apoyo', label: 'Apoyo' },
];


export const CommunityDetailScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const route = useRoute<RouteProp<CommunityStackParamList, 'CommunityDetail'>>();
  const { communityId } = route.params;

  const hydrate = useCommunityStore((s) => s.hydrate);
  const communities = useCommunityStore((s) => s.communities);
  const postsForCommunity = useCommunityStore((s) => s.postsForCommunity);
  const createPost = useCommunityStore((s) => s.createPost);
  const updatePost = useCommunityStore((s) => s.updatePost);
  const deletePost = useCommunityStore((s) => s.deletePost);
  const user = useAuthStore((s) => s.user);
  const authorId = user?.id ?? 'demo-local';

  const [filterCategory, setFilterCategory] =
    useState<CommunityPostCategory | 'all'>('all');
  const [editor, setEditor] = useState<{
    visible: boolean;
    post: CommunityPost | null;
  }>({ visible: false, post: null });

  useEffect(() => {
    hydrate().catch(() => {});
  }, [hydrate]);

  const community = communities.find((c) => c.id === communityId);
  const posts = postsForCommunity(communityId);

  const filtered = useMemo(() => {
    if (filterCategory === 'all') return posts;
    return posts.filter((p) => p.category === filterCategory);
  }, [posts, filterCategory]);

  const authorName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : 'Tú';

  const formatDate = (iso: string) => {
    try {
      return format(parseISO(iso), "d MMM yyyy · HH:mm", { locale: es });
    } catch {
      return iso;
    }
  };

  const handleDelete = (post: CommunityPost) => {
    const run = () => deletePost(post.id);
    if (typeof Alert?.alert === 'function') {
      Alert.alert('Eliminar publicación', '¿Quieres eliminarla?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: run },
      ]);
    } else {
      run();
    }
  };

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={styles.back}
      >
        <Ionicons name="chevron-back" size={26} color={Colors.text.primary} />
      </Pressable>

      <Text style={styles.title} numberOfLines={4}>
        {community?.name ?? 'Comunidad'}
      </Text>

      {community?.description ? (
        <Card variant="elevated" style={{ marginBottom: Spacing.base }}>
          <Text style={styles.intro}>{community.description}</Text>
        </Card>
      ) : null}

      <View style={styles.toolbar}>
        <Text style={styles.sectionLabel}>Publicaciones</Text>
        <Pressable onPress={() => setEditor({ visible: true, post: null })}>
          <Text style={styles.linkBtn}>+ Publicar</Text>
        </Pressable>
      </View>

      <View style={styles.filtersRow}>
        <OptionPill
          label="Todas"
          selected={filterCategory === 'all'}
          onPress={() => setFilterCategory('all')}
        />
        {categories.map((c) => (
          <OptionPill
            key={c.id}
            label={c.label}
            selected={filterCategory === c.id}
            onPress={() => setFilterCategory(c.id)}
          />
        ))}
      </View>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="Aún no hay publicaciones"
            description="Sé el primero en compartir en esta categoría."
          />
        </Card>
      ) : (
        filtered.map((p) => (
          <Card key={p.id} style={{ marginBottom: Spacing.sm }}>
            <View style={styles.postHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.postAuthor}>{p.authorName}</Text>
                <Text style={styles.postMeta}>{formatDate(p.createdAt)}</Text>
              </View>
              {p.authorId === authorId ? (
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable
                    onPress={() => setEditor({ visible: true, post: p })}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={Colors.primary.base}
                    />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(p)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
                  </Pressable>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
              )}
            </View>
            <Text style={styles.postBody}>{p.body || p.title}</Text>
            <View style={styles.postFooter}>
              <Ionicons name="chatbubble-outline" size={14} color={Colors.text.muted} />
              <Text style={styles.postReplies}>0 respuestas</Text>
            </View>
          </Card>
        ))
      )}

      <PostEditor
        visible={editor.visible}
        post={editor.post}
        onClose={() => setEditor({ visible: false, post: null })}
        onSubmit={async (input) => {
          if (editor.post) {
            await updatePost(editor.post.id, input);
          } else {
            await createPost({
              communityId,
              ...input,
              authorId,
              authorName: authorName,
            });
          }
          setEditor({ visible: false, post: null });
        }}
      />
    </Screen>
  );
};

interface PostEditorProps {
  visible: boolean;
  post: CommunityPost | null;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    body: string;
    category: CommunityPostCategory;
  }) => Promise<void>;
}

const PostEditor: React.FC<PostEditorProps> = ({
  visible,
  post,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [category, setCategory] = useState<CommunityPostCategory>(
    post?.category ?? 'experiencias',
  );
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setTitle(post?.title ?? '');
    setBody(post?.body ?? '');
    setCategory(post?.category ?? 'experiencias');
  }, [post]);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {post ? 'Editar publicación' : 'Nueva publicación'}
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={Colors.text.primary} />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Categoría</Text>
          <View style={styles.filtersRow}>
            {categories.map((c) => (
              <OptionPill
                key={c.id}
                label={c.label}
                selected={category === c.id}
                onPress={() => setCategory(c.id)}
              />
            ))}
          </View>

          <Text style={styles.fieldLabel}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Un título breve"
            placeholderTextColor={Colors.text.muted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.fieldLabel}>Contenido</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Comparte tu experiencia"
            placeholderTextColor={Colors.text.muted}
            value={body}
            onChangeText={setBody}
            multiline
          />

          <Button
            label={post ? 'Guardar cambios' : 'Publicar'}
            disabled={!canSubmit}
            loading={loading}
            onPress={async () => {
              setLoading(true);
              try {
                await onSubmit({
                  title: title.trim(),
                  body: body.trim(),
                  category,
                });
              } finally {
                setLoading(false);
              }
            }}
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', marginBottom: Spacing.sm },
  title: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
  },
  intro: { color: Colors.text.secondary, lineHeight: 22, fontSize: 15 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  sectionLabel: { ...Typography.styles.h4, color: Colors.text.primary },
  linkBtn: {
    color: Colors.primary.base,
    fontWeight: '800',
    fontSize: Typography.fontSize.sm,
  },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: Spacing.sm },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  postAuthor: { ...Typography.styles.label, color: Colors.text.primary },
  postMeta: { color: Colors.text.muted, fontSize: 12, marginTop: 2 },
  postBody: {
    color: Colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  postReplies: { color: Colors.text.muted, fontSize: 12 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.background.overlay,
  },
  modalContent: {
    backgroundColor: Colors.background.surfaceElevated,
    padding: Spacing.base,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    gap: Spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { ...Typography.styles.h3, color: Colors.text.primary },
  fieldLabel: {
    ...Typography.styles.label,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.surfaceHigh,
    color: Colors.text.primary,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
});

export default CommunityDetailScreen;
