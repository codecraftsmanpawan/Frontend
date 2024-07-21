// src/services/AuthService.js

import axios from 'axios';
import config from '../config';
const API_URL = `${baseURL}/api`;
 const { baseURL } = config;
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/admin/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  logout,
  getCurrentUser,
};
