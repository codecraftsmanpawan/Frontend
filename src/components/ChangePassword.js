import React, { useState } from 'react';
import config from '../config';
const ChangePassword = ({ onClose }) => {
     const { baseURL } = config;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (newPassword !== reEnterPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        const token = localStorage.getItem('masterAdminToken');

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${token}`);

        const raw = JSON.stringify({
            currentPassword,
            newPassword,
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        try {
            const response = await fetch(`${baseURL}/api/masteruser/change-password`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to change password');
            }
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setReEnterPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Re-enter New Password</label>
                        <input
                            type="password"
                            value={reEnterPassword}
                            onChange={(e) => setReEnterPassword(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg w-full p-2"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Change</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
