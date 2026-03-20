const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = '1484506212132458567';
const SERVER_IP = '77.221.92.217:22005';

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updatePlayerCount();

  setInterval(updatePlayerCount, 60000);
});

async function updatePlayerCount() {
  try {
    const res = await fetch('https://cdn.rage.mp/master/');
    const json = await res.json();

    const data = json.servers; // ✅ FIXED

    if (!data) {
      console.log('❌ No server data returned');
      return;
    }

    const server = data.find(s => s.ip === SERVER_IP);

    if (!server) {
      console.log('❌ Server not found in RageMP list');
      return;
    }

    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log('❌ Channel not found');
      return;
    }

    const newName = `👥 Players: ${server.players}/${server.maxplayers}`;
    await channel.setName(newName);

    console.log(`✅ Updated: ${newName}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

client.login(process.env.TOKEN);
