const express = require('express');
const cron = require('node-cron');
const { Telegraf } = require('telegraf');
const fs = require('fs');

// Read .env file if it exists
if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
  console.log('.env file loaded');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Configure these environment variables before launch
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TOKEN_HERE';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

let alertedTokens = new Set();
let tokensOver50 = [];

async function checkTokens() {
  try {
    console.log(`[${new Date().toISOString()}] Checking tokens...`);
    const res = await fetch('https://api.kasplex.org/v1/krc20/tokenlist');
    const data = await res.json();
    
    // Debug: display received data structure
    console.log('Data structure:', Object.keys(data));
    if (data.result && data.result.length > 0) {
      console.log('First token example:', JSON.stringify(data.result[0], null, 2));
    }
    
    tokensOver50 = [];
    
    // Try with data.result instead of data.tokens
    const tokens = data.result || data.tokens || [];
    console.log(`Number of tokens retrieved: ${tokens.length}`);
    
    for (const token of tokens) {
      const minted = Number(token.minted || 0);
      const max = Number(token.max || 0);
      const percentage = max > 0 ? (minted / max) : 0;
      
      // Debug: display some tokens to see their values
      if (tokens.indexOf(token) < 3) {
        console.log(`Debug token ${token.tick}: minted=${token.minted}, max=${token.max}, percentage=${(percentage * 100).toFixed(2)}%`);
      }
      
      // Alert only for tokens minted between 30% and 40%
      if (max > 0 && percentage >= 0.3 && percentage <= 0.4) {
        tokensOver50.push(token);
        console.log(`Token found (30-40%): ${token.tick} - ${(percentage * 100).toFixed(2)}%`);
        
        if (!alertedTokens.has(token.tick)) {
          console.log(`Attempting to send alert for: ${token.tick}`);
          try {
            const msg = `⚠️ Token "${token.tick}" minted at ${(percentage * 100).toFixed(2)}% (more than 30%)!`;
            await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, msg);
            alertedTokens.add(token.tick);
            console.log(`✅ Alert sent successfully for: ${token.tick}`);
          } catch (telegramError) {
            console.error(`❌ Telegram error for ${token.tick}:`, telegramError.message);
          }
        } else {
          console.log(`Alert already sent for: ${token.tick}`);
        }
      }
    }
    
    console.log(`Tokens minted between 30-40%: ${tokensOver50.length}`);
    console.log(`Already alerted tokens: ${alertedTokens.size}`);
  } catch (e) {
    console.error('Error retrieving tokens:', e);
  }
}

// Task scheduled every minute
cron.schedule('0 * * * * *', checkTokens);

// Initial startup
checkTokens();

app.get('/tokens', (req, res) => {
  res.json(tokensOver50);
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Telegram bot configured: ${TELEGRAM_BOT_TOKEN !== 'YOUR_TOKEN_HERE' ? 'YES' : 'NO'}`);
  console.log(`Chat ID configured: ${TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID_HERE' ? 'YES' : 'NO'}`);
  
  if (TELEGRAM_BOT_TOKEN === 'YOUR_TOKEN_HERE' || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
    console.log('\n⚠️  WARNING: Telegram environment variables are not configured!');
    console.log('Alerts will not be sent.');
    console.log('Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to receive alerts.');
    console.log('You can view tokens at: http://localhost:3001\n');
  }
});

/*
PROGRAM USAGE:

1. Install dependencies:
   Open a terminal in the project folder and run:
     npm install

2. Configure environment variables:
   - Create a Telegram bot with @BotFather and get the token.
   - Add the bot to your Telegram group or conversation.
   - Find the chat ID with @userinfobot or @getidsbot.
   
   RECOMMENDED METHOD - Create a .env file:
   Create a file named ".env" (no extension) at the project root with:
     TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRstuVWXyz
     TELEGRAM_CHAT_ID=123456789 dfg
   
   OR set variables in terminal BEFORE launching the program:
   On Windows (CMD):
     set TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRstuVWXyz
     set TELEGRAM_CHAT_ID=123456789
   
   On Windows (PowerShell):
     $env:TELEGRAM_BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
     $env:TELEGRAM_CHAT_ID="123456789"

3. Launch the program:
     npm start
   or
     node index.js

4. Let the program run:
   - It queries the API every minute.
   - If a token is minted between 30% and 40%, an alert is sent on Telegram.

To stop the program, press Ctrl+C in the terminal.
*/
