import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ms')
    .setDescription('Envoie un message avec Klown dans un salon.')
    .addChannelOption((option) =>
      option
        .setName('salon')
        .setDescription('Salon cible')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('texte')
        .setDescription('Message a envoyer')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel('salon', true);
    const text = interaction.options.getString('texte', true);

    await channel.send({
      content: text,
      allowedMentions: { parse: ['users', 'roles', 'everyone'] }
    });

    await interaction.deleteReply().catch(() => null);
  }
};
