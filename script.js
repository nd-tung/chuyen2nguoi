const socket = io();

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const historyScreen = document.getElementById('history-screen');

const playerNameInput = document.getElementById('player-name');
const roomNameInput = document.getElementById('room-name');
const joinRoomBtn = document.getElementById('join-room');
const joinViewerBtn = document.getElementById('join-viewer');
const roundCountSelect = document.getElementById('round-count');

const playerNumberDisplay = document.getElementById('player-number');
const playerNameDisplay = document.getElementById('player-name-display');
const scoreDisplay = document.getElementById('score-display');
const gameStatusDisplay = document.getElementById('game-status');
const roundTitle = document.getElementById('round-title');

// Scoreboard elements
const player1Name = document.getElementById('player1-name');
const player1Points = document.getElementById('player1-points');
const player2Name = document.getElementById('player2-name');
const player2Points = document.getElementById('player2-points');
const player1Score = document.getElementById('player1-score');
const player2Score = document.getElementById('player2-score');

// Topic selection elements
const topicSelectionArea = document.getElementById('topic-selection-area');
const topicPrompt = document.getElementById('topic-prompt');
const topicGrid = document.getElementById('topic-grid');
const topicSuggestions = document.getElementById('topic-suggestions');
const currentTopicName = document.getElementById('current-topic-name');
const suggestionList = document.getElementById('suggestion-list');
const selectCurrentTopicBtn = document.getElementById('select-current-topic');
const selectedTopicsTitle = document.getElementById('selected-topics-title');
const suggestionsTitle = document.getElementById('suggestions-title');
const selectedTopicsList = document.getElementById('selected-topic-list');
const confirmTopicsBtn = document.getElementById('confirm-topics');

// Statement creation elements
const inputArea = document.getElementById('input-area');
const inputPrompt = document.getElementById('input-prompt');
const currentTopicDiv = document.getElementById('current-topic');
const topicDisplay = document.getElementById('topic-display');
const seeTopicBtn = document.getElementById('see-topic-btn');
const topicHelp = document.getElementById('topic-help');
const helpTopicName = document.getElementById('help-topic-name');
const helpSuggestionList = document.getElementById('help-suggestion-list');
const hideTopicHelpBtn = document.getElementById('hide-topic-help');
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
const viewHistoryBtn = document.getElementById('view-history-btn');
const historyList = document.getElementById('history-list');
const sessionDetail = document.getElementById('session-detail');
const detailList = document.getElementById('detail-list');
const backToHistoryBtn = document.getElementById('back-to-history');
const clearHistoryBtn = document.getElementById('clear-history');
const backToMenuBtn = document.getElementById('back-to-menu');

// Side Menu elements
const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const closeMenuBtn = document.getElementById('close-menu');
const menuOverlay = document.getElementById('menu-overlay');

// Language elements (now in side menu)
const langEnBtn = document.getElementById('lang-en');
const langViBtn = document.getElementById('lang-vi');
const themeToggleBtn = document.getElementById('theme-toggle');
const clearDataBtn = document.getElementById('clear-data');

// Game state
let roomName;
let playerNumber;
let playerName;
let playerNames = { 1: 'Player 1', 2: 'Player 2' };
let totalRounds = 5;
let currentRound = 1;
let scores = { 1: 0, 2: 0 };
let currentGameRounds = [];
let selectedTopics = [];
let currentTopic;
let currentTopicKey; // Store the topic key
let highlightedTopic = null; // Currently highlighted topic
let statements = [];
let truthIndex;
let selectedTruthIndex = -1;
let currentLanguage = 'en';
let isViewer = false;
let currentGameMode = 'two-truths'; // 'two-truths', 'story-building', or 'would-you-rather'

// Story Building state
let storyText = '';
let currentTurn = 1;
let maxTurns = 10;
let storyContributions = [];
let randomElements = [
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

// Would You Rather state
let currentWYRQuestion = null;
let wyrQuestionTimer = null;
let wyrTimeRemaining = 30;
let wyrPlayerChoices = {};
let wyrRound = 1;
let maxWYRRounds = 5;
let wyrExplanations = {};

// Assumption Buster state
let abRound = 1;
let maxABRounds = 5;
let abPhase = 'making'; // 'making', 'responding', 'explanation', 'results'
let abCurrentAssumption = null;
let abPlayerAssumptions = {};
let abPlayerResponses = {};
let abPlayerExplanations = {};
let abResults = {};
let abTemplates = [
    'I bet you think I...',
    'You probably assume that I...',
    'Most people think I...',
    'I\'m guessing you believe I...',
    'You likely think I...',
    'I assume you think I...',
    'People usually assume I...',
    'You probably imagine I...'
];

// Would You Rather Questions Database
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
        },
        {
            question: "Would you rather have a rewind button or a pause button for your life?",
            optionA: "Rewind button",
            optionB: "Pause button",
            category: "Life Control"
        },
        {
            question: "Would you rather always have to say everything on your mind or never be able to speak again?",
            optionA: "Say everything on your mind",
            optionB: "Never speak again",
            category: "Communication"
        },
        {
            question: "Would you rather be famous or be the best friend of someone famous?",
            optionA: "Be famous",
            optionB: "Be best friend of someone famous",
            category: "Fame"
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
        },
        {
            question: "Would you rather live a comfortable life but never leave your hometown or struggle financially but travel the world?",
            optionA: "Comfortable life, never leave hometown",
            optionB: "Struggle financially, travel the world",
            category: "Life Choices"
        },
        {
            question: "Would you rather be able to read minds but never turn it off or have everyone be able to read your mind?",
            optionA: "Read minds (can't turn off)",
            optionB: "Everyone can read your mind",
            category: "Mind Powers"
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
        },
        {
            question: "Would you rather have the power to end all suffering but also all joy, or keep the world as it is with both?",
            optionA: "End all suffering and joy",
            optionB: "Keep world with both suffering and joy",
            category: "Ultimate Choice"
        },
        {
            question: "Would you rather know that nothing you do matters in the grand scheme of the universe or believe your actions matter but never know if they actually do?",
            optionA: "Know nothing matters",
            optionB: "Believe it matters but never know",
            category: "Existential Crisis"
        }
    ]
};

// Vietnamese Would You Rather Questions
const wouldYouRatherQuestionsVi = {
    easy: [
        {
            question: "Bạn thích có khả năng bay hay có thể tàng hình?",
            optionA: "Có khả năng bay",
            optionB: "Có thể tàng hình",
            category: "Siêu năng lực"
        },
        {
            question: "Bạn thích luôn trễ 10 phút hay luôn sớm 20 phút?",
            optionA: "Luôn trễ 10 phút",
            optionB: "Luôn sớm 20 phút",
            category: "Quản lý thời gian"
        },
        {
            question: "Bạn thích có tiền vô hạn hay có thời gian vô hạn?",
            optionA: "Tiền vô hạn",
            optionB: "Thời gian vô hạn",
            category: "Lựa chọn cuộc sống"
        },
        {
            question: "Bạn thích sống không có âm nhạc hay sống không có phim ảnh?",
            optionA: "Sống không có âm nhạc",
            optionB: "Sống không có phim ảnh",
            category: "Giải trí"
        },
        {
            question: "Bạn thích nói được mọi thứ tiếng hay chơi được mọi nhạc cụ?",
            optionA: "Nói được mọi thứ tiếng",
            optionB: "Chơi được mọi nhạc cụ",
            category: "Kỹ năng"
        },
        {
            question: "Bạn thích có nút tua lại hay nút tạm dừng cho cuộc đời mình?",
            optionA: "Nút tua lại",
            optionB: "Nút tạm dừng",
            category: "Kiểm soát cuộc sống"
        }
    ],
    moderate: [
        {
            question: "Bạn thích biết khi nào mình chết hay biết mình sẽ chết như thế nào?",
            optionA: "Biết khi nào mình chết",
            optionB: "Biết mình sẽ chết như thế nào",
            category: "Sống & Chết"
        },
        {
            question: "Bạn thích mất hết ký ức từ lúc sinh ra hay mất khả năng tạo ký ức mới?",
            optionA: "Mất hết ký ức quá khứ",
            optionB: "Mất khả năng tạo ký ức mới",
            category: "Trí nhớ"
        },
        {
            question: "Bạn thích được mọi người sợ hãi hay được mọi người yêu mến?",
            optionA: "Được mọi người sợ hãi",
            optionB: "Được mọi người yêu mến",
            category: "Mối quan hệ"
        },
        {
            question: "Bạn thích có khả năng thay đổi quá khứ hay nhìn thấy tương lai?",
            optionA: "Thay đổi quá khứ",
            optionB: "Nhìn thấy tương lai",
            category: "Sức mạnh thời gian"
        }
    ],
    extreme: [
        {
            question: "Bạn thích hy sinh bản thân để cứu 100 người lạ hay hy sinh 100 người lạ để cứu bản thân?",
            optionA: "Hy sinh bản thân cho 100 người lạ",
            optionB: "Hy sinh 100 người lạ cho bản thân",
            category: "Tình huống đạo đức"
        },
        {
            question: "Bạn thích sống trong thế giới chỉ còn mình là con người hay bị mắc kẹt trong vòng lặp thời gian của ngày tệ nhất?",
            optionA: "Chỉ còn mình là con người",
            optionB: "Vòng lặp thời gian ngày tệ nhất",
            category: "Kinh dị hiện sinh"
        },
        {
            question: "Bạn thích phải giết một người vô tội để cứu gia đình hay để gia đình chết để cứu người vô tội đó?",
            optionA: "Giết người vô tội, cứu gia đình",
            optionB: "Để gia đình chết, cứu người vô tội",
            category: "Gia đình vs Đạo đức"
        },
        {
            question: "Bạn thích sống mãi mãi nhưng nhìn mọi người yêu thương chết đi hay chết trẻ nhưng biết mọi người yêu thương sẽ sống mãi?",
            optionA: "Sống mãi mãi, nhìn người thân chết",
            optionB: "Chết trẻ, người thân sống mãi",
            category: "Tình huống bất tử"
        }
    ]
};

// Story building functions
function showStoryBuildingUI() {
    const storyUI = document.getElementById('story-building-ui');
    if (storyUI) storyUI.classList.remove('hidden');
    resetStoryBuildingGame();
}

function hideStoryBuildingUI() {
    const storyUI = document.getElementById('story-building-ui');
    if (storyUI) storyUI.classList.add('hidden');
}

function resetStoryBuildingGame() {
    storyText = '';
    currentTurn = 1;
    storyContributions = [];
    const storyDisplay = document.getElementById('story-text-display');
    if (storyDisplay) storyDisplay.innerHTML = '';
    const turnIndicator = document.getElementById('story-turn-indicator');
    if (turnIndicator) turnIndicator.textContent = `Turn ${currentTurn}/${maxTurns}`;
    chooseRandomElement();
}

function chooseRandomElement() {
    const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
    const randomElementDiv = document.getElementById('random-element-prompt');
    if (randomElementDiv) randomElementDiv.textContent = `Incorporate: ${randomElement}`;
}

function addStoryContribution(contribution) {
    storyText += contribution + ' ';
    storyContributions.push({
        turn: currentTurn,
        player: currentTurn % 2 === 1 ? 1 : 2,
        text: contribution
    });
    
    const storyDisplay = document.getElementById('story-text-display');
    if (storyDisplay) {
        storyDisplay.innerHTML += `<span class="story-contribution player-${currentTurn % 2 === 1 ? 1 : 2}">${contribution}</span> `;
    }
    
    currentTurn++;
    const turnIndicator = document.getElementById('story-turn-indicator');
    if (turnIndicator) {
        if (currentTurn <= maxTurns) {
            turnIndicator.textContent = `Turn ${currentTurn}/${maxTurns} - Player ${currentTurn % 2 === 1 ? 1 : 2}'s turn`;
            chooseRandomElement();
        } else {
            turnIndicator.textContent = 'Story Complete!';
            endStoryBuilding();
        }
    }
}

function endStoryBuilding() {
    const storyInput = document.getElementById('story-input');
    const submitStoryBtn = document.getElementById('submit-story-contribution');
    if (storyInput) storyInput.disabled = true;
    if (submitStoryBtn) submitStoryBtn.disabled = true;
    
    // Could add scoring/rating system here
    alert('Story building complete! Check out your collaborative masterpiece!');
}

function applyViewerMode() {
    const elements = [
        document.getElementById("confirm-topics"),
        document.getElementById("submit-statements"),
        document.getElementById("next-round"),
        document.getElementById("see-topic-btn"),
        document.getElementById("hide-topic-help"),
        document.getElementById("select-current-topic"),
        document.getElementById("play-again")
    ];
    elements.forEach(el => { if (el) el.classList.add("hidden"); });
    document.querySelectorAll(".remove-topic").forEach(btn => btn.classList.add("hidden"));
}

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
        description: 'Share your romantic experiences',
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
        description: 'Tell us about your wildest nights',
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
        description: 'Share something nobody knows about you',
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
        description: 'Your most mortifying adult experiences',
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
        description: 'Your craziest adult adventures',
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
        description: 'Things you\'ve never admitted to anyone',
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
        description: 'Financial confessions and money stories',
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
        title: '18+',
        description: 'Your secret indulgences',
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

