const socket = io();

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const roomNameInput = document.getElementById('room-name');
const joinRoomBtn = document.getElementById('join-room');
const roundCountSelect = document.getElementById('round-count');

const playerNumberDisplay = document.getElementById('player-number');
const scoreDisplay = document.getElementById('score-display');
const gameStatusDisplay = document.getElementById('game-status');
const roundTitle = document.getElementById('round-title');

// Topic selection elements
const topicSelectionArea = document.getElementById('topic-selection-area');
const topicPrompt = document.getElementById('topic-prompt');
const topicGrid = document.getElementById('topic-grid');
const selectedTopicsList = document.getElementById('selected-topic-list');
const confirmTopicsBtn = document.getElementById('confirm-topics');

// Modal elements
const topicModal = document.getElementById('topic-modal');
const modalTopicTitle = document.getElementById('modal-topic-title');
const suggestionList = document.getElementById('suggestion-list');
const closeModal = document.querySelector('.close');

// Statement creation elements
const inputArea = document.getElementById('input-area');
const inputPrompt = document.getElementById('input-prompt');
const currentTopicDiv = document.getElementById('current-topic');
const topicDisplay = document.getElementById('topic-display');
const statement1Input = document.getElementById('statement1');
const statement2Input = document.getElementById('statement2');
const statement3Input = document.getElementById('statement3');
const submitStatementsBtn = document.getElementById('submit-statements');

// Guessing elements
const guessArea = document.getElementById('guess-area');
const guessPrompt = document.getElementById('guess-prompt');
const opponentTopicDiv = document.getElementById('opponent-topic');
const opponentTopicDisplay = document.getElementById('opponent-topic-display');
const statementBtn1 = document.getElementById('statement-btn-1');
const statementBtn2 = document.getElementById('statement-btn-2');
const statementBtn3 = document.getElementById('statement-btn-3');

// Other elements
const resultMessage = document.getElementById('result-message');
const nextRoundBtn = document.getElementById('next-round');
const exitGameBtn = document.getElementById('exit-game');

// Language elements
const langEnBtn = document.getElementById('lang-en');
const langViBtn = document.getElementById('lang-vi');

// Game state
let roomName;
let playerNumber;
let totalRounds = 5;
let currentRound = 1;
let scores = { 1: 0, 2: 0 };
let selectedTopics = [];
let currentTopic;
let statements = [];
let truthIndex;
let selectedTruthIndex = -1;
let currentLanguage = 'en';

