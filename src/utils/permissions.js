import { PermissionFlagsBits } from 'discord.js';
import { roleNames } from '../config/serverConfig.js';

const textRead = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.UseApplicationCommands
];

const textWrite = [
  ...textRead,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.EmbedLinks,
  PermissionFlagsBits.UseExternalEmojis
];

const textModerate = [
  ...textWrite,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.ManageThreads,
  PermissionFlagsBits.CreatePublicThreads,
  PermissionFlagsBits.SendMessagesInThreads
];

const voiceUse = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.Connect,
  PermissionFlagsBits.Speak
];

const noTextChanges = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.ManageThreads,
  PermissionFlagsBits.CreatePublicThreads,
  PermissionFlagsBits.CreatePrivateThreads,
  PermissionFlagsBits.SendMessagesInThreads,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.EmbedLinks
];

function roleOverwrite(id, allow, deny = []) {
  return id ? { id, allow, deny } : null;
}

function roleOverwrites(ids, allow, deny = []) {
  return ids.map((id) => roleOverwrite(id, allow, deny)).filter(Boolean);
}

export function buildPermissionOverwrites(guild, roles, access) {
  const everyone = guild.roles.everyone.id;
  const member = roles.get(roleNames.membre)?.id;
  const visitor = roles.get(roleNames.visiteur)?.id;
  const klown = roles.get(roleNames.klown)?.id;
  const saltimbanque = roles.get(roleNames.saltimbanque)?.id;
  const kool = roles.get(roleNames.kool)?.id;
  const queen = roles.get(roleNames.queen)?.id;

  const troupeRoles = [member, saltimbanque, queen, kool];
  const moderatorRoles = [saltimbanque, queen, kool];
  const seniorRoles = [queen, kool];
  const entryWriteRoles = [klown, queen, kool];

  const overwrites = {
    visitor: [
      { id: everyone, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
      roleOverwrite(visitor, [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory])
    ],
    member: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites(troupeRoles, textWrite)
    ],
    memberVoice: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites(troupeRoles, voiceUse)
    ],
    gazette: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites([member, saltimbanque], textRead, noTextChanges),
      ...roleOverwrites(seniorRoles, textModerate)
    ],
    entryLog: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites([member, saltimbanque], textRead, noTextChanges),
      ...roleOverwrites(entryWriteRoles, textModerate)
    ],
    koolOnly: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites([kool], [...textModerate, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])
    ],
    koolKlownOnly: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites([klown, kool], textModerate)
    ],
    staff: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites(moderatorRoles, textModerate)
    ],
    throne: [
      { id: everyone, deny: [PermissionFlagsBits.ViewChannel] },
      ...roleOverwrites([queen], [...textModerate, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])
    ]
  };

  return (overwrites[access] ?? overwrites.member).filter(Boolean);
}
