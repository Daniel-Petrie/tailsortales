import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import CoinFlip from './CoinFlip';
import FrogAvatar from './FrogAvatar';

const GameContainer = ({
  players,
  currentRound,
  question,
  answer,
  isAnswerRevealed,
  coinFlipResult,
  submitQuestion,
  submitAnswer,
  startGame,
  startNextRound,
  currentPlayerId,
  isHost
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (currentRound && !gameStarted) {
      setGameStarted(true);
    }
  }, [currentRound, gameStarted]);

  useEffect(() => {
    let timer;
    if (isAnswerRevealed) {
      setShowAnswer(true);
      timer = setTimeout(() => {
        setShowAnswer(false);
        startNextRound();
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAnswerRevealed, startNextRound]);

  const handleSubmit = () => {
    if (currentRound?.questioner.id === currentPlayerId && !question) {
      submitQuestion(inputValue);
      setInputValue('');
    } else if (currentRound?.answerer.id === currentPlayerId && !answer) {
      submitAnswer(inputValue);
      setInputValue('');
    }
  };

  const handleCoinFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
    }, 3000);
  };

  const handleStartGame = () => {
    if (isHost && players.length >= 2) {
      startGame();
    }
  };

  const renderGameContent = () => {
    if (!gameStarted) {
      return (
        <div className="waiting-room">
          <h2>Waiting for players...</h2>
          <ul className="player-list">
            {players.map((player) => (
              <li key={player.id}>
                <FrogAvatar color={player.color} size={40} />
                <span>{player.name}</span>
              </li>
            ))}
          </ul>
          {isHost && players.length >= 2 && (
            <button onClick={handleStartGame} className="start-game-button">
              Start Game
            </button>
          )}
        </div>
      );
    }

    if (!currentRound) {
      return <p>Waiting for the next round to start...</p>;
    }

    const isQuestioner = currentRound.questioner.id === currentPlayerId;
    const isAnswerer = currentRound.answerer.id === currentPlayerId;

    return (
      <div className="game-phase">
        <div className="players-info">
          <div className="avatar-container">
            <FrogAvatar color={currentRound.questioner.color} size={60} />
            <p>{currentRound.questioner.name} is asking</p>
          </div>
          <div className="avatar-container">
            <FrogAvatar color={currentRound.answerer.color} size={60} />
            <p>{currentRound.answerer.name} is answering</p>
          </div>
        </div>
        
        <div className="game-content">
          {!question && isQuestioner && (
            <div className="input-section">
              <p>You are the questioner. Please ask a question:</p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your question"
              />
              <button onClick={handleSubmit}>Submit Question</button>
              <Timer duration={30} onComplete={handleSubmit} />
            </div>
          )}
          
          {question && (
            <div className="question-display">
              <h3>Question:</h3>
              <p className="question-text">{question}</p>
              {!answer && isAnswerer && (
                <div className="input-section">
                  <p>You are the answerer. Please provide an answer:</p>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your answer"
                  />
                  <button onClick={handleSubmit}>Submit Answer</button>
                  <Timer duration={30} onComplete={handleSubmit} />
                </div>
              )}
            </div>
          )}
          
          {answer && !isAnswerRevealed && (
            <div className="coin-flip-section">
              <p>The answer has been submitted. Flipping the coin...</p>
              <CoinFlip onComplete={handleCoinFlip} />
            </div>
          )}
          
          {showAnswer && (
            <div className="answer-reveal">
              <h3>Result:</h3>
              {coinFlipResult ? (
                <>
                  <p className="coin-result">Heads: The answer is revealed!</p>
                  <p className="answer-text">{answer}</p>
                </>
              ) : (
                <p className="coin-result">Tails: The answer is buried forever...</p>
              )}
              <p>Next round starting in 10 seconds...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="game-container">
      {renderGameContent()}
    </div>
  );
};

export default GameContainer;