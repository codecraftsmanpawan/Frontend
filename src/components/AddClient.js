import React, { useState } from 'react';
import MasterUserDropdown from './MasterUserDropdown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import config from '../config';
const AddClient = () => {
  const { baseURL } = config;
  const [formData, setFormData] = useState({
    code: '',
    budget: 0,
    masterCode: '',
    status: 'active',
    username: '',
    password: ''
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(formData),
      redirect: 'follow',
    };

    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/client/add`, requestOptions);
      const result = await response.text();
      setResponse(result);

      if (response.ok) {
        toast.success('Client added successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        clearForm();
      } else {
        toast.error(`Error: ${result}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      setError(error);
      toast.error('Error adding client. Please try again later.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      code: '',
      budget: 0,
      masterCode: '',
      status: 'active',
      username: '',
      password: ''
    });
    setResponse(null);
    setError(null);
  };

  const generateCredentials = () => {
    const randomUsername = `User_${Math.floor(Math.random() * 1000000)}`;
    const randomPassword = generateRandomPassword();
    setFormData({ ...formData, username: randomUsername, password: randomPassword });
  };

  const generateRandomPassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-blue-400">Add Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex">
            <div className="w-1/2 mr-2">
              <label className="block text-sm text-gray-400 mb-2">Code:</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                required
              />
            </div>
            <div className="w-1/2 ml-2">
              <label className="block text-sm text-gray-400 mb-2">Budget:</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Master Code:</label>
            <MasterUserDropdown onSelect={(value) => setFormData({ ...formData, masterCode: value })} />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Username:</label>
            <div className="flex">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white mr-2"
                required
              />
              <button
                type="button"
                onClick={generateCredentials}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Generate
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Password:</label>
            <div className="flex">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white mr-2"
                required
              />
              <button
                type="button"
                onClick={() => {
                  const randomPassword = generateRandomPassword();
                  setFormData({ ...formData, password: randomPassword });
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Generate
              </button>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline mr-4"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </motion.button>
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline"
            >
              Clear
            </button>
          </div>
        </form>
        {response && (
          <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
            Response: {response}
          </div>
        )}
        {error && (
          <div className="mt-4 p-2 bg-red-200 text-red-800 rounded">
            Error: {error.message}
          </div>
        )}
      </motion.div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddClient;
