import api from '../../../shared/api';

export const boardsAPI = {
  getBoards: () => 
    api.get('/board/boards'),
  
  createBoard: (name) => 
    api.post('/board/createBoard', { name }),
  
  updateBoard: (name, boardId) => 
    api.put('/board/editBoard', { name, boardId }),
  
  deleteBoard: (boardId) => 
    api.delete('/board/deleteBoard', { params: { boardId } }),

  reorderBoard: (boardId, order) =>
    api.put('/board/reorderBoard', {boardId, order})
};