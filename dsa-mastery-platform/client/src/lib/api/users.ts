import api from './index';
import { User } from '../../types';

export const usersAPI = {
  getProfile: () => 
    api.get<User>('/users/profile'),

  updateProfile: (data: Partial<User>) => 
    api.put<User>('/users/profile', data),

  updatePreferences: (preferences: User['preferences']) => 
    api.put('/users/preferences', preferences),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getPublicProfile: (username: string) => 
    api.get(`/users/${username}`),

  deleteAccount: () => 
    api.delete('/users/account'),
};