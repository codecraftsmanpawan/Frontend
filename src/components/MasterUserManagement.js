import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const MasterUserManagement = ({ adminToken }) => {
  const [masterUsers, setMasterUsers] = useState([]);
  const [newUser, setNewUser] = useState({ code: '', percentage: '', brokerage: '', username: '', password: '' });

  const fetchMasterUsers = async () => {
    try {
      const response = await axios.get('/masteruser', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setMasterUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch master users', error);
    }
  };

  useEffect(() => {
    fetchMasterUsers();
  }, [adminToken]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/masteruser/add', newUser, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setNewUser({ code: '', percentage: '', brokerage: '', username: '', password: '' });
      fetchMasterUsers();
    } catch (error) {
      console.error('Failed to add master user', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Master User Management</h2>
      <form onSubmit={handleAddUser} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Code</label>
          <input
            type="text"
            value={newUser.code}
            onChange={(e) => setNewUser({ ...newUser, code: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Percentage</label>
          <input
            type="number"
            value={newUser.percentage}
            onChange={(e) => setNewUser({ ...newUser, percentage: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">brokerage</label>
          <input
            type="number"
            value={newUser.brokerage}
            onChange={(e) => setNewUser({ ...newUser, brokerage: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Add Master User</button>
      </form>

      <h3 className="text-xl mb-4">Existing Master Users</h3>
      <ul>
        {masterUsers.map((user) => (
          <li key={user._id} className="border-b py-2">
            {user.username} ({user.code})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MasterUserManagement;
