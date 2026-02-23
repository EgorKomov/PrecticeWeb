import api from './auth';

export const boardsAPI = {
  getBoards: () => 
    api.get('/boards'),
  
  createBoard: (boardData) => 
    api.post('/boards', boardData),
  
  updateBoard: (id, boardData) => 
    api.put(`/boards/${id}`, boardData),
  
  deleteBoard: (id) => 
    api.delete(`/boards/${id}`),
};