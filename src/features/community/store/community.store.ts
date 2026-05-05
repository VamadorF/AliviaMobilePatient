import { create } from 'zustand';
import { localStorage } from '@/shared/services/storage/asyncStorage';
import { mockCommunities, mockCommunityPosts } from '@/shared/services/demo';
import type { CommunityPost, CommunityPostCategory } from '@/shared/types/domain';

const POSTS_KEY = 'alivia.community.posts';

export interface Community {
  id: string;
  name: string;
  pathology: string;
  description: string;
  _count: { memberships: number; posts: number };
}

interface CommunityState {
  communities: Community[];
  posts: CommunityPost[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  postsForCommunity: (id: string) => CommunityPost[];
  createPost: (input: {
    communityId: string;
    title: string;
    body: string;
    category: CommunityPostCategory;
    authorId: string;
    authorName: string;
  }) => Promise<CommunityPost>;
  updatePost: (
    id: string,
    input: Partial<Pick<CommunityPost, 'title' | 'body' | 'category'>>,
  ) => Promise<CommunityPost | null>;
  deletePost: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communities: mockCommunities,
  posts: mockCommunityPosts,
  hydrated: false,

  async hydrate() {
    const stored = await localStorage.getJSON<CommunityPost[]>(POSTS_KEY);
    if (stored && stored.length) {
      set({ posts: [...stored, ...mockCommunityPosts], hydrated: true });
    } else {
      await localStorage.setJSON(POSTS_KEY, []);
      set({ hydrated: true });
    }
  },

  postsForCommunity(id) {
    return get().posts.filter((p) => p.communityId === id);
  },

  async createPost(input) {
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId: input.communityId,
      authorId: input.authorId,
      authorName: input.authorName,
      category: input.category,
      title: input.title,
      body: input.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    };
    const userPosts =
      (await localStorage.getJSON<CommunityPost[]>(POSTS_KEY)) ?? [];
    const nextUser = [post, ...userPosts];
    await localStorage.setJSON(POSTS_KEY, nextUser);
    set({ posts: [...nextUser, ...mockCommunityPosts] });
    return post;
  },

  async updatePost(id, input) {
    const userPosts =
      (await localStorage.getJSON<CommunityPost[]>(POSTS_KEY)) ?? [];
    const idx = userPosts.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const updated: CommunityPost = {
      ...userPosts[idx],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    userPosts[idx] = updated;
    await localStorage.setJSON(POSTS_KEY, userPosts);
    set({ posts: [...userPosts, ...mockCommunityPosts] });
    return updated;
  },

  async deletePost(id) {
    const userPosts =
      (await localStorage.getJSON<CommunityPost[]>(POSTS_KEY)) ?? [];
    const next = userPosts.filter((p) => p.id !== id);
    await localStorage.setJSON(POSTS_KEY, next);
    set({ posts: [...next, ...mockCommunityPosts] });
  },

  async toggleLike(id) {
    const next = get().posts.map((p) =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p,
    );
    set({ posts: next });
    const userPosts =
      (await localStorage.getJSON<CommunityPost[]>(POSTS_KEY)) ?? [];
    const updatedUser = userPosts.map((p) =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p,
    );
    if (userPosts.length) await localStorage.setJSON(POSTS_KEY, updatedUser);
  },
}));
