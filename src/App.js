import React, { useState } from 'react';
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
    coinFlipResult,
    error,
    createLobby,
    joinLobby,
    submitQuestion,
    submitAnswer,
    startGame,
    startNextRound,
    socketId
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
    <div className="app-container">
      <h1>Tails Or Tales</h1>
      {isConnected ? (
        lobbyId ? (
          <>
            <div className="lobby-info">
              <h2>Lobby: {lobbyName}</h2>
              <p>ID: {lobbyId}</p>
            </div>
            <GameContainer
              players={players}
              currentRound={currentRound}
              question={question}
              answer={answer}
              isAnswerRevealed={isAnswerRevealed}
              coinFlipResult={coinFlipResult}
              submitQuestion={submitQuestion}
              submitAnswer={submitAnswer}
              startGame={startGame}
              startNextRound={startNextRound}
              currentPlayerId={socketId}
              isHost={players[0]?.id === socketId}
            />
          </>
        ) : (
          <div className="lobby-creation">
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