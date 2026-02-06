const getMockUsersFromStorage = () => {
  try {
    const usersStr = localStorage.getItem('mockUsers');
    if (usersStr) {
      return JSON.parse(usersStr);
    }
  } catch (error) {
    console.error('Ошибка чтения mockUsers из localStorage:', error);
  }
  
  return [
    { 
      id: 1, 
      email: 'test@test.com', 
      password: '123456', 
      name: 'Тестовый пользователь' 
    }
  ];
};

const saveMockUsersToStorage = (users) => {
  try {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  } catch (error) {
    console.error('Ошибка сохранения mockUsers в localStorage:', error);
  }
};

let mockUsers = getMockUsersFromStorage();

const mockAPI = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    mockUsers = getMockUsersFromStorage();
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const currentToken = 'mock-jwt-token-' + Date.now();
      const currentUser = { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      };
      
      return {
        data: {
          access_token: currentToken,
          user: currentUser
        }
      };
    }
    
    throw new Error('Неверный email или пароль');
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    mockUsers = getMockUsersFromStorage();
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = {
      id: mockUsers.length + 1,
      email: userData.email,
      password: userData.password,
      name: userData.name
    };
    
    mockUsers.push(newUser);
    saveMockUsersToStorage(mockUsers);

    const currentToken = 'mock-jwt-token-' + Date.now();
    const currentUser = { 
      id: newUser.id, 
      name: userData.name, 
      email: userData.email 
    };

    return {
      data: {
        access_token: currentToken,
        user: currentUser
      }
    };
  }
};

export const authAPI = mockAPI;