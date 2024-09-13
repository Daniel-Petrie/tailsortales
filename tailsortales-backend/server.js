const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const games = new Map();

function generateLobbyId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function selectRandomPlayers(players) {
  const shuffled = [...players].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createLobby', ({ lobbyName, playerName, playerColor }) => {
    const lobbyId = generateLobbyId();
    games.set(lobbyId, {
      name: lobbyName,
      players: [{ id: socket.id, name: playerName, color: playerColor }],
      currentRound: null,
      coinFlipResult: null
    });
    socket.join(lobbyId);
    socket.emit('lobbyCreated', { lobbyId, lobbyName, players: games.get(lobbyId).players });
  });

  socket.on('joinLobby', ({ lobbyId, playerName, playerColor }) => {
    const game = games.get(lobbyId);
    if (game) {
      if (!game.players.some(player => player.id === socket.id)) {
        game.players.push({ id: socket.id, name: playerName, color: playerColor });
        socket.join(lobbyId);
        io.to(lobbyId).emit('playerJoined', { 
          players: game.players,
          lobbyId,
          lobbyName: game.name
        });
      } else {
        socket.emit('error', 'You are already in this lobby');
      }
    } else {
      socket.emit('error', 'Lobby not found');
    }
  });

  socket.on('startRound', (lobbyId) => {
    const game = games.get(lobbyId);
    if (game && game.players.length >= 2) {
      const [questioner, answerer] = selectRandomPlayers(game.players);
      game.currentRound = {
        questioner,
        answerer,
        question: null,
        answer: null,
        isQuestionLocked: false,
        isAnswerLocked: false,
      };
      game.coinFlipResult = null;
      io.to(lobbyId).emit('roundStarted', { questioner, answerer });
    }
  });

  socket.on('submitQuestion', ({ lobbyId, question }) => {
    const game = games.get(lobbyId);
    if (game && game.currentRound && game.currentRound.questioner.id === socket.id) {
      game.currentRound.question = question;
      game.currentRound.isQuestionLocked = true;
      io.to(lobbyId).emit('questionSubmitted', { question });
    }
  });

  socket.on('submitAnswer', ({ lobbyId, answer }) => {
    const game = games.get(lobbyId);
    if (game && game.currentRound && game.currentRound.answerer.id === socket.id) {
      game.currentRound.answer = answer;
      game.currentRound.isAnswerLocked = true;
      io.to(lobbyId).emit('answerSubmitted', { answer });
    }
  });

  socket.on('flipCoin', (lobbyId) => {
    const game = games.get(lobbyId);
    if (game && game.currentRound) {
      const result = Math.random() < 0.5;
      game.coinFlipResult = result;
      io.to(lobbyId).emit('coinResult', { 
        result, 
        answer: result ? game.currentRound.answer : null 
      });
    }
  });

  socket.on('startNextRound', (lobbyId) => {
    const game = games.get(lobbyId);
    if (game && game.players.length >= 2) {
      const [questioner, answerer] = selectRandomPlayers(game.players);
      game.currentRound = {
        questioner,
        answerer,
        question: null,
        answer: null,
        isQuestionLocked: false,
        isAnswerLocked: false,
      };
      game.coinFlipResult = null;
      io.to(lobbyId).emit('roundStarted', { questioner, answerer });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const [lobbyId, game] of games.entries()) {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
        io.to(lobbyId).emit('playerLeft', { players: game.players });
        if (game.players.length === 0) {
          games.delete(lobbyId);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));