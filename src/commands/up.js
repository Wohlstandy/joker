import { SlashCommandBuilder } from 'discord.js';

const healthUrl = 'https://kool-klown-klanx-discord-bot.onrender.com';

export default {
  data: new SlashCommandBuilder()
    .setName('up')
    .setDescription('Verifie que Klown est reveille.')
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const started = Date.now();
    const response = await fetch(healthUrl);
    const text = await response.text();
    const delay = Date.now() - started;

    await interaction.editReply(
      response.ok && text.trim() === 'ok'
        ? `Klown est up. ${delay}ms`
        : `Klown repond mal: ${response.status}`
    );
  }
};
