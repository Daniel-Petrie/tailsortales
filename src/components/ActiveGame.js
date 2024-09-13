import React, { useState } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import Timer from './Timer';
import CoinFlip from './CoinFlip';

const ActiveGame = ({ gameState, gamePhase, onPhaseChange }) => {
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');

  const handleQuestionSubmit = () => {
    gameState.setQuestion(questionInput);
    onPhaseChange('answer');
  };

  const handleAnswerSubmit = () => {
    gameState.setAnswer(answerInput);
    onPhaseChange('reveal');
  };

  const handleCoinFlipComplete = (result) => {
    if (result) {
      gameState.updateScore(gameState.activePlayers[1], 1); // Answerer gets a point
    } else {
      gameState.updateScore(gameState.activePlayers[0], 1); // Questioner gets a point
    }
    onPhaseChange('selection');
  };

  return (
    <Box>
      {gamePhase === 'selection' && (
        <Button onClick={() => onPhaseChange('question')}>Start New Round</Button>
      )}
      {gamePhase === 'question' && (
        <VStack>
          <Text>{gameState.activePlayers[0]}, ask your question:</Text>
          <input
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Enter your question"
          />
          <Button onClick={handleQuestionSubmit}>Submit Question</Button>
          <Timer duration={30} onComplete={handleQuestionSubmit} />
        </VStack>
      )}
      {gamePhase === 'answer' && (
        <VStack>
          <Text>Question: {gameState.currentQuestion}</Text>
          <Text>{gameState.activePlayers[1]}, your answer:</Text>
          <input
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="Enter your answer"
          />
          <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
          <Timer duration={30} onComplete={handleAnswerSubmit} />
        </VStack>
      )}
      {gamePhase === 'reveal' && (
        <VStack>
          <Text>Question: {gameState.currentQuestion}</Text>
          <CoinFlip onComplete={handleCoinFlipComplete} />
        </VStack>
      )}
    </Box>
  );
};

export default ActiveGame;