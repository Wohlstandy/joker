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
  return new EmbedBuilder()
    .setColor(summary.restored.failed || summary.visitors.failed ? 0xe67e22 : 0x2ecc71)
    .setTitle('🔧 Réparation des accès')
    .setDescription(
      [
        `${interaction.user} a lancé la commande **/repar**.`,
        '',
        'Cette commande remet le serveur dans un état propre sans supprimer les salons : elle synchronise les rôles, relit la sauvegarde des accès, restaure les rôles manquants et replace les nouveaux arrivants sans rôle dans le sas **Visiteur**.'
      ].join('\n')
    )
    .addFields(
      {
        name: 'Rôles du setup',
        value: [
          `**${summary.roles}** rôles suivis ont été vérifiés.`,
          'Les couleurs, permissions, affichage séparé et mentionabilité sont resynchronisés.'
        ].join('\n'),
        inline: false
      },
      {
        name: 'Sauvegarde des accès',
        value: [
          `Utilisateurs sauvegardés vérifiés : **${summary.restored.checked}**`,
          `Rôles restaurés : **${summary.restored.restored}**`,
          `Restaurations ignorées : **${summary.restored.skipped}**`,
          `Erreurs : **${summary.restored.failed}**`
        ].join('\n'),
        inline: true
      },
      {
        name: 'Sas Visiteur',
        value: [
          `Membres vérifiés : **${summary.visitors.checked}**`,
          `Visiteurs ajoutés : **${summary.visitors.granted}**`,
          `Déjà corrects ou non concernés : **${summary.visitors.skipped}**`,
          `Erreurs : **${summary.visitors.failed}**`
        ].join('\n'),
        inline: true
      },
      {
        name: 'Résultat',
        value: summary.restored.failed || summary.visitors.failed
          ? 'Réparation terminée avec au moins une erreur. Vérifie la hiérarchie des rôles du bot et ses permissions.'
          : 'Réparation terminée correctement. Les accès sauvegardés et les visiteurs sont à jour.',
        inline: false
      }
    )
    .setFooter({ text: 'Kool Klown Klanx • réparation automatique des accès' })
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
