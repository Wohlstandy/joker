import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { runSetup } from '../utils/setupManager.js';
import { logAction } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure tout le serveur Kool Klown Klanx.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { roles, channels } = await runSetup(interaction.guild, { createMissing: true });
    await logAction(
      interaction.guild,
      '\u{1F6E0}\uFE0F Setup execute',
      `${interaction.user} a configure ${roles.size} roles suivis et ${Object.keys(channels).length} salons/categories.`
    );

    await interaction.deleteReply().catch(() => null);
  }
};
