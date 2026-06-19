import { SlashCommandBuilder } from 'discord.js';
import { isKlownOrKool } from '../utils/roleGuard.js';

export default {
  data: new SlashCommandBuilder()
    .setName('del')
    .setDescription('Supprime un message par ID.')
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('ID du message')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!isKlownOrKool(interaction.member)) {
      await interaction.editReply('Commande réservée à The Klown et The Kool.');
      return;
    }

    const id = interaction.options.getString('id', true);

    for (const channel of interaction.guild.channels.cache.filter((candidate) => candidate.isTextBased()).values()) {
      const message = await channel.messages.fetch(id).catch(() => null);
      if (message) {
        await message.delete();
        await interaction.deleteReply().catch(() => null);
        return;
      }
    }

    await interaction.editReply('Message introuvable.');
  }
};
