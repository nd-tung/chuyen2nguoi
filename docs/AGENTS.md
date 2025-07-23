# Project Guide: Two Truths and a Lie

This repository hosts a browser-based adaptation of the party game "Two Truths and a Lie" implemented with Node.js, Express, and Socket.IO.

## Key Features
- Real-time multiplayer gameplay using WebSockets
- English and Vietnamese language support
- Room-based system so two players can compete privately
- Responsive interface designed for both desktop and mobile screens
- Customizable round count and optional 18+ topics

## Directory Overview
- `index.html` – main game interface
- `style.css` – styling and responsive layout
- `script.js` – client-side logic
- `server.js` – Node.js/Express server with Socket.IO
- `script-new.js` / `script-old.js` – alternative scripts used in development
- `package.json` – project metadata and start scripts

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Launch the game
   ```bash
   npm start
   ```
3. Open `http://localhost:8080` in a browser and share the room name with another player.

## Development Notes
- Node.js version 12 or higher is recommended.
- There are currently no automated tests; confirm changes manually by running the server.
- When contributing, keep commits focused and provide clear messages.

