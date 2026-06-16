import { ChannelType } from 'discord.js';
import { tempVoiceConfig } from '../config/serverConfig.js';

const temporaryVoiceChannelIds = new Set();

function buildTempChannelName(member) {
  const baseName = member.displayName || member.user.globalName || member.user.username;
  const cleanName = baseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24) || 'klown';

  return `${tempVoiceConfig.channelPrefix}-${cleanName}`;
}

function isTemporaryVoiceChannel(channel) {
  return channel?.type === ChannelType.GuildVoice &&
    (temporaryVoiceChannelIds.has(channel.id) || channel.name.startsWith(`${tempVoiceConfig.channelPrefix}-`));
}

async function cleanupTemporaryChannel(channel) {
  if (!isTemporaryVoiceChannel(channel) || channel.members.size > 0) {
    return;
  }

  temporaryVoiceChannelIds.delete(channel.id);
  await channel.delete('Salon vocal temporaire vide').catch(() => null);
}

export async function handleTemporaryVoiceState(oldState, newState) {
  await cleanupTemporaryChannel(oldState.channel);

  const joinedChannel = newState.channel;
  if (!joinedChannel || joinedChannel.name !== tempVoiceConfig.triggerChannelName) {
    return;
  }

  const createdChannel = await newState.guild.channels.create({
    name: buildTempChannelName(newState.member),
    type: ChannelType.GuildVoice,
    parent: joinedChannel.parentId ?? undefined,
    permissionOverwrites: joinedChannel.permissionOverwrites.cache.map((overwrite) => ({
      id: overwrite.id,
      allow: overwrite.allow.bitfield,
      deny: overwrite.deny.bitfield
    })),
    reason: 'Creation salon vocal temporaire'
  });

  temporaryVoiceChannelIds.add(createdChannel.id);
  await newState.setChannel(createdChannel, 'Deplacement vers salon vocal temporaire').catch(() => null);
}
