const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

let rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('create or join', (room) => {
        console.log(`User ${socket.id} wants to create or join room: ${room}`);
        
        if (!rooms[room]) {
            console.log(`Creating new room: ${room}`);
            rooms[room] = { players: {}, playerCount: 0 };
            socket.join(room);
            rooms[room].players[socket.id] = { player: 1 };
            rooms[room].playerCount++;
            console.log(`User ${socket.id} created room ${room} as Player 1`);
            socket.emit('room created', room, 1);
        } else if (rooms[room].playerCount < 2) {
            console.log(`User ${socket.id} joining existing room: ${room}`);
            socket.join(room);
            rooms[room].players[socket.id] = { player: 2 };
            rooms[room].playerCount++;
            console.log(`User ${socket.id} joined room ${room} as Player 2`);
            socket.emit('room joined', room, 2);
            io.in(room).emit('start game', rooms[room].players);
        } else {
            console.log(`Room ${room} is full, rejecting user ${socket.id}`);
            socket.emit('room full');
        }
        
        console.log(`Current rooms:`, Object.keys(rooms));
        console.log(`Room ${room} player count:`, rooms[room]?.playerCount);
    });

    socket.on('submit statements', (room, statements, truthIndex) => {
        if (rooms[room]) {
            rooms[room].currentStatements = statements;
            rooms[room].currentTruthIndex = truthIndex;
            socket.to(room).emit('statements submitted', statements, truthIndex);
        }
    });

    socket.on('guess made', (room, guessIndex) => {
        if (rooms[room]) {
            const isCorrect = guessIndex === rooms[room].currentTruthIndex;
            io.in(room).emit('guess result', guessIndex, rooms[room].currentTruthIndex, isCorrect);
        }
    });

    socket.on('next round', (room) => {
        io.in(room).emit('new round');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        for (let room in rooms) {
            if (rooms[room].players[socket.id]) {
                delete rooms[room].players[socket.id];
                rooms[room].playerCount--;
                if (rooms[room].playerCount === 0) {
                    delete rooms[room];
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🎮 Two Truths and a Lie server listening on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});
