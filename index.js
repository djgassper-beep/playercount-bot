const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = '1484506212132458567';
const SERVER_IP = '77.221.92.217:22005';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updatePlayerCount();

  setInterval(updatePlayerCount, 60000);
});

async function updatePlayerCount() {
  try {
    const res = await fetch('https://cdn.rage.mp/master/');
    const data = await res.json();

    const server = data.find(s => s.ip === SERVER_IP);

    if (!server) {
      console.log('Server not found');
      return;
    }

    const channel = await client.channels.fetch(CHANNEL_ID);

    await channel.setName(`👥 Players: ${server.players}/${server.maxplayers}`);
    console.log(`Updated: ${server.players}/${server.maxplayers}`);
  } catch (err) {
    console.error(err);
  }
}

client.login(process.env.TOKEN);
