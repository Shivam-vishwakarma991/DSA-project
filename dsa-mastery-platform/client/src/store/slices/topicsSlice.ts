import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { topicsAPI } from '../../lib/api/topics';
import { Topic, Problem } from '../../types';

// API Response interface
interface TopicsResponse {
  success: boolean;
  data: Topic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

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
    return response.data.data; // Extract topics from nested data structure
  }
);

export const fetchTopicDetails = createAsyncThunk(
  'topics/fetchTopicDetails',
  async (slug: string) => {
    const response = await topicsAPI.getTopicBySlug(slug);
    return response.data.data; // Extract topic from nested data structure
  }
);

export const fetchTopicProblems = createAsyncThunk(
  'topics/fetchTopicProblems',
  async (slug: string) => {
    const response = await topicsAPI.getTopicProblems(slug);
    return response.data.data; // Extract problems from nested data structure
  }
);

export const createTopic = createAsyncThunk(
  'topics/createTopic',
  async (topicData: Partial<Topic>) => {
    const response = await topicsAPI.createTopic(topicData);
    return response.data;
  }
);

export const updateTopic = createAsyncThunk(
  'topics/updateTopic',
  async ({ id, data }: { id: string; data: Partial<Topic> }) => {
    const response = await topicsAPI.updateTopic(id, data);
    return response.data;
  }
);

export const deleteTopic = createAsyncThunk(
  'topics/deleteTopic',
  async (id: string) => {
    await topicsAPI.deleteTopic(id);
    return id;
  }
);

export const createProblem = createAsyncThunk(
  'topics/createProblem',
  async (problemData: Partial<Problem>) => {
    const response = await topicsAPI.createProblem(problemData);
    return response.data.data; // Extract the Problem object from the nested structure
  }
);

export const updateProblem = createAsyncThunk(
  'topics/updateProblem',
  async ({ id, data }: { id: string; data: Partial<Problem> }) => {
    const response = await topicsAPI.updateProblem(id, data);
    return response.data.data; // Extract the Problem object from the nested structure
  }
);

export const deleteProblem = createAsyncThunk(
  'topics/deleteProblem',
  async (id: string) => {
    await topicsAPI.deleteProblem(id);
    return id;
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
    updateProblemStatus: (state, action: PayloadAction<{ problemId: string; status: string }>) => {
      const { problemId, status } = action.payload;
      const problem = state.problems.find(p => p._id === problemId);
      if (problem) {
        problem.userStatus = status;
      }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
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
      })
      // Create Topic
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.unshift(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create topic';
      })
      // Update Topic
      .addCase(updateTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.topics.findIndex(topic => topic._id === action.payload._id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
        if (state.currentTopic && state.currentTopic._id === action.payload._id) {
          state.currentTopic = action.payload;
        }
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update topic';
      })
      // Delete Topic
      .addCase(deleteTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = state.topics.filter(topic => topic._id !== action.payload);
        if (state.currentTopic && state.currentTopic._id === action.payload) {
          state.currentTopic = null;
        }
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete topic';
      })
      // Create Problem
      .addCase(createProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new problem to the current topic's problems if it exists
        if (state.currentTopic && state.currentTopic.problems) {
          state.currentTopic.problems.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create problem';
      })
      // Update Problem
      .addCase(updateProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.loading = false;
        // Update the problem in the current topic's problems if it exists
        if (state.currentTopic && state.currentTopic.problems) {
          const index = state.currentTopic.problems.findIndex(p => p._id === action.payload._id);
          if (index !== -1) {
            state.currentTopic.problems[index] = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update problem';
      })
      // Delete Problem
      .addCase(deleteProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the problem from the current topic's problems if it exists
        if (state.currentTopic && state.currentTopic.problems) {
          state.currentTopic.problems = state.currentTopic.problems.filter(p => p._id !== action.payload);
        }
        state.error = null;
      })
      .addCase(deleteProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete problem';
      });
  },
});

export const { setCurrentTopic, setFilters, clearFilters, updateProblemStatus } = topicsSlice.actions;
export default topicsSlice.reducer;