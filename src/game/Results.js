import React, { useEffect, useState } from 'react';
import TopNavBar from './NavBar';
import BottomNavBar from './BottomNavBar';
import config from '../config';

const colors = [
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#3F51B5", // Indigo
  "#6750A4", // Blue
  "#FF5722", // Deep Orange
  "#00BCD4", // Cyan
  "#03ff63", // Green
  "#B295FF", // Yellow
  "#FF9800", // Orange
  "#03A9F4"  // Light Blue
];

const CurrentBets = () => {
  const [currentBets, setCurrentBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { baseURL } = config;

  const fetchCurrentBets = async () => {
    const token = localStorage.getItem('userToken');
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    try {
      const response = await fetch(`${baseURL}/api/bets/client-bets/${decodeId()}/current`, requestOptions);
      const result = await response.json();

      if (response.ok) {
        setCurrentBets(result.currentBets);
      } else {
        throw new Error(result.error || 'Failed to fetch bets');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decodeId = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))).id;
    }
    return null;
  };

  useEffect(() => {
    fetchCurrentBets();
    const intervalId = setInterval(fetchCurrentBets, 1000); // Refresh every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <TopNavBar />
      <div className="container mx-auto py-8">
        <div className="overflow-x-auto shadow-lg  bg-white mt-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Game ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Bet Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Bet Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Game Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estimated Win</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 divide-y divide-gray-200">
              {currentBets.map((bet, index) => {
                const estimatedWin = bet.gameMode === 'blackWhite' ? bet.amount * 1.9 : bet.amount * 9;
                const displayGameMode = bet.gameMode === 'blackWhite' ? 'Black & White' : 'Ten Color';
                const displayStatus = bet.status === 'running' ? 'Ongoing' : bet.status;

                let colorDisplay;
                if (bet.gameMode === 'blackWhite') {
                  colorDisplay = (
                    <div className={`w-6 h-6 rounded-full border-2 ${bet.color === 'Black' ? 'bg-black' : 'bg-white'}`}></div>
                  );
                } else if (bet.gameMode === 'tenColors') {
                  const colorIndex = parseInt(bet.color.replace('Color', ''), 10);
                  const tenColor = colors[colorIndex];
                  colorDisplay = (
                    <div className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: tenColor }}></div>
                  );
                }

                return (
                  <tr key={bet._id} className="hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bet.gameId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bet.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{colorDisplay}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{displayGameMode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{displayStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{estimatedWin.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
};

export default CurrentBets;
