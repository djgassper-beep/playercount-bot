const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const app = express();
app.use(express.json());

// CONFIG
const CHANNEL_ID = '1484568602450333726';
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Stores latest player count sent from your RageMP server
let currentPlayers = 0;
let maxPlayers = 50;

// Discord bot ready
client.once('clientReady', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Update once on startup
  await updateDiscordChannel();

  // Optional safety refresh every minute
  setInterval(updateDiscordChannel, 60000);
});

// Simple protected endpoint your RageMP server can call
app.post('/update-player-count', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { players, maxplayers } = req.body;

    if (typeof players !== 'number' || typeof maxplayers !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    currentPlayers = players;
    maxPlayers = maxplayers;

    await updateDiscordChannel();

    return res.json({ success: true });
  } catch (error) {
    console.error('❌ API update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function updateDiscordChannel() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log('❌ Channel not found');
      return;
    }

    const newName = `👥 Players: ${currentPlayers}/${maxPlayers}`;

    if (channel.name !== newName) {
      await channel.setName(newName);
      console.log(`✅ Updated channel to: ${newName}`);
    } else {
      console.log(`ℹ️ Channel already up to date: ${newName}`);
    }
  } catch (error) {
    console.error('❌ Discord update error:', error);
  }
}

// Health route for Railway
app.get('/', (req, res) => {
  res.send('Bot is running');
});

// Start web server
app.listen(PORT, () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});

// Login bot
client.login(process.env.TOKEN);
