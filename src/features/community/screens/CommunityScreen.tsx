import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Card,
  EmptyState,
  OptionPill,
  Screen,
} from '@/shared/components';
import httpClient from '@/shared/services/http/apiClient';
import type {
  CommunityPost,
  CommunityPostCategory,
} from '@/shared/types/domain';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

interface Community {
  id: string;
  name: string;
  pathology: string;
  description: string;
  _count: { memberships: number; posts: number };
}

const categories: { id: CommunityPostCategory; label: string }[] = [
  { id: 'experiencias', label: 'Experiencias' },
  { id: 'preguntas', label: 'Preguntas' },
  { id: 'logros', label: 'Logros' },
  { id: 'recursos', label: 'Recursos' },
  { id: 'apoyo', label: 'Apoyo' },
];

const CURRENT_AUTHOR_ID = 'u-1';
const CURRENT_AUTHOR_NAME = 'Tú';

export const CommunityScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] =
    useState<CommunityPostCategory | 'all'>('all');
  const [editor, setEditor] = useState<{
    visible: boolean;
    post: CommunityPost | null;
  }>({ visible: false, post: null });

  const { data: communities, isLoading: loadingComms } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: async () => {
      const res = await httpClient.get('/community');
      return res.data;
    },
  });

  const selectedCommunityId = activeCommunity ?? communities?.[0]?.id ?? null;

  const { data: posts, isLoading: loadingPosts } = useQuery<CommunityPost[]>({
    queryKey: ['community-posts', selectedCommunityId],
    enabled: !!selectedCommunityId,
    queryFn: async () => {
      const res = await httpClient.get(
        `/community/${selectedCommunityId}/posts`,
      );
      return res.data;
    },
  });

  const filtered = useMemo(() => {
    if (!posts) return [];
    return filterCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === filterCategory);
  }, [posts, filterCategory]);

  const createMutation = useMutation({
    mutationFn: async (input: {
      title: string;
      body: string;
      category: CommunityPostCategory;
    }) => {
      if (!selectedCommunityId) throw new Error('No community selected');
      const res = await httpClient.post(
        `/community/${selectedCommunityId}/posts`,
        {
          ...input,
          authorName: CURRENT_AUTHOR_NAME,
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community-posts', selectedCommunityId],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (input: {
      id: string;
      title: string;
      body: string;
      category: CommunityPostCategory;
    }) => {
      const res = await httpClient.patch(
        `/community/posts/${input.id}`,
        input,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community-posts', selectedCommunityId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await httpClient.delete(`/community/posts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community-posts', selectedCommunityId],
      });
    },
  });

  const handleDelete = (post: CommunityPost) => {
    const confirmAndDelete = () => deleteMutation.mutate(post.id);
    if (typeof Alert?.alert === 'function') {
      Alert.alert('Eliminar publicación', '¿Quieres eliminarla?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: confirmAndDelete },
      ]);
    } else {
      confirmAndDelete();
    }
  };

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Comunidad</Text>
      <Text style={styles.subtitle}>
        Comparte cómo te has sentido, pregunta y apóyate en otros.
      </Text>

      <Text style={styles.sectionLabel}>Tus comunidades</Text>
      {loadingComms ? (
        <ActivityIndicator color={Colors.medical.blue} />
      ) : (
        <View style={styles.commsRow}>
          {(communities ?? []).map((c) => (
            <OptionPill
              key={c.id}
              label={`${c.name} · ${c._count?.memberships ?? 0}`}
              selected={selectedCommunityId === c.id}
              onPress={() => setActiveCommunity(c.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.toolbar}>
        <Text style={styles.sectionLabel}>Publicaciones</Text>
        <Button
          label="Nueva"
          size="sm"
          leftIcon={
            <Ionicons name="add-circle" size={16} color={Colors.text.white} />
          }
          onPress={() => setEditor({ visible: true, post: null })}
        />
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

      {loadingPosts ? (
        <ActivityIndicator color={Colors.medical.blue} />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="Aún no hay publicaciones"
            description="Sé el primero en compartir algo con tu comunidad."
          />
        </Card>
      ) : (
        filtered.map((p) => (
          <Card key={p.id} style={{ marginBottom: Spacing.sm }}>
            <View style={styles.postHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.postTitle}>{p.title}</Text>
                <Text style={styles.postMeta}>
                  {p.authorName} · {categories.find((c) => c.id === p.category)?.label ?? p.category}
                </Text>
              </View>
              {p.authorId === CURRENT_AUTHOR_ID ? (
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable
                    onPress={() => setEditor({ visible: true, post: p })}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={Colors.medical.blue}
                    />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(p)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color="#b91c1c" />
                  </Pressable>
                </View>
              ) : null}
            </View>
            <Text style={styles.postBody}>{p.body}</Text>
            <View style={styles.postFooter}>
              <Ionicons name="heart-outline" size={16} color={Colors.text.muted} />
              <Text style={styles.postLikes}>{p.likes}</Text>
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
            await updateMutation.mutateAsync({ id: editor.post.id, ...input });
          } else {
            await createMutation.mutateAsync(input);
          }
          setEditor({ visible: false, post: null });
        }}
        loading={createMutation.isPending || updateMutation.isPending}
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
  loading: boolean;
}

const PostEditor: React.FC<PostEditorProps> = ({
  visible,
  post,
  onClose,
  onSubmit,
  loading,
}) => {
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [category, setCategory] = useState<CommunityPostCategory>(
    post?.category ?? 'experiencias',
  );

  React.useEffect(() => {
    setTitle(post?.title ?? '');
    setBody(post?.body ?? '');
    setCategory(post?.category ?? 'experiencias');
  }, [post]);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
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
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.fieldLabel}>Contenido</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Comparte tu experiencia"
            value={body}
            onChangeText={setBody}
            multiline
          />

          <Button
            label={post ? 'Guardar cambios' : 'Publicar'}
            disabled={!canSubmit}
            loading={loading}
            onPress={() =>
              onSubmit({ title: title.trim(), body: body.trim(), category })
            }
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { color: Colors.text.muted, marginBottom: Spacing.base },
  sectionLabel: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  commsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  postTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
  },
  postMeta: { color: Colors.text.muted, fontSize: 12 },
  postBody: {
    color: Colors.text.secondary,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  postLikes: { color: Colors.text.muted, fontSize: 12 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: Colors.background.light,
    padding: Spacing.base,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
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
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.white,
    color: Colors.text.primary,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
});

export default CommunityScreen;
