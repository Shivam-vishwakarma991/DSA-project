import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { progressAPI } from '@/lib/api/progress';
import { Progress, UserStats, StreakInfo } from '@/types';

interface ProgressState {
  userProgress: Progress[];
  statistics: UserStats | null;
  streak: StreakInfo | null;
  leaderboard: any[];
  loading: boolean;
  error: string | null;
  lastSync: string | null;
}

const initialState: ProgressState = {
  userProgress: [],
  statistics: null,
  streak: null,
  leaderboard: [],
  loading: false,
  error: null,
  lastSync: null,
};

export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUserProgress',
  async (userId: string) => {
    const response = await progressAPI.getUserProgress(userId);
    return response.data;
  }
);

export const updateProgress = createAsyncThunk(
  'progress/updateProgress',
  async (data: {
    problemId: string;
    topicId: string;
    status: string;
    timeSpent?: number;
    notes?: string;
  }) => {
    const response = await progressAPI.updateProgress(data);
    return response.data;
  }
);

export const fetchStats = createAsyncThunk(
  'progress/fetchStats',
  async () => {
    const response = await progressAPI.getStats();
    return response.data;
  }
);

export const fetchStreak = createAsyncThunk(
  'progress/fetchStreak',
  async () => {
    const response = await progressAPI.getStreak();
    return response.data;
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'progress/fetchLeaderboard',
  async (period: 'daily' | 'weekly' | 'monthly' | 'all' = 'all') => {
    const response = await progressAPI.getLeaderboard(period);
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
        state.userProgress = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      // Update Progress
      .addCase(updateProgress.fulfilled, (state, action) => {
        const index = state.userProgress.findIndex(
          p => p.problemId === action.payload.problemId
        );
        if (index !== -1) {
          state.userProgress[index] = action.payload;
        } else {
          state.userProgress.push(action.payload);
        }
      })
      // Fetch Stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statistics = action.payload;
      })
      // Fetch Streak
      .addCase(fetchStreak.fulfilled, (state, action) => {
        state.streak = action.payload;
      })
      // Fetch Leaderboard
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      });
  },
});

export const { setProgress, addProgress, updateLocalProgress, setLastSync } = progressSlice.actions;
export default progressSlice.reducer;