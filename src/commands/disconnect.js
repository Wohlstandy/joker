import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Disconnect')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.targetUser;
    const member = await interaction.guild.members.fetch(user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.deleteReply().catch(() => null);
      return;
    }

    const botMember = await interaction.guild.members.fetchMe();

    if (!botMember.permissions.has(PermissionFlagsBits.MoveMembers)) {
      await interaction.deleteReply().catch(() => null);
      return;
    }

    const reason = `Disconnect via menu BetterDiscord | Par ${interaction.user.tag}`;

    try {
      await member.voice.disconnect(reason);
    } catch {
      await interaction.deleteReply().catch(() => null);
      return;
    }

    await interaction.deleteReply().catch(() => null);
  }
};
