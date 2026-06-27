import 'dotenv/config';
import http from 'node:http';
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
import { ensureProtectedCategoryAccess, ensureVisitorAccessForPendingMembers } from './utils/setupManager.js';

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

if (process.env.PORT) {
  const startedAt = new Date();
  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }

    const payload = JSON.stringify({
      ok: true,
      service: 'joker',
      discord: client.isReady() ? 'ready' : 'starting',
      uptimeSeconds: Math.round(process.uptime()),
      startedAt: startedAt.toISOString()
    });

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    res.end(payload);
  });

  server.listen(Number(process.env.PORT), '0.0.0.0', () => {
    console.log(`Health check HTTP disponible sur le port ${process.env.PORT}`);
  });
}

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

  for (const guild of client.guilds.cache.values()) {
    await ensureProtectedCategoryAccess(guild).catch((error) => {
      console.error(`Impossible de restaurer les permissions protegees pour ${guild.name}: ${error.message}`);
    });
    await ensureVisitorAccessForPendingMembers(guild).catch((error) => {
      console.error(`Impossible de synchroniser le role visiteur pour ${guild.name}: ${error.message}`);
    });
  }

  console.log(`Connecte en tant que ${client.user.tag}`);
});

const commands = await loadCommands();
client.commands = commands;
console.log(`Commandes chargees: ${[...commands.keys()].sort().join(', ')}`);

const registrationMessage = await registerApplicationCommands(commands);
console.log(registrationMessage);

await loadEvents();
await client.login(process.env.DISCORD_TOKEN);
