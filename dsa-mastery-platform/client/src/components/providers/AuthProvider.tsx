'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { refreshToken, setUser } from '@/store/slices/authSlice';
import { Loader } from '@/components/common/Loader';
import Cookies from 'js-cookie';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
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
          const response = await fetch('/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            dispatch(setUser(data.user));
          } else {
            // Token is invalid
            Cookies.remove('token');
            Cookies.remove('refreshToken');
          }
        } catch (error) {
          console.error('Failed to validate token:', error);
        }
      }
    };

    initAuth();
  }, [dispatch, isAuthenticated]);

  // Set up token refresh interval
  useEffect(() => {
    if (isAuthenticated) {
      const refreshInterval = setInterval(async () => {
        try {
          await dispatch(refreshToken()).unwrap();
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }, 20 * 60 * 1000); // Refresh every 20 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <Loader fullScreen text="Authenticating..." />;
  }

  return <>{children}</>;
}