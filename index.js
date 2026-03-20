const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔧 CONFIG (YOUR VALUES)
const CHANNEL_ID = '1484506212132458567';
const SERVER_IP = '179.61.132.132:22005';

client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  updatePlayerCount();
  setInterval(updatePlayerCount, 60000); // every 60 seconds
});

async function updatePlayerCount() {
  try {
    // 🔄 Fetch RageMP server list
    const res = await fetch('https://cdn.rage.mp/master/');
    const json = await res.json();

    // ✅ Handle both possible formats (array or object)
    const data = Array.isArray(json) ? json : json.servers;

    if (!data) {
      console.log('❌ No server data returned');
      return;
    }

    // 🔍 Find your server by IP
    const server = data.find(s => s.ip === SERVER_IP);

    if (!server) {
      console.log('❌ Server not found in RageMP list');
      return;
    }

    // 📡 Fetch channel
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log('❌ Channel not found');
      return;
    }

    // 🔄 Update channel name
    const newName = `👥 Players: ${server.players}/${server.maxplayers}`;
    await channel.setName(newName);

    console.log(`✅ Updated player count: ${newName}`);
  } catch (error) {
    console.error('❌ Error updating player count:', error);
  }
}

// 🔐 Login
client.login(process.env.TOKEN);