// Topics data with suggestions
const topics = {
    // Safe topics
    childhood: {
        title: 'Childhood Memories',
        description: 'Share stories from when you were young',
        suggestions: [
            'I broke my arm falling off a bicycle when I was 8',
            'I had an imaginary friend named Charlie who lived in my closet',
            'I won first place in a school talent show singing contest',
            'My family moved 5 times before I turned 10',
            'I was afraid of the dark until I was 12 years old'
        ],
        isAdult: false
    },
    school: {
        title: 'School Days',
        description: 'Tell us about your educational experiences',
        suggestions: [
            'I was class president in high school',
            'I failed my first driving test three times',
            'I skipped prom to study for final exams',
            'I was suspended once for pulling a harmless prank',
            'I had a crush on my math teacher in 9th grade'
        ],
        isAdult: false
    },
    travel: {
        title: 'Travel Adventures',
        description: 'Share your travel experiences or dream destinations',
        suggestions: [
            'I\'ve been to all 7 continents',
            'I got lost in Tokyo for 6 hours without speaking Japanese',
            'I went skydiving in New Zealand',
            'I\'ve never left my home country',
            'I lived in a hostel for 3 months while backpacking'
        ],
        isAdult: false
    },
    food: {
        title: 'Food & Cooking',
        description: 'Tell us about your culinary experiences',
        suggestions: [
            'I once ate insects at a restaurant in Thailand',
            'I\'m allergic to chocolate and cry about it regularly',
            'I can cook a perfect 5-course meal from memory',
            'I\'ve never eaten sushi in my entire life',
            'I worked as a chef in a restaurant for 2 years'
        ],
        isAdult: false
    },
    pets: {
        title: 'Pets & Animals',
        description: 'Share stories about animals in your life',
        suggestions: [
            'I had a pet snake that escaped and lived in our walls for months',
            'I\'m secretly terrified of butterflies',
            'I trained my dog to fetch me snacks from the kitchen',
            'I\'ve rescued over 20 stray cats in my lifetime',
            'I was once chased by an angry goose at the park'
        ],
        isAdult: false
    },
    hobbies: {
        title: 'Hobbies & Interests',
        description: 'Talk about what you do in your free time',
        suggestions: [
            'I can solve a Rubik\'s cube in under 30 seconds',
            'I collect vintage postcards from the 1920s',
            'I\'ve never watched a single Star Wars movie',
            'I can play 4 different musical instruments',
            'I knit scarves for homeless shelters every winter'
        ],
        isAdult: false
    },
    work: {
        title: 'Work & Career',
        description: 'Share experiences from your professional life',
        suggestions: [
            'I once gave a presentation to 500 people in my underwear (in a dream)',
            'I got my current job because I helped my future boss in an elevator',
            'I\'ve been fired from 3 different jobs',
            'I worked as a professional birthday party clown for kids',
            'I make more money from a side hobby than my main job'
        ],
        isAdult: false
    },
    fears: {
        title: 'Fears & Phobias',
        description: 'What makes you scared or nervous?',
        suggestions: [
            'I\'m afraid of butterflies and run away when I see them',
            'I check under my bed every night before sleeping',
            'I can\'t sleep without a nightlight on',
            'I\'ve never been on a roller coaster because of my fear of heights',
            'I hyperventilate in elevators and take stairs to the 10th floor'
        ],
        isAdult: false
    },
    talents: {
        title: 'Hidden Talents',
        description: 'What secret skills do you have?',
        suggestions: [
            'I can juggle 5 balls at once',
            'I speak 6 different languages fluently',
            'I can touch my nose with my tongue',
            'I have perfect pitch and can identify any musical note',
            'I can solve complex math problems in my head instantly'
        ],
        isAdult: false
    },
    embarrassing: {
        title: 'Embarrassing Moments',
        description: 'Share those cringe-worthy experiences',
        suggestions: [
            'I once walked around all day with toilet paper stuck to my shoe',
            'I called my teacher "mom" in front of the whole class',
            'I waved back at someone who was waving at the person behind me',
            'I fell asleep during my own wedding ceremony',
            'I accidentally sent a love text to my boss instead of my partner'
        ],
        isAdult: false
    },
    family: {
        title: 'Family Stories',
        description: 'Tell us about your family members',
        suggestions: [
            'My grandmother was a professional dancer in the 1940s',
            'I have a twin brother who lives in another country',
            'My family owns a farm with over 100 animals',
            'I was adopted and found out when I was 18',
            'My uncle is a famous actor but uses a stage name'
        ],
        isAdult: false
    },
    // Adult topics (18+)
    dating: {
        title: 'Dating & Relationships',
        description: 'Share your romantic experiences (18+)',
        suggestions: [
            'I\'ve been on over 100 first dates in the past year',
            'I met my current partner in a police station',
            'I\'ve never been in a relationship longer than 3 months',
            'I once dated two people with the same name at the same time',
            'I broke up with someone via text message on their birthday'
        ],
        isAdult: true
    },
    party: {
        title: 'Party & Nightlife',
        description: 'Tell us about your wildest nights (18+)',
        suggestions: [
            'I once danced on a table at a wedding and broke it',
            'I\'ve never been drunk in my entire life',
            'I woke up in a different city with no memory of how I got there',
            'I was kicked out of a karaoke bar for singing too loudly',
            'I once partied with a famous celebrity and have photos to prove it'
        ],
        isAdult: true
    },
    secrets: {
        title: 'Deep Dark Secrets',
        description: 'Share something nobody knows about you (18+)',
        suggestions: [
            'I have a tattoo in a place nobody will ever see',
            'I once shoplifted as a teenager and still feel guilty',
            'I secretly read romance novels and have over 200 of them',
            'I\'ve never told my family about my real career',
            'I have a fake ID that I still carry even though I\'m over 30'
        ],
        isAdult: true
    },
    adult_embarrassing: {
        title: 'Adult Embarrassing Moments',
        description: 'Your most mortifying adult experiences (18+)',
        suggestions: [
            'I accidentally sent intimate photos to my entire work group chat',
            'I got caught making out in a public place by security',
            'I threw up on someone during a first date',
            'I fell asleep during an intimate moment',
            'I accidentally walked into the wrong apartment and into someone\'s bedroom'
        ],
        isAdult: true
    },
    wild_experiences: {
        title: 'Wild Life Experiences',
        description: 'Your craziest adult adventures (18+)',
        suggestions: [
            'I went skinny dipping in a public fountain at midnight',
            'I joined the mile high club on a 12-hour flight',
            'I got married to someone I met 24 hours earlier in Vegas',
            'I\'ve never done anything remotely wild or adventurous in my life',
            'I once streaked across a football field during a game'
        ],
        isAdult: true
    },
    adult_confessions: {
        title: 'Personal Confessions',
        description: 'Things you\'ve never admitted to anyone (18+)',
        suggestions: [
            'I\'ve faked being sick to avoid social events over 50 times',
            'I stalked my ex on social media for 2 years after we broke up',
            'I\'ve lied about my age on dating apps by 5 years',
            'I once pretended to be someone else online for 6 months',
            'I\'ve never actually enjoyed physical intimacy but pretend I do'
        ],
        isAdult: true
    },
    money_secrets: {
        title: 'Money & Secrets',
        description: 'Financial confessions and money stories (18+)',
        suggestions: [
            'I have a secret bank account my partner doesn\'t know about',
            'I once spent $5000 on a single shopping spree and hid it',
            'I\'ve never filed my taxes correctly and I\'m terrified of getting caught',
            'I make money from an embarrassing side hustle',
            'I\'m secretly in debt up to my eyeballs but nobody knows'
        ],
        isAdult: true
    },
    guilty_pleasures: {
        title: 'Guilty Pleasures',
        description: 'Your secret indulgences (18+)',
        suggestions: [
            'I watch reality TV shows and know all the drama by heart',
            'I collect something really weird that I\'m embarrassed about',
            'I have an addiction to a mobile game and spend money on it',
            'I eat ice cream for breakfast more often than actual breakfast food',
            'I pretend to be sophisticated but love the trashiest entertainment'
        ],
        isAdult: true
    }
};

