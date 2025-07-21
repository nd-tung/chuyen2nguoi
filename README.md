# Two Truths and a Lie 🎯

A real-time multiplayer web-based game where players try to guess which of three statements about their opponent is true. Built with Node.js, Express, and Socket.IO for seamless real-time gameplay.

## 🎮 Game Overview

**Two Truths and a Lie** is a classic party game adapted for online play. Two players join a room and take turns creating three statements about themselves - two are lies and one is the truth. The opposing player must guess which statement is true to score points.

### Game Features

- 🌐 **Real-time multiplayer** using WebSockets
- 🌍 **Bilingual support** (English & Vietnamese)  
- 🏆 **Flexible scoring system** with customizable rounds (3-10)
- 📱 **Responsive design** for desktop and mobile
- 🎨 **Clean, modern UI** with intuitive controls
- 🚪 **Room-based gameplay** - create or join game rooms
- 🎯 **Topic-driven gameplay** with 20 diverse categories
- 🔞 **Adult content options** for mature players (18+)
- 💡 **Suggested answers** to inspire creative statements
- 📊 **Real-time status updates** showing game phases
- 🔄 **Strategic topic selection** - players choose topics for opponents

## 🚀 Quick Start

### Prerequisites

- Node.js (version 12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nd-tung/chuyen2nguoi.git
   cd chuyen2nguoi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Development Mode

```bash
npm run dev
```

## 🎯 How to Play

1. **Setup Game**: Choose the number of rounds (3, 5, 7, or 10) and enter a room name
2. **Join Room**: Click "Join Room" and wait for a second player to join
3. **Topic Selection Phase**: 
   - Player 2 selects 3-5 topics from 20 available options for Player 1
   - Topics include both safe and 18+ adult content with suggested answers
   - Click on topics to see suggested responses before selecting
4. **Statement Creation Phase**: 
   - Player 1 creates 3 statements about the assigned topic
   - Mark which statement is TRUE by clicking the check icon
5. **Guessing Phase**: Player 2 tries to identify the true statement
6. **Role Reversal**: Player 1 now selects topics for Player 2
7. **Continue**: Play the selected number of rounds - each round has both players taking turns
8. **Win**: The player with the most correct guesses wins!

### 🎮 New Enhanced Features

- **📊 Customizable Rounds**: Choose 3, 5, 7, or 10 rounds
- **🎯 Topic-Based Gameplay**: 20 diverse topics including adult (18+) content  
- **💡 Suggested Answers**: Click topics to see example statements
- **🔄 Turn-Based Topic Selection**: Players alternate selecting topics for each other
- **📱 Real-Time Status Updates**: Always know what phase your opponent is in
- **🎭 Adult Content**: Mature topics for adult players (clearly marked)

## 🛠 Technical Architecture

### Backend (server.js)
- **Express.js** server for serving static files
- **Socket.IO** for real-time communication
- Room management system
- Game state tracking

### Frontend
- **Vanilla JavaScript** for game logic
- **Socket.IO Client** for real-time updates
- **Responsive CSS** for mobile-friendly design
- **Language switching** functionality

### Key Technologies
- **Node.js** - Server runtime
- **Express** - Web framework
- **Socket.IO** - Real-time communication
- **HTML5/CSS3** - Modern web standards
- **JavaScript ES6+** - Client-side logic

## 📁 Project Structure

```
chuyen2nguoi/
├── index.html          # Main game interface
├── style.css          # Styling and responsive design
├── script.js          # Client-side game logic
├── server.js          # Node.js server and Socket.IO handlers
├── package.json       # Dependencies and scripts
├── vercel.json        # Vercel deployment configuration
└── README.md          # Project documentation
```

## 🌐 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Fork/Clone** the repository
2. **Connect to Vercel** via GitHub integration
3. **Deploy** - Vercel will automatically detect the Node.js project

### Manual Deployment

For other platforms:

```bash
# Set the PORT environment variable
export PORT=8080

# Start the production server
npm start
```

## 🎨 Game Features Breakdown

### Real-time Communication
- Instant room creation and joining
- Live statement sharing
- Real-time guess validation
- Synchronized scoring

### User Experience
- **Bilingual Interface**: Switch between English and Vietnamese
- **Visual Feedback**: Clear indication of game states
- **Score Tracking**: Running score display throughout the game
- **Responsive Design**: Works on desktop and mobile devices

### Game Flow
1. **Setup Phase**: Players choose game settings and join room
2. **Topic Selection Phase**: 
   - Current topic selector chooses 3-5 topics from 20 options
   - Topics range from safe (childhood, hobbies) to adult (dating, secrets)
   - Click topics to view suggested example statements
3. **Statement Creation Phase**: 
   - Current player creates statements based on assigned topic
   - Must mark which statement is the truth
4. **Guessing Phase**: Opponent tries to identify the true statement
5. **Results Phase**: Show correct answers and update scores
6. **Role Switch**: Players swap roles for next turn
7. **Round Completion**: Continue until all selected rounds are finished

### 🎲 Available Topics

**Safe Topics (All Ages):**
- Childhood Memories, School Days, Travel Adventures
- Food & Cooking, Pets & Animals, Hobbies & Interests  
- Work & Career, Fears & Phobias, Hidden Talents
- Embarrassing Moments, Family Stories

**Adult Topics (18+):**
- Dating & Relationships, Party & Nightlife
- Deep Dark Secrets, Adult Embarrassing Moments
- Wild Life Experiences, Personal Confessions
- Money & Secrets, Guilty Pleasures

Each topic includes suggested example statements to inspire creativity!

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 8080)

### Customization Options

- **Round Count**: Modify the number of rounds in `script.js`
- **Styling**: Update `style.css` for different themes
- **Languages**: Extend language support in the language object

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues & Roadmap

### Known Issues
- Players leaving mid-game may require room refresh
- Adult content is clearly marked but requires player discretion

### Future Enhancements
- [ ] Add user authentication and age verification
- [ ] Implement persistent game statistics and leaderboards
- [ ] Add more game modes (3+ players, team play)
- [ ] Include sound effects and animations
- [ ] Add in-game chat functionality
- [ ] Implement automatic reconnection logic
- [ ] Custom topic creation by players
- [ ] Tournament mode with brackets
- [ ] AI opponent for solo practice

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the existing [Issues](https://github.com/nd-tung/chuyen2nguoi/issues)
2. **Create** a new issue with detailed description
3. **Contact** the maintainer: [@nd-tung](https://github.com/nd-tung)

## 🎉 Acknowledgments

- Inspired by the classic party game "Two Truths and a Lie"
- Built with modern web technologies for seamless online play
- Designed for cross-cultural gaming with bilingual support

---

**Ready to play?** [Start a game now!](https://your-deployed-url.vercel.app)
