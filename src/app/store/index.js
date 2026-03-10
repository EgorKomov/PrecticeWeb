import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/slice/authSlice';
import boardsReducer from '../../features/homeScreen/boards/boardsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
  },
});