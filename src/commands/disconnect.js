import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { logAction } from '../utils/logger.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Déconnecter du vocal')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.targetUser;
    const reason = 'Déconnexion depuis le menu contextuel';
    const member = await interaction.guild.members.fetch(user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.editReply(`${user.tag} n'est pas connecte a un salon vocal.`);
      return;
    }

    const botMember = await interaction.guild.members.fetchMe();

    if (!botMember.permissions.has(PermissionFlagsBits.MoveMembers)) {
      await interaction.editReply("Impossible de deconnecter cet utilisateur: le bot n'a pas la permission Deplacer des membres.");
      return;
    }

    try {
      await member.voice.disconnect(`${reason} | Par ${interaction.user.tag}`);
    } catch {
      await interaction.editReply("Impossible de deconnecter cet utilisateur. Verifie la hierarchie des roles et les permissions du bot.");
      return;
    }

    await logAction(
      interaction.guild,
      '\u{1F507} Deconnexion vocal',
      `${interaction.user} a deconnecte **${user.tag}** de **${voiceChannel.name}**.\nRaison: ${reason}`,
      0xf1c40f
    );

    await interaction.editReply(`${user.tag} a ete deconnecte de ${voiceChannel.name}. Raison: ${reason}`);
  }
};
