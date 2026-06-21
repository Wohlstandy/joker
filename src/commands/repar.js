import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { logEmbed } from '../utils/logger.js';
import { repairAccess } from '../utils/setupManager.js';

function formatSummary(summary) {
  return [
    `Rôles synchronisés : ${summary.roles}`,
    `Sauvegardes vérifiées : ${summary.restored.checked}`,
    `Rôles restaurés : ${summary.restored.restored}`,
    `Restaurations ignorées : ${summary.restored.skipped}`,
    `Erreurs restauration : ${summary.restored.failed}`,
    `Visiteurs ajoutés : ${summary.visitors.granted}`,
    `Visiteurs ignorés : ${summary.visitors.skipped}`,
    `Erreurs visiteurs : ${summary.visitors.failed}`
  ].join('\n');
}

function buildRepairLogEmbed(interaction, summary) {
  const hasError = summary.restored.failed > 0 || summary.visitors.failed > 0;

  return new EmbedBuilder()
    .setColor(hasError ? 0xe67e22 : 0x2ecc71)
    .setTitle(hasError ? 'Réparation terminée avec erreur' : 'Réparation terminée')
    .setDescription(`Commande lancée par ${interaction.user}`)
    .addFields(
      {
        name: 'Rôles',
        value: `Synchronisés : **${summary.roles}**`,
        inline: true
      },
      {
        name: 'Sauvegarde',
        value: [
          `Vérifiés : **${summary.restored.checked}**`,
          `Restaurés : **${summary.restored.restored}**`,
          `Ignorés : **${summary.restored.skipped}**`,
          `Erreurs : **${summary.restored.failed}**`
        ].join('\n'),
        inline: true
      },
      {
        name: 'Visiteurs',
        value: [
          `Vérifiés : **${summary.visitors.checked}**`,
          `Ajoutés : **${summary.visitors.granted}**`,
          `Ignorés : **${summary.visitors.skipped}**`,
          `Erreurs : **${summary.visitors.failed}**`
        ].join('\n'),
        inline: true
      },
      {
        name: 'Statut',
        value: hasError
          ? 'Des erreurs ont été rencontrées. Vérifie les permissions et la hiérarchie du bot.'
          : 'Tout est à jour.',
        inline: false
      }
    )
    .setTimestamp();
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

    await logEmbed(interaction.guild, buildRepairLogEmbed(interaction, summary));

    await interaction.editReply(`Réparation terminée.\n\`\`\`\n${message}\n\`\`\``);
  }
};
