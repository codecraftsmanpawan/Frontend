import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import 'animate.css';
import config from '../config'; 

function AdminLogin() {
  const { baseURL } = config;
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      toast.error('Please fill in both fields.');
      return;
    }

    // Prepare request body
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    };

    try {
      // Send login request
      const response = await fetch(`${baseURL}/admin/login`, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Extract token from response
      const { token } = await response.json();

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Navigate to dashboard
      navigate('/dashboard');

      // Show welcome message
      toast.success(`Welcome, ${username}!`);
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Invalid username or password.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg animate__animated animate__fadeInDown">
        <div className="flex justify-center mb-6">
          <FontAwesomeIcon icon={faSignInAlt} className="text-5xl text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transform transition-transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default AdminLogin;
