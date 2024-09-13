import React, { useState, useEffect } from 'react';
import GameContainer from './components/GameContainer';
import AvatarSelector from './components/AvatarSelector';
import useSocket from './hooks/useSocket';
import './styles.css';

const App = () => {
  const {
    isConnected,
    lobbyId,
    lobbyName,
    players,
    currentRound,
    question,
    answer,
    isAnswerRevealed,
    error,
    createLobby,
    joinLobby,
    submitQuestion,
    submitAnswer,
    flipCoin,
    startNextRound,
    socketId // Make sure useSocket is returning this
  } = useSocket();

  const [newLobbyName, setNewLobbyName] = useState('');
  const [joinLobbyId, setJoinLobbyId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState('green');

  const handleCreateLobby = () => {
    if (newLobbyName && playerName) {
      createLobby(newLobbyName, playerName, selectedColor);
    }
  };

  const handleJoinLobby = () => {
    if (joinLobbyId && playerName) {
      joinLobby(joinLobbyId, playerName, selectedColor);
    }
  };

  return (
    <div className="container">
      <h1>TailsOrTales Party Game</h1>
      {isConnected ? (
        lobbyId ? (
          <GameContainer
            players={players}
            lobbyId={lobbyId}
            lobbyName={lobbyName}
            currentRound={currentRound}
            question={question}
            answer={answer}
            isAnswerRevealed={isAnswerRevealed}
            submitQuestion={submitQuestion}
            submitAnswer={submitAnswer}
            flipCoin={flipCoin}
            startNextRound={startNextRound}
            currentPlayerId={socketId} // Pass the socketId as currentPlayerId
          />
        ) : (
          <div className="game-content">
            <div className="input-group">
              <label htmlFor="playerName">Your Name:</label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <AvatarSelector selectedColor={selectedColor} onSelectColor={setSelectedColor} />
            <div className="input-group">
              <label htmlFor="lobbyName">Lobby Name:</label>
              <input
                id="lobbyName"
                type="text"
                value={newLobbyName}
                onChange={(e) => setNewLobbyName(e.target.value)}
                placeholder="Enter lobby name"
              />
              <button onClick={handleCreateLobby} disabled={!playerName || !newLobbyName}>
                Create Lobby
              </button>
            </div>
            <div className="input-group">
              <label htmlFor="joinLobbyId">Lobby ID:</label>
              <input
                id="joinLobbyId"
                type="text"
                value={joinLobbyId}
                onChange={(e) => setJoinLobbyId(e.target.value)}
                placeholder="Enter lobby ID"
              />
              <button onClick={handleJoinLobby} disabled={!playerName || !joinLobbyId}>
                Join Lobby
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </div>
        )
      ) : (
        <p>Connecting to server...</p>
      )}
    </div>
  );
};

export default App;