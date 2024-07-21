import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };
  const handleUserLogin = () => {
    navigate('/user-login');
  };
  const handleMasterLogin = () => {
    navigate('/masterlogin');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Color Prediction Game</h1>
        <p className="text-lg md:text-2xl mb-6">Bet on the next color to win exciting rewards!</p>
        <div className="mt-10">
          <button
            onClick={handleAdminLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
          Super Admin Login
          </button>
        </div>
        <div className="mt-10">
          <button
            onClick={handleMasterLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Master Admin Login
          </button>
        </div>
        <div className="mt-10">
          <button
            onClick={handleUserLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            User Login
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
