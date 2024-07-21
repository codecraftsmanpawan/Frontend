import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, faSignOutAlt, faTimes, faTachometerAlt, faUserPlus, faUsers, 
  faUser, faClipboardList, faGamepad, faTh, faLock 
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isLoggedIn, username, isAdmin, onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Example: Clearing token from localStorage
    navigate('/admin-login'); // Redirect to login or home page after logout
    if (typeof onLogout === 'function') {
      onLogout(); // Optional: Trigger parent component's logout handler
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 }
  };

  return (
    <>
      {/* Sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <button className="text-white focus:outline-none" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
          </button>
          <h2 className="text-white text-xl font-bold">BW Game Admin</h2>
          <div className="flex space-x-4">
            <NavLink
              to="/dashboard"
              className="px-3 py-2 bg-blue-600 text-white rounded"
              activeClassName="bg-blue-800"
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" /> Dashboard
            </NavLink>
            <NavLink
              to="/addmasters"
              className="px-3 py-2 bg-blue-600 text-white rounded"
              activeClassName="bg-blue-800"
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Add Master
            </NavLink>
            <NavLink
              to="/masteruserlist"
              className="px-3 py-2 bg-blue-600 text-white rounded"
              activeClassName="bg-blue-800"
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" /> Master User Lists
            </NavLink>
            <NavLink
              to="/addClient"
              className="px-3 py-2 bg-blue-600 text-white rounded"
              activeClassName="bg-blue-800"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Add Client
            </NavLink>
            <NavLink
              to="/clientList"
              className="px-3 py-2 bg-blue-600 text-white rounded"
              activeClassName="bg-blue-800"
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" /> Client List
            </NavLink>
          </div>

          <div className="flex items-center">
            <div className="flex-grow"></div> {/* Spacer */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center">
                  <span className="mr-4">
                    {isAdmin ? `Welcome, Admin ${username}!` : `Welcome, ${username}!`}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded mr-4"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/admin-login"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded mr-4"
                  activeClassName="bg-blue-800"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Admin Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 bg-gray-900 w-64 z-50 overflow-y-auto`}
        initial="hidden"
        animate={isSidebarOpen ? 'visible' : 'hidden'}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center bg-gray-900">
          <div className="p-6 border border-gray-500 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
            <div className="p-4 border flex justify-between bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-white text-xl font-bold text-center">Game Controller</h2>
              <button
                className="text-white focus:outline-none"
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>
            <ul className="mt-10">
              <li className="my-2 px-3 py-2 bg-blue-600 text-white rounded">
                <NavLink
                  to="/game-dashboard"
                  className="text-white hover:text-gray-300 transition duration-300 "
                  activeClassName="text-gray-300"
                >
                  <FontAwesomeIcon icon={faGamepad} className="mr-2" /> Game Dashboard
                </NavLink>
              </li>
              <li className="my-2 px-3 py-2 bg-blue-600 text-white rounded">
                <NavLink
                  to="/gamestatus"
                  className="text-white hover:text-gray-300 transition duration-300"
                  activeClassName="text-gray-300"
                >
                  <FontAwesomeIcon icon={faTh} className="mr-2" /> Game Status
                </NavLink>
              </li>
              <li className="my-2 px-3 py-2 bg-blue-600 text-white rounded">
                <NavLink
                  to="/betting"
                  className="text-white hover:text-gray-300 transition duration-300"
                  activeClassName="text-gray-300"
                >
                  <FontAwesomeIcon icon={faTh} className="mr-2" /> Betting
                </NavLink>
              </li>
              <li className="my-2 px-3 py-2 bg-blue-600 text-white rounded">
                <NavLink
                  to=""
                  className="text-white hover:text-gray-300 transition duration-300"
                  activeClassName="text-gray-300"
                >
                  <FontAwesomeIcon icon={faLock} className="mr-2" /> Password Change
                </NavLink>
              </li>
              {isAdmin && (
                <li className="my-2">
                  <NavLink
                    to="/admin-panel"
                    className="text-white hover:text-gray-300 transition duration-300"
                    activeClassName="text-gray-300"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Admin Panel
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Navbar;