// Language translations (extended)
const translations = {
    en: {
        // ... (keep existing translations and add new ones)
        mainTitle: 'Two Truths and a Lie',
        settingsTitle: 'Game Settings:',
        roundsLabel: 'Number of Rounds:',
        topicSelectionPrompt: 'Select 3-5 topics for Player {player} to create statements about:',
        selectedTopicsTitle: 'Selected Topics:',
        confirmTopics: 'Confirm Topic Selection',
        currentTopic: 'Your Topic:',
        suggestedAnswers: 'Suggested answers:',
        selectingTopics: 'Player {player} is selecting topics for you...',
        creatingStatements: 'Player {player} is creating statements...',
        waitingGuess: 'Player {player} is making their guess...',
        adultContent: '18+'
    },
    vi: {
        // ... (keep existing translations and add new ones)
        mainTitle: 'Hai Sự Thật Một Lời Dối',
        settingsTitle: 'Cài Đặt Game:',
        roundsLabel: 'Số Vòng Chơi:',
        topicSelectionPrompt: 'Chọn 3-5 chủ đề cho Người chơi {player} tạo câu nói:',
        selectedTopicsTitle: 'Chủ Đề Đã Chọn:',
        confirmTopics: 'Xác Nhận Chọn Chủ Đề',
        currentTopic: 'Chủ Đề Của Bạn:',
        suggestedAnswers: 'Gợi ý trả lời:',
        selectingTopics: 'Người chơi {player} đang chọn chủ đề cho bạn...',
        creatingStatements: 'Người chơi {player} đang tạo câu nói...',
        waitingGuess: 'Người chơi {player} đang đoán...',
        adultContent: '18+'
    }
};

// Initialize
updateLanguageContent();

// Language switching
langEnBtn.addEventListener('click', () => switchLanguage('en'));
langViBtn.addEventListener('click', () => switchLanguage('vi'));

function switchLanguage(lang) {
    currentLanguage = lang;
    langEnBtn.classList.toggle('active', lang === 'en');
    langViBtn.classList.toggle('active', lang === 'vi');
    updateLanguageContent();
}

function updateLanguageContent() {
    const t = translations[currentLanguage];
    // Update all translatable elements
    // (Implementation similar to original but extended)
}

// Event listeners
joinRoomBtn.addEventListener('click', () => {
    roomName = roomNameInput.value.trim();
    totalRounds = parseInt(roundCountSelect.value);
    
    if (roomName && roomName.length >= 3) {
        socket.emit('create or join', roomName, totalRounds);
        joinRoomBtn.disabled = true;
        joinRoomBtn.textContent = 'Joining...';
    } else {
        alert('Please enter a room name with at least 3 characters.');
    }
});

