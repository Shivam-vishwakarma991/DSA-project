'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { refreshToken, setUser, getCurrentUser, setLoading } from '@/store/slices/authSlice';
import { Loader } from '@/components/common/Loader';
import Cookies from 'js-cookie';
import api from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initAuth = async () => {
      // Check for existing token
      const token = Cookies.get('token');
      const refreshTokenCookie = Cookies.get('refreshToken');
      
      if (refreshTokenCookie && !isAuthenticated) {
        try {
          // Try to refresh the token
          await dispatch(refreshToken()).unwrap();
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // Clear invalid tokens
          Cookies.remove('token');
          Cookies.remove('refreshToken');
        }
      } else if (token && !isAuthenticated) {
        // Validate token by fetching user profile
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error('Failed to validate token:', error);
          // Token is invalid
          Cookies.remove('token');
          Cookies.remove('refreshToken');
        }
      }
      
      // Set loading to false after initialization
      dispatch(setLoading(false));
    };

    initAuth();
  }, [dispatch, isAuthenticated, mounted]);

  // Set up token refresh interval
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        await dispatch(refreshToken()).unwrap();
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }, 20 * 60 * 1000); // Refresh every 20 minutes

    return () => clearInterval(refreshInterval);
  }, [dispatch, isAuthenticated, mounted]);

  if (!mounted || loading) {
    return <Loader fullScreen text="Authenticating..." />;
  }

  return <>{children}</>;
}