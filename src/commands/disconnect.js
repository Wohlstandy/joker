import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { logAction } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription("Deconnecte un utilisateur d'un salon vocal.")
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription('Utilisateur a deconnecter')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('raison')
        .setDescription('Raison de la deconnexion')
        .setMaxLength(300)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser('utilisateur', true);
    const reason = interaction.options.getString('raison') ?? 'Aucune raison indiquee';
    const member = await interaction.guild.members.fetch(user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.editReply(`${user.tag} n'est pas connecte a un salon vocal.`);
      return;
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
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
