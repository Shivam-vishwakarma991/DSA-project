import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { progressAPI } from '../../lib/api/progress';
import { Progress, UserStats, StreakInfo } from '../../types';

interface ProgressState {
  userProgress: Progress[];
  statistics: any;
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
    console.log('🔍 fetchUserProgress response:', response.data);
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
    console.log('📊 fetchStats response:', response.data);
    return response.data;
  }
);

export const fetchStreak = createAsyncThunk(
  'progress/fetchStreak',
  async () => {
    const response = await progressAPI.getStreakInfo();
    console.log('🔥 fetchStreak response:', response.data);
    return response.data;
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'progress/fetchRecentActivity',
  async (limit?: number) => {
    const response = await progressAPI.getRecentActivity(limit);
    console.log('🕒 fetchRecentActivity response:', response.data);
    return response.data;
  }
);

export const fetchAllUserProgress = createAsyncThunk(
  'progress/fetchAllUserProgress',
  async () => {
    const response = await progressAPI.getAllUserProgress();
    console.log('📊 fetchAllUserProgress response:', response.data);
    return response.data;
  }
);

export const fetchAchievements = createAsyncThunk(
  'progress/fetchAchievements',
  async () => {
    const response = await progressAPI.getAchievements();
    console.log('🏆 fetchAchievements response:', response.data);
    return response.data;
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
        console.log('📊 Storing statistics from fetchUserProgress:', action.payload);
        // Store the comprehensive progress data
        state.statistics = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      // Update Progress
      .addCase(updateProgress.fulfilled, (state, action) => {
        // Handle the progress update
        if (action.payload && typeof action.payload === 'object') {
          const progressData = action.payload.data || action.payload;
          if (progressData && typeof progressData === 'object' && '_id' in progressData && 'problemId' in progressData) {
            const index = state.userProgress.findIndex(p => p.problemId === progressData.problemId);
            if (index !== -1) {
              state.userProgress[index] = progressData as Progress;
            } else {
              state.userProgress.unshift(progressData as Progress);
            }
          }
        }
      })
      // Fetch Stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        if (action.payload) {
          console.log('📊 Storing topic progress from fetchStats:', action.payload);
          // Update statistics with topic stats
          if (state.statistics) {
            state.statistics.topicProgress = action.payload;
          } else {
            state.statistics = { topicProgress: action.payload };
          }
        }
      })
      // Fetch Streak
      .addCase(fetchStreak.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object' && 'current' in action.payload) {
          const streakData = action.payload as any;
          console.log('🔥 Storing streak data:', streakData);
          state.streak = {
            current: streakData.current,
            longest: streakData.longest,
            lastActiveDate: streakData.lastActiveDate,
            streakDates: streakData.streakDates || [],
            gapDays: streakData.gapDays || 0
          };
          // Update statistics with streak data
          if (state.statistics) {
            state.statistics.userStats = {
              ...state.statistics.userStats,
              streak: streakData.current,
              longestStreak: streakData.longest,
              lastActiveDate: streakData.lastActiveDate
            };
          }
        }
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          console.log('🕒 Storing recent activity:', action.payload);
          // Don't overwrite userProgress, just update statistics
          if (state.statistics) {
            state.statistics.recentActivity = action.payload;
          }
        }
      })
      // Fetch All User Progress
      .addCase(fetchAllUserProgress.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          console.log('📊 Storing all user progress:', action.payload);
          state.userProgress = action.payload;
        }
      })
      // Fetch Achievements
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          console.log('🏆 Storing achievements:', action.payload);
          state.achievements = action.payload;
        }
      });
  },
});

export const { setProgress, addProgress, updateLocalProgress, setLastSync } = progressSlice.actions;
export default progressSlice.reducer;