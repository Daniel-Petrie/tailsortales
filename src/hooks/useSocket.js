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

    socketRef.current.on('coinResult', ({ result }) => {
      console.log(`Coin flip result: ${result ? 'Heads' : 'Tails'}`);
      setCoinFlipResult(result);
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

  const startGame = useCallback(() => {
    console.log('Starting game');
    if (lobbyId) {
      socketRef.current.emit('startGame', lobbyId);
    } else {
      console.error('Cannot start game: lobbyId is null');
    }
  }, [lobbyId]);

  const submitQuestion = useCallback((question) => {
    console.log('Submitting question');
    if (lobbyId) {
      socketRef.current.emit('submitQuestion', { lobbyId, question });
    } else {
      console.error('Cannot submit question: lobbyId is null');
    }
  }, [lobbyId]);

  const submitAnswer = useCallback((answer) => {
    console.log('Submitting answer');
    if (lobbyId) {
      socketRef.current.emit('submitAnswer', { lobbyId, answer });
    } else {
      console.error('Cannot submit answer: lobbyId is null');
    }
  }, [lobbyId]);

  const startNextRound = useCallback(() => {
    console.log('Starting next round');
    if (lobbyId) {
      socketRef.current.emit('startNextRound', lobbyId);
    } else {
      console.error('Cannot start next round: lobbyId is null');
    }
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
    startGame,
    submitQuestion,
    submitAnswer,
    startNextRound
  };
};

export default useSocket;