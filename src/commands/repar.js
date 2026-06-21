import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { logAction } from '../utils/logger.js';
import { repairAccess } from '../utils/setupManager.js';

function formatSummary(summary) {
  return [
    `Roles synchronises: ${summary.roles}`,
    `Sauvegardes verifiees: ${summary.restored.checked}`,
    `Roles restaures: ${summary.restored.restored}`,
    `Restaurations ignorees: ${summary.restored.skipped}`,
    `Erreurs restauration: ${summary.restored.failed}`,
    `Visiteurs ajoutes: ${summary.visitors.granted}`,
    `Visiteurs ignores: ${summary.visitors.skipped}`,
    `Erreurs visiteurs: ${summary.visitors.failed}`
  ].join('\n');
}

export default {
  data: new SlashCommandBuilder()
    .setName('repar')
    .setDescription('Repare les acces sauvegardes et remet les visiteurs manquants.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const summary = await repairAccess(interaction.guild);
    const message = formatSummary(summary);

    await logAction(
      interaction.guild,
      '\u{1F527} Reparation acces',
      `${interaction.user} a lance /repar.\n\n${message}`
    );

    await interaction.editReply(`Reparation terminee.\n\`\`\`\n${message}\n\`\`\``);
  }
};
