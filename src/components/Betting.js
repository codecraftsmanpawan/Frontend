import React, { useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const Betting = () => {
    const [gameId, setGameId] = useState('');
    const [amount, setAmount] = useState('');
    const [color, setColor] = useState('');
    const [gameMode, setGameMode] = useState('');
    const [manualResult, setManualResult] = useState('');

    const { messages, sendMessage } = useWebSocket('ws://localhost:5000');

    const handleBet = () => {
        sendMessage({
            type: 'BET',
            gameId,
            amount: parseFloat(amount),
            color,
            gameMode
        });
    };

    const handleManualResult = () => {
        sendMessage({
            type: 'SET_MANUAL_RESULT',
            gameId,
            manualResult
        });
    };

    return (
        <div>
            <h2>Place a Bet</h2>
            <input
                type="text"
                placeholder="Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <input
                type="text"
                placeholder="Game Mode"
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
            />
            <button onClick={handleBet}>Place Bet</button>

            <h2>Set Manual Result</h2>
            <input
                type="text"
                placeholder="Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Manual Result"
                value={manualResult}
                onChange={(e) => setManualResult(e.target.value)}
            />
            <button onClick={handleManualResult}>Set Result</button>

            <div>
                <h3>Messages</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{JSON.stringify(msg)}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Betting;
