const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = '1484316636780564600';
const SERVER_IP = '179.61.132.132:22005';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updatePlayerCount();

  setInterval(updatePlayerCount, 60000);
});

async function updatePlayerCount() {
  try {
    const res = await fetch('https://api.rage.mp/servers');
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