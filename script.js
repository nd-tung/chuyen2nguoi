const socket = io();

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const historyScreen = document.getElementById('history-screen');

const playerNameInput = document.getElementById('player-name');
const roomNameInput = document.getElementById('room-name');
const joinRoomBtn = document.getElementById('join-room');
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

// Language elements
const langEnBtn = document.getElementById('lang-en');
const langViBtn = document.getElementById('lang-vi');
const themeToggleBtn = document.getElementById('theme-toggle');

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

// Initialize
function initializeApp() {
    console.log('DOM loaded, checking elements...');
    console.log('langEnBtn:', document.getElementById('lang-en'));
    console.log('langViBtn:', document.getElementById('lang-vi'));
    console.log('joinRoomBtn:', document.getElementById('join-room'));
    console.log('roomNameInput:', document.getElementById('room-name'));
    
    updateLanguageContent();
    
    console.log('Setting up event listeners...');
    
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
    
    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            console.log('English button clicked');
            switchLanguage('en');
        });
    }
    
    if (langViBtn) {
        langViBtn.addEventListener('click', () => {
            console.log('Vietnamese button clicked');
            switchLanguage('vi');
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            updateLanguageContent();
        });
    }
    
    // Join room button
    const joinRoomBtn = document.getElementById('join-room');
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
                joinRoomBtn.disabled = true;
                joinRoomBtn.textContent = 'Joining...';
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

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

        // Recreate topic grid with new language
        if (topicGrid) {
            createTopicGrid();
        }
        
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


// Confirm topics selection
confirmTopicsBtn.addEventListener('click', () => {
    console.log('Confirm topics clicked, selected topics:', selectedTopics); // Debug log
    console.log('Room name:', roomName); // Debug log
    if (selectedTopics.length >= 1) {
        if (!roomName) {
            console.error('Room name is not set!'); // Debug log
            alert('Room name error. Please refresh and try again.');
            return;
        }
        console.log('Sending topics selected event to server'); // Debug log
        socket.emit('topics selected', roomName, selectedTopics);
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
        socket.emit('guess made', roomName, index);
    });
});

// Next round
nextRoundBtn.addEventListener('click', () => {
    socket.emit('next round', roomName);
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
    
    // Hide all game areas initially
    topicSelectionArea.classList.add('hidden');
    inputArea.classList.add('hidden');
    guessArea.classList.add('hidden');
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
    
    if (gameOverNext) {
        nextRoundBtn.textContent = translations[currentLanguage].showResults || 'Show Results';
    } else if (roundOver) {
        nextRoundBtn.textContent = translations[currentLanguage].nextRound || 'Next Round';
    } else {
        nextRoundBtn.textContent = translations[currentLanguage].nextTurn || 'Next Turn';
    }
    nextRoundBtn.classList.remove('hidden');
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

// Utility functions
function addDesktopEnhancements() {
    // Add tooltips to buttons and interactive elements
    const elementsWithTooltips = [
        { selector: '#join-room', tooltip: 'Press Enter to join quickly' },
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
        // Close topic help if open
        if (!topicHelp.classList.contains('hidden')) {
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

