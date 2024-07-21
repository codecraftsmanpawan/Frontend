import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import PasswordChangePopup from './PasswordChangePopup';
import { useNavigate } from 'react-router-dom';
import TopNavBar from './NavBar';
import BottomNavBar from './BottomNavBar';
import config from '../config';

function SettingsPage() {
    const { baseURL } = config;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [clientDetails, setClientDetails] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClientDetails();
    }, []);

    const fetchClientDetails = () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error('No token found in localStorage');
            setError('User is not authenticated');
            return;
        }

        const userId = decodeToken(token).id;
        if (!userId) {
            setError('Invalid token');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const apiUrl = `${baseURL}/api/client/${userId}`;

        fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setClientDetails(data);
            })
            .catch(error => {
                console.error('Error fetching client details:', error);
                setError('Error fetching client details');
            });
    };

    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = JSON.parse(atob(base64));
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return {};
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/user-login');
    };

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const username = clientDetails ? clientDetails.username : '';
    const status = clientDetails ? clientDetails.status : '';
    const createDate = clientDetails ? new Date(clientDetails.createDate).toLocaleDateString() : '';

    return (
        <div>
            <TopNavBar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-lg rounded p-6 w-full max-w-md transform transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center justify-center mb-4">
                        <FaUserCircle className="h-12 w-12 mr-2 text-indigo-600" />
                        <h2 className="text-2xl font-semibold">Profile</h2>
                    </div>
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    disabled
                                    className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Status</label>
                                <input
                                    type="text"
                                    value={status}
                                    disabled
                                    className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Creation Date</label>
                                <input
                                    type="text"
                                    value={createDate}
                                    disabled
                                    className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <button
                                onClick={openPopup}
                                className="bg-indigo-600 text-white py-2 px-4 rounded shadow hover:bg-indigo-700 transition duration-200 w-full mb-2"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white py-2 px-4 rounded shadow hover:bg-red-700 transition duration-200 w-full"
                            >
                                <FaSignOutAlt className="inline-block mr-1" />
                                Logout
                            </button>
                        </>
                    )}
                </div>
                {isPopupOpen && <PasswordChangePopup closePopup={closePopup} />}
            </div>
            <BottomNavBar />
        </div>
    );
}

export default SettingsPage;
