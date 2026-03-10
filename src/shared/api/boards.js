import api from './auth';

export const boardsAPI = {
  createBoard: (name) => {
    return api.post('/board/createBoard', { name });
  },
  
  deleteBoard: (boardId) => {
    return api.delete('/board/deleteBoard', { params: { boardId } });
  },
  
  editBoard: (name, boardId) => {
    return api.put('/board/editBoard', { name, boardId });
  },
  
  getBoards: () => {
    return api.get('/board/boards');
  },
};

export const listsAPI = {
  getLists: (boardId) => {
    console.log('Fetching lists for board:', boardId);
    
    return api.get(`/lists/board/${boardId}`)
      .then(response => {
        console.log('Lists response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Lists error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  createList: (boardId, listData) => {
    console.log('Creating list for board:', boardId, 'with data:', listData);
    
    return api.post(`/lists/board/${boardId}`, listData)
      .then(response => {
        console.log('Create list response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Create list error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  updateList: (id, listData) => {
    console.log('Updating list:', id, 'with data:', listData);
    
    return api.put(`/lists/${id}`, listData)
      .then(response => {
        console.log('Update list response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Update list error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  deleteList: (id) => {
    console.log('Deleting list:', id);
    
    return api.delete(`/lists/${id}`)
      .then(response => {
        console.log('Delete list response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Delete list error:', error.response?.data || error.message);
        throw error;
      });
  },
};

export const cardsAPI = {
  getCards: (listId) => {
    console.log('📡 Fetching cards for list:', listId);
    
    return api.get(`/cards/list/${listId}`)
      .then(response => {
        console.log('Cards response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Cards error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  createCard: (listId, cardData) => {
    console.log('Creating card for list:', listId, 'with data:', cardData);
    
    return api.post(`/cards/list/${listId}`, cardData)
      .then(response => {
        console.log('Create card response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Create card error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  updateCard: (id, cardData) => {
    console.log('Updating card:', id, 'with data:', cardData);
    
    return api.put(`/cards/${id}`, cardData)
      .then(response => {
        console.log('Update card response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Update card error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  deleteCard: (id) => {
    console.log('Deleting card:', id);
    
    return api.delete(`/cards/${id}`)
      .then(response => {
        console.log('Delete card response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Delete card error:', error.response?.data || error.message);
        throw error;
      });
  },
  
  toggleCardComplete: (id) => {
    console.log('Toggling card complete:', id);
    
    return api.patch(`/cards/${id}/toggle`)
      .then(response => {
        console.log('Toggle card response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Toggle card error:', error.response?.data || error.message);
        throw error;
      });
  },
};