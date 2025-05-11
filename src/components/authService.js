import axios from 'axios';

const API_BASE_URL = 'https://hamilton06.pythonanywhere.com';

export const signin = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await axios.post(`${API_BASE_URL}/api/signin`, formData);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Signin error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};