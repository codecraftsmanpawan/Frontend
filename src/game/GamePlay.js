import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSurprise } from 'react-icons/fa';
import TopNavBar from './NavBar';
import BottomNavBar from './BottomNavBar';
import Modal from './Modal';
import config from '../config';

const OngoingGamesComponent = () => {
  const navigate = useNavigate();
  const { baseURL } = config;
  const [ongoingGames, setOngoingGames] = useState([]);
  const [completedGames, setCompletedGames] = useState(
    JSON.parse(localStorage.getItem('completedGames')) || []
  );
  const [error, setError] = useState(null);
  const [newGameCountdown, setNewGameCountdown] = useState(
    JSON.parse(localStorage.getItem('newGameCountdown')) || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameResults, setGameResults] = useState({});
  const [selectedGameDetails, setSelectedGameDetails] = useState({
    gameId: '',
    gameMode: '',
    selectedColor: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetchGameResults();
  }, []);

  useEffect(() => {
    fetchOngoingGames();
    const fetchInterval = setInterval(fetchOngoingGames, 1000);
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    if (newGameCountdown !== null) {
      const countdownInterval = setInterval(() => {
        if (newGameCountdown > 0) {
          setNewGameCountdown(newGameCountdown - 1);
          localStorage.setItem('newGameCountdown', JSON.stringify(newGameCountdown - 1));
        } else {
          fetchOngoingGames();
          setNewGameCountdown(null);
          localStorage.removeItem('newGameCountdown');
        }
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [newGameCountdown]);

  const fetchGameResults = () => {
    fetch(`${baseURL}/admin/last-game-results`)
      .then((response) => response.json())
      .then((result) => {
        setGameResults(result);
        if (result.blackWhite) {
          handleCompletedGame('blackWhite', result.blackWhite.results);
        }
        if (result.tenColors) {
          handleCompletedGame('tenColors', result.tenColors.results);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchOngoingGames = async (retries = 3) => {
    try {
      const response = await fetch(`${baseURL}/api/games/ongoing`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        const sortedGames = data.data.sort((a, b) => {
          if (a.mode === 'blackWhite') return -1;
          if (a.mode === 'tenColors' && b.mode !== 'blackWhite') return -1;
          return 1;
        });
        setOngoingGames(sortedGames.map(game => ({
          ...game,
          countdown: calculateCountdown(game.endTime)
        })));
      } else {
        setError('Failed to fetch ongoing games');
        if (retries > 0) {
          setTimeout(() => fetchOngoingGames(retries - 1), 2000); // Retry after 2 seconds
        } else {
          // Reload the page after exhausting retries
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error fetching ongoing games:', error);
      setError('Failed to fetch ongoing games');
      if (retries > 0) {
        setTimeout(() => fetchOngoingGames(retries - 1), 2000); // Retry after 2 seconds
      } else {
        // Reload the page after exhausting retries
        window.location.reload();
      }
    }
  };

  const calculateCountdown = (endTime) => {
    const endTimestamp = new Date(endTime).getTime();
    const now = new Date().getTime();
    const difference = endTimestamp - now;

    if (difference < 0) {
      return "00:00";
    }

    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setOngoingGames(prevGames => (
        prevGames.map(game => {
          const newCountdown = calculateCountdown(game.endTime);
          if (newCountdown === "00:00") {
            if (!newGameCountdown) {
              // Start the game result display countdown and then start the new game countdown
              setNewGameCountdown(35); // 35 seconds for new game countdown
              handleCompletedGame(game.mode, game.results);
            }
          }
          return {
            ...game,
            countdown: newCountdown
          };
        })
      ));
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [newGameCountdown]);

  useEffect(() => {
    if (newGameCountdown !== null) {
      if (newGameCountdown > 5) {
        const countdownInterval = setInterval(() => {
          setNewGameCountdown(prevCountdown => {
            const newCountdown = prevCountdown - 1;
            localStorage.setItem('newGameCountdown', JSON.stringify(newCountdown));
            return newCountdown;
          });
        }, 1000);
        return () => clearInterval(countdownInterval);
      } else if (newGameCountdown === 5) {
        // Display results for 5 seconds
        setTimeout(() => {
          fetchOngoingGames();
          setNewGameCountdown(null);
          localStorage.removeItem('newGameCountdown');
        }, 5000); // Display results for 5 seconds
      }
    }
  }, [newGameCountdown]);

  const colors = [
    "#E91E63", "#9C27B0", "#3F51B5", "#6750A4", "#FF5722",
    "#00BCD4", "#03ff63", "#B295FF", "#FF9800", "#03A9F4"
  ];

  const handleButtonClick = (gameId, gameMode, selectedColor, isDisabled) => {
    if (isDisabled) {
      alert('Time Out');
      return;
    }
    setSelectedGameDetails({ gameId, gameMode, selectedColor });
    setIsModalOpen(true);
  };

  const handleCompletedGame = (mode, results) => {
    const updatedCompletedGames = [
      ...completedGames,
      { mode, results }
    ];
    setCompletedGames(updatedCompletedGames);
    localStorage.setItem('completedGames', JSON.stringify(updatedCompletedGames));

    // Remove the game from completed games after 5 seconds
    setTimeout(() => {
      const filteredCompletedGames = updatedCompletedGames.filter(game => game.mode !== mode);
      setCompletedGames(filteredCompletedGames);
      localStorage.setItem('completedGames', JSON.stringify(filteredCompletedGames));
    }, 5000); // Display the game results for 5 seconds
  };

  const renderGamesByMode = (mode) => {
    const games = ongoingGames.filter(game => game.mode === mode);

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 ml-4">
          {mode === 'blackWhite' ? 'Black & White Games' : 'Ten Colors Games'}
        </h2>
        {games.length === 0 || games.every(game => game.countdown === "00:00") ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-lg font-semibold">New {mode === 'blackWhite' ? 'Black & White' : 'Ten Colors'} game starts soon...</p>
            {newGameCountdown !== null && (
              <p className="text-lg font-semibold">Starting in: {newGameCountdown} seconds</p>
            )}
            {completedGames.find(game => game.mode === mode) && (
              <div className="animate__animated animate__bounceIn text-center mt-6">
                <p className="text-lg font-semibold">Game Results:</p>
                <div className="flex items-center justify-center">
                  <p className="mr-2 text-2xl">{completedGames.find(game => game.mode === mode).results}</p>
                  <FaSurprise className={`text-2xl animate__animated animate__heartBeat ${mode === 'blackWhite' ? 'text-pink-500' : 'text-yellow-500'}`} />
                </div>
              </div>
            )}
          </div>
        ) : (
          games.map((game) => {
            const isDisabled = game.countdown.split(':').reduce((min, sec) => (parseInt(min) * 60) + parseInt(sec)) <= 30;
            return (
              <div key={game.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Game ID: {game.gameId}</p>
                  <p className="text-lg font-semibold">Countdown: {game.countdown}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  {game.mode === 'blackWhite' ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleButtonClick(game._id, game.mode, 'Black', isDisabled)}
                          disabled={isDisabled}
                          className={`py-3 px-14 rounded shadow transition duration-200 ${isDisabled ? 'bg-gray-300' : 'bg-black text-white hover:bg-gray-800'}`}
                        >
                          Black
                        </button>
                        <button
                          onClick={() => handleButtonClick(game._id, game.mode, 'White', isDisabled)}
                          disabled={isDisabled}
                          className={`py-3 px-14 rounded shadow transition duration-200 ${isDisabled ? 'bg-gray-300' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                          White
                        </button>
                      </div>
                      <p><strong>Note:</strong> Win Bet Amount * 1.9</p>
                    </div>
                  ) : game.mode === 'tenColors' ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="grid grid-cols-5 gap-4">
                        {colors.map((color, index) => (
                          <button
                            key={index}
                            style={{ backgroundColor: color }}
                            onClick={() => handleButtonClick(game._id, game.mode, `Color${index}`, isDisabled)}
                            disabled={isDisabled}
                            className={`relative text-white py-3 px-6 rounded-full shadow-lg transition duration-200 transform ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-1 hover:shadow-2xl'}`}
                          >
                            <span className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20 rounded-full pointer-events-none"></span>
                            {index}
                          </button>
                        ))}
                      </div>
                      <p><strong>Note:</strong> Win Bet Amount * 9</p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div>
      <TopNavBar />
      <div className="container mx-auto py-8 mt-12">
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderGamesByMode('blackWhite')}
          {renderGamesByMode('tenColors')}
        </div>
      </div>
      <BottomNavBar />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gameId={selectedGameDetails.gameId}
        gameMode={selectedGameDetails.gameMode}
        selectedColor={selectedGameDetails.selectedColor}
      />
    </div>
  );
};

export default OngoingGamesComponent;
