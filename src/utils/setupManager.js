import { ChannelType } from 'discord.js';
import {
  categoryDefinitions,
  klownAutoAccessSearchTerms,
  kweenAutoAccessSearchTerms,
  kweenAutoAccessUserIds,
  legacyRoleNames,
  memberRoleExcludedSearchTerms,
  roleDefinitions,
  roleNames,
  trackedChannelNames,
  trackedRoleNames
} from '../config/serverConfig.js';
import { buildPermissionOverwrites } from './permissions.js';

export const ACCEPT_RULES_CUSTOM_ID = 'accept_rules_ticket';
const defaultChannelNames = ['general', 'Général', 'général', 'Text Channels', 'Voice Channels'];

export async function ensureRoles(guild) {
  const roles = new Map(guild.roles.cache.map((role) => [role.name, role]));

  for (const definition of roleDefinitions) {
    const existing = roles.get(definition.name);
    if (existing) {
      await existing.edit({
        permissions: definition.permissions,
        hoist: definition.hoist,
        mentionable: true,
        reason: 'Synchronisation setup Kool Klown Klanx'
      });
      roles.set(definition.name, existing);
      continue;
    }

    const created = await guild.roles.create({
      name: definition.name,
      colors: { primaryColor: definition.color },
      permissions: definition.permissions,
      hoist: definition.hoist,
      mentionable: true,
      reason: 'Creation setup Kool Klown Klanx'
    });
    roles.set(definition.name, created);
  }

  await ensureRoleOrder(roles);
  await removeLegacyRoles(guild);

  return roles;
}

async function removeLegacyRoles(guild) {
  for (const roleName of legacyRoleNames) {
    const roles = guild.roles.cache.filter((role) => role.name === roleName && !role.managed);
    for (const role of roles.values()) {
      if (role.members.size > 0) {
        continue;
      }

      await role.delete('Nettoyage ancien role').catch(() => null);
    }
  }
}

async function ensureRoleOrder(roles) {
  const koolRole = roles.get(roleNames.kool);
  const queenRole = roles.get(roleNames.queen);
  const klownRole = roles.get(roleNames.klown);

  const basePosition = Math.max(
    koolRole?.position ?? 0,
    queenRole?.position ?? 0,
    klownRole?.position ?? 0
  );

  if (klownRole) {
    await klownRole.setPosition(basePosition).catch(() => null);
  }
  if (queenRole) {
    await queenRole.setPosition(Math.max(basePosition - 1, 1)).catch(() => null);
  }
  if (koolRole) {
    await koolRole.setPosition(Math.max(basePosition - 2, 1)).catch(() => null);
  }
}

export async function ensureChannels(guild, roles, options = {}) {
  const created = {};
  const { createMissing = false } = options;

  for (const categoryDefinition of categoryDefinitions) {
    let category = guild.channels.cache.find(
      (channel) => channel.name === categoryDefinition.name && channel.type === ChannelType.GuildCategory
    );

    const permissionOverwrites = buildPermissionOverwrites(guild, roles, categoryDefinition.access);

    if (!category) {
      if (!createMissing) {
        continue;
      }

      category = await guild.channels.create({
        name: categoryDefinition.name,
        type: categoryDefinition.type,
        permissionOverwrites,
        reason: 'Creation setup Kool Klown Klanx'
      });
    } else if (!categoryDefinition.preserveExisting) {
      await category.permissionOverwrites.set(permissionOverwrites);
    }

    created[categoryDefinition.key] = category;

    for (const channelDefinition of categoryDefinition.children) {
      let channel = guild.channels.cache.find(
        (candidate) =>
          candidate.name === channelDefinition.name &&
          candidate.parentId === category.id &&
          candidate.type === channelDefinition.type
      );

      const childPermissionOverwrites = buildPermissionOverwrites(
        guild,
        roles,
        channelDefinition.access ?? categoryDefinition.access
      );

      if (!channel) {
        if (!createMissing) {
          continue;
        }

        channel = await guild.channels.create({
          name: channelDefinition.name,
          type: channelDefinition.type,
          parent: category.id,
          topic: channelDefinition.type === ChannelType.GuildText ? channelDefinition.topic : undefined,
          userLimit: channelDefinition.type === ChannelType.GuildVoice ? channelDefinition.userLimit : undefined,
          permissionOverwrites: childPermissionOverwrites,
          reason: 'Creation setup Kool Klown Klanx'
        });
      } else if (!channelDefinition.preserveExisting) {
        await channel.setParent(category.id, { lockPermissions: false });
        await channel.permissionOverwrites.set(childPermissionOverwrites);
        if (channelDefinition.type === ChannelType.GuildText) {
          await channel.setTopic(channelDefinition.topic ?? null).catch(() => null);
        }
        if (channelDefinition.type === ChannelType.GuildVoice && typeof channelDefinition.userLimit === 'number') {
          await channel.setUserLimit(channelDefinition.userLimit).catch(() => null);
        }
      }

      created[channelDefinition.key] = channel;
    }
  }

  return created;
}

