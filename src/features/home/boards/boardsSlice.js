import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { boardsAPI } from '../../../entities/board/api/board';

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

export const reorderBoardsThunk = createAsyncThunk(
  'boards/reorderBoards',
  async ({ boardId, targetOrder, sourceOrder, allBoards }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Не авторизован');
      }

      await boardsAPI.reorderBoard(boardId, targetOrder);
      
      const updatedBoards = allBoards.map(board => {
        if (board.id === boardId) {
          return { ...board, order: targetOrder };
        }
        if (sourceOrder < targetOrder) {
          if (board.order > sourceOrder && board.order <= targetOrder && board.id !== boardId) {
            return { ...board, order: board.order - 1 };
          }
        } else {
          if (board.order >= targetOrder && board.order < sourceOrder && board.id !== boardId) {
            return { ...board, order: board.order + 1 };
          }
        }
        return board;
      });
      
      dispatch(fetchBoards());
      return updatedBoards;
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.message || 'Ошибка при изменении порядка досок');
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
      })
      .addCase(reorderBoardsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderBoardsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(reorderBoardsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBoardsError } = boardsSlice.actions;
export default boardsSlice.reducer;