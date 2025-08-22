import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function useAuth() {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator' || user?.role === 'admin',
  };
}