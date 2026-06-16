import 'dotenv/config';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials
} from 'discord.js';
import { loadCommands, registerApplicationCommands } from './utils/commandLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN est manquant. Copie .env.example vers .env puis ajoute le token du bot.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

async function loadEvents() {
  const eventsPath = path.resolve(__dirname, 'events');
  const files = (await readdir(eventsPath)).filter((file) => file.endsWith('.js'));

  for (const file of files) {
    const eventModule = await import(pathToFileURL(path.join(eventsPath, file)).href);
    const event = eventModule.default;

    if (!event?.name || typeof event.execute !== 'function') {
      throw new Error(`Evenement invalide: ${file}`);
    }

    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once('clientReady', async () => {
  client.user.setPresence({
    activities: [],
    status: 'online'
  });

  console.log(`Connecte en tant que ${client.user.tag}`);
});

const commands = await loadCommands();
client.commands = commands;

const registrationMessage = await registerApplicationCommands(commands);
console.log(registrationMessage);

await loadEvents();
await client.login(process.env.DISCORD_TOKEN);
