import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lobbyId, setLobbyId] = useState(null);
  const [lobbyName, setLobbyName] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [coinFlipResult, setCoinFlipResult] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socketRef.current.on('lobbyCreated', ({ lobbyId, lobbyName, players }) => {
      console.log(`Lobby created: ${lobbyId}`);
      setLobbyId(lobbyId);
      setLobbyName(lobbyName);
      setPlayers(players);
    });

    socketRef.current.on('playerJoined', ({ players, lobbyId, lobbyName }) => {
      console.log(`Player joined lobby: ${lobbyId}`);
      setLobbyId(lobbyId);
      setLobbyName(lobbyName);
      setPlayers(players);
    });

    socketRef.current.on('playerLeft', ({ players }) => {
      console.log('Player left');
      setPlayers(players);
    });

    socketRef.current.on('roundStarted', ({ questioner, answerer }) => {
      console.log('New round started');
      setCurrentRound({ questioner, answerer });
      setQuestion('');
      setAnswer('');
      setIsAnswerRevealed(false);
      setCoinFlipResult(null);
    });

    socketRef.current.on('questionSubmitted', ({ question }) => {
      console.log('Question submitted');
      setQuestion(question);
    });

    socketRef.current.on('answerSubmitted', ({ answer }) => {
      console.log('Answer submitted');
      setAnswer(answer);
    });

    socketRef.current.on('coinResult', ({ result, answer }) => {
      console.log(`Coin flip result: ${result ? 'Heads' : 'Tails'}`);
      setCoinFlipResult(result);
      if (result) {
        setAnswer(answer);
      }
      setIsAnswerRevealed(true);
    });

    socketRef.current.on('error', (errorMessage) => {
      console.error('Socket error:', errorMessage);
      setError(errorMessage);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const createLobby = useCallback((lobbyName, playerName, playerColor) => {
    console.log(`Creating lobby: ${lobbyName}`);
    socketRef.current.emit('createLobby', { lobbyName, playerName, playerColor });
  }, []);

  const joinLobby = useCallback((lobbyId, playerName, playerColor) => {
    console.log(`Joining lobby: ${lobbyId}`);
    socketRef.current.emit('joinLobby', { lobbyId, playerName, playerColor });
  }, []);

  const startRound = useCallback(() => {
    console.log('Starting new round');
    socketRef.current.emit('startRound', lobbyId);
  }, [lobbyId]);

  const submitQuestion = useCallback((question) => {
    console.log('Submitting question');
    socketRef.current.emit('submitQuestion', { lobbyId, question });
  }, [lobbyId]);

  const submitAnswer = useCallback((answer) => {
    console.log('Submitting answer');
    socketRef.current.emit('submitAnswer', { lobbyId, answer });
  }, [lobbyId]);

  const flipCoin = useCallback(() => {
    console.log('Flipping coin');
    socketRef.current.emit('flipCoin', lobbyId);
  }, [lobbyId]);

  const startNextRound = useCallback(() => {
    console.log('Starting next round');
    socketRef.current.emit('startNextRound', lobbyId);
  }, [lobbyId]);

  return {
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
    socketId: socketRef.current?.id,
    createLobby,
    joinLobby,
    startRound,
    submitQuestion,
    submitAnswer,
    flipCoin,
    startNextRound
  };
};

export default useSocket;