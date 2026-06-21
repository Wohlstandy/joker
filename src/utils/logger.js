import { EmbedBuilder } from 'discord.js';
import { logChannelName } from '../config/serverConfig.js';

export async function findLogChannel(guild) {
  return guild.channels.cache.find((channel) => channel.name === logChannelName && channel.isTextBased());
}

export async function logAction(guild, title, description, color = 0x2ecc71) {
  const channel = await findLogChannel(guild);
  if (!channel) {
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => null);
}

export async function logEmbed(guild, embed) {
  const channel = await findLogChannel(guild);
  if (!channel) {
    return;
  }

  await channel.send({ embeds: [embed] }).catch(() => null);
}
