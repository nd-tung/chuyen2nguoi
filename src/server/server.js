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

    socket.on('create or join', (room, roundCount = 5, playerName = 'Anonymous', isViewer = false) => {
        console.log(`User ${socket.id} wants to create or join room: ${room} with ${roundCount} rounds as ${playerName}`);

        if (!rooms[room]) {
            console.log(`Creating new room: ${room}`);
            rooms[room] = {
                players: {},
                viewers: {},
                playerCount: 0,
                totalRounds: roundCount,
                currentRound: 1,
                currentPhase: 'waiting', // waiting, topic_selection, statement_creation, guessing
                topicSelector: null, // who is selecting topics
                statementCreator: null, // who is creating statements
                selectedTopics: [],
                currentTopic: null,
                gameState: {
                    scores: { 1: 0, 2: 0 },
                    player1Turn: false,
                    player2Turn: false
                },
                playerNames: { 1: playerName, 2: 'Player 2' }
            };
            socket.join(room);
            rooms[room].players[socket.id] = { player: 1, name: playerName };
            rooms[room].playerCount++;
            console.log(`User ${socket.id} created room ${room} as Player 1 (${playerName})`);
            socket.emit('room created', room, 1, roundCount, rooms[room].playerNames);
        } else if (rooms[room].playerCount < 2) {
            console.log(`User ${socket.id} joining existing room: ${room}`);
            socket.join(room);
            rooms[room].players[socket.id] = { player: 2, name: playerName };
            rooms[room].playerNames[2] = playerName;
            rooms[room].playerCount++;
            console.log(`User ${socket.id} joined room ${room} as Player 2 (${playerName})`);
            socket.emit('room joined', room, 2, rooms[room].totalRounds, rooms[room].playerNames);

            // Notify all players about updated names
            io.to(room).emit('player names updated', rooms[room].playerNames);
            // Inform players that the second participant has joined
            io.to(room).emit('player joined', rooms[room].playerNames);

            // Start the game with topic selection
            startTopicSelectionPhase(room);
        } else {
            if (isViewer) {
                socket.join(room);
                if (!rooms[room].viewers) rooms[room].viewers = {};
                rooms[room].viewers[socket.id] = { name: playerName };
                console.log(`User ${socket.id} joined room ${room} as Viewer`);
                socket.emit('viewer joined', {
                    room,
                    rounds: rooms[room].totalRounds,
                    playerNames: rooms[room].playerNames,
                    phase: rooms[room].currentPhase,
                    round: rooms[room].currentRound,
                    selectedTopics: rooms[room].selectedTopics,
                    typing: rooms[room].currentTyping || []
                });
            } else {
                console.log(`Room ${room} is full, rejecting user ${socket.id}`);
                socket.emit('room full');
            }
        }
        
        console.log(`Current rooms:`, Object.keys(rooms));
        console.log(`Room ${room} player count:`, rooms[room]?.playerCount);
    });

    socket.on('topic progress', (room, selectedTopics) => {
        if (rooms[room]) {
            const viewers = rooms[room].viewers || {};
            Object.keys(viewers).forEach(id => {
                io.to(id).emit('viewer topic progress', selectedTopics);
            });
        }
    });

    socket.on('topics selected', (room, selectedTopics) => {
        console.log(`Topics selected for room ${room}:`, selectedTopics); // Debug log
        if (rooms[room]) {
            rooms[room].selectedTopics = selectedTopics;
            rooms[room].currentPhase = 'statement_creation';
            console.log(`Starting statement creation phase for room ${room}`); // Debug log
            startStatementCreationPhase(room);
        }
    });

    socket.on('statement typing', (room, statements) => {
        if (rooms[room]) {
            const viewers = rooms[room].viewers || {};
            rooms[room].currentTyping = statements;
            Object.keys(viewers).forEach(id => {
                io.to(id).emit('viewer statement typing', statements);
            });
        }
    });

    socket.on('submit statements', (room, statements, truthIndex, topic, points = 1) => {
        if (rooms[room]) {
            rooms[room].currentStatements = statements;
            rooms[room].currentTruthIndex = truthIndex;
            rooms[room].currentTopic = topic;
            rooms[room].currentTopicPoints = points;
            rooms[room].currentPhase = 'guessing';
            // Notify the guesser
            const guesserSocketId = Object.keys(rooms[room].players).find(
                id => rooms[room].players[id].player !== rooms[room].statementCreator
            );
            if (guesserSocketId) {
                io.to(guesserSocketId).emit('statements submitted', statements, topic);
                // Update status for statement creator
                const creatorSocketId = Object.keys(rooms[room].players).find(
                    id => rooms[room].players[id].player === rooms[room].statementCreator
                );
                if (creatorSocketId) {
                    io.to(creatorSocketId).emit('status update', `Player ${rooms[room].players[guesserSocketId].player} is making their guess...`);
                }

                const viewers = rooms[room].viewers || {};
                Object.keys(viewers).forEach(id => {
                    io.to(id).emit('viewer statements submitted', statements, topic);
                });
            }
        }
    });

    socket.on('guess made', (room, guessIndex) => {
        if (rooms[room]) {
            const isCorrect = guessIndex === rooms[room].currentTruthIndex;
            const guesserPlayer = rooms[room].players[socket.id].player;
            const creatorPlayer = guesserPlayer === 1 ? 2 : 1;
            
            // Update scores
            if (!rooms[room].gameState.scores) {
                rooms[room].gameState.scores = { 1: 0, 2: 0 };
            }
            const pts = rooms[room].currentTopicPoints || 1;
            if (isCorrect) {
                rooms[room].gameState.scores[guesserPlayer] += pts;
            }

            const roundOver = rooms[room].gameState.player1Turn && rooms[room].gameState.player2Turn;
            const gameOverNext = roundOver && rooms[room].currentRound >= rooms[room].totalRounds;

            io.in(room).emit('guess result', guessIndex, rooms[room].currentTruthIndex, isCorrect, rooms[room].gameState.scores, roundOver, gameOverNext, pts);
        }
    });

    socket.on('next round', (room) => {
        if (rooms[room]) {
            // Check if we need to switch roles or move to next round
            const currentRound = rooms[room].currentRound;
            const totalRounds = rooms[room].totalRounds;
            
            // Each round has two phases: Player 2 selects for Player 1, then Player 1 selects for Player 2
            if (!rooms[room].gameState.player1Turn && !rooms[room].gameState.player2Turn) {
                // Start first turn of the round (Player 2 selects for Player 1)
                rooms[room].gameState.player1Turn = true;
                rooms[room].topicSelector = 2;
                rooms[room].statementCreator = 1;
                startTopicSelectionPhase(room);
            } else if (rooms[room].gameState.player1Turn && !rooms[room].gameState.player2Turn) {
                // Start second turn of the round (Player 1 selects for Player 2)
                rooms[room].gameState.player2Turn = true;
                rooms[room].topicSelector = 1;
                rooms[room].statementCreator = 2;
                startTopicSelectionPhase(room);
            } else {
                // Both turns completed, move to next round
                rooms[room].currentRound++;
                rooms[room].gameState.player1Turn = false;
                rooms[room].gameState.player2Turn = false;
                
                if (rooms[room].currentRound > totalRounds) {
                    // Game over
                    io.in(room).emit('game over', rooms[room].gameState.scores, rooms[room].playerNames);
                } else {
                    // Start next round
                    rooms[room].topicSelector = 2;
                    rooms[room].statementCreator = 1;
                    rooms[room].gameState.player1Turn = true;
                    startTopicSelectionPhase(room);
                }
            }
        }
    });

    socket.on('create custom topic', (room, customTopic) => {
        if (rooms[room]) {
            console.log(`Custom topic request in room ${room}:`, customTopic);
            const otherPlayerSocketId = Object.keys(rooms[room].players).find(
                id => id !== socket.id
            );
            if (otherPlayerSocketId) {
                io.to(otherPlayerSocketId).emit('approve custom topic', customTopic);
            }
        }
    });

    socket.on('approve custom topic', (room, customTopic) => {
        if (rooms[room]) {
            console.log(`Custom topic approved in room ${room}:`, customTopic);
            const topicKey = `custom_${Date.now()}`;
            customTopic.key = topicKey;
            // Add custom topic to the room's session
            rooms[room].customTopics = rooms[room].customTopics || {};
            rooms[room].customTopics[topicKey] = customTopic;
            io.to(room).emit('custom topic approved', topicKey, customTopic);
        }
    });

    // Emoji interaction handling
    socket.on('send emoji', (data) => {
        console.log(`Emoji sent in room ${data.room}:`, data.emoji, 'from', data.sender);
        if (rooms[data.room]) {
            // Broadcast emoji to all other players and viewers in the room (except sender)
            socket.to(data.room).emit('emoji received', {
                sender: data.sender,
                senderNumber: data.senderNumber,
                emoji: data.emoji,
                timestamp: data.timestamp
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        for (let room in rooms) {
            if (rooms[room].players[socket.id]) {
                const leavingPlayer = rooms[room].players[socket.id].player;
                delete rooms[room].players[socket.id];
                rooms[room].playerNames[leavingPlayer] = `Player ${leavingPlayer}`;
                rooms[room].playerCount--;
                if (rooms[room].playerCount === 0 && Object.keys(rooms[room].viewers || {}).length === 0) {
                    delete rooms[room];
                } else {
                    rooms[room].currentPhase = 'waiting';
                    io.to(room).emit('player left', leavingPlayer);
                    io.to(room).emit('player names updated', rooms[room].playerNames);
                }
                break;
            } else if (rooms[room].viewers && rooms[room].viewers[socket.id]) {
                delete rooms[room].viewers[socket.id];
                if (rooms[room].playerCount === 0 && Object.keys(rooms[room].viewers).length === 0) {
                    delete rooms[room];
                }
                break;
            }
        }
    });
});

function startTopicSelectionPhase(room) {
    console.log(`Starting topic selection phase for room ${room}`); // Debug log
    const roomData = rooms[room];
    roomData.currentPhase = 'topic_selection';
    roomData.selectedTopics = [];
    
    // Initialize game state if needed
    if (!roomData.gameState.player1Turn && !roomData.gameState.player2Turn) {
        roomData.gameState.player1Turn = true;
        roomData.topicSelector = 2;
        roomData.statementCreator = 1;
        console.log(`Initialized: Player ${roomData.topicSelector} selecting for Player ${roomData.statementCreator}`); // Debug log
    }
    
    // Find socket IDs for each player
    const selectorSocketId = Object.keys(roomData.players).find(
        id => roomData.players[id].player === roomData.topicSelector
    );
    const creatorSocketId = Object.keys(roomData.players).find(
        id => roomData.players[id].player === roomData.statementCreator
    );
    
    console.log(`Selector: ${selectorSocketId} (Player ${roomData.topicSelector}), Creator: ${creatorSocketId} (Player ${roomData.statementCreator})`); // Debug log
    
    if (selectorSocketId && creatorSocketId) {
        // Tell topic selector to select topics
        io.to(selectorSocketId).emit('start topic selection', roomData.statementCreator, roomData.currentRound);
        // Tell statement creator to wait
        io.to(creatorSocketId).emit('status update', `Player ${roomData.topicSelector} is selecting a topic for you...`);
        console.log(`Sent topic selection start to Player ${roomData.topicSelector}`); // Debug log
    }

    // Inform viewers
    const viewers = roomData.viewers || {};
    Object.keys(viewers).forEach(id => {
        io.to(id).emit('viewer start topic selection', {
            selector: roomData.topicSelector,
            creator: roomData.statementCreator,
            round: roomData.currentRound
        });
    });
}

function startStatementCreationPhase(room) {
    console.log(`Starting statement creation phase for room ${room}`); // Debug log
    const roomData = rooms[room];

    roomData.currentTyping = ['', '', ''];
    
    // Find socket IDs
    const selectorSocketId = Object.keys(roomData.players).find(
        id => roomData.players[id].player === roomData.topicSelector
    );
    const creatorSocketId = Object.keys(roomData.players).find(
        id => roomData.players[id].player === roomData.statementCreator
    );
    
    // Pick a random topic from selected topics
    const selectedTopicKey = roomData.selectedTopics[Math.floor(Math.random() * roomData.selectedTopics.length)];
    roomData.currentTopic = selectedTopicKey;
    console.log(`Selected topic: ${selectedTopicKey} from ${roomData.selectedTopics.length} options`); // Debug log
    
    if (selectorSocketId && creatorSocketId) {
        // Tell statement creator to create statements - send both key and topic data
        io.to(creatorSocketId).emit('start statement creation', selectedTopicKey, roomData.currentRound);
        // Tell topic selector to wait
        io.to(selectorSocketId).emit('status update', `Player ${roomData.statementCreator} is creating statements...`);
        console.log(`Sent statement creation start to Player ${roomData.statementCreator} with topic ${selectedTopicKey}`); // Debug log
    }

    // Inform viewers
    const viewers = roomData.viewers || {};
    Object.keys(viewers).forEach(id => {
        io.to(id).emit('viewer start statement creation', {
            creator: roomData.statementCreator,
            topic: selectedTopicKey,
            round: roomData.currentRound
        });
    });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🎮 Two Truths and a Lie server listening on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});
