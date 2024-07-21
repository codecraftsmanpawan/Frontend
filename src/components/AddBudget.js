import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';

const DisplayCurrentBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentBudget, setCurrentBudget] = useState(0);
  const [addAmount, setAddAmount] = useState('');
  const [removeAmount, setRemoveAmount] = useState('');
  const [error, setError] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const { baseURL } = config;

  useEffect(() => {
    const fetchClientDetails = () => {
      const token = localStorage.getItem('token');
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch(`${baseURL}/api/client/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setClientDetails(result);
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    };

    fetchClientDetails();
  }, [id]);

  useEffect(() => {
    const fetchCurrentBudget = () => {
      const token = localStorage.getItem('token');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch(`${baseURL}/admin/client-budget/${id}`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch budget');
          }
          return response.json();
        })
        .then((data) => {
          setCurrentBudget(data.budget);
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    };

    fetchCurrentBudget();

    const interval = setInterval(fetchCurrentBudget, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const updateBudget = (newBudget) => {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({ budget: newBudget });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${baseURL}/admin/update-budget/${id}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update budget');
        }
        return response.json();
      })
      .then(() => {
        setCurrentBudget(newBudget);
        setAddAmount('');
        setRemoveAmount('');
        setError(null);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  };

  const handleAddBudget = () => {
    const amount = parseFloat(addAmount);
    const newBudget = currentBudget + amount;
    if (isNaN(amount) || amount <= 0) {
      setError(new Error('Invalid amount to add'));
      return;
    }
    updateBudget(newBudget);
  };

  const handleRemoveBudget = () => {
    const amount = parseFloat(removeAmount);
    const newBudget = currentBudget - amount;
    if (isNaN(amount) || amount <= 0) {
      setError(new Error('Invalid amount to remove'));
      return;
    }
    if (newBudget < 0) {
      setError(new Error('Budget cannot be negative'));
      return;
    }
    updateBudget(newBudget);
  };

  const totalAfterAddition = currentBudget + (parseFloat(addAmount) || 0);
  const totalAfterRemoval = currentBudget - (parseFloat(removeAmount) || 0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
        <div className="md:w-1/2 md:pr-4 mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-4">Client Details</h1>
          {clientDetails && (
            <div className="p-4 bg-gray-100 rounded-md shadow-md">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white p-2 rounded-md shadow-md w-full">
                  <strong className="w-1/2">Code:</strong>
                  <span className="w-1/2">{clientDetails.code}</span>
                </div>
                <div className="flex items-center bg-white p-2 rounded-md shadow-md w-full">
                  <strong className="w-1/2">Username:</strong>
                  <span className="w-1/2">{clientDetails.username}</span>
                </div>
                <div className="flex items-center bg-white p-2 rounded-md shadow-md w-full">
                  <strong className="w-1/2">Master Code:</strong>
                  <span className="w-1/2">{clientDetails.masterCode}</span>
                </div>
                <div className="flex items-center bg-white p-2 rounded-md shadow-md w-full">
                  <strong className="w-1/2">Status:</strong>
                  <span className="w-1/2">{clientDetails.status}</span>
                </div>
                <div className="flex items-center bg-white p-2 rounded-md shadow-md w-full">
                  <strong className="w-1/2">Budget:</strong>
                  <span className="w-1/2">₹{clientDetails.budget}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/2 md:pl-4">
          <h1 className="text-2xl font-bold mb-4">Current Budget</h1>

          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/2 p-2">
              <div className="text-lg mb-2">
                Budget: <span className="font-semibold">₹{currentBudget}</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-2">
              <div>
                Total After Addition: <span className="font-semibold">₹{totalAfterAddition}</span>
              </div>
              <div className={`font-semibold ${totalAfterRemoval < 0 ? 'text-red-500' : ''}`}>
                Total After Removal: <span>₹{totalAfterRemoval}</span>
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">Error: {error.message}</div>}

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Add Budget</h2>
            <input
              type="number"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
              placeholder="Amount to Add"
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
            />
            <button
              onClick={handleAddBudget}
              className="w-full bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Remove Budget</h2>
            <input
              type="number"
              value={removeAmount}
              onChange={e => setRemoveAmount(e.target.value)}
              placeholder="Amount to Remove"
              className="border border-gray-300 rounded-md p-2 w-full mb-2"
            />
            <button
              onClick={handleRemoveBudget}
              className="w-full bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayCurrentBudget;
