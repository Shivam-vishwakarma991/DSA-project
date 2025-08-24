import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { progressAPI } from '../../lib/api/progress';
import { Progress, UserStats, StreakInfo } from '../../types';

interface ProgressState {
  userProgress: Progress[];
  statistics: UserStats | null;
  streak: StreakInfo | null;
  leaderboard: any[];
  achievements: any[];
  loading: boolean;
  error: string | null;
  lastSync: string | null;
}

const initialState: ProgressState = {
  userProgress: [],
  statistics: null,
  streak: null,
  leaderboard: [],
  achievements: [],
  loading: false,
  error: null,
  lastSync: null,
};

export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUserProgress',
  async () => {
    const response = await progressAPI.getUserProgress();
    return response.data;
  }
);

export const updateProgress = createAsyncThunk(
  'progress/updateProgress',
  async (data: {
    problemId: string;
    status: 'pending' | 'attempted' | 'completed' | 'revisit';
    notes?: string;
    code?: string;
    language?: string;
    timeSpent: number;
    confidence?: number;
    isBookmarked?: boolean;
  }) => {
    const response = await progressAPI.updateProblemProgress(data.problemId, data);
    return response.data;
  }
);

export const fetchStats = createAsyncThunk(
  'progress/fetchStats',
  async () => {
    const response = await progressAPI.getTopicStats();
    return response.data;
  }
);

export const fetchStreak = createAsyncThunk(
  'progress/fetchStreak',
  async () => {
    const response = await progressAPI.getStreakInfo();
    return response.data;
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'progress/fetchRecentActivity',
  async (limit?: number) => {
    const response = await progressAPI.getRecentActivity(limit);
    return response.data;
  }
);

export const fetchAchievements = createAsyncThunk(
  'progress/fetchAchievements',
  async () => {
    const response = await progressAPI.getAchievements();
    return response.data.data;
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<Progress[]>) => {
      state.userProgress = action.payload;
    },
    addProgress: (state, action: PayloadAction<Progress>) => {
      state.userProgress.push(action.payload);
    },
    updateLocalProgress: (state, action: PayloadAction<Progress>) => {
      const index = state.userProgress.findIndex(
        p => p.problemId === action.payload.problemId
      );
      if (index !== -1) {
        state.userProgress[index] = action.payload;
      } else {
        state.userProgress.push(action.payload);
      }
    },
    setLastSync: (state) => {
      state.lastSync = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the comprehensive progress data structure
        if (action.payload && typeof action.payload === 'object') {
          // Store the entire payload as statistics since it contains all the data
          state.statistics = action.payload;
          
          // Extract recent activity for userProgress
          if ('recentActivity' in action.payload && Array.isArray(action.payload.recentActivity)) {
            state.userProgress = action.payload.recentActivity;
          }
        }
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      // Update Progress
      .addCase(updateProgress.fulfilled, (state, action) => {
        // Handle the progress update - add to recent activity
        if (action.payload && typeof action.payload === 'object') {
          // The API response has the progress data nested under 'data'
          const progressData = action.payload.data || action.payload;
          if (progressData && progressData._id) {
            const index = state.userProgress.findIndex(p => p.problemId === progressData.problemId);
            if (index !== -1) {
              state.userProgress[index] = progressData;
            } else {
              state.userProgress.unshift(progressData);
            }
          }
        }
      })
      // Fetch Stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        // The data is already extracted in the thunk
        if (action.payload) {
          state.statistics = action.payload as any;
        }
      })
      // Fetch Streak
      .addCase(fetchStreak.fulfilled, (state, action) => {
        // The data is already extracted in the thunk
        if (action.payload) {
          state.streak = action.payload as any;
        }
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        // The data is already extracted in the thunk
        if (Array.isArray(action.payload)) {
          state.userProgress = action.payload;
        }
      })
      // Fetch Achievements
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        // The data is already extracted in the thunk
        if (Array.isArray(action.payload)) {
          state.achievements = action.payload;
        }
      });
  },
});

export const { setProgress, addProgress, updateLocalProgress, setLastSync } = progressSlice.actions;
export default progressSlice.reducer;