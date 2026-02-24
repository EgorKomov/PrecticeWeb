import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { boardsAPI } from '../../../shared/api/auth';

const initialState = {
  boards: [],
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Не авторизован');
      }
      
      const response = await boardsAPI.getBoards();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки досок');
    }
  }
);

export const addBoard = createAsyncThunk(
  'boards/addBoard',
  async (boardData, { rejectWithValue, dispatch }) => {
    try {
      const response = await boardsAPI.createBoard(boardData.name);
      dispatch(fetchBoards());
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ошибка создания доски';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async (boardData, { rejectWithValue, dispatch }) => {
    try {
      const response = await boardsAPI.updateBoard(boardData.name, boardData.id);
      dispatch(fetchBoards());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления доски');
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId, { rejectWithValue, dispatch }) => {
    try {
      await boardsAPI.deleteBoard(boardId);
      dispatch(fetchBoards());
      return boardId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления доски');
    }
  }
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearBoardsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBoard.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBoardsError } = boardsSlice.actions;
export default boardsSlice.reducer;