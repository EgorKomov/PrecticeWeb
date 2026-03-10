import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

const getUserBoardsKey = () => {
  const user = getCurrentUser();
  return user ? `boards_${user.id}` : 'boards_guest';
};

const loadBoardsFromStorage = () => {
  try {
    const key = getUserBoardsKey();
    const boards = localStorage.getItem(key);
    return boards ? JSON.parse(boards) : [];
  } catch (error) {
    return [];
  }
};

const saveBoardsToStorage = (boards) => {
  try {
    const key = getUserBoardsKey();
    localStorage.setItem(key, JSON.stringify(boards));
  } catch (error) {}
};

const initialState = {
  boards: loadBoardsFromStorage(),
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const boards = loadBoardsFromStorage();
      return boards;
    } catch (error) {
      return rejectWithValue('Ошибка загрузки досок');
    }
  }
);

export const addBoard = createAsyncThunk(
  'boards/addBoard',
  async (boardData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = getCurrentUser();
      const newBoard = {
        id: Date.now(),
        name: boardData.name,
        userId: user?.id || 'guest',
        createdAt: new Date().toISOString(),
      };
      return newBoard;
    } catch (error) {
      return rejectWithValue('Ошибка создания доски');
    }
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id, name };
    } catch (error) {
      return rejectWithValue('Ошибка обновления доски');
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (id, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return id;
    } catch (error) {
      return rejectWithValue('Ошибка удаления доски');
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
      .addCase(addBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards.push(action.payload);
        saveBoardsToStorage(state.boards);
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.boards.findIndex(board => board.id === action.payload.id);
        if (index !== -1) {
          state.boards[index].name = action.payload.name;
          saveBoardsToStorage(state.boards);
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.filter(board => board.id !== action.payload);
        saveBoardsToStorage(state.boards);
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBoardsError } = boardsSlice.actions;
export default boardsSlice.reducer;