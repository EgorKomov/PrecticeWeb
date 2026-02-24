import axios from 'axios';

const API_URL = 'http://localhost:7000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/registration', userData),
};

export const boardsAPI = {
  getBoards: () => 
    api.get('/board/boards'),
  
  createBoard: (name) => 
    api.post('/board/createBoard', { name }),
  
  updateBoard: (name, boardId) => 
    api.put('/board/editBoard', { name, boardId }),
  
  deleteBoard: (boardId) => 
    api.delete('/board/deleteBoard', { params: { boardId } }),
};

export const listsAPI = {
  getLists: (boardId) => 
    api.get('/list/list', { params: { boardId } }),
  
  createList: (name, boardId) => 
    api.post('/list/createList', { name, boardId }),
  
  updateList: (name, listId, boardId) => 
    api.put('/list/editList', { name, listId, boardId }),
  
  deleteList: (listId, boardId) => 
    api.delete('/list/deleteList', { params: { listId, boardId } }),
};

export const tasksAPI = {
  getTasks: (boardId, listId) => 
    api.get('/task/task', { params: { boardId, listId } }),
  
  createTask: (name, listId) => 
    api.post('/task/createTask', { name, listId }),
  
  updateTask: (name, isActive, taskId, listId, boardId) => 
    api.put('/task/editTask', { name, isActive, taskId, listId, boardId }),
  
  deleteTask: (taskId, listId, boardId) => 
    api.delete('/task/deleteTask', { params: { taskId, listId, boardId } }),
};

export default api;