import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { topicsAPI } from '../../lib/api/topics';
import { Topic, Problem } from '../../types';

interface TopicsState {
  topics: Topic[];
  currentTopic: Topic | null;
  problems: Problem[];
  loading: boolean;
  error: string | null;
  filters: {
    difficulty: string;
    tags: string[];
    status: string;
  };
}

const initialState: TopicsState = {
  topics: [],
  currentTopic: null,
  problems: [],
  loading: false,
  error: null,
  filters: {
    difficulty: 'all',
    tags: [],
    status: 'all',
  },
};

export const fetchTopics = createAsyncThunk(
  'topics/fetchTopics',
  async () => {
    const response = await topicsAPI.getTopics();
    return response.data;
  }
);

export const fetchTopicDetails = createAsyncThunk(
  'topics/fetchTopicDetails',
  async (slug: string) => {
    const response = await topicsAPI.getTopicBySlug(slug);
    return response.data;
  }
);

export const fetchTopicProblems = createAsyncThunk(
  'topics/fetchTopicProblems',
  async (slug: string) => {
    const response = await topicsAPI.getTopicProblems(slug);
    return response.data;
  }
);

const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    setCurrentTopic: (state, action: PayloadAction<Topic | null>) => {
      state.currentTopic = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TopicsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateProblemStatus: (state, action: PayloadAction<{ problemId: string; status: string }>) => {
      const problem = state.problems.find(p => p._id === action.payload.problemId);
      if (problem) {
        problem.userStatus = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Topics
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch topics';
      })
      // Fetch Topic Details
      .addCase(fetchTopicDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTopic = action.payload;
      })
      .addCase(fetchTopicDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch topic details';
      })
      // Fetch Topic Problems
      .addCase(fetchTopicProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(fetchTopicProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch problems';
      });
  },
});

export const { setCurrentTopic, setFilters, clearFilters, updateProblemStatus } = topicsSlice.actions;
export default topicsSlice.reducer;