import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Fixed import for jwt-decode
import config from '../config';

const PasswordChangePopup = ({ closePopup }) => {
    const { baseURL } = config;
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        setErrorMessage('');
        setSuccessMessage(''); // Clear any previous success message

        // Validate password match
        if (newPassword !== confirmPassword) {
            setErrorMessage('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('userToken'); // Ensure you're using the correct token key

            if (!token) {
                setErrorMessage('No token found in local storage');
                return;
            }

            // Decode the token to extract the username
            const decodedToken = jwtDecode(token);
            const username = decodedToken.username; // Adjust based on your token payload structure

            const response = await axios.post(
                `${baseURL}/api/client/change-password`,
                {
                    username, // Include username in the request body
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setSuccessMessage('Password changed successfully'); // Set success message
                setTimeout(() => {
                    closePopup(); // Close popup after a short delay to allow user to see the message
                }, 2000);
            } else {
                setErrorMessage('Enter Correct Old password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setErrorMessage('Error changing password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

                {successMessage && (
                    <div className="mb-4 text-green-600">{successMessage}</div>
                )}

                {errorMessage && (
                    <div className="mb-4 text-red-600">{errorMessage}</div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700">Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handleChangePassword}
                        className={`bg-indigo-600 text-white py-2 px-4 rounded shadow hover:bg-indigo-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                        onClick={closePopup}
                        className="bg-gray-600 text-white py-2 px-4 rounded shadow hover:bg-gray-700 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangePopup;
