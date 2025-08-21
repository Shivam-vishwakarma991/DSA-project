import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  tourCompleted: boolean;
  notifications: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }[];
  modals: {
    [key: string]: boolean;
  };
}

const initialState: UIState = {
  theme: 'system',
  sidebarOpen: true,
  tourCompleted: false,
  notifications: [],
  modals: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTourCompleted: (state, action: PayloadAction<boolean>) => {
      state.tourCompleted = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('tourCompleted', action.payload.toString());
      }
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setTourCompleted,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;