// Vietnamese Topics
const topicsVi = {
    // Chủ đề an toàn
    childhood: {
        title: 'Kỷ Niệm Tuổi Thơ',
        description: 'Chia sẻ những câu chuyện khi bạn còn nhỏ',
        suggestions: [
            'Tôi bị gãy tay khi ngã xe đạp lúc 8 tuổi',
            'Tôi có một người bạn tưởng tượng tên Charlie sống trong tủ quần áo',
            'Tôi đã thắng giải nhất cuộc thi hát tài năng ở trường',
            'Gia đình tôi chuyển nhà 5 lần trước khi tôi 10 tuổi',
            'Tôi sợ bóng tối cho đến khi 12 tuổi'
        ],
        isAdult: false
    },
    school: {
        title: 'Thời Học Sinh',
        description: 'Kể cho chúng tôi về trải nghiệm giáo dục của bạn',
        suggestions: [
            'Tôi là lớp trưởng ở trường cấp 3',
            'Tôi thi bằng lái xe trượt 3 lần mới đỗ',
            'Tôi bỏ lễ tốt nghiệp để ôn thi cuối kỳ',
            'Tôi từng bị đình chỉ vì làm trò đùa vô hại',
            'Tôi từng thích thầy giáo Toán lớp 9'
        ],
        isAdult: false
    },
    travel: {
        title: 'Cuộc Phiêu Lưu Du Lịch',
        description: 'Chia sẻ trải nghiệm du lịch hoặc điểm đến mơ ước',
        suggestions: [
            'Tôi đã đi qua cả 7 châu lục',
            'Tôi bị lạc ở Tokyo 6 tiếng mà không biết tiếng Nhật',
            'Tôi đã nhảy dù ở New Zealand',
            'Tôi chưa bao giờ rời khỏi quê hương',
            'Tôi sống ở hostel 3 tháng khi du lịch bụi'
        ],
        isAdult: false
    },
    food: {
        title: 'Ẩm Thực & Nấu Ăn',
        description: 'Kể về trải nghiệm ẩm thực của bạn',
        suggestions: [
            'Tôi từng ăn côn trùng ở một nhà hàng Thái Lan',
            'Tôi bị dị ứng chocolate và thường xuyên khóc vì điều đó',
            'Tôi có thể nấu một bữa ăn 5 món hoàn hảo từ trí nhớ',
            'Tôi chưa bao giờ ăn sushi trong đời',
            'Tôi đã làm đầu bếp ở nhà hàng 2 năm'
        ],
        isAdult: false
    },
    pets: {
        title: 'Thú Cưng & Động Vật',
        description: 'Chia sẻ câu chuyện về động vật trong cuộc sống bạn',
        suggestions: [
            'Tôi có một con rắn cưng trốn trong tường nhà nhiều tháng',
            'Tôi bí mật rất sợ bướm',
            'Tôi huấn luyện chó mang đồ ăn nhẹ từ bếp ra cho tôi',
            'Tôi đã cứu hơn 20 con mèo hoang trong đời',
            'Tôi từng bị một con ngỗng điên đuổi ở công viên'
        ],
        isAdult: false
    },
    hobbies: {
        title: 'Sở Thích & Quan Tâm',
        description: 'Nói về những gì bạn làm trong thời gian rảnh',
        suggestions: [
            'Tôi có thể giải rubik dưới 30 giây',
            'Tôi sưu tập thiệp cũ từ những năm 1920',
            'Tôi chưa bao giờ xem phim Star Wars',
            'Tôi có thể chơi 4 loại nhạc cụ khác nhau',
            'Tôi đan khăn cho các trại người vô gia cư mỗi mùa đông'
        ],
        isAdult: false
    },
    work: {
        title: 'Công Việc & Sự Nghiệp',
        description: 'Chia sẻ trải nghiệm từ đời sống nghề nghiệp',
        suggestions: [
            'Tôi từng thuyết trình cho 500 người trong mơ mà chỉ mặc đồ lót',
            'Tôi có công việc hiện tại vì đã giúp sếp tương lai trong thang máy',
            'Tôi đã bị sa thải từ 3 công việc khác nhau',
            'Tôi từng làm chú hề sinh nhật chuyên nghiệp cho trẻ em',
            'Tôi kiếm tiền từ sở thích phụ nhiều hơn công việc chính'
        ],
        isAdult: false
    },
    fears: {
        title: 'Nỗi Sợ & Ám Ảnh',
        description: 'Điều gì khiến bạn sợ hãi hoặc lo lắng?',
        suggestions: [
            'Tôi sợ bướm và chạy trốn khi nhìn thấy chúng',
            'Tôi kiểm tra dưới gầm giường mỗi đêm trước khi ngủ',
            'Tôi không thể ngủ nếu không có đèn ngủ',
            'Tôi chưa bao giờ đi tàu lượn siêu tốc vì sợ độ cao',
            'Tôi khó thở trong thang máy và leo bộ lên tầng 10'
        ],
        isAdult: false
    },
    talents: {
        title: 'Tài Năng Ẩn',
        description: 'Bạn có những kỹ năng bí mật gì?',
        suggestions: [
            'Tôi có thể tung hứng 5 quả bóng cùng lúc',
            'Tôi nói thành thạo 6 thứ tiếng',
            'Tôi có thể chạm mũi bằng lưỡi',
            'Tôi có thính giác tuyệt đối, nhận diện được mọi nốt nhạc',
            'Tôi có thể giải toán phức tạp trong đầu ngay lập tức'
        ],
        isAdult: false
    },
    embarrassing: {
        title: 'Khoảnh Khắc Xấu Hổ',
        description: 'Chia sẻ những trải nghiệm đáng xấu hổ',
        suggestions: [
            'Tôi từng đi cả ngày với giấy vệ sinh dính ở giày',
            'Tôi từng gọi cô giáo là "mẹ" trước cả lớp',
            'Tôi vẫy tay lại với ai đó đang vẫy cho người phía sau tôi',
            'Tôi ngủ gật trong đám cưới của chính mình',
            'Tôi vô tình gửi tin nhắn tình cảm cho sếp thay vì người yêu'
        ],
        isAdult: false
    },
    family: {
        title: 'Câu Chuyện Gia Đình',
        description: 'Chia sẻ về gia đình và người thân',
        suggestions: [
            'Tôi có 15 anh chị em họ và nhớ tên được hết',
            'Bố mẹ tôi gặp nhau trong thang máy bị kẹt',
            'Tôi được sinh ra trong xe taxi trên đường đến bệnh viện',
            'Tôi có người anh/chị em sinh đôi mà ít ai biết',
            'Gia đình tôi từng nổi tiếng địa phương vì lý do kỳ lạ'
        ],
        isAdult: false
    },

    // Chủ đề 18+ 
    dating: {
        title: 'Hẹn Hò & Tình Cảm',
        description: 'Chia sẻ trải nghiệm tình cảm của bạn',
        suggestions: [
            'Tôi đã hẹn hò trên 100 lần trong năm qua',
            'Tôi gặp người yêu hiện tại ở đồn cảnh sát',
            'Tôi chưa bao giờ có mối quan hệ nào dài hơn 3 tháng',
            'Tôi từng hẹn hò với 2 người cùng tên cùng lúc',
            'Tôi chia tay ai đó qua tin nhắn vào ngày sinh nhật họ'
        ],
        isAdult: true
    },
    party: {
        title: 'Tiệc Tung & Cuộc Sống Đêm',
        description: 'Kể về những đêm điên rồ nhất của bạn',
        suggestions: [
            'Tôi từng nhảy lên bàn trong đám cưới và làm gãy nó',
            'Tôi chưa bao giờ say rượu trong đời',
            'Tôi tỉnh dậy ở thành phố khác mà không nhớ mình đến đó thế nào',
            'Tôi bị đuổi khỏi quán karaoke vì hát quá to',
            'Tôi từng tiệc tùng với một người nổi tiếng và có ảnh chứng minh'
        ],
        isAdult: true
    },
    secrets: {
        title: 'Bí Mật Sâu Kín',
        description: 'Chia sẻ điều không ai biết về bạn',
        suggestions: [
            'Tôi có hình xăm ở nơi không ai có thể thấy',
            'Tôi từng ăn cắp vặt lúc còn trẻ và vẫn cảm thấy tội lỗi',
            'Tôi bí mật đọc tiểu thuyết tình cảm và có hơn 200 cuốn',
            'Tôi chưa bao giờ kể với gia đình về nghề nghiệp thật của mình',
            'Tôi có giấy tờ giả và vẫn mang theo dù đã hơn 30 tuổi'
        ],
        isAdult: true
    },
    adult_embarrassing: {
        title: 'Khoảnh Khắc Xấu Hổ Người Lớn',
        description: 'Những trải nghiệm đáng xấu hổ nhất khi trưởng thành',
        suggestions: [
            'Tôi vô tình gửi ảnh nhạy cảm cho cả nhóm chat công ty',
            'Tôi bị bảo vệ bắt gặp hôn hít ở nơi công cộng',
            'Tôi đã nôn lên người ta trong buổi hẹn hò đầu tiên',
            'Tôi ngủ gật trong lúc... quan hệ thân mật',
            'Tôi vô tình đi nhầm căn hộ và vào tận phòng ngủ người ta'
        ],
        isAdult: true
    },
    wild_experiences: {
        title: 'Trải Nghiệm Hoang Dã',
        description: 'Những cuộc phiêu lưu điên rồ nhất của bạn',
        suggestions: [
            'Tôi đã tắm tiên ở đài phun nước công cộng lúc nửa đêm',
            'Tôi gia nhập "câu lạc bộ dặm cao" trên chuyến bay 12 tiếng',
            'Tôi kết hôn với người chỉ quen 24 tiếng ở Vegas',
            'Tôi chưa bao giờ làm gì hoang dã hay phiêu lưu trong đời',
            'Tôi từng chạy trần qua sân bóng đá trong trận đấu'
        ],
        isAdult: true
    },
    adult_confessions: {
        title: 'Thú Nhận Cá Nhân',
        description: 'Những điều bạn chưa bao giờ thừa nhận với ai',
        suggestions: [
            'Tôi đã giả ốm để tránh sự kiện xã hội hơn 50 lần',
            'Tôi theo dõi người yêu cũ trên mạng xã hội 2 năm sau khi chia tay',
            'Tôi nói dối về tuổi trên app hẹn hò 5 tuổi',
            'Tôi từng giả mạo danh tính trực tuyến 6 tháng',
            'Tôi chưa bao giờ thực sự thích quan hệ thân mật nhưng giả vờ thích'
        ],
        isAdult: true
    },
    money_secrets: {
        title: 'Tiền Bạc & Bí Mật',
        description: 'Những thú nhận về tài chính',
        suggestions: [
            'Tôi có một tài khoản ngân hàng bí mật mà người yêu không biết',
            'Tôi từng tiêu 100 triệu trong một lần mua sắm và giấu diếm',
            'Tôi chưa bao giờ khai thuế đúng cách và sợ bị phát hiện',
            'Tôi kiếm tiền từ một công việc phụ đáng xấu hổ',
            'Tôi đang ngập đến cổ trong nợ nần mà không ai biết'
        ],
        isAdult: true
    },
    guilty_pleasures: {
        title: 'Thú Vui Tội Lỗi',
        description: 'Những thú vui bí mật của bạn',
        suggestions: [
            'Tôi xem reality show và thuộc lòng tất cả drama',
            'Tôi sưu tập thứ gì đó rất kỳ lạ mà xấu hổ không dám kể',
            'Tôi nghiện một game mobile và tiêu tiền vào đó',
            'Tôi ăn kem vào bữa sáng thường xuyên hơn đồ ăn sáng thật',
            'Tôi giả vờ tinh tế nhưng thích những thứ tầm thường nhất'
        ],
        isAdult: true
    },
};

const topicPoints = {
    childhood: 1,
    school: 1,
    travel: 1,
    food: 1,
    pets: 1,
    hobbies: 1,
    work: 2,
    talents: 2,
    fears: 3,
    embarrassing: 3,
    family: 4,
    dating: 5,
    party: 5,
    secrets: 5,
    adult_embarrassing: 5,
    wild_experiences: 5,
    adult_confessions: 5,
    money_secrets: 5,
    guilty_pleasures: 8
};

function getTopicClass(points) {
    if (points >= 5) return 'adult';
    if (points === 4) return 'deep';
    if (points === 3) return 'sensitive';
    if (points === 2) return 'moderate';
    return 'easy';
}

function getTopicIcon(points) {
    if (points >= 5) {
        return '🔥';
    }
    switch (points) {
        case 4:
            return '🔥';
        case 3:
            return '🔴';
        case 2:
            return '🟡';
        default:
            return '🟢';
    }
}

function assignTopicPoints(topicSet) {
    Object.entries(topicSet).forEach(([key, t]) => {
        if (!t.points) {
            t.points = topicPoints[key] !== undefined ? topicPoints[key] : (t.isAdult ? 5 : 1);
        }
    });
}

assignTopicPoints(topics);
assignTopicPoints(topicsVi);
// Get topics based on current language
function getCurrentTopics() {
    return currentLanguage === 'vi' ? topicsVi : topics;
}

