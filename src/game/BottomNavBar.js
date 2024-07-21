import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ClipboardListIcon, ClockIcon, CogIcon } from '@heroicons/react/solid';

const BottomNavBar = () => {
    const location = useLocation();

    const linkClasses = (path) => (
        `flex flex-col items-center justify-center ${location.pathname === path ? 'text-yellow-300' : 'text-white hover:text-gray-300'} transition duration-300`
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-700 shadow-md z-50">
            <div className="container mx-auto flex justify-around items-center py-2">
                <Link to="/gameplay" className={linkClasses('/gameplay')}>
                    <HomeIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Home</span>
                </Link>
                <Link to="/results" className={linkClasses('/results')}>
                    <ClipboardListIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Current Bets</span>
                </Link>
                <Link to="/history" className={linkClasses('/history')}>
                    <ClockIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs">History</span>
                </Link>
                <Link to="/settings" className={linkClasses('/settings')}>
                    <CogIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Settings</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomNavBar;
