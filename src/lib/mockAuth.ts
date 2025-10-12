export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'verifier';
  total_tokens: number;
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const signup = (name: string, email: string, password: string, role: 'user' | 'verifier'): User => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find((u: User) => u.email === email)) {
    throw new Error('Email already exists');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    role,
    total_tokens: 0
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem(`password_${email}`, password);
  
  return newUser;
};

export const login = (email: string, password: string): User => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: User) => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }

  const storedPassword = localStorage.getItem(`password_${email}`);
  if (storedPassword !== password) {
    throw new Error('Invalid password');
  }

  return user;
};

export const logout = () => {
  setCurrentUser(null);
};

export const updateUserTokens = (userId: string, tokens: number) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: User) => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].total_tokens = tokens;
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[userIndex]);
    }
  }
};
