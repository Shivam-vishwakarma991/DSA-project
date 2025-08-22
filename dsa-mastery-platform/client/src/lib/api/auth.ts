import api from './index';
import { LoginCredentials, RegisterData, User } from '@/types';

export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post<{ success: boolean; token: string; user: User }>('/auth/login', credentials),

  register: (data: RegisterData) => 
    api.post<{ success: boolean; token: string; user: User }>('/auth/register', data),

  logout: () => 
    api.post('/auth/logout'),

  refreshToken: () => 
    api.post<{ success: boolean; token: string; user: User }>('/auth/refresh'),

  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) => 
    api.post(`/auth/reset-password/${token}`, { password }),

  verifyEmail: (token: string) => 
    api.get(`/auth/verify-email/${token}`),

  updatePassword: (currentPassword: string, newPassword: string) => 
    api.put('/auth/update-password', { currentPassword, newPassword }),
};