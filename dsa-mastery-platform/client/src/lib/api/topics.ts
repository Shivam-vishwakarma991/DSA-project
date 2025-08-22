import api from './index';
import { Topic, Problem } from '../../types';

export const topicsAPI = {
  getTopics: (params?: { page?: number; limit?: number; sort?: string }) => 
    api.get<Topic[]>('/topics', { params }),

  getTopicBySlug: (slug: string) => 
    api.get<Topic>(`/topics/${slug}`),

  getTopicProblems: (slug: string, params?: { 
    page?: number; 
    limit?: number; 
    difficulty?: string 
  }) => 
    api.get<Problem[]>(`/topics/${slug}/problems`, { params }),

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
    api.get<Problem[]>('/topics/problems/all', { params }),

  getProblem: (id: string) => 
    api.get<Problem>(`/topics/problems/${id}`),
};
