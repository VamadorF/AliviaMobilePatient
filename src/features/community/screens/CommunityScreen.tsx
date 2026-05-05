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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Card,
  EmptyState,
  OptionPill,
  Screen,
} from '@/shared/components';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  useCommunityStore,
  type Community,
} from '@/features/community/store/community.store';
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

export const CommunityScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const hydrate = useCommunityStore((s) => s.hydrate);
  const hydrated = useCommunityStore((s) => s.hydrated);
  const communities = useCommunityStore((s) => s.communities);
  const postsForCommunity = useCommunityStore((s) => s.postsForCommunity);
  const createPost = useCommunityStore((s) => s.createPost);
  const updatePost = useCommunityStore((s) => s.updatePost);
  const deletePost = useCommunityStore((s) => s.deletePost);

  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] =
    useState<CommunityPostCategory | 'all'>('all');
  const [editor, setEditor] = useState<{
    visible: boolean;
    post: CommunityPost | null;
  }>({ visible: false, post: null });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    hydrate().catch(() => {});
  }, [hydrate]);

  const authorId = user?.id ?? 'demo-local';
  const authorName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : 'Tú';

  const selectedCommunityId = activeCommunity ?? communities[0]?.id ?? null;

  const filtered = useMemo(() => {
    const posts = selectedCommunityId ? postsForCommunity(selectedCommunityId) : [];
    if (filterCategory === 'all') return posts;
    return posts.filter((p) => p.category === filterCategory);
  }, [selectedCommunityId, postsForCommunity, filterCategory]);

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

  const submitPost = async (input: {
    title: string;
    body: string;
    category: CommunityPostCategory;
  }) => {
    if (!selectedCommunityId) return;
    setBusy(true);
    try {
      if (editor.post) {
        await updatePost(editor.post.id, input);
      } else {
        await createPost({
          communityId: selectedCommunityId,
          ...input,
          authorId,
          authorName,
        });
      }
      setEditor({ visible: false, post: null });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Comunidad</Text>
      <Text style={styles.subtitle}>
        Comparte cómo te has sentido, pregunta y apóyate en otros.
      </Text>

      <Pressable
        onPress={() => navigation.navigate('VoiceSpaces')}
        style={styles.voiceBanner}
      >
        <Card variant="elevated" padded>
          <View style={styles.voiceRow}>
            <View style={styles.voiceIcon}>
              <Ionicons name="mic" size={20} color={Colors.text.onAccent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.voiceTitle}>Espacios de voz</Text>
              <Text style={styles.voiceHint}>Sesiones grupales demo · sin audio real</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
          </View>
        </Card>
      </Pressable>

      <Text style={styles.sectionLabel}>Tus comunidades</Text>
      {!hydrated ? (
        <Text style={styles.loading}>Cargando…</Text>
      ) : (
        <View style={styles.commsRow}>
          {(communities as Community[]).map((c) => (
            <OptionPill
              key={c.id}
              label={`${c.name} · ${c._count?.memberships ?? 0}`}
              selected={selectedCommunityId === c.id}
              onPress={() => setActiveCommunity(c.id)}
            />
          ))}
        </View>
      )}

      {selectedCommunityId ? (
        <Button
          label="Ver foro completo"
          variant="outline"
          size="sm"
          fullWidth
          style={{ marginTop: Spacing.sm }}
          onPress={() =>
            navigation.navigate('CommunityDetail', { communityId: selectedCommunityId })
          }
        />
      ) : null}

      <View style={styles.toolbar}>
        <Text style={styles.sectionLabel}>Publicaciones</Text>
        <Button
          label="Nueva"
          size="sm"
          fullWidth={false}
          leftIcon={<Ionicons name="add-circle" size={16} color={Colors.text.onAccent} />}
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

      {!hydrated ? (
        <Text style={styles.loading}>Cargando publicaciones…</Text>
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
                  {p.authorName} ·{' '}
                  {categories.find((c) => c.id === p.category)?.label ?? p.category}
                </Text>
              </View>
              {p.authorId === authorId ? (
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable
                    onPress={() => setEditor({ visible: true, post: p })}
                    hitSlop={8}
                  >
                    <Ionicons name="create-outline" size={20} color={Colors.primary.base} />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(p)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
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
        onSubmit={submitPost}
        loading={busy}
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
            onPress={() => onSubmit({ title: title.trim(), body: body.trim(), category })}
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
  voiceBanner: { marginBottom: Spacing.base },
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  voiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceTitle: { ...Typography.styles.h4, color: Colors.text.primary },
  voiceHint: { color: Colors.text.muted, fontSize: 12, marginTop: 2 },
  loading: { color: Colors.text.muted, marginVertical: Spacing.sm },
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

export default CommunityScreen;
