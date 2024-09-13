import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';

const MiniGame = ({ players }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsActive(true);
  };

  const incrementScore = () => {
    if (isActive) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  return (
    <Box>
      <Text fontSize="xl">Mini-Game for Non-Active Players</Text>
      <VStack spacing={4}>
        <Text>Players: {players.join(', ')}</Text>
        <Text>Score: {score}</Text>
        <Text>Time Left: {timeLeft}s</Text>
        {!isActive && (
          <Button onClick={startGame}>Start Mini-Game</Button>
        )}
        {isActive && (
          <Button onClick={incrementScore} size="lg">
            Tap Me!
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default MiniGame;