// Language translations (extended)
const translations = {
    en: {
        mainTitle: 'Two Truths and a Lie',
        instructionsTitle: 'How to Play:',
        settingsTitle: 'Game Settings:',
        roundsLabel: 'Number of Rounds:',
        playerName: 'Player Name',
        roomPlaceholder: 'Enter Room Name',
        joinRoom: 'Join Room',
        joinViewer: 'Join as Viewer',
        topicSelectionPrompt: 'Select 1 topic for Player {player} to create statements about:',
        selectedTopicsTitle: 'Selected Topics:',
        confirmTopics: 'Confirm Topic Selection',
        currentTopic: 'Your Topic:',
        suggestedAnswers: 'Suggested answers:',
        selectingTopics: 'Player {player} is selecting a topic for you...',
        creatingStatements: 'Player {player} is creating statements...',
        waitingGuess: 'Player {player} is making their guess...',
        adultContent: '18+',
        playerNumber: 'You are Player {player}',
        waiting: 'Waiting for other player...',
        gameStarted: 'Game Started!',
        roundOf: 'Round {current} of {total}',
        yourTurn: 'Your turn to create statements',
        guessingTime: 'Time to guess!',
        correctGuess: 'Correct! +{points} point(s)',
        wrongGuess: 'Wrong guess!',
        finalScore: 'Final Score',
        winner: 'Winner: Player {player}',
        tie: 'It\'s a tie!',
        playAgain: 'Play Again',
        statement1: 'Statement 1:',
        statement2: 'Statement 2:',
        statement3: 'Statement 3:',
        markTruth: 'Mark the TRUE statement',
        submitStatements: 'Submit Statements',
        whichIsTrue: 'Which statement is TRUE?',
        submitGuess: 'Submit Guess',
        seeTopicHelp: 'See Topic',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        nextTurn: 'Next Turn',
        nextRound: 'Next Round',
        showResults: 'Show Results',
        clearData: 'Clear Saved Data',
        specialMessage: 'This topic encourages creative and personal statements. Use your imagination!',
        instructions: [
            'Two players join the same room',
            'Each player takes turns creating 3 statements about themselves',
            '2 statements are lies, 1 statement is the truth',
            'Mark which statement is TRUE using the check icon',
            'The other player tries to guess which one is the truth',
            'Score points for correct guesses!',
            'Play multiple rounds and see who wins!'
        ]
    },
    vi: {
        mainTitle: 'Hai Sự Thật Một Lời Dối',
        instructionsTitle: 'Cách Chơi:',
        settingsTitle: 'Cài Đặt Game:',
        roundsLabel: 'Số Vòng Chơi:',
        playerName: 'Tên Người Chơi',
        roomPlaceholder: 'Nhập Tên Phòng',
        joinRoom: 'Tham Gia Phòng',
        joinViewer: 'Xem Trực Tiếp',
        topicSelectionPrompt: 'Chọn 1 chủ đề cho Người chơi {player} tạo câu nói:',
        selectedTopicsTitle: 'Chủ Đề Đã Chọn:',
        confirmTopics: 'Xác Nhận Chọn Chủ Đề',
        currentTopic: 'Chủ Đề Của Bạn:',
        suggestedAnswers: 'Gợi ý trả lời:',
        selectingTopics: 'Người chơi {player} đang chọn chủ đề cho bạn...',
        creatingStatements: 'Người chơi {player} đang tạo câu nói...',
        waitingGuess: 'Người chơi {player} đang đoán...',
        adultContent: '18+',
        playerNumber: 'Bạn là Người chơi {player}',
        waiting: 'Đang chờ người chơi khác...',
        gameStarted: 'Game Bắt Đầu!',
        roundOf: 'Vòng {current} / {total}',
        yourTurn: 'Lượt của bạn tạo câu nói',
        guessingTime: 'Đến lúc đoán!',
        correctGuess: 'Đúng rồi! +{points} điểm',
        wrongGuess: 'Đoán sai!',
        finalScore: 'Điểm Cuối Cùng',
        winner: 'Người Thắng: Người chơi {player}',
        tie: 'Hòa!',
        playAgain: 'Chơi Lại',
        statement1: 'Câu nói 1:',
        statement2: 'Câu nói 2:',
        statement3: 'Câu nói 3:',
        markTruth: 'Đánh dấu câu nói ĐÚNG',
        submitStatements: 'Gửi Các Câu Nói',
        whichIsTrue: 'Câu nói nào là ĐÚNG?',
        submitGuess: 'Gửi Đáp Án',
        seeTopicHelp: 'Xem Chủ Đề',
        darkMode: 'Chế độ tối',
        lightMode: 'Chế độ sáng',
        nextTurn: 'Lượt Tiếp',
        nextRound: 'Vòng Tiếp',
        showResults: 'Xem Kết Quả',
        clearData: 'Xóa Dữ Liệu',
        specialMessage: 'Chủ đề này khuyến khích những câu nói sáng tạo và cá nhân. Hãy sử dụng trí tưởng tượng của bạn!',
        instructions: [
            'Hai người chơi tham gia cùng một phòng',
            'Mỗi người chơi lần lượt tạo 3 câu nói về bản thân',
            '2 câu nói là dối trá, 1 câu nói là sự thật',
            'Đánh dấu câu nói ĐÚNG bằng biểu tượng dấu tích',
            'Người chơi kia cố gắng đoán câu nào là sự thật',
            'Ghi điểm khi đoán đúng!',
            'Chơi nhiều vòng và xem ai thắng!'
        ]
    }
};

// Side Menu Functions
function openSideMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
}

function closeSideMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

function updateMenuActiveStates() {
    // Update language button states
    langEnBtn.classList.toggle('active', currentLanguage === 'en');
    langViBtn.classList.toggle('active', currentLanguage === 'vi');
}

function updateThemeButtonText() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const darkModeText = currentLanguage === 'en' ? 'Light Mode' : 'Chế độ sáng';
    const lightModeText = currentLanguage === 'en' ? 'Dark Mode' : 'Chế độ tối';

    themeToggleBtn.textContent = isDarkMode ? darkModeText : lightModeText;
}

function clearGameData() {
    // Clear local storage items related to the game
    localStorage.removeItem('gameHistory');
    localStorage.removeItem('playerName');

    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Clear caches if available
    if (window.caches) {
        caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key));
        });
    }
}

function updateGameInstructions(mode) {
    const instructionsContent = document.getElementById('instructions-content');
    let instructionsHTML = '';
    
    if (mode === 'two-truths') {
        instructionsHTML = `
            <ol>
                <li>Two players join the same room</li>
                <li>Each player takes turns creating 3 statements about themselves</li>
                <li>2 statements are lies, 1 statement is the truth</li>
                <li>Mark which statement is TRUE using the check icon</li>
                <li>The other player tries to guess which one is the truth</li>
                <li>Score points for correct guesses!</li>
                <li>Play multiple rounds and see who wins!</li>
            </ol>
        `;
    } else if (mode === 'story-building') {
        instructionsHTML = `
            <ol>
                <li>Players take turns contributing to a story</li>
                <li>Each turn, a player adds a sentence or phrase</li>
                <li>A random prompt may be incorporated for creativity</li>
                <li>The goal is to create a fun and cohesive story</li>
                <li>Continue until the story reaches a pre-set limit</li>
            </ol>
        `;
    } else if (mode === 'would-you-rather') {
        instructionsHTML = `
            <ol>
                <li>Players face a hypothetical question with two choices</li>
                <li>Select the option you prefer and explain your reasoning</li>
                <li>Compare answers with other players</li>
                <li>Score points for creativity and reasoning</li>
                <li>Play multiple rounds and compare choices!</li>
            </ol>
        `;
    } else if (mode === 'assumption-buster') {
        instructionsHTML = `
            <ol>
                <li>Create an assumption about the other player</li>
                <li>The other player responds with true or false</li>
                <li>Explain why your assumption was true or false</li>
                <li>Gain insights into each other’s thinking</li>
                <li>Continue through multiple rounds</li>
            </ol>
        `;
    }
    
    if (instructionsContent) {
        instructionsContent.innerHTML = instructionsHTML;
    }
}


// Initialize
function initializeApp() {
    console.log('DOM loaded, checking elements...');
    console.log('langEnBtn:', document.getElementById('lang-en'));
    console.log('langViBtn:', document.getElementById('lang-vi'));
    console.log('joinRoomBtn:', document.getElementById('join-room'));
    console.log('roomNameInput:', document.getElementById('room-name'));
    
    updateLanguageContent();
    
    console.log('Setting up event listeners...');

    // Prefill player name if saved from previous session
    const storedName = localStorage.getItem('playerName');
    if (storedName && playerNameInput) {
        playerNameInput.value = storedName;
        playerName = storedName;
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Add desktop enhancements
    if (window.innerWidth >= 768) {
        addDesktopEnhancements();
    }
    
    // Language switching
    const langEnBtn = document.getElementById('lang-en');
    const langViBtn = document.getElementById('lang-vi');

    // Welcome popup handling with countdown
    const welcomePopup = document.getElementById('welcome-popup');
    const countdownEl = document.getElementById('countdown');
    if (welcomePopup) {
        let countdown = 5;
        if (countdownEl) countdownEl.textContent = `Starting in ${countdown}...`;
        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if (countdownEl) countdownEl.textContent = `Starting in ${countdown}...`;
            } else {
                clearInterval(timer);
                welcomePopup.classList.add('hidden');
            }
        }, 1000);
    }
    
    // Side Menu functionality
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            openSideMenu();
        });
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            closeSideMenu();
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            closeSideMenu();
        });
    }
    
    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            console.log('English button clicked');
            switchLanguage('en');
            updateMenuActiveStates();
        });
    }
    
    if (langViBtn) {
        langViBtn.addEventListener('click', () => {
            console.log('Vietnamese button clicked');
            switchLanguage('vi');
            updateMenuActiveStates();
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            updateLanguageContent();
            updateThemeButtonText();
        });
    }

    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Clear saved data and cookies?')) {
                clearGameData();
                alert('Data cleared!');
            }
        });
    }
    
    // Join room button
    const joinRoomBtn = document.getElementById('join-room');
    const joinViewerBtn = document.getElementById('join-viewer');
    const roomNameInput = document.getElementById('room-name');
    const roundCountSelect = document.getElementById('round-count');
    
    if (joinRoomBtn) {
        joinRoomBtn.addEventListener('click', () => {
            console.log('Join room button clicked');
            roomName = roomNameInput.value.trim();
            playerName = playerNameInput.value.trim();
            totalRounds = parseInt(roundCountSelect.value);
            
            // Reset input styles
            playerNameInput.classList.remove('error', 'success');
            roomNameInput.classList.remove('error', 'success');
            
            let hasError = false;
            
            if (!playerName) {
                playerNameInput.classList.add('error');
                alert('Please enter your name.');
                hasError = true;
            } else {
                playerNameInput.classList.add('success');
            }
            
            if (!roomName || roomName.length < 3) {
                roomNameInput.classList.add('error');
                if (!hasError) alert('Please enter a room name with at least 3 characters.');
                hasError = true;
            } else {
                roomNameInput.classList.add('success');
            }
            
            if (!hasError) {
                console.log('Emitting create or join event');
                socket.emit('create or join', roomName, totalRounds, playerName);
                // Save player name for future sessions
                localStorage.setItem('playerName', playerName);
                joinRoomBtn.disabled = true;
                joinRoomBtn.textContent = 'Joining...';
                
                // Store the selected game mode for later use
                console.log('Selected game mode:', currentGameMode);
            }
        });
    }

    if (joinViewerBtn) {
        joinViewerBtn.addEventListener('click', () => {
            roomName = roomNameInput.value.trim();
            playerName = playerNameInput.value.trim() || 'Viewer';
            totalRounds = parseInt(roundCountSelect.value);

            if (!roomName || roomName.length < 3) {
                alert('Please enter a room name with at least 3 characters.');
                return;
            }
            isViewer = true;
            applyViewerMode();
            socket.emit('create or join', roomName, totalRounds, playerName, true);
            joinViewerBtn.disabled = true;
            joinViewerBtn.textContent = 'Joining...';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Game mode selection event handlers
document.addEventListener('DOMContentLoaded', () => {
    // Handle game mode card selection
document.querySelectorAll('.mode-card').forEach((card) => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
            // Add selected class to clicked card
card.classList.add('active');
            currentGameMode = card.dataset.mode;
            
            // Update instructions based on selected mode
            updateGameInstructions(currentGameMode);
            
    // Handle UI transitions based on selected mode
            if (currentGameMode === 'story-building') {
                showStoryBuildingUI();
                hideWouldYouRatherUI();
                hideAssumptionBusterUI();
            } else if (currentGameMode === 'would-you-rather') {
                showWouldYouRatherUI();
                hideStoryBuildingUI();
                hideAssumptionBusterUI();
            } else if (currentGameMode === 'assumption-buster') {
                showAssumptionBusterUI();
                hideStoryBuildingUI();
                hideWouldYouRatherUI();
            } else {
                hideStoryBuildingUI();
                hideWouldYouRatherUI();
                hideAssumptionBusterUI();
            }
        });
    });
    
    // Story building specific event handlers
    const storyInput = document.getElementById('story-input');
    const submitStoryBtn = document.getElementById('submit-story-contribution');
    
    if (submitStoryBtn) {
        submitStoryBtn.addEventListener('click', () => {
            const contribution = storyInput.value.trim();
            if (contribution) {
                // Send contribution to server for multiplayer sync
                if (roomName && !isViewer) {
                    socket.emit('story contribution', roomName, contribution, currentTurn, playerNumber);
                    storyInput.value = '';
                } else {
                    // Local mode for testing
                    addStoryContribution(contribution);
                    storyInput.value = '';
                }
            } else {
                alert('Please enter your story contribution!');
            }
        });
    }
    
    // Enter key support for story input
    if (storyInput) {
        storyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitStoryBtn.click();
            }
        });
    }
    
    // Would You Rather specific event handlers
    const wyrChoiceA = document.getElementById('wyr-choice-a');
    const wyrChoiceB = document.getElementById('wyr-choice-b');
    const wyrSubmitBtn = document.getElementById('submit-wyr-explanation');
    const wyrExplanationTextarea = document.getElementById('wyr-explanation-input');
    
    if (wyrChoiceA) {
        wyrChoiceA.addEventListener('click', () => {
            selectWYRChoice('A');
        });
    }
    
    if (wyrChoiceB) {
        wyrChoiceB.addEventListener('click', () => {
            selectWYRChoice('B');
        });
    }
    
    if (wyrSubmitBtn) {
        wyrSubmitBtn.addEventListener('click', () => {
            submitWYRChoice();
        });
    }
    
    // Enter key support for explanation input
    if (wyrExplanationTextarea) {
        wyrExplanationTextarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                submitWYRChoice();
            }
        });
    }
});

// Remove duplicate initialization
// console.log('Checking DOM elements...');
// console.log('langEnBtn:', langEnBtn);
// console.log('langViBtn:', langViBtn);
// console.log('joinRoomBtn:', joinRoomBtn);
// console.log('roomNameInput:', roomNameInput);

// updateLanguageContent();

