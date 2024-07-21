import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import config from '../config';

const Modal = ({ isOpen, onClose, gameId, gameMode, selectedColor }) => {
    const { baseURL } = config;
    const [amount, setAmount] = useState('');
    const [walletAmount, setWalletAmount] = useState(0); // Initialize walletAmount with 0
    const [clientDetails, setClientDetails] = useState(null);
    const [error, setError] = useState(null);
    const predefinedAmounts = [10, 25, 50, 100, 500, 1000, 1500, 3000, 5000];

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
                setWalletAmount(data.budget); // Set walletAmount based on fetched data
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

    const handleAmountClick = (value) => {
        setAmount(value.toString());
    };

    const handleInputChange = (event) => {
        setAmount(event.target.value);
    };

    const remainingBalance = walletAmount - parseFloat(amount || 0);

    const handleSubmit = () => {
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
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
            clientId: userId, // Use userId fetched from token or clientDetails
            gameId: gameId,
            amount: parseFloat(amount).toFixed(2), // Use parseFloat and toFixed to handle decimal values
            color: selectedColor,
            gameMode: gameMode
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${baseURL}/api/bets/join-game`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Bet placed successfully:');
                onClose(); // Close modal after successful bet placement
                // Perform any additional actions after successful bet placement
            })
            .catch(error => {
                console.error('Error placing bet:', error);
                setError('Error placing bet');
            });
    };

    if (!isOpen) return null;

    const isSubmitDisabled = remainingBalance < 0 || amount === '';

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <div className="mt-4">
                    <p className="font-semibold">Enter Bet Amount:</p>
                    <input
                        type="text"
                        value={amount}
                        onChange={handleInputChange}
                        placeholder="Enter custom amount"
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <p className={`text-sm mt-1 ${remainingBalance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        Remaining Balance: ₹{remainingBalance >= 0 ? remainingBalance.toFixed(2) : 0}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {predefinedAmounts.map((value) => (
                        <button
                            key={value}
                            onClick={() => handleAmountClick(value)}
                            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-200"
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className={`bg-green-500 text-white py-2 px-12 rounded hover:bg-green-700 transition duration-200 mr-2 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white py-2 px-12 rounded hover:bg-red-700 transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
