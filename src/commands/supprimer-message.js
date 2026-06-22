import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { isKlownOrKool } from '../utils/roleGuard.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Supprimer le message')
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!isKlownOrKool(interaction.member)) {
      await interaction.editReply('Commande reservee a The Klown et The Kool.');
      return;
    }

    await interaction.targetMessage.delete();
    await interaction.deleteReply().catch(() => null);
  }
};