function switchLanguage(lang) {
    console.log('Switching language to:', lang);
    currentLanguage = lang;
    const langEnBtn = document.getElementById('lang-en');
    const langViBtn = document.getElementById('lang-vi');
    
    if (langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
    if (langViBtn) langViBtn.classList.toggle('active', lang === 'vi');
    updateLanguageContent();
}

function updateLanguageContent() {
    const t = translations[currentLanguage];
    console.log('Updating language content to:', currentLanguage);
    
    try {
        // Update main UI elements
        const mainTitle = document.getElementById('main-title');
        if (mainTitle) mainTitle.textContent = t.mainTitle;
        
        const instructionsTitle = document.getElementById('instructions-title');
        if (instructionsTitle) instructionsTitle.textContent = t.instructionsTitle;
        
        const settingsTitle = document.getElementById('settings-title');
        if (settingsTitle) settingsTitle.textContent = t.settingsTitle;
        
        const roundsLabel = document.getElementById('rounds-label');
        if (roundsLabel) roundsLabel.textContent = t.roundsLabel;
        
        const roomNameInput = document.getElementById('room-name');
        if (roomNameInput) roomNameInput.placeholder = t.roomPlaceholder;
        
        const playerNameInput = document.getElementById('player-name');
        if (playerNameInput) playerNameInput.placeholder = t.playerName;
        
        const joinRoomBtn = document.getElementById('join-room');
        if (joinRoomBtn) joinRoomBtn.textContent = t.joinRoom;
        const joinViewerBtn = document.getElementById('join-viewer');
        if (joinViewerBtn) joinViewerBtn.textContent = t.joinViewer;
        
        // Update instructions list
        const instructionsList = document.querySelector('#instructions-content ol');
        if (instructionsList) {
            instructionsList.innerHTML = '';
            t.instructions.forEach(instruction => {
                const li = document.createElement('li');
                li.textContent = instruction;
                instructionsList.appendChild(li);
            });
        }
        
        // Update topic selection elements
        if (topicPrompt) {
            topicPrompt.textContent = t.topicSelectionPrompt.replace('{player}', '2');
        }
        if (selectedTopicsTitle) {
            selectedTopicsTitle.textContent = t.selectedTopicsTitle;
        }
        if (confirmTopicsBtn) {
            confirmTopicsBtn.textContent = t.confirmTopics;
        }
        
        // Update other game elements (only if they exist)
        const currentTopicLabel = document.getElementById('current-topic-label');
        if (currentTopicLabel) currentTopicLabel.textContent = t.currentTopic;
        
        if (suggestionsTitle) suggestionsTitle.textContent = t.suggestedAnswers;
        
        if (seeTopicBtn) {
            seeTopicBtn.textContent = t.seeTopicHelp;
        }
        
        // Update statement labels
        const statementLabels = document.querySelectorAll('.statement-label');
        statementLabels.forEach((label, index) => {
            if (label) {
                label.textContent = t[`statement${index + 1}`];
            }
        });
        
        // Update other labels (only if they exist)
        const markTruthLabel = document.getElementById('mark-truth-label');
        if (markTruthLabel) markTruthLabel.textContent = t.markTruth;
        
        const submitStatementsBtn = document.getElementById('submit-statements-btn');
        if (submitStatementsBtn) submitStatementsBtn.textContent = t.submitStatements;
        
        const guessPrompt = document.getElementById('guess-prompt');
        if (guessPrompt) guessPrompt.textContent = t.whichIsTrue;

        if (nextRoundBtn) nextRoundBtn.textContent = t.nextRound;
        
        const submitGuessBtn = document.getElementById('submit-guess-btn');
        if (submitGuessBtn) submitGuessBtn.textContent = t.submitGuess;

        if (themeToggleBtn) {
            themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? t.lightMode : t.darkMode;
        }
        if (clearDataBtn) {
            clearDataBtn.textContent = t.clearData;
        }

        // Recreate topic grid with new language
        if (topicGrid) {
            createTopicGrid();
        }
        
        // Update menu button states
        updateMenuActiveStates();
        updateThemeButtonText();
        
        console.log('Language content updated successfully');
    } catch (error) {
        console.error('Error updating language content:', error);
    }
}

// Topic selection functionality
function createTopicGrid() {
    topicGrid.innerHTML = '';
    const currentTopics = getCurrentTopics();
    
    Object.keys(currentTopics).forEach(topicKey => {
        const topic = currentTopics[topicKey];
        const topicCard = document.createElement('div');
        const cls = getTopicClass(topic.points);
        topicCard.className = `topic-card ${cls}`;
        topicCard.dataset.topic = topicKey;
        topicCard.tabIndex = 0; // Make focusable for keyboard navigation

        const t = translations[currentLanguage];
        const iconBadge = `<span class="icon-badge">${getTopicIcon(topic.points)}</span>`;
        const pointsBadge = `<span class="points-badge">${topic.points} pts</span>`;
        topicCard.innerHTML = `
            ${iconBadge}
            ${pointsBadge}
            <h4>${topic.title}</h4>
            <p>${topic.description}</p>
        `;
        
        // Mouse click handler
        topicCard.addEventListener('click', () => {
            showTopicSuggestions(topicKey, topic);
        });
        
        // Keyboard handler
        topicCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTopicSuggestions(topicKey, topic);
            }
        });
        
        topicGrid.appendChild(topicCard);
    });
    
    // Add "Create Custom Topic" template card
    const customTopicCard = document.createElement('div');
    customTopicCard.className = 'topic-card custom-topic-template';
    customTopicCard.tabIndex = 0;
    customTopicCard.innerHTML = `
        <h4>✨ Create Custom Topic</h4>
        <p>Click here to create your own topic with custom questions</p>
    `;
    
    // Handle clicking on the custom topic template
    customTopicCard.addEventListener('click', () => {
        showCustomTopicForm();
    });
    
    customTopicCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showCustomTopicForm();
        }
    });
    
    topicGrid.appendChild(customTopicCard);
}

function showTopicSuggestions(topicKey, topic) {
    highlightedTopic = topicKey;
    updateTopicCards();
    
    // Special handling for the "18+" topic
    if (topicKey === 'guilty_pleasures') {
        // Show a special message instead of suggestions
        const t = translations[currentLanguage];
        currentTopicName.textContent = topic.title;
        suggestionList.innerHTML = `<li class="special-message">${t.specialMessage}</li>`;
        topicSuggestions.classList.remove('hidden');
        
        // Show/hide select button based on selection status
        if (selectedTopics.includes(topicKey)) {
            selectCurrentTopicBtn.classList.add('hidden');
        } else {
            selectCurrentTopicBtn.classList.remove('hidden');
            selectCurrentTopicBtn.onclick = () => selectTopic(topicKey);
        }
        return;
    }
    
    // Show suggestions for all other topics
    currentTopicName.textContent = topic.title;
    
    suggestionList.innerHTML = '';
    topic.suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionList.appendChild(li);
    });
    
    topicSuggestions.classList.remove('hidden');
    
    // Show/hide select button based on selection status
    if (selectedTopics.includes(topicKey)) {
        selectCurrentTopicBtn.classList.add('hidden');
    } else {
        selectCurrentTopicBtn.classList.remove('hidden');
        selectCurrentTopicBtn.onclick = () => selectTopic(topicKey);
    }
}

function updateTopicCards() {
    document.querySelectorAll('.topic-card').forEach(card => {
        const topicKey = card.dataset.topic;
        card.classList.toggle('highlighted', topicKey === highlightedTopic);
        card.classList.toggle('selected', selectedTopics.includes(topicKey));
    });
}

function selectTopic(topicKey) {
    console.log('Selecting topic:', topicKey); // Debug log
    if (selectedTopics.includes(topicKey)) {
        console.log('Topic already selected'); // Debug log
        return;
    }
    
    // Only allow 1 topic selection now
    if (selectedTopics.length >= 1) {
        alert('You can only select 1 topic per round.');
        return;
    }
    
    selectedTopics.push(topicKey);
    console.log('Selected topics now:', selectedTopics); // Debug log
    highlightedTopic = null;
    updateSelectedTopicsList();
    updateTopicCards();
    if (!isViewer) {
        socket.emit('topic progress', roomName, selectedTopics);
    }
    topicSuggestions.classList.add('hidden');
    
    // Show confirm button immediately after selecting 1 topic
    console.log('Showing confirm button'); // Debug log
    confirmTopicsBtn.classList.remove('hidden');
}

function updateSelectedTopicsList() {
    selectedTopicsList.innerHTML = '';
    const currentTopics = getCurrentTopics();
    
    selectedTopics.forEach(topicKey => {
        const topic = currentTopics[topicKey];
        const item = document.createElement('div');
        item.className = 'selected-topic-item';
        item.innerHTML = `
            <span>${topic.title} (${topic.points} pts)</span>
            ${isViewer ? '' : `<button class="remove-topic" onclick="removeTopic('${topicKey}')">Remove</button>`}
        `;
        selectedTopicsList.appendChild(item);
    });
}

function removeTopic(topicKey) {
    selectedTopics = selectedTopics.filter(t => t !== topicKey);
    updateSelectedTopicsList();
    updateTopicCards();
    if (!isViewer) {
        socket.emit('topic progress', roomName, selectedTopics);
    }
    
    if (selectedTopics.length < 3) {
        confirmTopicsBtn.classList.add('hidden');
    }
}


// Custom topic form functions
function showCustomTopicForm() {
    // Hide topic grid and suggestions
    topicGrid.style.display = 'none';
    topicSuggestions.classList.add('hidden');
    
    // Show custom topic form
    const customTopicSection = document.getElementById('custom-topic-section');
    customTopicSection.classList.remove('hidden');
    
    // Focus on the topic name input
    const nameInput = document.getElementById('custom-topic-name');
    if (nameInput) nameInput.focus();
}

function hideCustomTopicForm() {
    // Hide custom topic form
    const customTopicSection = document.getElementById('custom-topic-section');
    customTopicSection.classList.add('hidden');
    
    // Show topic grid again
    topicGrid.style.display = 'grid';
    
    // Clear form fields
    document.getElementById('custom-topic-name').value = '';
    document.getElementById('custom-topic-description').value = '';
    document.getElementById('custom-topic-suggestions').value = '';
    document.getElementById('custom-topic-points').value = '1';
    document.getElementById('custom-topic-adult').checked = false;
}

// Confirm topics selection
  document.getElementById('create-custom-topic').onclick = () => {
    const customTopicName = document.getElementById('custom-topic-name').value.trim();
    const customTopicDescription = document.getElementById('custom-topic-description').value.trim();
    const customTopicSuggestions = document.getElementById('custom-topic-suggestions').value.trim().split('\n').filter(s => s.trim());
    const customTopicPoints = parseInt(document.getElementById('custom-topic-points').value);
    const isAdult = document.getElementById('custom-topic-adult').checked;
    
    if (customTopicName && customTopicSuggestions.length >= 3) {
      const customTopic = {
        title: customTopicName,
        description: customTopicDescription,
        suggestions: customTopicSuggestions,
        points: customTopicPoints,
        isAdult
      };
      socket.emit('create custom topic', roomName, customTopic);
      hideCustomTopicForm(); // Hide the form after submission
    } else {
      alert('Please enter a topic name and at least 3 suggestions.');
    }
  };
  
  // Cancel custom topic creation
  document.getElementById('cancel-custom-topic').onclick = () => {
    hideCustomTopicForm();
  };

  confirmTopicsBtn.addEventListener('click', () => {
    console.log('Confirm topics clicked, selected topics:', selectedTopics); // Debug log
    console.log('Room name:', roomName); // Debug log
    if (selectedTopics.length >= 1) {
        if (!roomName) {
            console.error('Room name is not set!'); // Debug log
            alert('Room name error. Please refresh and try again.');
            return;
        }
        if (!isViewer) {
            console.log('Sending topics selected event to server'); // Debug log
            socket.emit('topics selected', roomName, selectedTopics);
        }
        topicSelectionArea.classList.add('hidden');
        topicSuggestions.classList.add('hidden');
        highlightedTopic = null;
    } else {
        console.log('Not enough topics selected:', selectedTopics.length); // Debug log
        alert('Please select at least 1 topic.');
    }
});

// See topic suggestions during statement creation
seeTopicBtn.addEventListener('click', () => {
    if (currentTopic) {
        helpTopicName.textContent = currentTopic.title;
        
        helpSuggestionList.innerHTML = '';
        currentTopic.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            helpSuggestionList.appendChild(li);
        });
        
        topicHelp.classList.remove('hidden');
        seeTopicBtn.style.display = 'none'; // Hide the see topic button when help is shown
    }
});

// Hide topic suggestions
hideTopicHelpBtn.addEventListener('click', () => {
    topicHelp.classList.add('hidden');
    seeTopicBtn.style.display = 'inline-block'; // Show the see topic button again
});

// Real-time typing updates for viewers
[statement1Input, statement2Input, statement3Input].forEach(input => {
    input.addEventListener('input', () => {
        if (!isViewer) {
            const currentStatements = [statement1Input.value, statement2Input.value, statement3Input.value];
            socket.emit('statement typing', roomName, currentStatements);
        }
    });
});

// Statement submission
submitStatementsBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (isViewer) return;
    
    statements = [statement1Input.value, statement2Input.value, statement3Input.value];
    
    if (statements.some(s => !s.trim())) {
        alert("Please fill in all three statements.");
        return;
    }
    
    const selectedRadio = document.querySelector('input[name="truth-selection"]:checked');
    if (!selectedRadio) {
        alert("Please select which statement is the TRUTH by clicking the check icon.");
        return;
    }
    
    selectedTruthIndex = parseInt(selectedRadio.value);
    
    socket.emit('submit statements', roomName, statements, selectedTruthIndex, currentTopicKey, currentTopic.points);
    inputArea.classList.add('hidden');
    topicHelp.classList.add('hidden'); // Hide help area when submitting
});

// Guess buttons
[statementBtn1, statementBtn2, statementBtn3].forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (!isViewer) {
            socket.emit('guess made', roomName, index);
        }
    });
});

// Next round
nextRoundBtn.addEventListener('click', () => {
    if (!isViewer) {
        socket.emit('next round', roomName);
    }
    nextRoundBtn.classList.add('hidden');
});

// Socket event handlers
socket.on('room created', (room, player, rounds, names) => {
    console.log('Room created:', room, player, rounds, names); // Debug log
    roomName = room;
    playerNumber = player;
    totalRounds = rounds;
    if (names) playerNames = names;
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerNumberDisplay.textContent = `Player ${playerNumber}`;
    if (playerNameDisplay) playerNameDisplay.textContent = playerName || 'Anonymous';
    gameStatusDisplay.textContent = 'Waiting for Player 2 to join...';
    
    // Initialize scoreboard and session data
    updatePlayerNames(playerNames);
    updateScores();
    currentGameRounds = [];
    
    // Initialize emoji system
    initializeEmojiSystem();
    
    // Hide all game areas initially
    topicSelectionArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    guessArea.classList.add('hidden');
});

socket.on('room joined', (room, player, rounds, names) => {
    console.log('Room joined:', room, player, rounds, names); // Debug log
    roomName = room;
    playerNumber = player;
    totalRounds = rounds;
    if (names) playerNames = names;
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerNumberDisplay.textContent = `Player ${playerNumber}`;
    if (playerNameDisplay) playerNameDisplay.textContent = playerName || 'Anonymous';
    
    // Initialize scoreboard and session data
    updatePlayerNames(playerNames);
    updateScores();
    currentGameRounds = [];
    
    // Initialize emoji system
    initializeEmojiSystem();
    
    // Hide all game areas initially
    topicSelectionArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    guessArea.classList.add('hidden');
});

