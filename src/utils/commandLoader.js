import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Collection, REST, Routes } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands() {
  const commands = new Collection();
  const commandsPath = path.resolve(__dirname, '../commands');
  const files = (await readdir(commandsPath)).filter((file) => file.endsWith('.js'));

  for (const file of files) {
    const commandModule = await import(pathToFileURL(path.join(commandsPath, file)).href);
    const command = commandModule.default;

    if (!command?.data?.name || typeof command.execute !== 'function') {
      throw new Error(`Commande invalide: ${file}`);
    }

    commands.set(command.data.name, command);
  }

  return commands;
}

export async function registerApplicationCommands(commands) {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId) {
    throw new Error('DISCORD_TOKEN et CLIENT_ID sont requis pour enregistrer les commandes slash.');
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const body = commands.map((command) => command.data.toJSON());

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
    return `Commandes slash enregistrees pour le serveur ${guildId}.`;
  }

  await rest.put(Routes.applicationCommands(clientId), { body });
  return 'Commandes slash globales enregistrees.';
}
