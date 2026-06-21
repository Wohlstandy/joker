import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { logEmbed } from '../utils/logger.js';
import { repairAccess } from '../utils/setupManager.js';

function formatSummary(summary) {
  return [
    `R\u00f4les synchronis\u00e9s : ${summary.roles}`,
    `Sauvegardes v\u00e9rifi\u00e9es : ${summary.restored.checked}`,
    `R\u00f4les restaur\u00e9s : ${summary.restored.restored}`,
    `Restaurations ignor\u00e9es : ${summary.restored.skipped}`,
    `Erreurs restauration : ${summary.restored.failed}`,
    `Visiteurs ajout\u00e9s : ${summary.visitors.granted}`,
    `Visiteurs ignor\u00e9s : ${summary.visitors.skipped}`,
    `Erreurs visiteurs : ${summary.visitors.failed}`
  ].join('\n');
}

export function buildRepairLogEmbed(interaction, summary) {
  const hasError = summary.restored.failed > 0 || summary.visitors.failed > 0;
  const restoredSomething = summary.restored.restored > 0 || summary.visitors.granted > 0;
  const untouchedSaved = Math.max(0, summary.restored.checked - summary.restored.restored - summary.restored.failed);
  const untouchedVisitors = Math.max(0, summary.visitors.checked - summary.visitors.granted - summary.visitors.failed);
  const title = hasError
    ? '\u26a0\ufe0f R\u00e9paration \u00e0 v\u00e9rifier'
    : restoredSomething
      ? '\u{1f527} R\u00e9paration effectu\u00e9e'
      : '\u2705 Aucune r\u00e9paration n\u00e9cessaire';
  const color = hasError ? 0xe67e22 : restoredSomething ? 0x3498db : 0x2ecc71;
  const status = hasError
    ? 'Le bot a termin\u00e9, mais au moins une action a \u00e9chou\u00e9.'
    : restoredSomething
      ? 'Le bot a corrig\u00e9 les acc\u00e8s manquants.'
      : 'Tout \u00e9tait d\u00e9j\u00e0 correct.';

  const fields = [
    {
      name: '\u{1f4cc} R\u00e9sum\u00e9',
      value: [
        status,
        `Commande lanc\u00e9e par ${interaction.user}`
      ].join('\n'),
      inline: false
    },
    {
      name: '\u{1f3ad} R\u00f4les du setup',
      value: `${summary.roles} r\u00f4les v\u00e9rifi\u00e9s et resynchronis\u00e9s.`,
      inline: false
    },
    {
      name: '\u{1f4be} Acc\u00e8s sauvegard\u00e9s',
      value: summary.restored.checked > 0
        ? (
          restoredSomething || hasError
            ? [
              `${summary.restored.checked} utilisateur(s) dans la sauvegarde.`,
              `${summary.restored.restored} r\u00f4le(s) restaur\u00e9(s).`,
              `${untouchedSaved} d\u00e9j\u00e0 correct(s) ou non concern\u00e9(s).`,
              `${summary.restored.failed} erreur(s).`
            ].join('\n')
            : `${summary.restored.checked} utilisateur(s) sauvegard\u00e9(s), aucun r\u00f4le manquant.`
        )
        : 'Aucun utilisateur dans la sauvegarde.',
      inline: false
    },
    {
      name: '\u{1f6aa} Visiteurs',
      value: summary.visitors.granted > 0 || hasError
        ? [
          `${summary.visitors.checked} membre(s) v\u00e9rifi\u00e9(s).`,
          `${summary.visitors.granted} visiteur(s) ajout\u00e9(s).`,
          `${untouchedVisitors} d\u00e9j\u00e0 correct(s) ou non concern\u00e9(s).`,
          `${summary.visitors.failed} erreur(s).`
        ].join('\n')
        : `${summary.visitors.checked} membre(s) v\u00e9rifi\u00e9(s), aucun visiteur \u00e0 ajouter.`,
      inline: false
    }
  ];

  if (hasError) {
    fields.push({
      name: '\u{1f6e0}\ufe0f \u00c0 v\u00e9rifier',
      value: 'Place le r\u00f4le du bot au-dessus des r\u00f4les g\u00e9r\u00e9s et v\u00e9rifie la permission G\u00e9rer les r\u00f4les.',
      inline: false
    });
  }

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .addFields(fields)
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

    await interaction.editReply(`R\u00e9paration termin\u00e9e.\n\`\`\`\n${message}\n\`\`\``);
  }
};