socket.on('viewer joined', (data) => {
    console.log('Viewer joined:', data);
    roomName = data.room;
    totalRounds = data.rounds;
    if (data.playerNames) playerNames = data.playerNames;
    isViewer = true;
    applyViewerMode();
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerNumberDisplay.textContent = 'Viewer';
    if (playerNameDisplay) playerNameDisplay.textContent = playerName || 'Viewer';
    updatePlayerNames(playerNames);
    updateScores();

    if (data.phase === 'topic_selection') {
        selectedTopics = data.selectedTopics || [];
        currentRound = data.round || 1;
        roundTitle.textContent = `Round ${currentRound}`;
        createTopicGrid();
        updateSelectedTopicsList();
        topicSelectionArea.classList.remove('hidden');
        inputArea.classList.add('hidden');
        guessArea.classList.add('hidden');
    } else if (data.phase === 'statement_creation') {
        currentRound = data.round || 1;
        roundTitle.textContent = `Round ${currentRound}`;
        currentTopicKey = data.currentTopic;
        const currentTopics = getCurrentTopics();
        currentTopic = currentTopics[currentTopicKey];
        inputArea.classList.remove('hidden');
        currentTopicDiv.classList.remove('hidden');
        topicDisplay.textContent = currentTopic ? currentTopic.title : '';
        const typing = data.typing || ['', '', ''];
        [statement1Input.value, statement2Input.value, statement3Input.value] = typing;
        document.querySelectorAll('input[name="truth-selection"]').forEach(r => r.disabled = true);
        [statement1Input, statement2Input, statement3Input].forEach(inp => inp.disabled = true);
    }
});

socket.on('start topic selection', (targetPlayer, round) => {
    console.log('Start topic selection:', targetPlayer, round); // Debug log
    currentRound = round;
    roundTitle.textContent = `Round ${round}`;
    
    // Show topic selection
    topicSelectionArea.classList.remove('hidden');
    topicPrompt.textContent = `Select 1 topic for Player ${targetPlayer} to create statements about:`;
    
    selectedTopics = [];
    highlightedTopic = null;
    createTopicGrid();
    updateSelectedTopicsList();
    confirmTopicsBtn.classList.add('hidden');
    topicSuggestions.classList.add('hidden');
    
    // Hide other areas - especially input area
    inputArea.classList.add('hidden');
    guessArea.classList.add('hidden');
    currentTopicDiv.classList.add('hidden');
    opponentTopicDiv.classList.add('hidden');
    topicHelp.classList.add('hidden');

    nextRoundBtn.classList.add('hidden');
    resultMessage.textContent = '';
});

socket.on('viewer start statement creation', (data) => {
    if (!isViewer) return;
    currentRound = data.round;
    roundTitle.textContent = `Round ${currentRound}`;
    currentTopicKey = data.topic;
    const currentTopics = getCurrentTopics();
    currentTopic = currentTopics[currentTopicKey];
    inputArea.classList.remove('hidden');
    currentTopicDiv.classList.remove('hidden');
    topicDisplay.textContent = currentTopic ? currentTopic.title : '';
    document.querySelectorAll('input[name="truth-selection"]').forEach(r => r.disabled = true);
    [statement1Input, statement2Input, statement3Input].forEach(inp => inp.disabled = true);
    applyViewerMode();
});

socket.on('viewer statement typing', (statementsArray) => {
    if (!isViewer) return;
    [statement1Input.value, statement2Input.value, statement3Input.value] = statementsArray;
});

socket.on('viewer statements submitted', (submittedStatements, topicKey) => {
    if (!isViewer) return;
    statements = submittedStatements;
    const currentTopics = getCurrentTopics();
    currentTopic = currentTopics[topicKey];
    guessArea.classList.remove('hidden');
    opponentTopicDiv.classList.remove('hidden');
    opponentTopicDisplay.textContent = currentTopic.title;
    statementBtn1.textContent = statements[0];
    statementBtn2.textContent = statements[1];
    statementBtn3.textContent = statements[2];
    topicSelectionArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    currentTopicDiv.classList.add('hidden');
    applyViewerMode();
});

socket.on('viewer start topic selection', (data) => {
    if (!isViewer) return;
    currentRound = data.round;
    roundTitle.textContent = `Round ${currentRound}`;
    selectedTopics = data.selectedTopics || [];
    createTopicGrid();
    updateSelectedTopicsList();
    topicSelectionArea.classList.remove('hidden');
    inputArea.classList.add('hidden');
    applyViewerMode();
    guessArea.classList.add('hidden');
});

socket.on('viewer topic progress', (topics) => {
    if (!isViewer) return;
    selectedTopics = topics;
    updateSelectedTopicsList();
    applyViewerMode();
    updateTopicCards();
});

socket.on('start statement creation', (topicKey, round) => {
    console.log('Received start statement creation:', topicKey, round); // Debug log
    currentRound = round;
    roundTitle.textContent = `Round ${round}`;
    currentTopicKey = topicKey; // Store the topic key
    const currentTopics = getCurrentTopics();
    currentTopic = currentTopics[topicKey]; // Store the topic object
    
    if (!currentTopic) {
        console.error('Topic not found:', topicKey); // Debug log
        console.log('Available topics:', Object.keys(currentTopics)); // Debug log
        return;
    }
    
    console.log('Current topic:', currentTopic.title); // Debug log
    
    // Show statement creation
    inputArea.classList.remove('hidden');
    currentTopicDiv.classList.remove('hidden');
    topicDisplay.textContent = currentTopic.title;
    
    // Reset topic help visibility
    topicHelp.classList.add('hidden');
    seeTopicBtn.style.display = 'inline-block';
    
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

    nextRoundBtn.classList.add('hidden');
    resultMessage.textContent = '';
});

socket.on('statements submitted', (submittedStatements, topicKey) => {
    statements = submittedStatements;
    const currentTopics = getCurrentTopics();
    currentTopic = currentTopics[topicKey]; // Get topic object from key
    
    // Show guessing area
    guessArea.classList.remove('hidden');
    opponentTopicDiv.classList.remove('hidden');
    opponentTopicDisplay.textContent = currentTopic.title;
    
    const t = translations[currentLanguage];
    guessPrompt.textContent = t.whichIsTrue;
    statementBtn1.textContent = statements[0];
    statementBtn2.textContent = statements[1];
    statementBtn3.textContent = statements[2];
    
    // Hide other areas
    topicSelectionArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    currentTopicDiv.classList.add('hidden');
});

socket.on('guess result', (guessIndex, correctIndex, isCorrect, newScores, roundOver, gameOverNext, pointsAwarded) => {
    scores = newScores;
    updateScores();

    if (isCorrect) {
        const t = translations[currentLanguage];
        const msgTemplate = (t.correctGuess || 'Correct! +{points} point(s)').replace('{points}', pointsAwarded);
        resultMessage.textContent = msgTemplate;
        resultMessage.style.color = '#28a745';
    } else {
        resultMessage.textContent = `Wrong! The truth was: "${statements[correctIndex]}"`;
        resultMessage.style.color = '#dc3545';
    }
    
    // Only show next turn button if the current player was guessing (not creating statements)
    const wasGuessing = !guessArea.classList.contains('hidden');
    
    if (wasGuessing && !isViewer) {
        // This player was guessing, show them the next turn button
        if (gameOverNext) {
            nextRoundBtn.textContent = translations[currentLanguage].showResults || 'Show Results';
        } else if (roundOver) {
            nextRoundBtn.textContent = translations[currentLanguage].nextRound || 'Next Round';
        } else {
            nextRoundBtn.textContent = translations[currentLanguage].nextTurn || 'Next Turn';
        }
        nextRoundBtn.classList.remove('hidden');
    } else if (wasGuessing && isViewer) {
        nextRoundBtn.classList.add('hidden');
    } else {
        // This player was creating statements, show them a waiting message
        const t = translations[currentLanguage];
        statusMessage.textContent = t.waiting || 'Waiting for other player...';
        statusMessage.style.color = '#6c757d';
    }
    
    guessArea.classList.add('hidden');
    opponentTopicDiv.classList.add('hidden');

    // Record round details for history
    currentGameRounds.push({
        round: currentRound,
        topic: currentTopic ? currentTopic.title : '',
        statements: [...statements],
        truthIndex: correctIndex,
        guessIndex,
        isCorrect,
        points: isCorrect ? pointsAwarded : 0
    });
});

socket.on('game over', (finalScores, names) => {
    scores = finalScores;
    if (names) playerNames = names;
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    const finalScore = document.getElementById('final-score');
    const winner = document.getElementById('winner');
    
    const player1Name = playerNames[1] || 'Player 1';
    const player2Name = playerNames[2] || 'Player 2';
    
    finalScore.textContent = `${player1Name}: ${scores[1]} - ${player2Name}: ${scores[2]}`;
    
    let winnerPlayer = 0;
    if (scores[1] > scores[2]) {
        winner.textContent = `${player1Name} wins!`;
        winnerPlayer = 1;
    } else if (scores[2] > scores[1]) {
        winner.textContent = `${player2Name} wins!`;
        winnerPlayer = 2;
    } else {
        winner.textContent = "It's a tie!";
    }

    // Save history to localStorage
    const historyItem = {
        timestamp: new Date().toISOString(),
        players: { 1: player1Name, 2: player2Name },
        scores: { ...scores },
        winner: winnerPlayer,
        rounds: currentGameRounds
    };
    const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    history.push(historyItem);
    localStorage.setItem('gameHistory', JSON.stringify(history));
    currentGameRounds = [];
});

socket.on('status update', (status) => {
    console.log('Status update:', status); // Debug log
    gameStatusDisplay.textContent = status;
    
    // Update status indicator for desktop
    if (window.innerWidth >= 768) {
        updateStatusIndicator(status);
    }
});

socket.on('player names updated', (names) => {
    console.log('Player names updated:', names); // Debug log
    updatePlayerNames(names);
});

socket.on('player joined', (names) => {
    console.log('Player joined:', names);
    updatePlayerNames(names);
    gameStatusDisplay.textContent = 'Both players are ready!';
    
    // Auto-start game mode based on selection
    if (currentGameMode === 'would-you-rather') {
        console.log('Starting Would You Rather mode');
        socket.emit('start would you rather', roomName);
    } else if (currentGameMode === 'story-building') {
        console.log('Starting Story Building mode');
        socket.emit('start story building', roomName);
    } else if (currentGameMode === 'assumption-buster') {
        console.log('Starting Assumption Buster mode');
        socket.emit('start assumption buster', roomName);
    }
    // Default to Two Truths and a Lie if no specific mode or 'two-truths' selected
});

socket.on('player left', (playerNum) => {
    console.log('Player left:', playerNum);
    gameStatusDisplay.textContent = `Player ${playerNum} left the game. Waiting for new player...`;
    topicSelectionArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    guessArea.classList.add('hidden');
    currentTopicDiv.classList.add('hidden');
    opponentTopicDiv.classList.add('hidden');
    nextRoundBtn.classList.add('hidden');
});

// Handle room full error
socket.on('room full', () => {
    console.log('Room is full');
    alert('This room is full! Only 2 players can join a room. You can:\n\n1. Try joining as a viewer to watch the game\n2. Create a new room with a different name\n3. Wait for a player to leave');
    
    // Re-enable join buttons
    const joinRoomBtn = document.getElementById('join-room');
    const joinViewerBtn = document.getElementById('join-viewer');
    
    if (joinRoomBtn) {
        joinRoomBtn.disabled = false;
        joinRoomBtn.textContent = translations[currentLanguage].joinRoom || 'Join Room';
    }
    
    if (joinViewerBtn) {
        joinViewerBtn.disabled = false;
        joinViewerBtn.textContent = translations[currentLanguage].joinViewer || 'Join as Viewer';
    }
});

// Utility functions
function addDesktopEnhancements() {
    // Add tooltips to buttons and interactive elements
    const elementsWithTooltips = [
        { selector: '#join-room', tooltip: 'Press Enter to join quickly' },
        { selector: '#join-viewer', tooltip: 'Watch the game' },
        { selector: '.exit-btn', tooltip: 'Leave the current game' },
        { selector: '.see-topic-btn', tooltip: 'Get inspiration for your statements' },
        { selector: '.hide-help-btn', tooltip: 'Close topic suggestions' },
        { selector: '#lang-en', tooltip: 'Switch to English' },
        { selector: '#lang-vi', tooltip: 'Chuyển sang Tiếng Việt' }
    ];
    
    elementsWithTooltips.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.classList.add('tooltip');
            element.setAttribute('data-tooltip', item.tooltip);
        }
    });
    
    // Add status indicators
    const statusDisplay = document.getElementById('game-status');
    if (statusDisplay) {
        statusDisplay.innerHTML += '<span class="status-indicator waiting"></span>';
    }
    
    // Enhanced visual feedback for form validation
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error', 'success');
            if (this.value.trim()) {
                this.classList.add('success');
            }
        });
    });
}

function updateStatusIndicator(status) {
    const indicator = document.querySelector('.status-indicator');
    if (indicator) {
        indicator.className = 'status-indicator';
        
        if (status.includes('waiting') || status.includes('Waiting')) {
            indicator.classList.add('waiting');
        } else if (status.includes('selecting') || status.includes('creating') || status.includes('making')) {
            indicator.classList.add('thinking');
        } else if (status.includes('Started') || status.includes('turn')) {
            indicator.classList.add('active');
        } else {
            indicator.classList.add('waiting');
        }
    }
}