// Topic selection functionality
function createTopicGrid() {
    topicGrid.innerHTML = '';
    
    Object.keys(topics).forEach(topicKey => {
        const topic = topics[topicKey];
        const topicCard = document.createElement('div');
        topicCard.className = `topic-card ${topic.isAdult ? 'adult' : ''}`;
        topicCard.dataset.topic = topicKey;
        
        topicCard.innerHTML = `
            <h4>${topic.title}</h4>
            <p>${topic.description}</p>
        `;
        
        topicCard.addEventListener('click', () => {
            showTopicModal(topicKey, topic);
        });
        
        topicGrid.appendChild(topicCard);
    });
}

function showTopicModal(topicKey, topic) {
    modalTopicTitle.textContent = topic.title;
    
    suggestionList.innerHTML = '';
    topic.suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionList.appendChild(li);
    });
    
    topicModal.classList.remove('hidden');
    
    // Add select button to modal if not already selected
    if (!selectedTopics.includes(topicKey)) {
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Select This Topic';
        selectBtn.className = 'select-topic-btn';
        selectBtn.onclick = () => selectTopic(topicKey);
        document.querySelector('.modal-content').appendChild(selectBtn);
    }
}

function selectTopic(topicKey) {
    if (selectedTopics.includes(topicKey)) return;
    if (selectedTopics.length >= 5) {
        alert('You can select maximum 5 topics.');
        return;
    }
    
    selectedTopics.push(topicKey);
    updateSelectedTopicsList();
    updateTopicCards();
    closeTopicModal();
    
    if (selectedTopics.length >= 3) {
        confirmTopicsBtn.classList.remove('hidden');
    }
}

function updateSelectedTopicsList() {
    selectedTopicsList.innerHTML = '';
    
    selectedTopics.forEach(topicKey => {
        const topic = topics[topicKey];
        const item = document.createElement('div');
        item.className = 'selected-topic-item';
        item.innerHTML = `
            <span>${topic.title}</span>
            <button class="remove-topic" onclick="removeTopic('${topicKey}')">Remove</button>
        `;
        selectedTopicsList.appendChild(item);
    });
}

function removeTopic(topicKey) {
    selectedTopics = selectedTopics.filter(t => t !== topicKey);
    updateSelectedTopicsList();
    updateTopicCards();
    
    if (selectedTopics.length < 3) {
        confirmTopicsBtn.classList.add('hidden');
    }
}

function updateTopicCards() {
    document.querySelectorAll('.topic-card').forEach(card => {
        const topicKey = card.dataset.topic;
        card.classList.toggle('selected', selectedTopics.includes(topicKey));
    });
}

function closeTopicModal() {
    topicModal.classList.add('hidden');
    // Remove any select buttons
    document.querySelectorAll('.select-topic-btn').forEach(btn => btn.remove());
}

// Modal close events
closeModal.addEventListener('click', closeTopicModal);
window.addEventListener('click', (e) => {
    if (e.target === topicModal) {
        closeTopicModal();
    }
});

// Confirm topics selection
confirmTopicsBtn.addEventListener('click', () => {
    if (selectedTopics.length >= 3) {
        socket.emit('topics selected', roomName, selectedTopics);
        topicSelectionArea.classList.add('hidden');
    }
});

// Statement submission
submitStatementsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    statements = [statement1Input.value, statement2Input.value, statement3Input.value];
    
    if (statements.some(s => !s.trim())) {
        alert("Please fill in all three statements.");
        return;
    }
    
    const selectedRadio = document.querySelector('input[name="truth-selection"]:checked');
    if (!selectedRadio) {
        alert("Please select which statement is the TRUTH by clicking a radio button.");
        return;
    }
    
    selectedTruthIndex = parseInt(selectedRadio.value);
    
    socket.emit('submit statements', roomName, statements, selectedTruthIndex, currentTopic);
    inputArea.classList.add('hidden');
});

// Guess buttons
[statementBtn1, statementBtn2, statementBtn3].forEach((btn, index) => {
    btn.addEventListener('click', () => {
        socket.emit('guess made', roomName, index);
    });
});

// Next round
nextRoundBtn.addEventListener('click', () => {
    socket.emit('next round', roomName);
    nextRoundBtn.classList.add('hidden');
});

