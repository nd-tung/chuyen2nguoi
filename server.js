const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

let rooms = {};

// Random elements for story building
const storyRandomElements = [
    'a talking cat',
    'a mysterious door',
    'your biggest fear',
    'something that sparkles',
    'an unexpected phone call',
    'a childhood memory',
    'a rainy day',
    'something you lost',
    'a strange noise',
    'an old friend',
    'a secret passage',
    'something blue',
    'a forgotten dream',
    'an unusual smell',
    'a piece of advice',
    'something from yesterday',
    'a mirror',
    'something that flies',
    'a warm feeling',
    'an unopened letter'
];

// Would You Rather Questions Database (Server-side)
const wouldYouRatherQuestions = {
    easy: [
        {
            question: "Would you rather have the ability to fly or be invisible?",
            optionA: "Have the ability to fly",
            optionB: "Be invisible",
            category: "Superpowers"
        },
        {
            question: "Would you rather always be 10 minutes late or always be 20 minutes early?",
            optionA: "Always be 10 minutes late",
            optionB: "Always be 20 minutes early",
            category: "Time Management"
        },
        {
            question: "Would you rather have unlimited money or unlimited time?",
            optionA: "Unlimited money",
            optionB: "Unlimited time",
            category: "Life Choices"
        },
        {
            question: "Would you rather live without music or live without movies?",
            optionA: "Live without music",
            optionB: "Live without movies",
            category: "Entertainment"
        },
        {
            question: "Would you rather be able to speak every language or play every instrument?",
            optionA: "Speak every language",
            optionB: "Play every instrument",
            category: "Skills"
        }
    ],
    moderate: [
        {
            question: "Would you rather know when you're going to die or how you're going to die?",
            optionA: "Know when you're going to die",
            optionB: "Know how you're going to die",
            category: "Life & Death"
        },
        {
            question: "Would you rather lose all your memories from birth to now or lose your ability to make new memories?",
            optionA: "Lose all past memories",
            optionB: "Lose ability to make new memories",
            category: "Memory"
        },
        {
            question: "Would you rather be feared by all or loved by all?",
            optionA: "Be feared by all",
            optionB: "Be loved by all",
            category: "Relationships"
        },
        {
            question: "Would you rather have the ability to change the past or see into the future?",
            optionA: "Change the past",
            optionB: "See into the future",
            category: "Time Powers"
        }
    ],
    extreme: [
        {
            question: "Would you rather sacrifice yourself to save 100 strangers or sacrifice 100 strangers to save yourself?",
            optionA: "Sacrifice yourself for 100 strangers",
            optionB: "Sacrifice 100 strangers for yourself",
            category: "Moral Dilemma"
        },
        {
            question: "Would you rather live in a world where you're the only human left or be trapped in a time loop of the worst day of your life?",
            optionA: "Only human left in the world",
            optionB: "Time loop of worst day",
            category: "Existential Horror"
        },
        {
            question: "Would you rather have to kill one innocent person to save your family or let your family die to save that innocent person?",
            optionA: "Kill innocent person, save family",
            optionB: "Let family die, save innocent person",
            category: "Family vs Morality"
        },
        {
            question: "Would you rather live forever but watch everyone you love die or die young but know everyone you love will live forever?",
            optionA: "Live forever, watch loved ones die",
            optionB: "Die young, loved ones live forever",
            category: "Immortality Dilemma"
        }
    ]
};

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
                playerNames: { 1: playerName, 2: 'Player 2' },
                disconnectedPlayers: {} // Track disconnected players for reconnection
            };
            socket.join(room);
            rooms[room].players[socket.id] = { player: 1, name: playerName };
            rooms[room].playerCount++;
            console.log(`User ${socket.id} created room ${room} as Player 1 (${playerName})`);
            socket.emit('room created', room, 1, roundCount, rooms[room].playerNames);
        } else {
            // Check if this is a reconnection attempt
            const reconnectionAttempt = checkForReconnection(room, playerName);
            
            if (reconnectionAttempt) {
                // Handle reconnection
                const { playerNumber, wasDisconnected } = reconnectionAttempt;
                console.log(`Player ${playerName} reconnecting to room ${room} as Player ${playerNumber}`);
                
                socket.join(room);
                rooms[room].players[socket.id] = { player: playerNumber, name: playerName };
                
                // Remove from disconnected players list
                delete rooms[room].disconnectedPlayers[playerNumber];
                
                // Restore player count if necessary
                if (wasDisconnected && rooms[room].playerCount < 2) {
                    rooms[room].playerCount++;
                }
                
                // Update player name
                rooms[room].playerNames[playerNumber] = playerName;
                
                // Emit reconnection event
                socket.emit('player reconnected', room, playerNumber, rooms[room].totalRounds, rooms[room].playerNames, {
                    phase: rooms[room].currentPhase,
                    round: rooms[room].currentRound,
                    scores: rooms[room].gameState.scores,
                    selectedTopics: rooms[room].selectedTopics,
                    currentTopic: rooms[room].currentTopic
                });
                
                // Notify other players about reconnection
                socket.to(room).emit('player reconnected notification', playerNumber, playerName);
                
                // Resume game state if appropriate
                resumeGameStateForReconnectedPlayer(room, socket.id, playerNumber);
                
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

    // Story Building Challenge handlers
    socket.on('start story building', (room) => {
        console.log(`Starting story building mode in room ${room}`);
        if (rooms[room]) {
            initializeStoryBuildingMode(room);
        }
    });

    socket.on('story contribution', (room, contribution, turn, playerNumber) => {
        console.log(`Story contribution in room ${room} from Player ${playerNumber}: ${contribution}`);
        if (rooms[room] && rooms[room].storyMode) {
            // Add contribution to story
            rooms[room].storyMode.contributions.push({
                turn: turn,
                player: playerNumber,
                text: contribution,
                timestamp: Date.now()
            });
            
            // Update story text
            rooms[room].storyMode.storyText += contribution + ' ';
            rooms[room].storyMode.currentTurn++;
            
            // Get next random element
            const nextElement = getRandomStoryElement();
            rooms[room].storyMode.currentRandomElement = nextElement;
            
            // Broadcast story update to all players in room
            io.in(room).emit('story updated', {
                contributions: rooms[room].storyMode.contributions,
                storyText: rooms[room].storyMode.storyText,
                currentTurn: rooms[room].storyMode.currentTurn,
                maxTurns: rooms[room].storyMode.maxTurns,
                currentPlayer: rooms[room].storyMode.currentTurn % 2 === 1 ? 1 : 2,
                randomElement: nextElement,
                isComplete: rooms[room].storyMode.currentTurn > rooms[room].storyMode.maxTurns
            });
            
            // Check if story is complete
            if (rooms[room].storyMode.currentTurn > rooms[room].storyMode.maxTurns) {
                completeStoryBuilding(room);
            }
        }
    });

    socket.on('get story state', (room) => {
        if (rooms[room] && rooms[room].storyMode) {
            socket.emit('story state', {
                contributions: rooms[room].storyMode.contributions,
                storyText: rooms[room].storyMode.storyText,
                currentTurn: rooms[room].storyMode.currentTurn,
                maxTurns: rooms[room].storyMode.maxTurns,
                currentPlayer: rooms[room].storyMode.currentTurn % 2 === 1 ? 1 : 2,
                randomElement: rooms[room].storyMode.currentRandomElement,
                isComplete: rooms[room].storyMode.currentTurn > rooms[room].storyMode.maxTurns
            });
        }
    });

    // Would You Rather: Extreme Edition handlers
    socket.on('start would you rather', (room) => {
        console.log(`Starting Would You Rather mode in room ${room}`);
        if (rooms[room]) {
            initializeWouldYouRatherMode(room);
        }
    });

    socket.on('wyr choice made', (room, playerNumber, choice) => {
        console.log(`WYR choice made in room ${room}: Player ${playerNumber} chose ${choice}`);
        if (rooms[room] && rooms[room].wyrMode) {
            // Store player choice
            rooms[room].wyrMode.playerChoices[playerNumber] = choice;
            
            // Broadcast choice made (without revealing what they chose)
            socket.to(room).emit('wyr player choice', playerNumber, choice);
            
            console.log(`Player ${playerNumber} choice stored:`, choice);
        }
    });

    socket.on('wyr explanation submitted', (room, playerNumber, explanation) => {
        console.log(`WYR explanation submitted in room ${room}: Player ${playerNumber}`);
        if (rooms[room] && rooms[room].wyrMode) {
            // Store player explanation
            rooms[room].wyrMode.playerExplanations[playerNumber] = explanation;
            
            // Broadcast explanation received
            socket.to(room).emit('wyr explanation received', playerNumber, explanation);
            
            // Check if all players have submitted explanations
            const totalPlayers = Object.keys(rooms[room].players).length;
            const submittedExplanations = Object.keys(rooms[room].wyrMode.playerExplanations).length;
            
            console.log(`Explanations: ${submittedExplanations}/${totalPlayers}`);
            
            if (submittedExplanations >= totalPlayers) {
                // All players have submitted, show results
                const results = {
                    choices: rooms[room].wyrMode.playerChoices,
                    explanations: rooms[room].wyrMode.playerExplanations,
                    question: rooms[room].wyrMode.currentQuestion
                };
                
                io.in(room).emit('wyr round complete', results);
                console.log(`Round ${rooms[room].wyrMode.currentRound} complete in room ${room}`);
            }
        }
    });

    socket.on('wyr next round', (room, round, question) => {
        console.log(`WYR next round in room ${room}: Round ${round}`);
        if (rooms[room] && rooms[room].wyrMode) {
            // Store previous round data in history
            if (rooms[room].wyrMode.currentQuestion) {
                rooms[room].wyrMode.roundHistory.push({
                    round: rooms[room].wyrMode.currentRound,
                    question: rooms[room].wyrMode.currentQuestion,
                    choices: { ...rooms[room].wyrMode.playerChoices },
                    explanations: { ...rooms[room].wyrMode.playerExplanations }
                });
            }
            
            // Reset for next round
            rooms[room].wyrMode.currentRound = round;
            rooms[room].wyrMode.currentQuestion = question;
            rooms[room].wyrMode.playerChoices = {};
            rooms[room].wyrMode.playerExplanations = {};
            
            // Check if game should end
            if (round > rooms[room].wyrMode.maxRounds) {
                completeWouldYouRatherGame(room);
                return;
            }
            
            // Broadcast new question to all players
            io.in(room).emit('wyr question', question, round);
            
            console.log(`Round ${round} started with question:`, question.question);
        }
    });

    socket.on('wyr end game', (room) => {
        console.log(`WYR end game requested in room ${room}`);
        if (rooms[room] && rooms[room].wyrMode) {
            // Store current round data in history if it exists
            if (rooms[room].wyrMode.currentQuestion) {
                rooms[room].wyrMode.roundHistory.push({
                    round: rooms[room].wyrMode.currentRound,
                    question: rooms[room].wyrMode.currentQuestion,
                    choices: { ...rooms[room].wyrMode.playerChoices },
                    explanations: { ...rooms[room].wyrMode.playerExplanations }
                });
            }
            
            completeWouldYouRatherGame(room);
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
        console.log('user disconnected:', socket.id);
        for (let room in rooms) {
            if (rooms[room].players[socket.id]) {
                const leavingPlayer = rooms[room].players[socket.id].player;
                const playerName = rooms[room].players[socket.id].name;
                
                console.log(`Player ${leavingPlayer} (${playerName}) disconnected from room ${room}`);
                
                // Store disconnected player info for potential reconnection
                if (!rooms[room].disconnectedPlayers) {
                    rooms[room].disconnectedPlayers = {};
                }
                
                rooms[room].disconnectedPlayers[leavingPlayer] = {
                    name: playerName,
                    disconnectedAt: Date.now(),
                    socketId: socket.id
                };
                
                // Remove from active players but keep room state
                delete rooms[room].players[socket.id];
                rooms[room].playerCount--;
                
                // Set a timeout to permanently remove the player if they don't reconnect
                const reconnectionTimeout = setTimeout(() => {
                    if (rooms[room] && rooms[room].disconnectedPlayers[leavingPlayer]) {
                        console.log(`Player ${leavingPlayer} reconnection timeout expired`);
                        delete rooms[room].disconnectedPlayers[leavingPlayer];
                        
                        // Reset player name to default
                        rooms[room].playerNames[leavingPlayer] = `Player ${leavingPlayer}`;
                        
                        // If no players left, clean up room
                        if (rooms[room].playerCount === 0 && Object.keys(rooms[room].viewers || {}).length === 0) {
                            delete rooms[room];
                        } else {
                            // Set phase to waiting and notify remaining players
                            rooms[room].currentPhase = 'waiting';
                            io.to(room).emit('player left permanently', leavingPlayer);
                            io.to(room).emit('player names updated', rooms[room].playerNames);
                        }
                    }
                }, 60000); // 60 seconds to reconnect
                
                // Store timeout reference
                rooms[room].disconnectedPlayers[leavingPlayer].timeout = reconnectionTimeout;
                
                // Immediately notify other players about temporary disconnection
                io.to(room).emit('player disconnected', leavingPlayer, playerName);
                
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

// Story Building Challenge helper functions
function initializeStoryBuildingMode(room) {
    console.log(`Initializing story building mode for room ${room}`);
    const roomData = rooms[room];
    
    // Initialize story mode state
    roomData.storyMode = {
        storyText: '',
        currentTurn: 1,
        maxTurns: 10,
        contributions: [],
        currentRandomElement: getRandomStoryElement(),
        startTime: Date.now(),
        isActive: true
    };
    
    roomData.currentPhase = 'story_building';
    
    // Notify all players that story building has started
    io.in(room).emit('story building started', {
        currentTurn: roomData.storyMode.currentTurn,
        maxTurns: roomData.storyMode.maxTurns,
        currentPlayer: 1, // Player 1 starts
        randomElement: roomData.storyMode.currentRandomElement,
        playerNames: roomData.playerNames
    });
    
    console.log(`Story building initialized for room ${room} with element: ${roomData.storyMode.currentRandomElement}`);
}

function getRandomStoryElement() {
    return storyRandomElements[Math.floor(Math.random() * storyRandomElements.length)];
}

function completeStoryBuilding(room) {
    console.log(`Completing story building for room ${room}`);
    const roomData = rooms[room];
    
    if (roomData.storyMode) {
        roomData.storyMode.isActive = false;
        roomData.storyMode.endTime = Date.now();
        
        // Calculate some basic stats
        const totalWords = roomData.storyMode.storyText.trim().split(/\s+/).length;
        const averageWordsPerTurn = Math.round(totalWords / roomData.storyMode.contributions.length);
        
        // Create story summary
        const storySummary = {
            finalStory: roomData.storyMode.storyText.trim(),
            contributions: roomData.storyMode.contributions,
            totalTurns: roomData.storyMode.contributions.length,
            totalWords: totalWords,
            averageWordsPerTurn: averageWordsPerTurn,
            duration: roomData.storyMode.endTime - roomData.storyMode.startTime,
            playerNames: roomData.playerNames
        };
        
        // Notify all players that story is complete
        io.in(room).emit('story building complete', storySummary);
        
        console.log(`Story building completed for room ${room}. Final story: ${roomData.storyMode.storyText.substring(0, 100)}...`);
    }
}

// Reconnection helper functions
function checkForReconnection(room, playerName) {
    if (!rooms[room] || !rooms[room].disconnectedPlayers) {
        return null;
    }
    
    // Check if this player name matches any disconnected player
    for (const [playerNumber, disconnectedInfo] of Object.entries(rooms[room].disconnectedPlayers)) {
        if (disconnectedInfo.name === playerName) {
            // Clear timeout if it exists
            if (disconnectedInfo.timeout) {
                clearTimeout(disconnectedInfo.timeout);
            }
            
            return {
                playerNumber: parseInt(playerNumber),
                wasDisconnected: true,
                disconnectedInfo
            };
        }
    }
    
    return null;
}

function resumeGameStateForReconnectedPlayer(room, socketId, playerNumber) {
    const roomData = rooms[room];
    if (!roomData) return;
    
    console.log(`Resuming game state for Player ${playerNumber} in room ${room}, phase: ${roomData.currentPhase}`);
    
    switch (roomData.currentPhase) {
        case 'topic_selection':
            if (roomData.topicSelector === playerNumber) {
                // This player should be selecting topics
                io.to(socketId).emit('start topic selection', roomData.statementCreator, roomData.currentRound);
            } else {
                // This player should be waiting
                io.to(socketId).emit('status update', `Player ${roomData.topicSelector} is selecting a topic for you...`);
            }
            break;
            
        case 'statement_creation':
            if (roomData.statementCreator === playerNumber) {
                // This player should be creating statements
                io.to(socketId).emit('start statement creation', roomData.currentTopic, roomData.currentRound);
            } else {
                // This player should be waiting
                io.to(socketId).emit('status update', `Player ${roomData.statementCreator} is creating statements...`);
            }
            break;
            
        case 'guessing':
            const guesserPlayer = Object.keys(roomData.players).find(
                id => roomData.players[id].player !== roomData.statementCreator
            );
            
            if (guesserPlayer && roomData.players[guesserPlayer].player === playerNumber) {
                // This player should be guessing
                io.to(socketId).emit('statements submitted', roomData.currentStatements, roomData.currentTopic);
            } else {
                // This player should be waiting for guess
                io.to(socketId).emit('status update', `Player ${roomData.players[guesserPlayer]?.player || 'other'} is making their guess...`);
            }
            break;
            
        case 'story_building':
            if (roomData.storyMode) {
                io.to(socketId).emit('story state', {
                    contributions: roomData.storyMode.contributions,
                    storyText: roomData.storyMode.storyText,
                    currentTurn: roomData.storyMode.currentTurn,
                    maxTurns: roomData.storyMode.maxTurns,
                    currentPlayer: roomData.storyMode.currentTurn % 2 === 1 ? 1 : 2,
                    randomElement: roomData.storyMode.currentRandomElement,
                    isComplete: roomData.storyMode.currentTurn > roomData.storyMode.maxTurns
                });
            }
            break;
            
        case 'would_you_rather':
            if (roomData.wyrMode) {
                io.to(socketId).emit('wyr question', roomData.wyrMode.currentQuestion, roomData.wyrMode.currentRound);
            }
            break;
            
        default:
            // Game is waiting or in unknown state
            io.to(socketId).emit('status update', 'Game is waiting for players...');
            break;
    }
}

// Would You Rather: Extreme Edition helper functions
function initializeWouldYouRatherMode(room) {
    console.log(`Initializing Would You Rather mode for room ${room}`);
    const roomData = rooms[room];
    
    // Initialize Would You Rather mode state
    roomData.wyrMode = {
        currentRound: 1,
        maxRounds: 5,
        currentQuestion: null,
        playerChoices: {},
        playerExplanations: {},
        startTime: Date.now(),
        isActive: true,
        roundHistory: []
    };
    
    roomData.currentPhase = 'would_you_rather';
    
    // Get first question (easy difficulty for round 1)
    const firstQuestion = getRandomWYRQuestion('easy');
    roomData.wyrMode.currentQuestion = firstQuestion;
    
    // Notify all players that Would You Rather has started
    io.in(room).emit('wyr game started', {
        round: roomData.wyrMode.currentRound,
        maxRounds: roomData.wyrMode.maxRounds,
        question: firstQuestion,
        playerNames: roomData.playerNames
    });
    
    console.log(`Would You Rather initialized for room ${room} with question: ${firstQuestion.question}`);
}

function getRandomWYRQuestion(difficulty = 'easy') {
    const questionSet = wouldYouRatherQuestions[difficulty] || wouldYouRatherQuestions.easy;
    return questionSet[Math.floor(Math.random() * questionSet.length)];
}

function completeWouldYouRatherGame(room) {
    console.log(`Completing Would You Rather game for room ${room}`);
    const roomData = rooms[room];
    
    if (roomData.wyrMode) {
        roomData.wyrMode.isActive = false;
        roomData.wyrMode.endTime = Date.now();
        
        // Calculate game statistics
        const totalRounds = roomData.wyrMode.roundHistory.length;
        const gameStats = {
            totalRounds: totalRounds,
            duration: roomData.wyrMode.endTime - roomData.wyrMode.startTime,
            playerNames: roomData.playerNames,
            roundHistory: roomData.wyrMode.roundHistory
        };
        
        // Notify all players that game is complete
        io.in(room).emit('wyr game complete', gameStats);
        
        console.log(`Would You Rather completed for room ${room} after ${totalRounds} rounds`);
    }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🎮 Two Truths and a Lie server listening on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});