function handleKeyboardNavigation(e) {
    // Enter key to join room
    if (e.key === 'Enter' && !welcomeScreen.classList.contains('hidden')) {
        const joinBtn = document.getElementById('join-room');
        if (joinBtn && !joinBtn.disabled) {
            joinBtn.click();
        }
    }
    
    // ESC key to exit/close modals
    if (e.key === 'Escape') {
        // Close side menu if open
        if (sideMenu.classList.contains('open')) {
            closeSideMenu();
        }
        // Close topic help if open
        else if (!topicHelp.classList.contains('hidden')) {
            hideTopicHelpBtn.click();
        }
        // Close topic suggestions if open
        else if (!topicSuggestions.classList.contains('hidden')) {
            topicSuggestions.classList.add('hidden');
            highlightedTopic = null;
            updateTopicCards();
        }
    }
    
    // Number keys for quick statement selection during guessing
    if (!guessArea.classList.contains('hidden')) {
        if (e.key >= '1' && e.key <= '3') {
            const buttonIndex = parseInt(e.key) - 1;
            const buttons = [statementBtn1, statementBtn2, statementBtn3];
            if (buttons[buttonIndex]) {
                buttons[buttonIndex].click();
            }
        }
    }
    
    // Arrow keys for topic navigation (desktop only)
    if (window.innerWidth >= 768 && !topicSelectionArea.classList.contains('hidden')) {
        const topicCards = document.querySelectorAll('.topic-card');
        const focusedCard = document.activeElement;
        
        if (topicCards.length > 0 && e.key.startsWith('Arrow')) {
            e.preventDefault();
            let currentIndex = Array.from(topicCards).indexOf(focusedCard);
            
            if (currentIndex === -1) {
                // No card focused, focus first one
                topicCards[0].focus();
                return;
            }
            
            let newIndex = currentIndex;
            const cols = window.innerWidth >= 1400 ? 4 : window.innerWidth >= 992 ? 3 : 2;
            
            switch (e.key) {
                case 'ArrowLeft':
                    newIndex = currentIndex > 0 ? currentIndex - 1 : topicCards.length - 1;
                    break;
                case 'ArrowRight':
                    newIndex = currentIndex < topicCards.length - 1 ? currentIndex + 1 : 0;
                    break;
                case 'ArrowUp':
                    newIndex = currentIndex - cols;
                    if (newIndex < 0) newIndex = currentIndex + (Math.ceil(topicCards.length / cols) - 1) * cols;
                    if (newIndex >= topicCards.length) newIndex = topicCards.length - 1;
                    break;
                case 'ArrowDown':
                    newIndex = currentIndex + cols;
                    if (newIndex >= topicCards.length) newIndex = currentIndex - (Math.ceil(topicCards.length / cols) - 1) * cols;
                    if (newIndex < 0) newIndex = 0;
                    break;
            }
            
            if (newIndex !== currentIndex && topicCards[newIndex]) {
                topicCards[newIndex].focus();
            }
        }
    }
}

function updateScores() {
    if (player1Points && player2Points) {
        const prevScores = { 1: parseInt(player1Points.textContent) || 0, 2: parseInt(player2Points.textContent) || 0 };
        
        player1Points.textContent = scores[1];
        player2Points.textContent = scores[2];
        
        // Add score update animation if score changed
        if (prevScores[1] !== scores[1]) {
            player1Score.classList.add('score-updated');
            setTimeout(() => player1Score.classList.remove('score-updated'), 600);
        }
        if (prevScores[2] !== scores[2]) {
            player2Score.classList.add('score-updated');
            setTimeout(() => player2Score.classList.remove('score-updated'), 600);
        }
        
        // Update current player highlighting
        player1Score.classList.toggle('current-player', playerNumber === 1);
        player2Score.classList.toggle('current-player', playerNumber === 2);
    }
    
    // Keep the old scoreDisplay for backward compatibility if it exists
    if (scoreDisplay) {
        scoreDisplay.textContent = `Scores: ${playerNames[1] || 'Player 1'}: ${scores[1]} - ${playerNames[2] || 'Player 2'}: ${scores[2]}`;
    }
}

function updatePlayerNames(names) {
    playerNames = names;
    if (player1Name && player2Name) {
        player1Name.textContent = names[1] || 'Player 1';
        player2Name.textContent = names[2] || 'Player 2';
    }
}

// Exit game functionality
exitGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit the game?')) {
        location.reload();
    }
});

// Play again functionality
const playAgainBtn = document.getElementById('play-again');
const exitFinalBtn = document.getElementById('exit-final');

if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
        location.reload();
    });
}

if (exitFinalBtn) {
    exitFinalBtn.addEventListener('click', () => {
        location.reload();
    });
}

if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', showHistory);
}

if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
        historyScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        sessionDetail.classList.add('hidden');
        historyList.classList.remove('hidden');
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('gameHistory');
        renderHistory();
    });
}

if (backToHistoryBtn) {
    backToHistoryBtn.addEventListener('click', () => {
        sessionDetail.classList.add('hidden');
        historyList.classList.remove('hidden');
        clearHistoryBtn.classList.remove('hidden');
        backToMenuBtn.classList.remove('hidden');
    });
}

function showHistory() {
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    historyScreen.classList.remove('hidden');
    sessionDetail.classList.add('hidden');
    historyList.classList.remove('hidden');
    clearHistoryBtn.classList.remove('hidden');
    backToMenuBtn.classList.remove('hidden');
    renderHistory();
}

function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    if (history.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No history yet';
        historyList.appendChild(li);
        return;
    }
    history.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('history-item');

        const textSpan = document.createElement('span');
        const date = new Date(item.timestamp).toLocaleString();
        const p1 = item.players[1];
        const p2 = item.players[2];
        const winnerText = item.winner === 0 ? 'Tie' : `Winner: ${item.players[item.winner]}`;
        textSpan.textContent = `${date} - ${p1}: ${item.scores[1]} vs ${p2}: ${item.scores[2]} (${winnerText})`;
        const arrow = document.createElement('span');
        arrow.classList.add('detail-icon');
        arrow.innerHTML = '&#9654;';
        li.appendChild(textSpan);
        li.appendChild(arrow);

        li.addEventListener('click', () => showSessionDetails(item));
        historyList.appendChild(li);
    });
}

function showSessionDetails(item) {
    if (!detailList) return;
    historyList.classList.add('hidden');
    clearHistoryBtn.classList.add('hidden');
    backToMenuBtn.classList.add('hidden');
    sessionDetail.classList.remove('hidden');
    detailList.innerHTML = '';
    const scoreLine = document.createElement('li');
    scoreLine.textContent = `Final Score: ${item.players[1]} ${item.scores[1]} - ${item.players[2]} ${item.scores[2]}`;
    detailList.appendChild(scoreLine);
    item.rounds.forEach(r => {
        const li = document.createElement('li');
        const statementsText = r.statements.map((s, i) => `${i + 1}. ${s}${i === r.truthIndex ? ' (True)' : ''}`).join(' | ');
        li.textContent = `Round ${r.round} (${r.topic}) - ${statementsText}`;
        detailList.appendChild(li);
    });
}

// Custom topic approval handlers
socket.on('approve custom topic', (customTopic) => {
    const popup = document.getElementById('custom-topic-approval-popup');
    const titleEl = document.getElementById('preview-topic-title');
    const descEl = document.getElementById('preview-topic-description');
    const adultEl = document.getElementById('preview-topic-adult');
    const suggestionsEl = document.getElementById('preview-topic-suggestions');
    
    // Populate popup with custom topic details
    titleEl.textContent = customTopic.title;
    descEl.textContent = customTopic.description || 'No description provided';
    adultEl.textContent = customTopic.isAdult ? 'Yes' : 'No';
    
    suggestionsEl.innerHTML = '';
    customTopic.suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsEl.appendChild(li);
    });
    
    popup.classList.remove('hidden');
    
    // Handle approval/rejection
    document.getElementById('approve-custom-topic').onclick = () => {
        socket.emit('approve custom topic', roomName, customTopic);
        popup.classList.add('hidden');
    };
    
    document.getElementById('reject-custom-topic').onclick = () => {
        popup.classList.add('hidden');
        // Could emit a rejection event if needed
    };
});

socket.on('custom topic approved', (topicKey, customTopic) => {
    // Add the custom topic to our local topics for this session
    const currentTopics = getCurrentTopics();
    
    // Use the points value from the custom topic (already set by the form)
    
    // Add to current language topics
    currentTopics[topicKey] = customTopic;
    
    // Refresh topic grid to show the new custom topic
    if (!topicSelectionArea.classList.contains('hidden')) {
        createTopicGrid();
    }
    
    // Clear the custom topic form
    document.getElementById('custom-topic-name').value = '';
    document.getElementById('custom-topic-description').value = '';
    document.getElementById('custom-topic-suggestions').value = '';
    document.getElementById('custom-topic-adult').checked = false;
    
    // Show success message
    alert('Custom topic approved and added!');
});

// Modify the createTopicGrid function to include custom topics
function getCurrentTopicsWithCustom() {
    const baseTopics = getCurrentTopics();
    // Custom topics are already added to baseTopics by the approval handler
    return baseTopics;
}

// Radio button selection handling
document.addEventListener('change', (e) => {
    if (e.target.name === 'truth-selection') {
        selectedTruthIndex = parseInt(e.target.value);

        document.querySelectorAll('.statement-input-group').forEach(group => {
            group.classList.remove('lie-selected');
        });
        document.querySelectorAll('.radio-label').forEach(label => {
            label.classList.remove('checked');
        });

        const group = e.target.closest('.statement-input-group');
        if (group) {
            group.classList.add('lie-selected');
            const label = group.querySelector('.radio-label');
            if (label) label.classList.add('checked');
        }
    }
});

// Emoji Interaction System
let emojiPanelVisible = false;
const emojiPanel = document.getElementById('emoji-interaction');
const emojiToggle = document.getElementById('toggle-emoji-panel');
const emojiButtons = document.querySelectorAll('.emoji-btn');
const emojiMessages = document.getElementById('emoji-messages');

// Initialize emoji system when game starts
function initializeEmojiSystem() {
    if (!emojiPanel || !emojiToggle) return;
    
    // Show emoji panel when game starts
    emojiPanel.classList.remove('hidden');
    
    // Toggle panel visibility
    emojiToggle.addEventListener('click', () => {
        emojiPanelVisible = !emojiPanelVisible;
        const content = emojiPanel.querySelector('.emoji-content');
        if (content) {
            content.style.display = emojiPanelVisible ? 'block' : 'none';
        }
        emojiToggle.textContent = emojiPanelVisible ? '😀' : '😑';
    });
    
    // Set initial state
    const content = emojiPanel.querySelector('.emoji-content');
    if (content) {
        content.style.display = 'block';
        emojiPanelVisible = true;
    }
    
    // Add click handlers to emoji buttons
    emojiButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            if (emoji && roomName && playerName) {
                sendEmoji(emoji);
            }
        });
    });
}

// Send emoji to other player
function sendEmoji(emoji) {
    socket.emit('send emoji', {
        room: roomName,
        sender: playerName,
        senderNumber: playerNumber,
        emoji: emoji,
        timestamp: Date.now()
    });
    
    // Add to local message display
    displayEmojiMessage({
        sender: playerName,
        emoji: emoji,
        timestamp: Date.now(),
        isSent: true
    });
}

// Display emoji as animated popup
function displayEmojiMessage(message) {
    createEmojiPopup(message.emoji, message.sender, message.isSent);
}

// Create animated emoji popup
function createEmojiPopup(emoji, sender, isSent) {
    // Create popup container if it doesn't exist
    let popupContainer = document.getElementById('emoji-popup-container');
    if (!popupContainer) {
        popupContainer = document.createElement('div');
        popupContainer.id = 'emoji-popup-container';
        popupContainer.className = 'emoji-popup-container';
        document.body.appendChild(popupContainer);
    }
    
    // Create emoji popup element
    const emojiPopup = document.createElement('div');
    emojiPopup.className = 'emoji-popup pop-in';
    emojiPopup.textContent = emoji;
    
    // Add random positioning for variety
    const randomOffset = {
        x: (Math.random() - 0.5) * 100, // -50px to +50px
        y: (Math.random() - 0.5) * 100  // -50px to +50px
    };
    
    emojiPopup.style.left = `calc(50% + ${randomOffset.x}px)`;
    emojiPopup.style.top = `calc(50% + ${randomOffset.y}px)`;
    
    // Add different colors for sent vs received
    if (isSent) {
        emojiPopup.style.filter = 'drop-shadow(0 0 15px rgba(0, 123, 255, 0.6))';
    } else {
        emojiPopup.style.filter = 'drop-shadow(0 0 15px rgba(255, 193, 7, 0.6))';
    }
    
    popupContainer.appendChild(emojiPopup);
    
    // Show sender name briefly
    const senderLabel = document.createElement('div');
    senderLabel.className = 'emoji-sender-label';
    senderLabel.textContent = isSent ? 'You' : sender;
    senderLabel.style.cssText = `
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        font-weight: bold;
        color: ${isSent ? '#007bff' : '#ffc107'};
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        pointer-events: none;
        opacity: 0;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    emojiPopup.appendChild(senderLabel);
    
    // Add CSS for sender label animation if not exists
    if (!document.getElementById('emoji-sender-animation')) {
        const style = document.createElement('style');
        style.id = 'emoji-sender-animation';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // After popup animation, start float away animation
    setTimeout(() => {
        emojiPopup.classList.remove('pop-in');
        emojiPopup.classList.add('float-away');
    }, 800);
    
    // Remove popup after animation completes
    setTimeout(() => {
        if (emojiPopup.parentNode) {
            emojiPopup.remove();
        }
        
        // Clean up container if empty
        if (popupContainer.children.length === 0) {
            popupContainer.remove();
        }
    }, 1800);
    
    // Add screen shake effect for received emojis
    if (!isSent) {
        document.body.style.animation = 'screenShake 0.3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
        
        // Add screen shake CSS if not exists
        if (!document.getElementById('screen-shake-animation')) {
            const shakeStyle = document.createElement('style');
            shakeStyle.id = 'screen-shake-animation';
            shakeStyle.textContent = `
                @keyframes screenShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
            `;
            document.head.appendChild(shakeStyle);
        }
    }
}

// Socket listeners for Story Building Challenge
socket.on('story building started', (data) => {
    console.log('Story building started:', data);
    currentGameMode = 'story-building';
    showStoryBuildingUI();
    
    // Reset story state
    storyText = '';
    currentTurn = data.currentTurn;
    maxTurns = data.maxTurns;
    storyContributions = [];
    
    // Update UI
    const storyDisplay = document.getElementById('story-text-display');
    if (storyDisplay) storyDisplay.innerHTML = '';
    
    const turnIndicator = document.getElementById('story-turn-indicator');
    if (turnIndicator) {
        turnIndicator.textContent = `Turn ${data.currentTurn}/${data.maxTurns} - ${data.playerNames[data.currentPlayer]}'s turn`;
    }
    
    const randomElementDiv = document.getElementById('random-element-prompt');
    if (randomElementDiv) randomElementDiv.textContent = `Incorporate: ${data.randomElement}`;
    
    gameStatusDisplay.textContent = 'Story Building Mode Started!';
});

