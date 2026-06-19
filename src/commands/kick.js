import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { logAction } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulse un utilisateur avec une raison et log automatique.')
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription('Utilisateur à expulser')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('raison')
        .setDescription("Raison de l'expulsion")
        .setMaxLength(300)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser('utilisateur', true);
    const reason = interaction.options.getString('raison', true);
    const member = await interaction.guild.members.fetch(user.id);

    if (!member.kickable) {
      await interaction.editReply("Impossible d'expulser cet utilisateur. Vérifie la hiérarchie des rôles du bot.");
      return;
    }

    await member.kick(`${reason} | Par ${interaction.user.tag}`);
    await logAction(
      interaction.guild,
      '\u{1F6AA} Kick',
      `${interaction.user} a expulsé **${user.tag}**.\nRaison: ${reason}`,
      0xe74c3c
    );

    await interaction.editReply(`${user.tag} a été expulsé. Raison: ${reason}`);
  }
};
