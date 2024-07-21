import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const ClientList = () => {
  const { baseURL } = config;
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseURL}/api/client`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setClients(result);
        setFilteredClients(result);
      })
      .catch((error) => setError(error));
  }, [baseURL]);

  useEffect(() => {
    setFilteredClients(
      clients.filter(
        (client) =>
          client.username.toLowerCase().includes(search.toLowerCase()) ||
          client.code.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  const handleUpdateBudget = (id) => {
    navigate(`/addbudget/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    try {
      const response = await fetch(`${baseURL}/api/client/${id}`, {
        method: 'DELETE',
        headers: myHeaders,
      });

      if (response.ok) {
        // Update the client list
        setClients(clients.filter(client => client._id !== id));
        setFilteredClients(filteredClients.filter(client => client._id !== id));
        alert('Client deleted successfully');
        setError(null);
      } else {
        throw new Error('Failed to delete client');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      setError(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Client List</h1>
        <p className="text-gray-600">Manage your clients effectively</p>
      </header>
      <div className="max-w-5xl w-full mx-auto bg-white rounded-lg shadow-md p-6">
        {error && <div className="text-red-500 mb-4">Error: {error.message}</div>}
        <input
          type="text"
          placeholder="Search by username or code"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Master Code</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Create Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client, index) => (
              <motion.tr
                key={client._id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-gray-100"
              >
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{index + 1}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{client.code}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{client.budget}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{client.masterCode}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{client.status}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{client.username}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">{new Date(client.createDate).toLocaleString()}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800 flex space-x-2">
                  <button
                    onClick={() => handleUpdateBudget(client._id)}
                    className="text-blue-500 hover:text-blue-400 transition"
                  >
                    Add Budget
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default ClientList;