socket.on('story updated', (data) => {
    console.log('Story updated:', data);
    
    // Update local state
    storyText = data.storyText;
    currentTurn = data.currentTurn;
    storyContributions = data.contributions;
    
    // Update story display
    const storyDisplay = document.getElementById('story-text-display');
    if (storyDisplay) {
        storyDisplay.innerHTML = '';
        data.contributions.forEach(contribution => {
            const span = document.createElement('span');
            span.className = `story-contribution player-${contribution.player}`;
            span.textContent = contribution.text + ' ';
            storyDisplay.appendChild(span);
        });
        
        // Auto-scroll to bottom
        storyDisplay.scrollTop = storyDisplay.scrollHeight;
    }
    
    // Update turn indicator
    const turnIndicator = document.getElementById('story-turn-indicator');
    if (turnIndicator) {
        if (data.isComplete) {
            turnIndicator.textContent = 'Story Complete!';
        } else {
            turnIndicator.textContent = `Turn ${data.currentTurn}/${data.maxTurns} - Player ${data.currentPlayer}'s turn`;
        }
    }
    
    // Update random element
    const randomElementDiv = document.getElementById('random-element-prompt');
    if (randomElementDiv) randomElementDiv.textContent = `Incorporate: ${data.randomElement}`;
    
    // Disable input if story is complete
    if (data.isComplete) {
        const storyInput = document.getElementById('story-input');
        const submitStoryBtn = document.getElementById('submit-story-contribution');
        if (storyInput) storyInput.disabled = true;
        if (submitStoryBtn) submitStoryBtn.disabled = true;
    }
});

socket.on('story building complete', (summary) => {
    console.log('Story building complete:', summary);
    
    // Show completion message with stats
    const message = `Story building complete!\n\nFinal Story: "${summary.finalStory.substring(0, 100)}..."\n\nStats:\n- Total turns: ${summary.totalTurns}\n- Total words: ${summary.totalWords}\n- Average words per turn: ${summary.averageWordsPerTurn}\n- Duration: ${Math.round(summary.duration / 1000)} seconds`;
    
    alert(message);
    
    gameStatusDisplay.textContent = 'Story Building Complete!';
});

socket.on('story state', (data) => {
    console.log('Received story state:', data);
    
    // Update UI with current story state
    storyText = data.storyText;
    currentTurn = data.currentTurn;
    storyContributions = data.contributions;
    
    const storyDisplay = document.getElementById('story-text-display');
    if (storyDisplay) {
        storyDisplay.innerHTML = '';
        data.contributions.forEach(contribution => {
            const span = document.createElement('span');
            span.className = `story-contribution player-${contribution.player}`;
            span.textContent = contribution.text + ' ';
            storyDisplay.appendChild(span);
        });
    }
    
    const turnIndicator = document.getElementById('story-turn-indicator');
    if (turnIndicator) {
        turnIndicator.textContent = data.isComplete ? 'Story Complete!' : `Turn ${data.currentTurn}/${data.maxTurns} - Player ${data.currentPlayer}'s turn`;
    }
    
    const randomElementDiv = document.getElementById('random-element-prompt');
    if (randomElementDiv) randomElementDiv.textContent = `Incorporate: ${data.randomElement}`;
});

// Socket listeners for emoji system
socket.on('emoji received', (data) => {
    // Don't display our own emojis again
    if (data.senderNumber !== playerNumber) {
        displayEmojiMessage({
            sender: data.sender,
            emoji: data.emoji,
            timestamp: data.timestamp,
            isSent: false
        });
        
        // Show a brief notification if panel is collapsed
        if (!emojiPanelVisible && emojiToggle) {
            emojiToggle.style.animation = 'emojiPulse 0.5s ease';
            setTimeout(() => {
                if (emojiToggle) emojiToggle.style.animation = '';
            }, 500);
        }
    }
});

// Clear emoji messages when game ends
function clearEmojiMessages() {
    if (emojiMessages) {
        emojiMessages.innerHTML = '';
    }
}

// Hide emoji panel when not in game
function hideEmojiPanel() {
    if (emojiPanel) {
        emojiPanel.classList.add('hidden');
    }
}

// Would You Rather Functions
function showWouldYouRatherUI() {
    const wyrUI = document.getElementById('would-you-rather-area');
    if (wyrUI) wyrUI.classList.remove('hidden');
    resetWouldYouRatherGame();
}

function hideWouldYouRatherUI() {
    const wyrUI = document.getElementById('would-you-rather-area');
    if (wyrUI) wyrUI.classList.add('hidden');
}

function resetWouldYouRatherGame() {
    currentWYRQuestion = null;
    wyrPlayerChoices = {};
    wyrExplanations = {};
    wyrRound = 1;
    wyrTimeRemaining = 30;
    
    if (wyrQuestionTimer) {
        clearInterval(wyrQuestionTimer);
        wyrQuestionTimer = null;
    }
    
    // Reset UI elements
    const questionDisplay = document.getElementById('wyr-question-display');
    if (questionDisplay) questionDisplay.textContent = '';
    
    const progressDisplay = document.getElementById('wyr-progress');
    if (progressDisplay) progressDisplay.textContent = `Round ${wyrRound}/${maxWYRRounds}`;
    
    const timerDisplay = document.getElementById('wyr-timer');
    if (timerDisplay) timerDisplay.textContent = `${wyrTimeRemaining}s`;
    
    // Reset choice buttons
    const choiceA = document.getElementById('wyr-choice-a');
    const choiceB = document.getElementById('wyr-choice-b');
    if (choiceA) {
        choiceA.textContent = '';
        choiceA.classList.remove('selected', 'disabled');
    }
    if (choiceB) {
        choiceB.textContent = '';
        choiceB.classList.remove('selected', 'disabled');
    }
    
    // Reset explanation textarea
    const explanationTextarea = document.getElementById('wyr-explanation');
    if (explanationTextarea) {
        explanationTextarea.value = '';
        explanationTextarea.disabled = true;
    }
    
    // Reset submit button
    const submitBtn = document.getElementById('wyr-submit-choice');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Make Your Choice First';
    }
    
    // Hide results section
    const resultsSection = document.getElementById('wyr-results');
    if (resultsSection) resultsSection.classList.add('hidden');
}

function getCurrentWYRQuestions() {
    return currentLanguage === 'vi' ? wouldYouRatherQuestionsVi : wouldYouRatherQuestions;
}

function getRandomWYRQuestion(difficulty = 'easy') {
    const questions = getCurrentWYRQuestions();
    const questionSet = questions[difficulty] || questions.easy;
    return questionSet[Math.floor(Math.random() * questionSet.length)];
}

function displayWYRQuestion(question) {
    currentWYRQuestion = question;
    
    // Update question display
    const questionDisplay = document.getElementById('wyr-question-text');
    if (questionDisplay) questionDisplay.textContent = question.question;
    
    // Update choice buttons
    const choiceA = document.getElementById('wyr-choice-a');
    const choiceB = document.getElementById('wyr-choice-b');
    
    if (choiceA) {
        const choiceTextA = choiceA.querySelector('.choice-text');
        if (choiceTextA) choiceTextA.textContent = question.optionA;
        choiceA.classList.remove('selected', 'disabled');
    }
    if (choiceB) {
        const choiceTextB = choiceB.querySelector('.choice-text');
        if (choiceTextB) choiceTextB.textContent = question.optionB;
        choiceB.classList.remove('selected', 'disabled');
    }
    
    // Update category display
    const categoryDisplay = document.getElementById('wyr-category');
    if (categoryDisplay) categoryDisplay.textContent = question.category;
    
    // Reset and start timer
    startWYRTimer();
    
    // Enable choice buttons
    if (choiceA) choiceA.disabled = false;
    if (choiceB) choiceB.disabled = false;
    
    // Reset explanation area
    const explanationTextarea = document.getElementById('wyr-explanation-input');
    if (explanationTextarea) {
        explanationTextarea.value = '';
        explanationTextarea.disabled = true;
        explanationTextarea.placeholder = 'Select a choice first, then explain your reasoning...';
    }
    
    // Show explanation area
    const explanationArea = document.getElementById('wyr-explanation-area');
    if (explanationArea) explanationArea.classList.remove('hidden');
    
    // Reset submit button
    const submitBtn = document.getElementById('submit-wyr-explanation');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Make Your Choice First';
    }
}

function startWYRTimer() {
    wyrTimeRemaining = 30;
    const timerDisplay = document.getElementById('wyr-timer');
    const timerProgress = document.getElementById('wyr-timer-progress');
    
    if (wyrQuestionTimer) {
        clearInterval(wyrQuestionTimer);
    }
    
    wyrQuestionTimer = setInterval(() => {
        wyrTimeRemaining--;
        
        if (timerDisplay) {
            timerDisplay.textContent = `${wyrTimeRemaining}s`;
            
            // Change color as time runs out
            if (wyrTimeRemaining <= 5) {
                timerDisplay.style.color = '#e74c3c';
            } else if (wyrTimeRemaining <= 10) {
                timerDisplay.style.color = '#f39c12';
            } else {
                timerDisplay.style.color = '#27ae60';
            }
        }
        
        if (timerProgress) {
            const percentage = (wyrTimeRemaining / 30) * 100;
            timerProgress.style.width = `${percentage}%`;
        }
        
        if (wyrTimeRemaining <= 0) {
            clearInterval(wyrQuestionTimer);
            handleWYRTimeUp();
        }
    }, 1000);
}

function handleWYRTimeUp() {
    // Disable all interactions
    const choiceA = document.getElementById('wyr-choice-a');
    const choiceB = document.getElementById('wyr-choice-b');
    const explanationTextarea = document.getElementById('wyr-explanation-input');
    const submitBtn = document.getElementById('submit-wyr-explanation');
    
    if (choiceA) choiceA.disabled = true;
    if (choiceB) choiceB.disabled = true;
    if (explanationTextarea) explanationTextarea.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    
    // Show time up message
    const timerDisplay = document.getElementById('wyr-timer');
    if (timerDisplay) {
        timerDisplay.textContent = 'Time Up!';
        timerDisplay.style.color = '#e74c3c';
    }
    
    // Auto-submit or move to results
    setTimeout(() => {
        showWYRResults();
    }, 2000);
}

function selectWYRChoice(choice) {
    if (wyrTimeRemaining <= 0) return;
    
    const choiceA = document.getElementById('wyr-choice-a');
    const choiceB = document.getElementById('wyr-choice-b');
    const explanationTextarea = document.getElementById('wyr-explanation-input');
    const submitBtn = document.getElementById('submit-wyr-explanation');
    
    // Remove previous selection
    if (choiceA) choiceA.classList.remove('selected');
    if (choiceB) choiceB.classList.remove('selected');
    
    // Add selection to clicked choice
    if (choice === 'A' && choiceA) {
        choiceA.classList.add('selected');
        wyrPlayerChoices[playerNumber] = 'A';
    } else if (choice === 'B' && choiceB) {
        choiceB.classList.add('selected');
        wyrPlayerChoices[playerNumber] = 'B';
    }
    
    // Enable explanation textarea
    if (explanationTextarea) {
        explanationTextarea.disabled = false;
        explanationTextarea.placeholder = 'Explain why you chose this option...';
        explanationTextarea.focus();
    }
    
    // Enable submit button
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Choice & Explanation';
    }
    
    // Send choice to server for multiplayer sync
    if (roomName && !isViewer) {
        socket.emit('wyr choice made', roomName, playerNumber, choice);
    }
}

function submitWYRChoice() {
    const explanationTextarea = document.getElementById('wyr-explanation-input');
    const explanation = explanationTextarea ? explanationTextarea.value.trim() : '';
    
    if (!explanation) {
        alert('Please provide an explanation for your choice!');
        return;
    }
    
    wyrExplanations[playerNumber] = explanation;
    
    // Send to server
    if (roomName && !isViewer) {
        socket.emit('wyr explanation submitted', roomName, playerNumber, explanation);
    }
    
    // Disable submit button
    const submitBtn = document.getElementById('submit-wyr-explanation');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Waiting for other player...';
    }
    
    // Disable explanation textarea
    if (explanationTextarea) {
        explanationTextarea.disabled = true;
    }
}

function showWYRResults() {
    // Stop timer
    if (wyrQuestionTimer) {
        clearInterval(wyrQuestionTimer);
        wyrQuestionTimer = null;
    }
    
    // Hide main question area
    const questionArea = document.getElementById('wyr-question-area');
    if (questionArea) questionArea.style.display = 'none';
    
    // Show results section
    const resultsSection = document.getElementById('wyr-results');
    if (resultsSection) resultsSection.classList.remove('hidden');
    
    // Display results
    updateWYRResults();
}

function updateWYRResults() {
    const resultsGrid = document.getElementById('wyr-results-grid');
    if (!resultsGrid) return;
    
    resultsGrid.innerHTML = '';
    
    // Show results for each player
    Object.keys(playerNames).forEach(playerNum => {
        const playerChoice = wyrPlayerChoices[playerNum];
        const playerExplanation = wyrExplanations[playerNum] || 'No explanation provided';
        
        const resultCard = document.createElement('div');
        resultCard.className = 'wyr-player-result';
        
        const chosenOption = playerChoice === 'A' ? currentWYRQuestion.optionA : currentWYRQuestion.optionB;
        const choiceClass = playerChoice === 'A' ? 'choice-a' : 'choice-b';
        
        resultCard.innerHTML = `
            <div class="wyr-player-info">
                <h4>${playerNames[playerNum] || `Player ${playerNum}`}</h4>
                <div class="wyr-choice ${choiceClass}">
                    <strong>Choice:</strong> ${chosenOption || 'No choice made'}
                </div>
            </div>
            <div class="wyr-explanation">
                <strong>Explanation:</strong>
                <p>${playerExplanation}</p>
            </div>
        `;
        
        resultsGrid.appendChild(resultCard);
    });
    
    // Show statistics
    const statsDiv = document.getElementById('wyr-statistics');
    if (statsDiv) {
        const choiceACount = Object.values(wyrPlayerChoices).filter(choice => choice === 'A').length;
        const choiceBCount = Object.values(wyrPlayerChoices).filter(choice => choice === 'B').length;
        const total = choiceACount + choiceBCount;
        
        if (total > 0) {
            const choiceAPercentage = Math.round((choiceACount / total) * 100);
            const choiceBPercentage = Math.round((choiceBCount / total) * 100);
            
            statsDiv.innerHTML = `
                <h4>Results Breakdown:</h4>
                <div class="wyr-stats-bar">
                    <div class="wyr-stats-option choice-a" style="width: ${choiceAPercentage}%">
                        ${choiceAPercentage}% chose A
                    </div>
                    <div class="wyr-stats-option choice-b" style="width: ${choiceBPercentage}%">
                        ${choiceBPercentage}% chose B
                    </div>
                </div>
            `;
        }
    }
    
    // Show next round button or end game button
    const nextBtn = document.getElementById('wyr-next-round');
    if (nextBtn) {
        if (wyrRound < maxWYRRounds) {
            nextBtn.textContent = `Next Round (${wyrRound + 1}/${maxWYRRounds})`;
            nextBtn.onclick = startNextWYRRound;
        } else {
            nextBtn.textContent = 'End Game';
            nextBtn.onclick = endWYRGame;
        }
        nextBtn.style.display = 'block';
    }
}

