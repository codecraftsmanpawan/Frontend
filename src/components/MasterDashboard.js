import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import ChangePassword from './ChangePassword'; // Import your ChangePassword component

const MasterDashboard = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalBets, setTotalBets] = useState(0);
    const [userBetAmount, setUserBetAmount] = useState(0);
    const [brokarge, setBrokarge] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const [clients, setClients] = useState([]);
    const [totalBetAmount, setTotalBetAmount] = useState(0);
    const [totalBrokargeAmount, setTotalBrokargeAmount] = useState(0);
    const [showChangePassword, setShowChangePassword] = useState(false); // State to control the password modal
    const [firstDayOfWeek, setFirstDayOfWeek] = useState('');
    const [lastDayOfWeek, setLastDayOfWeek] = useState('');

    const { baseURL } = config;

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('masterAdminToken');
            if (!token) {
                console.error('No token found in local storage');
                setError('User is not authenticated');
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);

            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.username);
                const response = await fetch(
                    `${baseURL}/api/masteruser/profile/${decodedToken.username}`,
                    { method: 'GET', headers: myHeaders }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const result = await response.json();
                setProfileData(result);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();

        const intervalId = setInterval(fetchProfileData, 10000);
        return () => clearInterval(intervalId);
    }, [baseURL]);

    useEffect(() => {
        const fetchClientsData = async () => {
            const token = localStorage.getItem('masterAdminToken');
            if (!token || !profileData) return;

            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);

            try {
                const response = await fetch(`${baseURL}/api/masteruser/clients/${profileData?.code}`, { method: 'GET', headers: myHeaders });
                if (!response.ok) throw new Error('Failed to fetch clients data');

                const result = await response.json();
                setClients(result.clients);

                setFirstDayOfWeek(result.firstDayOfWeek);
                setLastDayOfWeek(result.lastDayOfWeek);

                setTotalUsers(result.clients.length);
                const totalBetsSum = result.clients.reduce((sum, client) => sum + client.totalBetAmount, 0);
                setTotalBets(totalBetsSum);
                setUserBetAmount(profileData.userBetAmount);
                setBrokarge(profileData.brokarge);
                const totalBrokargeSum = result.clients.reduce((sum, client) => sum + client.brokargeAmount, 0);
                setTotalBrokargeAmount(totalBrokargeSum);
            } catch (error) {
                console.error('Error fetching clients data:', error);
            }
        };

        if (profileData) {
            fetchClientsData();
            const intervalId = setInterval(fetchClientsData, 10000);
            return () => clearInterval(intervalId);
        }
    }, [profileData, baseURL]);

    const handleLogout = () => {
        localStorage.removeItem('masterAdminToken');
        navigate('/masterlogin');
    };

    return (
        <>
            <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <div className="text-white text-xl font-bold">BW Game</div>
                <div className="flex items-center space-x-4">
                    <span className="text-white">Welcome, {username}</span>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-lg">Logout</button>
                </div>
            </nav>
            <div className="flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-xxl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {profileData ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-teal-800 text-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold">Your Code</h3>
                                <p className="text-2xl">{profileData.code}</p>
                            </div>
                            <div className="bg-lime-800 text-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold">Your Percentage</h3>
                                <p className="text-2xl">{profileData.percentage}%</p>
                            </div>
                            <div className="bg-yellow-800 text-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold">Your Brokarge</h3>
                                <p className="text-2xl">{profileData.brokarge}%</p>
                            </div>
                            <div className="bg-fuchsia-800 text-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold">Create Date</h3>
                                <p className="text-2xl">{new Date(profileData.createDate).toLocaleString()}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700">Loading profile data...</p>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-xxl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">Total Bets</h3>
                            <p className="text-2xl">₹{totalBets}</p>
                        </div>
                        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">Total Brokarge</h3>
                            <p className="text-2xl">₹{totalBrokargeAmount}</p>
                        </div>
                        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold">Password Change</h3>
                            <p className="text-2xl"><button onClick={() => setShowChangePassword(true)} className="bg-blue-800 text-white px-3 py-1 rounded-lg">Change Password</button></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Client List</h1>
            <div className="mb-4">
                <span className="font-bold">Week:</span> {firstDayOfWeek} to {lastDayOfWeek}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 shadow-md rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount Bet</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Win Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Win Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Loss Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Loss Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brokerage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {clients.map((client, index) => (
                            <tr key={client.code} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-no-wrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{client.code}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{client.username}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">₹{client.budget}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">₹{client.totalBetAmount}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{client.totalBetCount}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">₹{client.totalWinAmount}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{client.totalWinCount}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">₹{client.totalLossAmount}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{client.totalLossCount}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">₹{client.brokargeAmount}</td>
                                <td className="px-6 py-4 whitespace-no-wrap capitalize">{client.status}</td>
                                <td className="px-6 py-4 whitespace-no-wrap">{new Date(client.createDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
            {showChangePassword && (
                <ChangePassword onClose={() => setShowChangePassword(false)} />
            )}
        </>
    );
};

export default MasterDashboard;
