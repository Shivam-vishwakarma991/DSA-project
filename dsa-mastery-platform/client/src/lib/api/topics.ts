import api from './instance';
import { Topic, Problem } from '../../types';

// API Response interfaces
interface TopicsResponse {
  success: boolean;
  data: Topic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface TopicResponse {
  success: boolean;
  data: Topic;
}

interface ProblemsResponse {
  success: boolean;
  data: Problem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const topicsAPI = {
  getTopics: (params?: { page?: number; limit?: number; sort?: string }) => 
    api.get<TopicsResponse>('/topics', { params }),

  getTopicBySlug: (slug: string) => 
    api.get<TopicResponse>(`/topics/${slug}`),

  getTopicProblems: (slug: string, params?: { 
    page?: number; 
    limit?: number; 
    difficulty?: string 
  }) => 
    api.get<ProblemsResponse>(`/topics/${slug}/problems`, { params }),

  getTopicResources: (slug: string) => 
    api.get(`/topics/${slug}/resources`),

  createTopic: (data: Partial<Topic>) => 
    api.post<Topic>('/topics', data),

  updateTopic: (id: string, data: Partial<Topic>) => 
    api.put<Topic>(`/topics/${id}`, data),

  deleteTopic: (id: string) => 
    api.delete(`/topics/${id}`),

  getProblems: (params?: { 
    page?: number; 
    limit?: number; 
    difficulty?: string;
    tags?: string;
    search?: string;
  }) => 
    api.get<ProblemsResponse>('/topics/problems/all', { params }),

  getProblem: (id: string) => 
    api.get<{ success: boolean; data: Problem }>(`/topics/problems/${id}`),
};
