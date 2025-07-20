const socket = io();

const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const roomNameInput = document.getElementById('room-name');
const joinRoomBtn = document.getElementById('join-room');

const playerNumberDisplay = document.getElementById('player-number');
const scoreDisplay = document.getElementById('score-display');
const roundTitle = document.getElementById('round-title');
const inputArea = document.getElementById('input-area');
const inputPrompt = document.getElementById('input-prompt');
const statement1Input = document.getElementById('statement1');
const statement2Input = document.getElementById('statement2');
const statement3Input = document.getElementById('statement3');
const submitStatementsBtn = document.getElementById('submit-statements');

const guessArea = document.getElementById('guess-area');
const guessPrompt = document.getElementById('guess-prompt');
const statementBtn1 = document.getElementById('statement-btn-1');
const statementBtn2 = document.getElementById('statement-btn-2');
const statementBtn3 = document.getElementById('statement-btn-3');

const resultMessage = document.getElementById('result-message');
const nextRoundBtn = document.getElementById('next-round');

const finalScore = document.getElementById('final-score');
const winner = document.getElementById('winner');
const playAgainBtn = document.getElementById('play-again');
const exitGameBtn = document.getElementById('exit-game');
const exitFinalBtn = document.getElementById('exit-final');

let roomName;
let playerNumber;
let currentPlayer, guessingPlayer;
let round = 1;
let scores = { 1: 0, 2: 0 };
const totalRounds = 5;
let statements = [];
let truthIndex;
let selectedTruthIndex = -1;

// Add event listeners for radio buttons
document.addEventListener('change', (e) => {
    if (e.target.name === 'truth-selection') {
        selectedTruthIndex = parseInt(e.target.value);
        
        // Remove selection from all input groups
        document.querySelectorAll('.statement-input-group').forEach(group => {
            group.classList.remove('lie-selected');
        });
        
        // Add selection to the corresponding input group
        e.target.closest('.statement-input-group').classList.add('lie-selected');
    }
});

socket.on('connect', () => {
    console.log('Socket connected');
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

joinRoomBtn.addEventListener('click', () => {
    roomName = roomNameInput.value.trim();
    if (roomName && roomName.length >= 3) {
        socket.emit('create or join', roomName);
        joinRoomBtn.disabled = true;
        joinRoomBtn.textContent = 'Joining...';
    } else {
        alert('Please enter a room name with at least 3 characters.');
    }
});

socket.on('room created', (room, player) => {
    roomName = room;
    playerNumber = player;
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerNumberDisplay.textContent = `You are Player ${playerNumber}`;
    inputPrompt.textContent = 'Waiting for Player 2 to join...';
    resultMessage.textContent = `Room "${room}" created. Share this room name with another player.`;
    resultMessage.style.color = '#007bff';
});

socket.on('room joined', (room, player) => {
    roomName = room;
    playerNumber = player;
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerNumberDisplay.textContent = `You are Player ${playerNumber}`;
    inputPrompt.textContent = 'Game starting...';
});

socket.on('room full', () => {
    alert('This room is full. Please try a different room name.');
    joinRoomBtn.disabled = false;
    joinRoomBtn.textContent = 'Join Room';
});

socket.on('start game', (players) => {
    currentPlayer = 1;
    guessingPlayer = 2;
    startRound();
});

submitStatementsBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    console.log('Submit button clicked'); // Debug log
    
    statements = [statement1Input.value, statement2Input.value, statement3Input.value];
    console.log('Statements:', statements); // Debug log
    
    // Check if all statements are filled
    if (statements.some(s => !s.trim())) {
        alert("Please fill in all three statements.");
        return;
    }
    
    // Check if a truth has been selected via radio button
    const selectedRadio = document.querySelector('input[name="truth-selection"]:checked');
    console.log('Selected radio:', selectedRadio); // Debug log
    
    if (!selectedRadio) {
        alert("Please select which statement is the TRUTH by clicking a radio button.");
        return;
    }
    
    selectedTruthIndex = parseInt(selectedRadio.value);
    console.log('Selected truth index:', selectedTruthIndex); // Debug log
    console.log('Room name:', roomName); // Debug log
    
    if (!roomName) {
        alert("Room name not set. Please refresh and try again.");
        return;
    }
    
    socket.emit('submit statements', roomName, statements, selectedTruthIndex);
    inputArea.classList.add('hidden');
    inputPrompt.textContent = `Waiting for Player ${guessingPlayer} to make a guess...`;
});

