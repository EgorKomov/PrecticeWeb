import api from '../../../shared/api';

export const listsAPI = {
  getLists: (boardId) => 
    api.get('/list/list', { params: { boardId } }),
  
  createList: (name, boardId) => 
    api.post('/list/createList', { name, boardId }),
  
  updateList: (name, listId, boardId) => 
    api.put('/list/editList', { name, listId, boardId }),
  
  deleteList: (listId, boardId) => 
    api.delete('/list/deleteList', { params: { listId, boardId } }),

  reorderLists: (boardId, listId, order) => 
  api.put('/list/reorderList', { boardId, listId, order }),
};