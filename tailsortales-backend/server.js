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

function startNewRound(lobbyId) {
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
    io.to(lobbyId).emit('roundStarted', { questioner, answerer });
    console.log(`New round started in lobby ${lobbyId}`);
  }
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('createLobby', ({ lobbyName, playerName, playerColor }) => {
    const lobbyId = generateLobbyId();
    games.set(lobbyId, {
      name: lobbyName,
      players: [{ id: socket.id, name: playerName, color: playerColor }],
      currentRound: null,
    });
    socket.join(lobbyId);
    socket.emit('lobbyCreated', { lobbyId, lobbyName, players: games.get(lobbyId).players });
    console.log(`Lobby created: ${lobbyId} by player ${playerName}`);
  });

  socket.on('joinLobby', ({ lobbyId, playerName, playerColor }) => {
    const game = games.get(lobbyId);
    if (game) {
      game.players.push({ id: socket.id, name: playerName, color: playerColor });
      socket.join(lobbyId);
      io.to(lobbyId).emit('playerJoined', { 
        players: game.players,
        lobbyId,
        lobbyName: game.name
      });
      console.log(`Player ${playerName} joined lobby ${lobbyId}`);
    } else {
      socket.emit('error', 'Lobby not found');
    }
  });

  socket.on('startGame', (lobbyId) => {
    startNewRound(lobbyId);
  });

  socket.on('submitQuestion', ({ lobbyId, question }) => {
    console.log(`Received question for lobby ${lobbyId}:`, question);
    const game = games.get(lobbyId);
    if (game && game.currentRound && game.currentRound.questioner.id === socket.id) {
      game.currentRound.question = question;
      game.currentRound.isQuestionLocked = true;
      io.to(lobbyId).emit('questionSubmitted', { question });
      console.log(`Question submitted and broadcasted to lobby ${lobbyId}`);
    } else {
      console.log('Invalid question submission');
      socket.emit('error', 'Invalid question submission');
    }
  });

  socket.on('submitAnswer', ({ lobbyId, answer }) => {
    console.log(`Received answer for lobby ${lobbyId}:`, answer);
    const game = games.get(lobbyId);
    if (game && game.currentRound && game.currentRound.answerer.id === socket.id) {
      game.currentRound.answer = answer;
      game.currentRound.isAnswerLocked = true;
      io.to(lobbyId).emit('answerSubmitted', { answer });
      console.log(`Answer submitted and broadcasted to lobby ${lobbyId}`);
      
      // Automatically flip the coin after the answer is submitted
      setTimeout(() => {
        const result = Math.random() < 0.5;
        io.to(lobbyId).emit('coinResult', { result });
        console.log(`Coin flipped in lobby ${lobbyId}. Result: ${result ? 'Heads' : 'Tails'}`);
      }, 3000); // Wait 3 seconds before flipping the coin
    } else {
      console.log('Invalid answer submission');
      socket.emit('error', 'Invalid answer submission');
    }
  });

  socket.on('startNextRound', (lobbyId) => {
    startNewRound(lobbyId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const [lobbyId, game] of games.entries()) {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
        io.to(lobbyId).emit('playerLeft', { players: game.players });
        console.log(`Player left lobby ${lobbyId}`);
        
        if (game.players.length === 0) {
          games.delete(lobbyId);
          console.log(`Lobby ${lobbyId} deleted due to no players`);
        } else if (game.players.length >= 2) {
          // If it was the questioner or answerer who left, start a new round
          if (game.currentRound && 
              (game.currentRound.questioner.id === socket.id || 
               game.currentRound.answerer.id === socket.id)) {
            startNewRound(lobbyId);
          }
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));