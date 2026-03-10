import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../../shared/api';

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

const getStoredToken = () => {
  try {
    return localStorage.getItem('token') || null;
  } catch (error) {
    return null;
  }
};

const token = getStoredToken();
const isValidToken = token && token.length > 0;

const initialState = {
  user: getStoredUser(),
  token: token,
  loading: false,
  error: null,
  isAuthenticated: !!isValidToken,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          'Неверный email или пароль';
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      if (userData.password.length < 6) {
        return rejectWithValue('Пароль должен содержать минимум 6 символов');
      }
      
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Ошибка регистрации';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.access_token) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.access_token;
          localStorage.setItem('token', action.payload.access_token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;