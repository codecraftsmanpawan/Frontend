// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Navbar from './components/Navbar'; 
import AddMasters from './components/AddMasterUser';
import MasterUserlist from './components/MasterUserList';
import MasterUserDetail from './components/MasterUserDetail';
import AddClient from './components/AddClient';
import ClientList from './components/ClientList';
import GameDashboard from './components/GameDashboard';
import UserLogin from './game/UserLogin';
import LiveGame from './game/LiveGame';
import CompletedGame from './game/CompletedGame';
import GamePlay from './game/GamePlay';
import Results from './game/Results';
import History from './game/History';
import Settings from './game/Settings';
import MasterLogin from './components/MasterLogin';
import MasterDashboard from './components/MasterDashboard';
import AddBudget from './components/AddBudget';
import GameStatus from './components/GameStatus';
import Betting from './components/Betting';
const App = () => {
  // Mock authentication state
  const isLoggedIn = true; 
  const isAdmin = false; 
  const username = "Super Admin";

  return (
    <Router>
      <div>
        <Routes>
          {/* Route without Navbar */}
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Routes with Navbar */}
          <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<Dashboard />} />} />
          <Route path="/addmasters" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<AddMasters />} />} />
          <Route path="/masteruserlist" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<MasterUserlist />} />} />
          <Route path="/masteruserdetail/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<MasterUserDetail />} />} />
          <Route path="/addClient" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<AddClient />} />} />
          <Route path="/clientList" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<ClientList />} />} />
          <Route path="/game-dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<GameDashboard />} />} />
          <Route path="/addbudget/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} component={<AddBudget />} />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/livegame" element={<LiveGame />} />
          <Route path="/completedgame" element={<CompletedGame />} />
          <Route path="/gameplay" element={<GamePlay />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/masterlogin" element={<MasterLogin />} />
          <Route path="/masterdashboard" element={<MasterDashboard />} />
           <Route path="/gamestatus" element={<GameStatus />} />
          <Route path="/betting" element={<Betting />} />
         
        </Routes>
      </div>
    </Router>
  );
};

// PrivateRoute component for protecting routes
const ProtectedRoute = ({ isLoggedIn, isAdmin, username, component }) => {
  const token = localStorage.getItem('token');

  return token ? (
    <>
      <Navbar isLoggedIn={isLoggedIn} username={username} isAdmin={isAdmin} />
      {component}
    </>
  ) : (
    <Navigate to="/admin-login" replace /> // Ensure Navigate is properly imported and used here
  );
};

export default App;
