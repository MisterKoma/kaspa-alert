# Kaspa Alert

Kaspa Alert is a Node.js application that monitors KRC20 tokens on the Kaspa network. It automatically sends a Telegram alert when a token reaches a mint rate between 30% and 40%. The application also provides an API to view the relevant tokens.

## Features

- Automatic monitoring of KRC20 tokens via the kasplex.org API.
- Sends Telegram alerts for tokens minted between 30% and 40%.
- Express server with `/tokens` endpoint to display monitored tokens.
- Simple configuration via `.env` file.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/votre-utilisateur/kaspa-alert-main.git
   cd kaspa-alert-main/kaspa-alert
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Telegram:**
   - Create a Telegram bot with [@BotFather](https://t.me/BotFather) and get the token.
   - Add the bot to your group or conversation.
   - Get the chat ID using [@userinfobot](https://t.me/userinfobot) or [@getidsbot](https://t.me/getidsbot).

4. **Create a `.env` file at the project root:**
   ```
   TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
   TELEGRAM_CHAT_ID=YOUR_CHAT_ID
   ```

## Usage

1. **Start the application:**
   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```

2. **How it works:**
   - The application queries the API every minute.
   - If a token is minted between 30% and 40%, a Telegram alert is sent (only once per token).
   - Monitored tokens are available at [http://localhost:3001/tokens](http://localhost:3001/tokens).

## API

- **GET `/tokens`**: Returns the list of tokens minted between 30% and 40%.

## Stop

To stop the application, press `Ctrl+C` in the terminal.

## Contact

For any questions, contact: [misterkoma@proton.me](mailto:misterkoma@proton.me)