function memberMatchesTerms(member, terms) {
  const values = [
    member.displayName,
    member.nickname,
    member.user.username,
    member.user.globalName,
    member.user.tag
  ].filter(Boolean).map((value) => value.toLowerCase());

  return terms.some((term) => values.some((value) => value.includes(term)));
}

function isExcludedFromMemberRole(member) {
  return memberMatchesTerms(member, memberRoleExcludedSearchTerms);
}

function getsAutoKweenAccess(member) {
  return kweenAutoAccessUserIds.includes(member.id) || memberMatchesTerms(member, kweenAutoAccessSearchTerms);
}

function getsAutoKlownAccess(member) {
  return memberMatchesTerms(member, klownAutoAccessSearchTerms);
}

function isConfiguredThroneChannel(channel) {
  const throneDefinition = categoryDefinitions.find((category) => category.key === 'throne');
  const throneChannelNames = new Set([
    throneDefinition.name,
    ...throneDefinition.children.map((child) => child.name)
  ]);

  return throneChannelNames.has(channel.name);
}

export async function ensureThroneAccess(guild, channels, roles) {
  const targets = new Map();
  for (const channel of [channels.throne, channels.throneText, channels.throneVoice].filter(Boolean)) {
    targets.set(channel.id, channel);
  }
  for (const channel of guild.channels.cache.filter(isConfiguredThroneChannel).values()) {
    targets.set(channel.id, channel);
  }

  if (!targets.size) {
    return [];
  }

  const overwrites = buildPermissionOverwrites(guild, roles, 'throne');

  for (const channel of targets.values()) {
    await channel.permissionOverwrites.set(overwrites).catch(() => null);
  }

  return roles.get(roleNames.queen) ?? null;
}

async function hasBotMessage(channel) {
  const messages = await channel.messages.fetch({ limit: 20 }).catch(() => null);

  if (!messages) {
    return false;
  }

  return messages.some((message) => message.author.id === channel.client.user.id);
}

export async function runSetup(guild, options = {}) {
  await deleteDefaultChannels(guild);
  const roles = await ensureRoles(guild);
  await ensureAutoAccess(guild);
  const channels = await ensureChannels(guild, roles, { createMissing: options.createMissing === true });
  await ensureEntryLogAccess(guild, roles);
  await ensureThroneAccess(guild, channels, roles);

  return { roles, channels };
}

async function ensureEntryLogAccess(guild, roles) {
  const names = ['\u{1F44B}\u30FBentr\u00E9es', '\u{1F449}\u30FBsorties'];
  const kool = roles.get(roleNames.kool)?.id;
  const saltimbanque = roles.get(roleNames.saltimbanque)?.id;
  for (const channel of guild.channels.cache.filter((candidate) => names.includes(candidate.name)).values()) {
    for (const roleId of [kool, saltimbanque].filter(Boolean)) {
      await channel.permissionOverwrites.edit(roleId, {
        ViewChannel: true,
        ReadMessageHistory: true,
        SendMessages: false
      }).catch(() => null);
    }
  }
}

async function ensureAutoAccess(guild) {
  await guild.members.fetch().catch(() => null);
  for (const member of guild.members.cache.filter(getsAutoKlownAccess).values()) {
    await grantKlownAccess(member);
  }
  for (const member of guild.members.cache.filter(getsAutoKweenAccess).values()) {
    await grantKweenAccess(member);
  }
}

async function deleteDefaultChannels(guild) {
  const channels = guild.channels.cache.filter(
    (channel) => defaultChannelNames.includes(channel.name) && !trackedChannelNames.includes(channel.name)
  );

  for (const channel of channels.sort((a, b) => {
    if (a.type === ChannelType.GuildCategory && b.type !== ChannelType.GuildCategory) {
      return 1;
    }
    if (a.type !== ChannelType.GuildCategory && b.type === ChannelType.GuildCategory) {
      return -1;
    }
    return 0;
  }).values()) {
    await channel.delete('Nettoyage salons Discord par defaut').catch(() => null);
  }
}

