import { ChannelType, SlashCommandBuilder } from 'discord.js';
import { isKlownOrKool } from '../utils/roleGuard.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ms')
    .setDescription('Envoie un message avec Klown dans un salon.')
    .addStringOption((option) =>
      option
        .setName('texte')
        .setDescription('Message à envoyer')
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('salon')
        .setDescription('Salon cible')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    )
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!isKlownOrKool(interaction.member)) {
      await interaction.editReply('Commande réservée à The Klown et The Kool.');
      return;
    }

    const channel = interaction.options.getChannel('salon') ?? interaction.channel;
    const text = interaction.options.getString('texte', true);

    await channel.send({
      content: text,
      allowedMentions: { parse: ['users', 'roles', 'everyone'] }
    });

    await interaction.deleteReply().catch(() => null);
  }
};
