import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const ClientManagement = ({ adminToken }) => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ code: '', budget: '', masterCode: '', status: '', username: '', password: '' });

  const fetchClients = async () => {
    try {
      const response = await axios.get('/client', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [adminToken]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/client/add', newClient, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setNewClient({ code: '', budget: '', masterCode: '', status: '', username: '', password: '' });
      fetchClients();
    } catch (error) {
      console.error('Failed to add client', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Client Management</h2>
      <form onSubmit={handleAddClient} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Code</label>
          <input
            type="text"
            value={newClient.code}
            onChange={(e) => setNewClient({ ...newClient, code: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Budget</label>
          <input
            type="number"
            value={newClient.budget}
            onChange={(e) => setNewClient({ ...newClient, budget: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Master Code</label>
          <input
            type="text"
            value={newClient.masterCode}
            onChange={(e) => setNewClient({ ...newClient, masterCode: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <input
            type="text"
            value={newClient.status}
            onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={newClient.username}
            onChange={(e) => setNewClient({ ...newClient, username: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={newClient.password}
            onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Add Client</button>
      </form>

      <h3 className="text-xl mb-4">Existing Clients</h3>
      <ul>
        {clients.map((client) => (
          <li key={client._id} className="border-b py-2">
            {client.username} ({client.code})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientManagement;
