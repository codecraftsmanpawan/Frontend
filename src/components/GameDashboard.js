import React from 'react';
import { FaPalette, FaChessBoard } from 'react-icons/fa';
import BlackWhiteGame from './BlackWhiteGame';
import TenColorGame from './TenColorGame';

const GameDashboard = () => {
  return (
    <div className="flex flex-wrap justify-center items-stretch min-h-screen bg-gradient-to-r from-gray-800 to-gray-800 p-6 mt-16">
      <div className="w-full md:w-1/2 p-4 flex">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full">
          <div className="flex items-center mb-4">
            <FaChessBoard className="text-blue-600 text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Black & White Game</h2>
          </div>
          <BlackWhiteGame />
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4 flex">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full">
          <div className="flex items-center mb-4">
            <FaPalette className="text-red-600 text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Ten Color Game</h2>
          </div>
          <TenColorGame />
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
