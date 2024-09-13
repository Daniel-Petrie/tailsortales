import { useState, useCallback } from 'react';

const useGameState = (players) => {
  const [activePlayers, setActivePlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isQuestionRevealed, setIsQuestionRevealed] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [scores, setScores] = useState({});

  // Initialize scores
  useState(() => {
    const initialScores = {};
    players.forEach(player => {
      initialScores[player] = 0;
    });
    setScores(initialScores);
  }, [players]);

  const selectActivePlayers = useCallback(() => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    setActivePlayers(shuffled.slice(0, 2));
  }, [players]);

  const setQuestion = useCallback((question) => {
    setCurrentQuestion(question);
    setIsQuestionRevealed(true);
  }, []);

  const setAnswer = useCallback((answer) => {
    setCurrentAnswer(answer);
  }, []);

  const flipCoin = useCallback(() => {
    const result = Math.random() < 0.5;
    setIsAnswerRevealed(result);
    return result;
  }, []);

  const updateScore = useCallback((player, points) => {
    setScores(prevScores => ({
      ...prevScores,
      [player]: prevScores[player] + points
    }));
  }, []);

  return {
    activePlayers,
    currentQuestion,
    currentAnswer,
    isQuestionRevealed,
    isAnswerRevealed,
    scores,
    selectActivePlayers,
    setQuestion,
    setAnswer,
    flipCoin,
    updateScore
  };
};

export default useGameState;