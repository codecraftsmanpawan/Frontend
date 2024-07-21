import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import config from '../config'; 

const MasterUserList = () => {
  const { baseURL } = config;
  const navigate = useNavigate();
  const [masterUsers, setMasterUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending order

  useEffect(() => {
    const fetchMasterUsers = async () => {
      const token = localStorage.getItem('token');

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch(`${baseURL}/api/masteruser?sort=createDate:${sortOrder}`, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMasterUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error fetching master users. Please try again later.', {
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

    fetchMasterUsers();
  }, [sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
  };

  const handleView = (id) => {
    navigate(`/masteruserdetail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/masterusers/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this master user?')) {
      const token = localStorage.getItem('token');

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch(`${baseURL}/api/masteruser/${id}`, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to delete master user');
        }
        toast.success('Master user deleted successfully!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Refresh the list after deletion
        const updatedUsers = masterUsers.filter(user => user._id !== id);
        setMasterUsers(updatedUsers);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error deleting master user. Please try again later.', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const filteredUsers = masterUsers.filter(user =>
    user.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMasterUsers = () => {
    return (
      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden"
      >
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Percentage</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">brokarge</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={handleSort}
            >
              Created Date
              {sortOrder === 'asc' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.293 13.293a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414zM9 15a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1 text-gray-300 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 10.293a1 1 0 011.414 0L10 13.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414zM9 5a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd" />
                </svg>
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-200">
          {filteredUsers.map((user, index) => (
            <motion.tr
              key={user._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.percentage}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.brokarge}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(user.createDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <button
                  onClick={() => handleView(user._id)}
                  className="text-blue-500 hover:text-blue-700 ml-1 mr-4"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                {/* <button
                  onClick={() => handleEdit(user._id)}
                  className="text-yellow-500 hover:text-yellow-700 mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button> */}
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    );
  };

  const totalClients = masterUsers.length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-4xl w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">Master User List</h2>
        <div className="mb-4 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by code or username"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M13.293 13.293a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414zM9 15a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="mb-4 text-gray-300">
          Total Clients: {totalClients}
        </div>
        {loading ? (
          <p className="text-center text-gray-300">Loading master user data...</p>
        ) : (
          renderMasterUsers()
        )}
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

export default MasterUserList;