// Socket event handlers
socket.on('room created', (room, player, rounds) => {
    roomName = room;
    playerNumber = player;
    totalRounds = rounds;
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerNumberDisplay.textContent = `You are Player ${playerNumber}`;
    gameStatusDisplay.textContent = 'Waiting for Player 2 to join...';
});

socket.on('room joined', (room, player, rounds) => {
    roomName = room;
    playerNumber = player;
    totalRounds = rounds;
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerNumberDisplay.textContent = `You are Player ${playerNumber}`;
});

socket.on('start topic selection', (targetPlayer, round) => {
    currentRound = round;
    roundTitle.textContent = `Round ${round}`;
    
    // Show topic selection
    topicSelectionArea.classList.remove('hidden');
    topicPrompt.textContent = `Select 3-5 topics for Player ${targetPlayer} to create statements about:`;
    
    selectedTopics = [];
    createTopicGrid();
    updateSelectedTopicsList();
    confirmTopicsBtn.classList.add('hidden');
    
    // Hide other areas
    inputArea.classList.add('hidden');
    guessArea.classList.add('hidden');
    currentTopicDiv.classList.add('hidden');
    opponentTopicDiv.classList.add('hidden');
});

socket.on('start statement creation', (topic, round) => {
    currentRound = round;
    roundTitle.textContent = `Round ${round}`;
    currentTopic = topics[topic];
    
    // Show statement creation
    inputArea.classList.remove('hidden');
    currentTopicDiv.classList.remove('hidden');
    topicDisplay.textContent = currentTopic.title;
    
    inputPrompt.textContent = 'Create 3 statements about this topic. Mark which one is TRUE.';
    
    // Clear previous inputs
    statement1Input.value = '';
    statement2Input.value = '';
    statement3Input.value = '';
    document.querySelectorAll('input[name="truth-selection"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Hide other areas
    topicSelectionArea.classList.add('hidden');
    guessArea.classList.add('hidden');
    opponentTopicDiv.classList.add('hidden');
});

socket.on('statements submitted', (submittedStatements, topic) => {
    statements = submittedStatements;
    currentTopic = topics[topic];
    
    // Show guessing area
    guessArea.classList.remove('hidden');
    opponentTopicDiv.classList.remove('hidden');
    opponentTopicDisplay.textContent = currentTopic.title;
    
    guessPrompt.textContent = 'Which one is the TRUTH?';
    statementBtn1.textContent = statements[0];
    statementBtn2.textContent = statements[1];
    statementBtn3.textContent = statements[2];
    
    // Hide other areas
    topicSelectionArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    currentTopicDiv.classList.add('hidden');
});

socket.on('guess result', (guessIndex, correctIndex, isCorrect, newScores) => {
    scores = newScores;
    updateScores();
    
    if (isCorrect) {
        resultMessage.textContent = 'Correct! You found the truth!';
        resultMessage.style.color = '#28a745';
    } else {
        resultMessage.textContent = `Wrong! The truth was: "${statements[correctIndex]}"`;
        resultMessage.style.color = '#dc3545';
    }
    
    nextRoundBtn.classList.remove('hidden');
    guessArea.classList.add('hidden');
    opponentTopicDiv.classList.add('hidden');
});

socket.on('game over', (finalScores) => {
    scores = finalScores;
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    const finalScore = document.getElementById('final-score');
    const winner = document.getElementById('winner');
    
    finalScore.textContent = `Player 1: ${scores[1]} - Player 2: ${scores[2]}`;
    
    if (scores[1] > scores[2]) {
        winner.textContent = 'Player 1 wins!';
    } else if (scores[2] > scores[1]) {
        winner.textContent = 'Player 2 wins!';
    } else {
        winner.textContent = "It's a tie!";
    }
});

socket.on('status update', (status) => {
    gameStatusDisplay.textContent = status;
});

// Utility functions
function updateScores() {
    scoreDisplay.textContent = `Scores: Player 1: ${scores[1]} - Player 2: ${scores[2]}`;
}

// Exit game functionality
exitGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit the game?')) {
        location.reload();
    }
});

// Radio button selection handling
document.addEventListener('change', (e) => {
    if (e.target.name === 'truth-selection') {
        selectedTruthIndex = parseInt(e.target.value);
        
        document.querySelectorAll('.statement-input-group').forEach(group => {
            group.classList.remove('lie-selected');
        });
        
        e.target.closest('.statement-input-group').classList.add('lie-selected');
    }
});
