import React, { useEffect, useState } from 'react';
import config from '../config';
const MasterUserDropdown = ({ onSelect }) => {
  const { baseURL } = config;
  const [masterCodes, setMasterCodes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseURL}/api/masteruser`, requestOptions)
      .then((response) => response.json())
      .then((result) => setMasterCodes(result))
      .catch((error) => setError(error));
  }, []);

  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
<>
      <select
        id="masterCode"
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
      >
        <option value="">--Select Master Code--</option>
        {masterCodes.map((code) => (
          <option key={code.id} value={code.code}>
            {code.code}
          </option>
        ))}
      </select>
      {error && <div className="mt-2 p-2 bg-red-200 text-red-800 rounded">Error: {error.message}</div>}
      </>
  );
};

export default MasterUserDropdown;
