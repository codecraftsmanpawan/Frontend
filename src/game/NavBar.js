import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWallet } from 'react-icons/fa';
import { GiGamepad } from 'react-icons/gi';
import config from '../config';

const TopNavBar = ({ walletAmount = 0 }) => {
    const { baseURL } = config;
    const [clientDetails, setClientDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientDetails();
        const intervalId = setInterval(fetchClientDetails, 1000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const fetchClientDetails = () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error('No token found in localStorage');
            setLoading(false);
            return;
        }

        const userId = decodeToken(token).id;

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
                setLoading(false); // Set loading to false when data is fetched
            })
            .catch(error => {
                console.error('Error fetching client details:', error);
                setLoading(false); // Set loading to false even if there's an error
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

    return (
        <div className="bg-indigo-700 p-4 shadow-lg fixed w-full top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Link to="/gameplay" className="text-white text-lg font-bold flex items-center transform transition-transform duration-300 hover:scale-110">
                        <GiGamepad className="h-6 w-6 mr-1" />
                        BW Game
                    </Link>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center text-white transform transition-transform duration-300 hover:scale-110">
                        <FaWallet className="h-5 w-5 mr-1" />
                        <span className="text-xl">
                            {loading ? 'Loading...' : `₹${clientDetails ? clientDetails.budget : walletAmount}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNavBar;
