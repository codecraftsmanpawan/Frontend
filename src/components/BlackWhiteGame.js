import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlackWhiteGame = () => {
  const { baseURL } = config;

  const [gameDetails, setGameDetails] = useState([]);
  const [error, setError] = useState(null);
  const [countdownDisplay, setCountdownDisplay] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); // State to store remaining time
  const [autoResult, setAutoResult] = useState(true); // State to toggle auto/manual result setting
  const [isToggleActive, setIsToggleActive] = useState(false); // State to track toggle button activation
  const [selectedColor, setSelectedColor] = useState(''); // State to store the selected winner color
  const [responseMessage, setResponseMessage] = useState(''); // State to store response message
  const [responseType, setResponseType] = useState(''); // State to store response type (success or error)

  const colors = {
    "Black": "#000000", // Black
    "White": "#FFFFFF"  // White
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError(new Error('Token not found'));
      return;
    }

    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/ongoing-game-details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = response.data;
        if (!Array.isArray(result)) {
          throw new Error('API response is not an array');
        }
        const filteredDetails = result.filter(game => game.mode === "blackWhite");
        setGameDetails(filteredDetails);
      } catch (error) {
        setError(error);
      }
    };

    fetchGameDetails(); // Initial fetch

    const interval = setInterval(fetchGameDetails, 1000); // Refresh every second

    return () => clearInterval(interval); // Cleanup interval on unmount or re-render
  }, [baseURL]);

  useEffect(() => {
    if (gameDetails.length > 0) {
      const currentGame = gameDetails[0];
      const { startTime } = currentGame;
      const startTimestamp = new Date(startTime).getTime() / 1000;
      const nowTimestamp = new Date().getTime() / 1000;
      const secondsPassed = nowTimestamp - startTimestamp;
      const remainingSeconds = 15 * 60 - secondsPassed; // 15 minutes in seconds

      setTimeLeft(remainingSeconds); // Set remaining time
      setIsToggleActive(remainingSeconds <= 30); // Activate toggle button in the last 30 seconds

      const timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1); // Decrease time every second
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameDetails]);

  useEffect(() => {
    // Update countdown display
    setCountdownDisplay(formatCountdown(timeLeft));
  }, [timeLeft]);

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Round seconds to nearest whole number

    // Format the countdown display
    const minDisplay = minutes > 0 ? `${minutes} min` : '';
    const secDisplay = `${remainingSeconds} sec`;

    return `${minDisplay} ${secDisplay}`;
  };

  const handleToggleResultSetting = () => {
    if (isToggleActive) {
      setAutoResult(!autoResult);
    }
  };

  const handleSetWinner = async (color) => {
    if (!autoResult) {
      const currentGame = gameDetails[0]; // Fetch the current game details
      const token = localStorage.getItem('token');
      const requestConfig = {
        method: 'post',
        url: `${baseURL}/api/games/${currentGame.Id}/blackWhiteResultsBeforeEnd`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify({ results: color })
      };

      try {
        const response = await axios.request(requestConfig);
        setResponseMessage(response.data.message || `Winner set successfully: ${color}`); // Set success message
        setResponseType('success');
        setSelectedColor(color); // Update selected color
        toast.success(response.data.message || `Winner set successfully: ${color}`);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setResponseMessage('Results can only be added within 30 seconds of the endTime');
          setResponseType('error');
          toast.error('Results can only be added within 30 seconds of the endTime');
        } else {
          setError(error);
          setResponseMessage('Failed to set winner'); // Set error message
          setResponseType('error');
          toast.error('Failed to set winner. Please try again.');
        }
      }
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (gameDetails.length === 0) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-2xl mx-auto my-6 flex justify-center items-center">
        Loading...
        <div className="animate-spin text-5xl">
          ⏳
        </div>
      </div>
    );
  }

  const currentGame = gameDetails[0]; // Assuming only one game is relevant
  const hasBets = currentGame.details.some(d => d.clients && d.clients.length > 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedColor) {
      handleSetWinner(selectedColor);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg max-w-2xl mx-auto my-6">
      {/* <h2 className="text-xl">
        <strong
          style={{
            backgroundColor: selectedColor ? colors[selectedColor] : 'gray',
            padding: '0.5rem',
            color: selectedColor === 'Black' ? 'white' : 'initial'
          }}
        >
          {selectedColor ? `Selected Color: ${selectedColor}` : 'No color selected'}
        </strong>
      </h2> */}
      <div className="flex justify-between mb-2 mt-4">
        <h2 className="text-xl"><strong>Game ID: {currentGame.gameId}</strong></h2>
        <h2 className="text-xl"><strong>Countdown: {countdownDisplay}</strong></h2>
        <button
          onClick={handleToggleResultSetting}
          className={`px-4 py-2 ${isToggleActive ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded-full`}
          disabled={!isToggleActive}
        >
          Switch to {autoResult ? 'Manual' : 'Automatic'}
        </button>
      </div>
      {responseMessage && (
        <div className={`mt-4 p-4 ${responseType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg`}>
          {responseMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-4 mt-8">
        <label className="block mb-2">
          Selected Color:
          <input
            type="text"
            value={selectedColor}
            readOnly
            className="ml-2 p-2 bg-gray-700 text-white rounded"
          />
       
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-full mt-2 ml-5"
          disabled={!selectedColor || autoResult}
        >
          Submit Winner
        </button> </label>
      </form>
      <table className="min-w-full bg-gray-700 mb-4 mt-6">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Color</th>
            <th className="py-2 px-4 border-b">Total Bet Users</th>
            <th className="py-2 px-4 border-b">Total Bet Amount</th>
            <th className="py-2 px-4 border-b">After Calculation Bet Amount</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {Object.keys(colors).map((color, index) => {
            const detail = currentGame.details.find(d => d.color === color) || {};
            const textColor = color === "Black" ? "white" : "black";
            const isActionDisabled = timeLeft > 30 || autoResult; // Disable action if more than 30 seconds left or in auto mode

            const totalBetAmount = detail.clients
              ? detail.clients.reduce((acc, client) => acc + client.betAmount, 0)
              : 0;

            return (
              <tr key={index}>
                <td className="py-2 px-4 border-b" style={{ backgroundColor: colors[color], color: textColor }}>{color}</td>
                <td className="py-2 px-4 border-b">{detail.totalUsers || 0}</td>
                <td className="py-2 px-4 border-b">{totalBetAmount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{detail.totalFinalAmount || 0}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full ${color === "Black" ? "text-white" : "text-black"}`}
                    style={{
                      backgroundColor: colors[color],
                      color: color === "Black" ? "white" : "black"
                    }}
                    disabled={timeLeft > 30 || autoResult}
                  >
                    {selectedColor === color ? 'Selected' : 'Set Winner'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BlackWhiteGame;
