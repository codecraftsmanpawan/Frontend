import React, { useState, useEffect } from 'react';
import TopNavBar from './NavBar';
import BottomNavBar from './BottomNavBar';
import config from '../config';

const CurrentBetsTable = () => {
    const { baseURL } = config;
    const [clientBets, setClientBets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientDetails();
    }, []);

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

    const fetchClientDetails = async () => {
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

        try {
            const response = await fetch(`${baseURL}/api/bets/client-bets/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                redirect: 'follow'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            // Sort bets in descending order based on timestamp
            const sortedBets = data.clientBets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            setClientBets(sortedBets);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching client details');
        }
    };

    const colors = [
        "#E91E63", "#9C27B0", "#3F51B5", "#6750A4",
        "#FF5722", "#00BCD4", "#03ff63", "#B295FF",
        "#FF9800", "#03A9F4"
    ];

    const getColorStyle = (color, gameMode) => {
        if (!color) return {};
        const styles = {
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'inline-block',
            width: '1.5rem',
            height: '1.5rem',
            textAlign: 'center',
            lineHeight: '1.5rem'
        };

        if (gameMode === 'blackWhite') {
            styles.backgroundColor = color.toLowerCase() === 'black' ? '#000000' : '#FFFFFF';
            styles.color = color.toLowerCase() === 'black' ? '#FFFFFF' : '#000000';
        } else if (color.startsWith('Color')) {
            const index = parseInt(color.replace('Color', ''), 10);
            if (index >= 0 && index < colors.length) {
                styles.backgroundColor = colors[index];
                styles.color = '#ffffff';
            }
        } else if (color.toLowerCase() === 'black') {
            styles.backgroundColor = '#000000';
            styles.color = '#FFFFFF';
        } else {
            styles.backgroundColor = color === 'Black' ? '#000000' : '#FFFFFF';
            styles.color = color === 'Black' ? '#FFFFFF' : '#000000';
        }
        return styles;
    };

    const getResultDisplay = (bet) => {
        if (!bet.results) return { result: 'Pending', winningAmount: 0 };

        const betColor = bet.color ? bet.color.toLowerCase() : 'unknown';
        const resultColor = bet.results ? bet.results.toLowerCase() : 'unknown';

        if (betColor === resultColor) {
            const winningAmount = calculateWinningAmount(bet.amount, bet.gameMode);
            return {
                result: <span className="bg-green-500 text-white py-1 px-2 rounded">Win 🏆</span>,
                winningAmount
            };
        } else {
            return {
                result: <span className="bg-red-500 text-white py-1 px-2 rounded">Lose 😞</span>,
                winningAmount: 0
            };
        }
    };

    const calculateWinningAmount = (betAmount, gameMode) => {
        if (gameMode === 'blackWhite') {
            return betAmount * 1.9; // Example: Double the bet amount
        } else if (gameMode === 'tenColor') {
            return betAmount * 9; // Example: Ten times the bet amount
        } else {
            return betAmount; // Default
        }
    };

    const getGameModeDisplay = (gameMode) => {
        return gameMode === 'blackWhite' ? 'Black & White' : 'Ten Color';
    };

    return (
        <>
            <TopNavBar />
            <div className="container mx-auto py-8 mt-8">
                <div className="overflow-x-auto shadow-lg bg-white ">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Game ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Bet Color</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Game Mode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Game Outcome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Game Results</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Winning Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-100 divide-y divide-gray-200">
                            {clientBets.map((bet, index) => (
                                <tr key={bet._id} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{bet.gameId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(bet.timestamp).toLocaleString('en-GB', { 
                                            day: 'numeric', 
                                            month: 'short', 
                                            year: 'numeric', 
                                            hour: 'numeric', 
                                            minute: 'numeric', 
                                            hour12: true 
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{bet.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span style={getColorStyle(bet.color, bet.gameMode)}></span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getGameModeDisplay(bet.gameMode)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getResultDisplay(bet).result}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span style={getColorStyle(bet.results, bet.gameMode)}></span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex justify-center items-center w-10 h-10 text-white rounded-full ${getResultDisplay(bet).winningAmount === 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                                            <span>{getResultDisplay(bet).winningAmount}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <BottomNavBar />
        </>
    );
};

export default CurrentBetsTable;
