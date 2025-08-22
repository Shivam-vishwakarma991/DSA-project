import api from './instance';

interface CommunityPost {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    role: string;
  };
  title: string;
  content: string;
  problemTitle?: string;
  topic?: string;
  difficulty?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  tags: string[];
}

interface CommunityMember {
  _id: string;
  username: string;
  avatar: string;
  role: string;
  stats: {
    totalSolved: number;
    streak: number;
  };
  isOnline: boolean;
  lastActive: string;
}

export const communityAPI = {
  // Get community posts
  getPosts: (params?: {
    type?: 'discussions' | 'solutions' | 'questions';
    topic?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }) => 
    api.get<{ success: boolean; data: CommunityPost[]; total: number }>('/community/posts', { params }),

  // Create a new post
  createPost: (data: {
    title: string;
    content: string;
    type: 'discussions' | 'solutions' | 'questions';
    problemTitle?: string;
    topic?: string;
    difficulty?: string;
    tags?: string[];
  }) => 
    api.post<{ success: boolean; data: CommunityPost }>('/community/posts', data),

  // Like/unlike a post
  toggleLike: (postId: string) => 
    api.post<{ success: boolean; message: string }>(`/community/posts/${postId}/like`),

  // Bookmark/unbookmark a post
  toggleBookmark: (postId: string) => 
    api.post<{ success: boolean; message: string }>(`/community/posts/${postId}/bookmark`),

  // Get post comments
  getComments: (postId: string) => 
    api.get<{ success: boolean; data: any[] }>(`/community/posts/${postId}/comments`),

  // Add comment to a post
  addComment: (postId: string, content: string) => 
    api.post<{ success: boolean; data: any }>(`/community/posts/${postId}/comments`, { content }),

  // Get online members
  getOnlineMembers: () => 
    api.get<{ success: boolean; data: CommunityMember[] }>('/community/members/online'),

  // Get top contributors
  getTopContributors: (limit?: number) => 
    api.get<{ success: boolean; data: CommunityMember[] }>(`/community/members/top?limit=${limit || 10}`),

  // Get community stats
  getCommunityStats: () => 
    api.get<{ success: boolean; data: any }>('/community/stats'),
};
