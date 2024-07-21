import React, { useEffect, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';

const GameStatus = () => {
    const [games, setGames] = useState([]);
    const { messages } = useWebSocket('ws://localhost:5000');

    useEffect(() => {
        messages.forEach((msg) => {
            if (msg.type === 'GAME_STATE') {
                setGames((prevGames) =>
                    prevGames.map((game) =>
                        game._id === msg.game._id ? msg.game : game
                    )
                );
            } else if (msg.type === 'GAME_ENDED') {
                setGames((prevGames) =>
                    prevGames.map((game) =>
                        game._id === msg.game._id ? msg.game : game
                    )
                );
            }
        });
    }, [messages]);

    return (
        <div>
            <h2>Game Status</h2>
            <ul>
                {games.map((game) => (
                    <li key={game._id}>
                        Game ID: {game._id}, Mode: {game.mode}, Status: {game.status}, Results: {game.results || 'Pending'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameStatus;