export async function clearSetup(guild) {
  const deleted = {
    channels: 0,
    roles: 0
  };

  const trackedOrder = new Map(trackedChannelNames.map((name, index) => [name, index]));
  const channelsToDelete = guild.channels.cache.filter((channel) => trackedChannelNames.includes(channel.name));

  for (const channel of channelsToDelete.sort((a, b) => {
    if (a.type === ChannelType.GuildCategory && b.type !== ChannelType.GuildCategory) {
      return 1;
    }
    if (a.type !== ChannelType.GuildCategory && b.type === ChannelType.GuildCategory) {
      return -1;
    }
    return (trackedOrder.get(b.name) ?? 0) - (trackedOrder.get(a.name) ?? 0);
  }).values()) {
    await channel.delete('Suppression clearsetup Kool Klown Klanx').catch(() => null);
    deleted.channels += 1;
  }

  for (const roleName of trackedRoleNames) {
    const role = guild.roles.cache.find((candidate) => candidate.name === roleName);
    if (!role || role.managed || role.name === '@everyone') {
      continue;
    }

    await role.delete('Suppression clearsetup Kool Klown Klanx').catch(() => null);
    deleted.roles += 1;
  }

  return deleted;
}

export async function grantMemberAccess(member) {
  const memberRole = member.guild.roles.cache.find((role) => role.name === roleNames.membre);
  const visitorRole = member.guild.roles.cache.find((role) => role.name === roleNames.visiteur);
  const klownRole = member.guild.roles.cache.find((role) => role.name === roleNames.klown);
  const kweenRole = member.guild.roles.cache.find((role) => role.name === roleNames.queen);

  if (getsAutoKlownAccess(member)) {
    await grantKlownAccess(member);
    return { memberRole, visitorRole, klownRole, skipDm: true };
  }

  if (!memberRole) {
    throw new Error(`Role introuvable: ${roleNames.membre}`);
  }

  if (getsAutoKweenAccess(member)) {
    await grantKweenAccess(member);
    return { memberRole, visitorRole, kweenRole, skipDm: true };
  }

  if (isExcludedFromMemberRole(member)) {
    if (member.roles.cache.has(memberRole.id)) {
      await member.roles.remove(memberRole, 'Exclusion permanente du role Klown');
    }
  } else {
    await member.roles.add(memberRole, 'Validation du reglement Kool Klown Klanx');
  }

  if (visitorRole && member.roles.cache.has(visitorRole.id)) {
    await member.roles.remove(visitorRole, 'Validation du reglement Kool Klown Klanx');
  }

  return { memberRole, visitorRole };
}

export async function grantVisitorAccess(member) {
  const visitorRole = member.guild.roles.cache.find((role) => role.name === roleNames.visiteur);
  const memberRole = member.guild.roles.cache.find((role) => role.name === roleNames.membre);
  const klownRole = member.guild.roles.cache.find((role) => role.name === roleNames.klown);
  const kweenRole = member.guild.roles.cache.find((role) => role.name === roleNames.queen);

  if (getsAutoKlownAccess(member)) {
    await grantKlownAccess(member);
    return { visitorRole, memberRole, klownRole, skipRules: true };
  }

  if (getsAutoKweenAccess(member)) {
    await grantKweenAccess(member);
    return { visitorRole, memberRole, kweenRole, skipRules: true };
  }

  if (visitorRole && !member.roles.cache.has(visitorRole.id)) {
    await member.roles.add(visitorRole, 'Nouveau membre Kool Klown Klanx');
  }

  if (memberRole && member.roles.cache.has(memberRole.id)) {
    await member.roles.remove(memberRole, 'Retour au sas Kool Klown Klanx');
  }

  if (memberRole && isExcludedFromMemberRole(member) && member.roles.cache.has(memberRole.id)) {
    await member.roles.remove(memberRole, 'Exclusion permanente du role Klown');
  }
}

async function grantKlownAccess(member) {
  const visitorRole = member.guild.roles.cache.find((role) => role.name === roleNames.visiteur);
  const memberRole = member.guild.roles.cache.find((role) => role.name === roleNames.membre);
  const klownRole = member.guild.roles.cache.find((role) => role.name === roleNames.klown);

  if (klownRole && !member.roles.cache.has(klownRole.id)) {
    await member.roles.add(klownRole, 'Acces automatique The Klown');
  }
  if (visitorRole && member.roles.cache.has(visitorRole.id)) {
    await member.roles.remove(visitorRole, 'Acces automatique The Klown');
  }
  if (memberRole && member.roles.cache.has(memberRole.id)) {
    await member.roles.remove(memberRole, 'Exception role The Klown');
  }
}

async function grantKweenAccess(member) {
  const visitorRole = member.guild.roles.cache.find((role) => role.name === roleNames.visiteur);
  const memberRole = member.guild.roles.cache.find((role) => role.name === roleNames.membre);
  const kweenRole = member.guild.roles.cache.find((role) => role.name === roleNames.queen);

  if (kweenRole && !member.roles.cache.has(kweenRole.id)) {
    await member.roles.add(kweenRole, 'Acces automatique The Kween');
  }
  if (visitorRole && member.roles.cache.has(visitorRole.id)) {
    await member.roles.remove(visitorRole, 'Acces automatique The Kween');
  }
  if (memberRole && member.roles.cache.has(memberRole.id)) {
    await member.roles.remove(memberRole, 'Exception role The Kween');
  }
}