function startNextWYRRound() {
    wyrRound++;
    
    // Reset for next round
    wyrPlayerChoices = {};
    wyrExplanations = {};
    
    // Update progress
    const progressDisplay = document.getElementById('wyr-progress');
    if (progressDisplay) progressDisplay.textContent = `Round ${wyrRound}/${maxWYRRounds}`;
    
    // Hide results and show question area
    const resultsSection = document.getElementById('wyr-results');
    if (resultsSection) resultsSection.classList.add('hidden');
    
    const questionArea = document.getElementById('wyr-question-area');
    if (questionArea) questionArea.style.display = 'block';
    
    // Get difficulty based on round
    let difficulty = 'easy';
    if (wyrRound > 3) difficulty = 'extreme';
    else if (wyrRound > 1) difficulty = 'moderate';
    
    // Start new question
    const question = getRandomWYRQuestion(difficulty);
    displayWYRQuestion(question);
    
    // Send to server for multiplayer sync
    if (roomName && !isViewer) {
        socket.emit('wyr next round', roomName, wyrRound, question);
    }
}

function endWYRGame() {
    // Show final results or return to main menu
    const message = `Would You Rather: Extreme Edition Complete!\n\n${maxWYRRounds} rounds of tough choices completed.\n\nThanks for playing!`;
    alert(message);
    
    // Could add scoring system here based on explanations, creativity, etc.
    
    // Return to main menu or show final screen
    location.reload();
}

// Assumption Buster Functions
function showAssumptionBusterUI() {
    const abUI = document.getElementById('assumption-buster-area');
    if (abUI) abUI.classList.remove('hidden');
    resetAssumptionBusterGame();
}

function hideAssumptionBusterUI() {
    const abUI = document.getElementById('assumption-buster-area');
    if (abUI) abUI.classList.add('hidden');
}

function resetAssumptionBusterGame() {
    abRound = 1;
    abPhase = 'making';
    abCurrentAssumption = null;
    abPlayerAssumptions = {};
    abPlayerResponses = {};
    abPlayerExplanations = {};
    abResults = {};
    
    // Reset UI elements
    const roundIndicator = document.getElementById('ab-round-indicator');
    if (roundIndicator) roundIndicator.textContent = `Round ${abRound}/${maxABRounds}`;
    
    const phaseIndicator = document.getElementById('ab-phase-indicator');
    if (phaseIndicator) phaseIndicator.textContent = 'Making Assumptions';
    
    // Reset assumption input
    const assumptionInput = document.getElementById('ab-assumption-input');
    if (assumptionInput) {
        assumptionInput.value = '';
        assumptionInput.disabled = false;
    }
    
    // Show making phase, hide others
    showABPhase('making');
}

function showABPhase(phase) {
    abPhase = phase;
    
    // Hide all phases first
    const phases = ['ab-make-assumption', 'ab-respond-assumption', 'ab-explanation-area', 'ab-results-area'];
    phases.forEach(phaseId => {
        const element = document.getElementById(phaseId);
        if (element) element.classList.add('hidden');
    });
    
    // Show current phase
    let currentPhaseId;
    switch (phase) {
        case 'making':
            currentPhaseId = 'ab-make-assumption';
            break;
        case 'responding':
            currentPhaseId = 'ab-respond-assumption';
            break;
        case 'explanation':
            currentPhaseId = 'ab-explanation-area';
            break;
        case 'results':
            currentPhaseId = 'ab-results-area';
            break;
    }
    
    if (currentPhaseId) {
        const element = document.getElementById(currentPhaseId);
        if (element) element.classList.remove('hidden');
    }
    
    // Update phase indicator
    const phaseIndicator = document.getElementById('ab-phase-indicator');
    if (phaseIndicator) {
        const phaseNames = {
            making: 'Making Assumptions',
            responding: 'Responding to Assumptions',
            explanation: 'Explaining Responses',
            results: 'Results'
        };
        phaseIndicator.textContent = phaseNames[phase] || phase;
    }
}

function useAssumptionTemplate(template) {
    const assumptionInput = document.getElementById('ab-assumption-input');
    if (assumptionInput) {
        assumptionInput.value = template;
        assumptionInput.focus();
        // Move cursor to end
        assumptionInput.setSelectionRange(template.length, template.length);
    }
}

function submitAssumption() {
    const assumptionInput = document.getElementById('ab-assumption-input');
    const assumption = assumptionInput ? assumptionInput.value.trim() : '';
    
    if (!assumption) {
        alert('Please enter an assumption!');
        return;
    }
    
    if (assumption.length < 10) {
        alert('Please make your assumption more detailed (at least 10 characters).');
        return;
    }
    
    // Store the assumption
    abPlayerAssumptions[playerNumber] = assumption;
    abCurrentAssumption = assumption;
    
    // Send to server for multiplayer sync
    if (roomName && !isViewer) {
        socket.emit('ab assumption submitted', roomName, playerNumber, assumption);
    }
    
    // Disable input and show waiting state
    assumptionInput.disabled = true;
    const submitBtn = document.getElementById('ab-submit-assumption');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Waiting for other player...';
    }
}

function displayAssumptionForResponse(assumption, fromPlayer) {
    const assumptionDisplay = document.getElementById('ab-assumption-display');
    if (assumptionDisplay) {
        assumptionDisplay.textContent = assumption;
    }
    
    const playerIndicator = document.getElementById('ab-assumption-from');
    if (playerIndicator) {
        playerIndicator.textContent = `${playerNames[fromPlayer] || `Player ${fromPlayer}`} assumes:`;
    }
    
    // Enable response buttons
    const trueBtn = document.getElementById('ab-response-true');
    const falseBtn = document.getElementById('ab-response-false');
    
    if (trueBtn) {
        trueBtn.disabled = false;
        trueBtn.classList.remove('selected');
    }
    if (falseBtn) {
        falseBtn.disabled = false;
        falseBtn.classList.remove('selected');
    }
    
    showABPhase('responding');
}

function selectABResponse(response) {
    const trueBtn = document.getElementById('ab-response-true');
    const falseBtn = document.getElementById('ab-response-false');
    
    // Remove previous selection
    if (trueBtn) trueBtn.classList.remove('selected');
    if (falseBtn) falseBtn.classList.remove('selected');
    
    // Add selection to clicked button
    if (response === 'true' && trueBtn) {
        trueBtn.classList.add('selected');
    } else if (response === 'false' && falseBtn) {
        falseBtn.classList.add('selected');
    }
    
    // Store response
    abPlayerResponses[playerNumber] = response;
    
    // Enable explanation area
    const explanationInput = document.getElementById('ab-explanation-input');
    if (explanationInput) {
        explanationInput.disabled = false;
        explanationInput.placeholder = 'Explain why this assumption is ' + (response === 'true' ? 'TRUE' : 'FALSE') + '...';
        explanationInput.focus();
    }
    
    // Enable submit button
    const submitBtn = document.getElementById('ab-submit-explanation');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Explanation';
    }
    
    // Send response to server
    if (roomName && !isViewer) {
        socket.emit('ab response made', roomName, playerNumber, response);
    }
    
    showABPhase('explanation');
}

function submitABExplanation() {
    const explanationInput = document.getElementById('ab-explanation-input');
    const explanation = explanationInput ? explanationInput.value.trim() : '';
    
    if (!explanation) {
        alert('Please provide an explanation for your response!');
        return;
    }
    
    if (explanation.length < 10) {
        alert('Please provide a more detailed explanation (at least 10 characters).');
        return;
    }
    
    // Store explanation
    abPlayerExplanations[playerNumber] = explanation;
    
    // Send to server
    if (roomName && !isViewer) {
        socket.emit('ab explanation submitted', roomName, playerNumber, explanation);
    }
    
    // Disable input and show waiting state
    explanationInput.disabled = true;
    const submitBtn = document.getElementById('ab-submit-explanation');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Waiting for other player...';
    }
}

function showABResults() {
    showABPhase('results');
    
    const resultsContainer = document.getElementById('ab-player-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    // Display results for each player
    Object.keys(playerNames).forEach(playerNum => {
        const assumption = abPlayerAssumptions[playerNum];
        const response = abPlayerResponses[playerNum];
        const explanation = abPlayerExplanations[playerNum];
        
        if (assumption || response) {
            const resultCard = document.createElement('div');
            resultCard.className = 'ab-player-result-card';
            
            resultCard.innerHTML = `
                <div class="ab-player-info">
                    <h4>${playerNames[playerNum] || `Player ${playerNum}`}</h4>
                </div>
                ${assumption ? `
                    <div class="ab-assumption-section">
                        <strong>Made assumption:</strong>
                        <p>"${assumption}"</p>
                    </div>
                ` : ''}
                ${response ? `
                    <div class="ab-response-section">
                        <strong>Response:</strong>
                        <span class="ab-response-indicator ${response}">${response.toUpperCase()}</span>
                    </div>
                    <div class="ab-explanation-section">
                        <strong>Explanation:</strong>
                        <p>${explanation || 'No explanation provided'}</p>
                    </div>
                ` : ''}
            `;
            
            resultsContainer.appendChild(resultCard);
        }
    });
    
    // Calculate and display surprise points
    calculateABSurprisePoints();
    
    // Show next round button
    const nextBtn = document.getElementById('ab-next-round');
    if (nextBtn && !isViewer) {
        if (abRound < maxABRounds) {
            nextBtn.textContent = `Next Round (${abRound + 1}/${maxABRounds})`;
            nextBtn.onclick = startNextABRound;
        } else {
            nextBtn.textContent = 'End Game';
            nextBtn.onclick = endABGame;
        }
        nextBtn.classList.remove('hidden');
    }
}

function calculateABSurprisePoints() {
    const surpriseScores = document.getElementById('ab-surprise-scores');
    if (!surpriseScores) return;
    
    let surpriseText = 'Surprise Points: ';
    let totalSurprises = 0;
    
    // Check each assumption for surprise factor
    Object.keys(abPlayerAssumptions).forEach(makerNum => {
        Object.keys(abPlayerResponses).forEach(responderNum => {
            if (makerNum !== responderNum) {
                const response = abPlayerResponses[responderNum];
                // If response was 'false', the assumption was surprising/wrong
                if (response === 'false') {
                    totalSurprises++;
                }
            }
        });
    });
    
    surpriseText += `${totalSurprises} unexpected responses this round!`;
    
    if (totalSurprises > 0) {
        surpriseText += ' 🎯';
    }
    
    surpriseScores.textContent = surpriseText;
}

function startNextABRound() {
    abRound++;
    
    // Reset for next round
    abPlayerAssumptions = {};
    abPlayerResponses = {};
    abPlayerExplanations = {};
    
    // Update round indicator
    const roundIndicator = document.getElementById('ab-round-indicator');
    if (roundIndicator) roundIndicator.textContent = `Round ${abRound}/${maxABRounds}`;
    
    // Send to server for multiplayer sync
    if (roomName && !isViewer) {
        socket.emit('ab next round', roomName, abRound);
    }
    
    // Reset to making phase
    resetAssumptionBusterGame();
}

function endABGame() {
    // Show final results
    const message = `Assumption Buster Complete!\n\n${maxABRounds} rounds of assumptions and revelations completed.\n\nThanks for learning more about each other!`;
    alert(message);
    
    // Return to main menu
    location.reload();
}

// Socket listeners for Would You Rather
socket.on('wyr game started', (data) => {
    console.log('Would You Rather game started:', data);
    currentGameMode = 'would-you-rather';
    showWouldYouRatherUI();
    
    // Reset state
    wyrRound = data.round || 1;
    maxWYRRounds = data.maxRounds || 5;
    currentWYRQuestion = data.question;
    wyrPlayerChoices = {};
    wyrExplanations = {};
    
    // Display the question
    if (currentWYRQuestion) {
        displayWYRQuestion(currentWYRQuestion);
    }
    
    gameStatusDisplay.textContent = 'Would You Rather: Extreme Edition Started!';
});

socket.on('wyr question', (question, round) => {
    console.log('Received WYR question:', question, round);
    wyrRound = round;
    currentWYRQuestion = question;
    
    // Update progress
    const progressDisplay = document.getElementById('wyr-progress');
    if (progressDisplay) progressDisplay.textContent = `Round ${wyrRound}/${maxWYRRounds}`;
    
    displayWYRQuestion(question);
});

socket.on('wyr player choice', (playerNum, choice) => {
    console.log(`Player ${playerNum} chose:`, choice);
    wyrPlayerChoices[playerNum] = choice;
    
    // Visual feedback for other players' choices (without revealing what they chose)
    if (playerNum !== playerNumber) {
        const statusDisplay = document.getElementById('wyr-other-player-status');
        if (statusDisplay) {
            statusDisplay.textContent = `${playerNames[playerNum] || `Player ${playerNum}`} has made their choice...`;
        }
    }
});

socket.on('wyr explanation received', (playerNum, explanation) => {
    console.log(`Player ${playerNum} explanation:`, explanation);
    wyrExplanations[playerNum] = explanation;
    
    // Check if all players have submitted
    const totalPlayers = Object.keys(playerNames).length;
    const submittedExplanations = Object.keys(wyrExplanations).length;
    
    if (submittedExplanations >= totalPlayers) {
        showWYRResults();
    }
});

socket.on('wyr round complete', (results) => {
    console.log('WYR round complete:', results);
    wyrPlayerChoices = results.choices || {};
    wyrExplanations = results.explanations || {};
    showWYRResults();
});

socket.on('wyr game complete', (finalResults) => {
    console.log('WYR game complete:', finalResults);
    
    // Show final game statistics
    const message = `Would You Rather: Extreme Edition Complete!\n\nGame Statistics:\n- Total rounds: ${finalResults.totalRounds}\n- Most popular choices: ${finalResults.stats?.mostPopular || 'N/A'}\n\nThanks for playing!`;
    
    alert(message);
    
    gameStatusDisplay.textContent = 'Would You Rather Game Complete!';
});

