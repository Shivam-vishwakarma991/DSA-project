import api from './instance';
import { LoginCredentials, RegisterData, User } from '../../types';

interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
}

export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),

  register: (data: RegisterData) => 
    api.post<AuthResponse>('/auth/register', data),

  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/logout', { refreshToken });
  },

  refreshToken: () => 
    api.post<AuthResponse>('/auth/refresh'),

  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) => 
    api.post(`/auth/reset-password/${token}`, { password }),

  verifyEmail: (token: string) => 
    api.get(`/auth/verify-email/${token}`),

  updatePassword: (currentPassword: string, newPassword: string) => 
    api.put('/auth/update-password', { currentPassword, newPassword }),

  getCurrentUser: () => 
    api.get<{ success: boolean; data: User }>('/users/profile'),
};

// Export individual functions for convenience
export const login = authAPI.login;
export const register = authAPI.register;
export const logout = authAPI.logout;
export const refreshToken = authAPI.refreshToken;
export const forgotPassword = authAPI.forgotPassword;
export const resetPassword = authAPI.resetPassword;
export const verifyEmail = authAPI.verifyEmail;
export const updatePassword = authAPI.updatePassword;
export const getCurrentUser = authAPI.getCurrentUser;