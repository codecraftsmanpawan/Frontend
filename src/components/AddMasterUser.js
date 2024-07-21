import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import config from '../config'; 

const AddMasterUser = () => {
  const { baseURL } = config;
  const navigate = useNavigate(); // Access navigate function for navigation
  const [responseText, setResponseText] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    percentage: '',
    brokarge: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Function to generate a random username
  const generateUsername = () => {
    const username = `Master_${Math.floor(Math.random() * 100000)}`;
    setFormData({ ...formData, username });
  };

  // Function to generate a random password
  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8); // Generate 8-character random string
    setFormData({ ...formData, password });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const url = `${baseURL}/api/masteruser/add`;
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.text();
      setResponseText(result);

      // Show toast based on the response
      if (response.ok) {
        toast.success('Master user added successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Navigate to the dashboard after successful submission
        navigate('/masteruserlist');
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
      console.error('Error:', error);
      toast.error('Error adding master user. Please try again later.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const clearForm = () => {
    setFormData({
      code: '',
      percentage: '',
      brokarge: '',
      username: '',
      password: ''
    });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-400">Add Master User:</h2>
        <div className="mb-4 flex items-center">
          <div className="w-1/2 mr-2">
            <label className="block text-sm text-gray-400 mb-2">Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
            />
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-sm text-gray-400 mb-2">Percentage:</label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">brokarge:</label>
          <input
            type="number"
            name="brokarge"
            value={formData.brokarge}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Username:</label>
          <div className="flex items-center">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
            />
            <button
              type="button"
              onClick={generateUsername}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Generate
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Password:</label>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
            <button
              type="button"
              onClick={generatePassword}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Generate
            </button>
          </div>
        </div>
        <div className="flex mt-6 justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline mr-4"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline"
          >
            Clear
          </button>
        </div>
      </div>
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

export default AddMasterUser;
