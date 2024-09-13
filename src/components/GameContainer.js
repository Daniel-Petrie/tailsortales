import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import CoinFlip from './CoinFlip';
import FrogAvatar from './FrogAvatar';

const GameContainer = ({
  players,
  lobbyId,
  lobbyName,
  currentRound,
  question,
  answer,
  isAnswerRevealed,
  coinFlipResult,
  submitQuestion,
  submitAnswer,
  flipCoin,
  currentPlayerId,
  startNextRound
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showCoinFlipResult, setShowCoinFlipResult] = useState(false);

  useEffect(() => {
    if (isAnswerRevealed) {
      setShowCoinFlipResult(true);
      // Delay showing the answer for a dramatic effect
      const answerTimer = setTimeout(() => setShowAnswer(true), 2000);
      
      // Start next round after a longer delay
      const nextRoundTimer = setTimeout(() => {
        setShowAnswer(false);
        setShowCoinFlipResult(false);
        startNextRound();
      }, 10000);

      return () => {
        clearTimeout(answerTimer);
        clearTimeout(nextRoundTimer);
      };
    }
  }, [isAnswerRevealed, startNextRound]);

  useEffect(() => {
    // Reset states when a new round starts
    if (currentRound) {
      setShowAnswer(false);
      setShowCoinFlipResult(false);
    }
  }, [currentRound]);

  const handleSubmit = () => {
    if (currentRound?.questioner.id === currentPlayerId && !question) {
      submitQuestion(inputValue);
      setInputValue('');
    } else if (currentRound?.answerer.id === currentPlayerId && !answer) {
      submitAnswer(inputValue);
      setInputValue('');
    }
  };

  const renderGameContent = () => {
    const isQuestioner = currentRound && currentRound.questioner.id === currentPlayerId;
    const isAnswerer = currentRound && currentRound.answerer.id === currentPlayerId;

    return (
      <div className="game-phase">
        {currentRound ? (
          <>
            <div className="players-info">
              <div className="avatar-container">
                <FrogAvatar color={currentRound.questioner.color} size={100} seed={currentRound.questioner.id} />
                <p>{currentRound.questioner.name} is asking</p>
              </div>
              <div className="avatar-container">
                <FrogAvatar color={currentRound.answerer.color} size={100} seed={currentRound.answerer.id} />
                <p>{currentRound.answerer.name} is answering</p>
              </div>
            </div>
            
            {!question && (
              isQuestioner ? (
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
              ) : (
                <p>Waiting for {currentRound.questioner.name} to ask a question...</p>
              )
            )}
            
            {question && (
              <div className="question-display">
                <h3>Question:</h3>
                <p className="question-text">{question}</p>
              </div>
            )}
            
            {question && !answer && (
              isAnswerer ? (
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
              ) : (
                <p>Waiting for {currentRound.answerer.name} to answer...</p>
              )
            )}
            
            {answer && !isAnswerRevealed && (
              <CoinFlip onComplete={flipCoin} />
            )}
            
            {showCoinFlipResult && coinFlipResult !== null && (
              <div className="coin-flip-result">
                <p>
                  {coinFlipResult
                    ? "Heads: The coin landed on heads! The answer is:"
                    : "Tails: The coin landed on tails, this answer will be buried forever..."}
                </p>
              </div>
            )}
            
            {showAnswer && coinFlipResult && (
              <div className={`answer-reveal ${showAnswer ? 'show' : ''}`}>
                <h3>Answer:</h3>
                <p className="answer-text">{answer}</p>
                <p>Next round starting soon...</p>
              </div>
            )}
          </>
        ) : (
          <p>Waiting for the next round to start...</p>
        )}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="player-list">
        <div className="lobby-info">
          <h2>Lobby: {lobbyName}</h2>
          <p>ID: {lobbyId}</p>
        </div>
        <ul>
          {players.map((player) => (
            <li key={player.id} className={player.id === currentPlayerId ? 'current-player' : ''}>
              <FrogAvatar color={player.color} size={50} seed={player.id} />
              <span>{player.name}</span>
              {currentRound && currentRound.questioner.id === player.id && ' (Questioner)'}
              {currentRound && currentRound.answerer.id === player.id && ' (Answerer)'}
              {player.id === currentPlayerId && ' (You)'}
            </li>
          ))}
        </ul>
      </div>
      <div className="game-content">
        {renderGameContent()}
      </div>
    </div>
  );
};

export default GameContainer;