socket.on('statements submitted', (submittedStatements, submittedTruthIndex) => {
    statements = submittedStatements;
    truthIndex = submittedTruthIndex;
    guessArea.classList.remove('hidden');
    guessPrompt.textContent = 'Which one is the TRUTH?';
    statementBtn1.textContent = statements[0];
    statementBtn2.textContent = statements[1];
    statementBtn3.textContent = statements[2];
    
    // Show all three buttons
    document.getElementById('statement-btn-3').style.display = 'block';
});

[statementBtn1, statementBtn2, statementBtn3].forEach((btn, index) => {
    btn.addEventListener('click', () => {
        socket.emit('guess made', roomName, index);
    });
});

socket.on('guess result', (guessIndex, correctIndex, isCorrect) => {
    if (isCorrect) {
        resultMessage.textContent = 'Correct! You found the truth!';
        resultMessage.style.color = '#28a745';
        scores[guessingPlayer]++;
    } else {
        resultMessage.textContent = `Wrong! The truth was: "${statements[correctIndex]}"`;
        resultMessage.style.color = '#dc3545';
    }
    updateScores();
    nextRoundBtn.classList.remove('hidden');
    guessArea.classList.add('hidden');
});

nextRoundBtn.addEventListener('click', () => {
    socket.emit('next round', roomName);
});

socket.on('new round', () => {
    round++;
    if (round > totalRounds * 2) {
        endGame();
    } else {
        switchPlayers();
        startRound();
    }
});

playAgainBtn.addEventListener('click', () => {
    // For simplicity, we'll just reload the page to start a new game.
    location.reload();
});

// Exit button functionality
exitGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit the game?')) {
        socket.disconnect();
        location.reload();
    }
});

exitFinalBtn.addEventListener('click', () => {
    socket.disconnect();
    location.reload();
});

function startRound() {
    roundTitle.textContent = `Round ${Math.ceil(round / 2)}`;
    updateScores();
    resultMessage.textContent = '';
    nextRoundBtn.classList.add('hidden');
    guessArea.classList.add('hidden');

    if (playerNumber === currentPlayer) {
        inputArea.classList.remove('hidden');
        inputPrompt.textContent = 'Enter 3 statements about yourself. Select the radio button for the ONE that is TRUE.';
        statement1Input.value = '';
        statement2Input.value = '';
        statement3Input.value = '';
        
        // Reset truth selection
        selectedTruthIndex = -1;
        document.querySelectorAll('input[name="truth-selection"]').forEach(radio => {
            radio.checked = false;
        });
        document.querySelectorAll('.statement-input-group').forEach(group => {
            group.classList.remove('lie-selected');
        });
    } else {
        inputArea.classList.add('hidden');
        inputPrompt.textContent = `Waiting for Player ${currentPlayer} to enter statements...`;
    }
}

function switchPlayers() {
    [currentPlayer, guessingPlayer] = [guessingPlayer, currentPlayer];
}

function endGame() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScore.textContent = `Player 1: ${scores[1]} - Player 2: ${scores[2]}`;
    if (scores[1] > scores[2]) {
        winner.textContent = 'Player 1 wins!';
    } else if (scores[2] > scores[1]) {
        winner.textContent = 'Player 2 wins!';
    } else {
        winner.textContent = "It's a tie!";
    }
}

function updateScores() {
    scoreDisplay.textContent = `Scores: Player 1: ${scores[1]} - Player 2: ${scores[2]}`;
}

