import api from '../../../shared/api';

export const tasksAPI = {
  getTasks: (boardId, listId) => 
    api.get('/task/task', { params: { boardId, listId } }),
  
  createTask: (name, listId) => 
    api.post('/task/createTask', { name, listId }),
  
  updateTask: (name, isActive, taskId, listId, boardId) => 
    api.put('/task/editTask', { name, isActive, taskId, listId, boardId }),
  
  deleteTask: (taskId, listId, boardId) => 
    api.delete('/task/deleteTask', { params: { taskId, listId, boardId } }),

  reorderTasks: (boardId, taskId, order, newListId) => 
  api.put('/task/reorderTask', { taskId, boardId, order, newListId  }),
};