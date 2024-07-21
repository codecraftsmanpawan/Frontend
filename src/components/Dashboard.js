import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGamepad } from '@fortawesome/free-solid-svg-icons';
import 'chart.js/auto';
import 'animate.css';
import config from '../config';

const Dashboard = () => {
  const { baseURL } = config;

  const [totalMasterUsers, setTotalMasterUsers] = useState(null);
  const [totalClients, setTotalClients] = useState(null);
  const [totalGames, setTotalGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const fetchMasterUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/api/masteruser`, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setTotalMasterUsers(result.length); // Assuming the API returns an array of master users
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await fetch(`${baseURL}/api/client`, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setTotalClients(result.length); // Assuming the API returns an array of clients
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchTotalGames = async () => {
      try {
        const response = await fetch(`${baseURL}/api/games/all`, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setTotalGames(result.count); // Assuming the API returns an object with a count property
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterUsers();
    fetchClients();
    fetchTotalGames();
  }, [baseURL]);

  // Data for the line chart
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Total Users',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
      {
        label: 'Total Games',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.4,
      },
    ],
  };

  // Data for the pie chart
  const pieChartData = {
    labels: ['Master Users', 'Clients', 'Active Games', 'Inactive Games'],
    datasets: [
      {
        label: 'Distribution',
        data: [totalMasterUsers, totalClients, totalGames, 0], // Inactive Games set to 0 or adjust as needed
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-r from-gray-800 to-gray-800 p-4 mt-16 overflow-hidden">
      <div className="w-full max-w-screen-xl bg-gray-900 text-white rounded-lg shadow-lg p-8 animate__animated animate__fadeInDown overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105 animate__animated animate__fadeInLeft overflow-hidden">
            <div className="flex items-center justify-center text-3xl text-blue-400 mb-2">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3 className="text-xl font-semibold text-center text-blue-400 mb-2">Total Master Users</h3>
            <p className="text-4xl font-bold text-center text-white">{totalMasterUsers}</p>
          </div>

          {/* Total Clients */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105 animate__animated animate__fadeInRight overflow-hidden">
            <div className="flex items-center justify-center text-3xl text-blue-400 mb-2">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3 className="text-xl font-semibold text-center text-blue-400 mb-2">Total Clients</h3>
            <p className="text-4xl font-bold text-center text-white">{totalClients}</p>
          </div>

          {/* Total Games */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105 animate__animated animate__fadeInLeft overflow-hidden">
            <div className="flex items-center justify-center text-3xl text-blue-400 mb-2">
              <FontAwesomeIcon icon={faGamepad} />
            </div>
            <h3 className="text-xl font-semibold text-center text-blue-400 mb-2">Total Games</h3>
            <p className="text-4xl font-bold text-center text-white">{totalGames}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105 animate__animated animate__fadeInUp overflow-hidden">
            <h3 className="text-2xl font-bold text-center text-blue-400 mb-4">User and Game Trends</h3>
            <div className="relative w-full h-64">
              <Line data={lineChartData} />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105 animate__animated animate__fadeInUp overflow-hidden">
            <h3 className="text-2xl font-bold text-center text-blue-400 mb-4">Distribution of Users and Games</h3>
            <div className="relative w-full h-64">
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
