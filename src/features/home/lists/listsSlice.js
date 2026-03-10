import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listsAPI } from '../../../entities/list/api/list';
import { tasksAPI } from '../../../entities/task/api/task';

const initialState = {
  lists: [],
  tasks: {},
  loading: false,
  error: null,
  currentBoardId: null,
};

export const fetchBoardData = createAsyncThunk(
  'lists/fetchBoardData',
  async (boardId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Не авторизован');
      }
      
      const listsResponse = await listsAPI.getLists(boardId);
      const lists = listsResponse.data;
      
      const tasks = {};
      
      await Promise.all(
        lists.map(async (list) => {
          const tasksResponse = await tasksAPI.getTasks(boardId, list.id);
          tasks[list.id] = tasksResponse.data;
        })
      );
      
      return { lists, tasks, boardId };
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки данных доски');
    }
  }
);

export const addList = createAsyncThunk(
  'lists/addList',
  async ({ boardId, name }, { rejectWithValue, dispatch }) => {
    try {
      const response = await listsAPI.createList(name, boardId);
      dispatch(fetchBoardData(boardId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания списка');
    }
  }
);

export const updateList = createAsyncThunk(
  'lists/updateList',
  async ({ id, name, boardId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await listsAPI.updateList(name, id, boardId);
      dispatch(fetchBoardData(boardId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления списка');
    }
  }
);

export const deleteList = createAsyncThunk(
  'lists/deleteList',
  async ({ id, boardId }, { rejectWithValue, dispatch }) => {
    try {
      await listsAPI.deleteList(id, boardId);
      dispatch(fetchBoardData(boardId));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления списка');
    }
  }
);

export const addTask = createAsyncThunk(
  'lists/addTask',
  async ({ listId, content, boardId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await tasksAPI.createTask(content, listId);
      dispatch(fetchBoardData(boardId));
      return { listId, task: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания задачи');
    }
  }
);

export const updateTask = createAsyncThunk(
  'lists/updateTask',
  async ({ id, content, listId, boardId, completed }, { rejectWithValue, dispatch }) => {
    try {
      const response = await tasksAPI.updateTask(
        content,
        !completed,
        id,
        listId,
        boardId
      );
      dispatch(fetchBoardData(boardId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления задачи');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'lists/deleteTask',
  async ({ id, listId, boardId }, { rejectWithValue, dispatch }) => {
    try {
      await tasksAPI.deleteTask(id, listId, boardId);
      dispatch(fetchBoardData(boardId));
      return { id, listId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления задачи');
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'lists/toggleTaskComplete',
  async ({ id, listId, boardId, completed }, { rejectWithValue, dispatch, getState }) => {
    try {
      const newCompleted = !completed;
      
      const state = getState();
      const task = state.lists.tasks[listId]?.find(t => t.id === id);
      const content = task?.name;
      
      const response = await tasksAPI.updateTask(
        content,
        !newCompleted,
        id,
        listId,
        boardId
      );
      dispatch(fetchBoardData(boardId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка изменения статуса задачи');
    }
  }
);

export const reorderTasksThunk = createAsyncThunk(
  'lists/reorderTasks',
  async ({ taskId, boardId, order, newListId }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Не авторизован');
      }
      
      const response = await tasksAPI.reorderTasks(boardId, taskId, order, newListId);
      dispatch(fetchBoardData(boardId));
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      return rejectWithValue(error.response?.data?.message || 'Ошибка');
    }
  }
);

export const reorderListsThunk = createAsyncThunk(
  'lists/reorderLists',
  async ({ boardId, listId, order }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Не авторизован');
      }

      const response = await listsAPI.reorderLists(boardId, listId, order);
      
      dispatch(fetchBoardData(boardId));
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      return rejectWithValue(error.response?.data?.message || 'Ошибка при изменении порядка списков');
    }
  }
);

const listsSlice = createSlice({
  name: 'lists',
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardData.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload.lists;
        state.tasks = action.payload.tasks;
        state.currentBoardId = action.payload.boardId;
      })
      .addCase(fetchBoardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addList.pending, (state) => {
        state.loading = true;
      })
      .addCase(addList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateList.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteList.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        const { listId, task } = action.payload;
        if (!state.tasks[listId]) {
          state.tasks[listId] = [];
        }
        state.tasks[listId].push(task);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const task = action.payload;
        if (state.tasks[task.listId]) {
          const index = state.tasks[task.listId].findIndex(t => t.id === task.id);
          if (index !== -1) {
            state.tasks[task.listId][index] = task;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const { id, listId } = action.payload;
        if (state.tasks[listId]) {
          state.tasks[listId] = state.tasks[listId].filter(t => t.id !== id);
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleTaskComplete.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        state.loading = false;
        const task = action.payload;
        if (state.tasks[task.listId]) {
          const index = state.tasks[task.listId].findIndex(t => t.id === task.id);
          if (index !== -1) {
            state.tasks[task.listId][index] = task;
          }
        }
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reorderTasksThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(reorderTasksThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reorderTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reorderListsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(reorderListsThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reorderListsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listsSlice.reducer;