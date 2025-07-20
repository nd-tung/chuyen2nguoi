const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

let rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('create or join', (room) => {
        if (!rooms[room]) {
            rooms[room] = { players: {}, playerCount: 0 };
            socket.join(room);
            rooms[room].players[socket.id] = { player: 1 };
            rooms[room].playerCount++;
            socket.emit('room created', room, 1);
        } else if (rooms[room].playerCount < 2) {
            socket.join(room);
            rooms[room].players[socket.id] = { player: 2 };
            rooms[room].playerCount++;
            socket.emit('room joined', room, 2);
            io.in(room).emit('start game', rooms[room].players);
        } else {
            socket.emit('room full');
        }
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
