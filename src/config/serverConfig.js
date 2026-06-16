import { ChannelType, PermissionFlagsBits } from 'discord.js';

export const roleNames = {
  kool: '\u{1F3AD} The Kool',
  klown: '\u{1F47A} The Klown',
  queen: '\u{1F451} The Kween',
  saltimbanque: '\u{1F388} Saltimbanque',
  membre: '\u{1F921} Klown',
  visiteur: '\u{1F6AA} Visiteur'
};

export const memberStandardPermissions = [
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.AttachFiles,
  PermissionFlagsBits.EmbedLinks,
  PermissionFlagsBits.UseExternalEmojis,
  PermissionFlagsBits.UseApplicationCommands,
  PermissionFlagsBits.Connect,
  PermissionFlagsBits.Speak
];

export const seniorModeratorPermissions = [
  ...memberStandardPermissions,
  PermissionFlagsBits.ViewAuditLog,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.ManageThreads,
  PermissionFlagsBits.KickMembers,
  PermissionFlagsBits.BanMembers,
  PermissionFlagsBits.ModerateMembers,
  PermissionFlagsBits.ManageNicknames,
  PermissionFlagsBits.CreateInstantInvite
];

export const lightModeratorPermissions = [
  ...memberStandardPermissions,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.KickMembers,
  PermissionFlagsBits.ModerateMembers,
  PermissionFlagsBits.ManageNicknames,
  PermissionFlagsBits.CreateInstantInvite
];

export const roleDefinitions = [
  {
    key: 'klown',
    name: roleNames.klown,
    color: 0x992d22,
    permissions: [PermissionFlagsBits.Administrator],
    hoist: true
  },
  {
    key: 'kool',
    name: roleNames.kool,
    color: 0xffffff,
    permissions: seniorModeratorPermissions,
    hoist: true
  },
  {
    key: 'queen',
    name: roleNames.queen,
    color: 0x8e44ad,
    permissions: seniorModeratorPermissions,
    hoist: true
  },
  {
    key: 'saltimbanque',
    name: roleNames.saltimbanque,
    color: 0x206694,
    permissions: lightModeratorPermissions,
    hoist: true
  },
  {
    key: 'membre',
    name: roleNames.membre,
    color: 0xe67e22,
    permissions: memberStandardPermissions,
    hoist: true
  },
  {
    key: 'visiteur',
    name: roleNames.visiteur,
    color: 0x95a5a6,
    permissions: [],
    hoist: true
  }
];

export const rulesMessage = [
  '# \u{1F3AA} Bienvenue chez Kool Klown Klanx',
  '',
  "Avant d'entrer sous le chapiteau, prends deux minutes pour capter l'esprit de la troupe.",
  '',
  '## \u{1F3AD} Code de la troupe',
  '',
  '1\uFE0F\u20E3 On joue ensemble, pas chacun dans son coin.',
  "2\uFE0F\u20E3 On garde l'ambiance l\u00E9g\u00E8re : vannes oui, malaise non.",
  '3\uFE0F\u20E3 Les coups de main, conseils et sorties font vivre la guilde.',
  '4\uFE0F\u20E3 Les dramas restent dehors, les bonnes vibes restent dedans.',
  "5\uFE0F\u20E3 Si un Klown appelle la troupe pour un donjon, on r\u00E9pond quand on peut.",
  '6\uFE0F\u20E3 Commerce, entraide, optimisation : on partage les bons plans sans arnaquer les copains.',
  '7\uFE0F\u20E3 Les d\u00E9cisions admin sont l\u00E0 pour garder le cirque debout, pas pour casser la f\u00EAte.',
  '',
  '\u{1F39F}\uFE0F Si \u00E7a te va, valide ton ticket et rejoins la piste.',
  '',
  "Clique sur \u2705 pour obtenir l'acc\u00E8s au serveur."
].join('\n');

export const privateWelcomeDm = [
  '\u{1F3AA} Bienvenue dans **Kool Klown Klanx** \u{1F921}',
  '',
  'Ton acc\u00E8s au serveur est valid\u00E9. Installe-toi dans la troupe et viens faire un tour sur la Place du Cirque !'
].join('\n');

export const logCategoryName = '\u{1F512}\u30FBLogs';
export const logChannelName = '\u{1F4CB}\u30FBactions-bot';
export const memberEntryChannelName = '\u{1F44B}\u30FBentr\u00E9es';
export const memberExitChannelName = '\u{1F449}\u30FBsorties';
export const memberRoleExcludedSearchTerms = ['wohlstand'];
export const klownAutoAccessSearchTerms = ['wohlstand'];
export const kweenAutoAccessSearchTerms = ['lisouille', 'jaliyha'];
export const kweenAutoAccessUserIds = ['402512615387037713'];
export const tempVoiceConfig = {
  triggerChannelName: '\u2795\u30FBcree-ton-salon',
  parentCategoryName: '\u{1F389}\u30FBLoge des Klowns',
  channelPrefix: '\u{1F3AA}\u30FBsalon-de'
};

export const categoryDefinitions = [
  {
    key: 'throne',
    name: '\u{1F451}\u30FBLe Tr\u00F4ne',
    type: ChannelType.GuildCategory,
    access: 'throne',
    children: [
      {
        key: 'throneText',
        name: '\u{1F451}\u30FBle-tr\u00F4ne',
        type: ChannelType.GuildText,
        topic: 'Salon priv\u00E9 du tr\u00F4ne.'
      },
      {
        key: 'throneVoice',
        name: '\u{1F451}\u30FBLe Tr\u00F4ne',
        type: ChannelType.GuildVoice
      }
    ]
  },
  {
    key: 'management',
    name: '\u2620\uFE0F\u30FBThe Real KKK',
    type: ChannelType.GuildCategory,
    access: 'koolOnly',
    children: [
      {
        key: 'truth',
        name: '\u2620\uFE0F\u30FBla-v\u00E9rit\u00E9',
        type: ChannelType.GuildText,
        topic: 'Salon priv\u00E9 Klown & Kool.'
      },
      {
        key: 'koolKlownVoice',
        name: '\u{1F53A}\u30FBKKK',
        type: ChannelType.GuildVoice
      }
    ]
  },
  {
    key: 'dofus',
    name: '\u{1F4F0}\u30FBGazette des Klowns',
    type: ChannelType.GuildCategory,
    access: 'gazette',
    children: [
      {
        key: 'announcements',
        name: '\u{1F4E2}\u30FBannonces',
        type: ChannelType.GuildText,
        topic: 'Annonces importantes de la guilde.'
      },
      {
        key: 'events',
        name: '\u{1F4C5}\u30FBevents',
        type: ChannelType.GuildText,
        topic: 'Organisation des \u00E9v\u00E9nements de guilde.'
      },
      {
        key: 'news',
        name: '\u{1F5DE}\uFE0F\u30FBactualit\u00E9',
        type: ChannelType.GuildText,
        topic: 'Actualit\u00E9s li\u00E9es \u00E0 Dofus.'
      }
    ]
  },
  {
    key: 'main',
    name: '\u{1F3AA}\u30FBLe Chapiteau',
    type: ChannelType.GuildCategory,
    access: 'member',
    children: [
      {
        key: 'general',
        name: '\u{1F4AC}\u30FBla-place',
        type: ChannelType.GuildText,
        topic: '\u{1F3AA} Discussions g\u00E9n\u00E9rales de la troupe.'
      },
      {
        key: 'introductions',
        name: '\u{1F4D6}\u30FBpr\u00E9sentation',
        type: ChannelType.GuildText,
        topic: 'Pr\u00E9sentations des membres de la troupe.'
      },
      {
        key: 'trade',
        name: '\u{1F4B0}\u30FBcommerce',
        type: ChannelType.GuildText,
        topic: "\u00C9changes d'objets, de ressources et bons plans."
      },
      {
        key: 'builds',
        name: '\u{1F4C8}\u30FBstuffs',
        type: ChannelType.GuildText,
        topic: 'Builds, conseils, strat\u00E9gies et optimisation.'
      },
      {
        key: 'skins',
        name: '\u{1F58C}\uFE0F\u30FBskins',
        type: ChannelType.GuildText,
        topic: 'Partage de skins et looks de personnages.'
      }
    ]
  },
  {
    key: 'voice',
    name: '\u{1F389}\u30FBLoge des Klowns',
    type: ChannelType.GuildCategory,
    access: 'memberVoice',
    children: [
      { key: 'voiceMain', name: '\u{1F50A}\u30FBSalon principal', type: ChannelType.GuildVoice },
      { key: 'voiceDungeons', name: '\u{1F50A}\u30FBDonjons', type: ChannelType.GuildVoice },
      { key: 'voiceFarm', name: '\u{1F50A}\u30FBFarm', type: ChannelType.GuildVoice },
      { key: 'voiceAfk', name: '\u{1F50A}\u30FBAFK', type: ChannelType.GuildVoice },
      { key: 'voiceTwo', name: '\u{1F465}\u30FBduo', type: ChannelType.GuildVoice, userLimit: 2 },
      { key: 'voiceFour', name: '\u{1F46A}\u30FBquatuor', type: ChannelType.GuildVoice, userLimit: 4 },
      { key: 'voiceCreate', name: tempVoiceConfig.triggerChannelName, type: ChannelType.GuildVoice }
    ]
  },
  {
    key: 'staff',
    name: '\u{1F512}\u30FBCoulisses du Chapiteau',
    type: ChannelType.GuildCategory,
    access: 'staff',
    children: [
      {
        key: 'staffVoice',
        name: '\u{1F50A}\u30FBStaff',
        type: ChannelType.GuildVoice
      },
      {
        key: 'staffChat',
        name: '\u{1F4DD}\u30FBstaff',
        type: ChannelType.GuildText,
        topic: "Discussion de l'\u00E9quipe."
      },
      {
        key: 'guildManagement',
        name: '\u{1F4CA}\u30FBgestion-guilde',
        type: ChannelType.GuildText,
        topic: 'Notes internes de gestion de guilde.'
      },
      {
        key: 'sanctions',
        name: '\u{1F6A8}\u30FBsanctions',
        type: ChannelType.GuildText,
        topic: 'Suivi administratif des sanctions.'
      }
    ]
  },
  {
    key: 'logs',
    name: logCategoryName,
    type: ChannelType.GuildCategory,
    access: 'staff',
    children: [
      {
        key: 'botActions',
        name: logChannelName,
        type: ChannelType.GuildText,
        access: 'koolKlownOnly',
        topic: 'Logs automatiques du bot Kool Klown Klanx.'
      }
    ]
  }
];

export const trackedRoleNames = roleDefinitions.map((role) => role.name);
export const legacyRoleNames = [
  '\u{1F3AD} The Klown',
  '\u{1F451} The Queen',
  '\u{1F3AA} The Kool',
  '\u{1F921} Membre',
  '\u{1F3AD} Saltimbanque'
];
export const trackedChannelNames = categoryDefinitions.flatMap((category) => [
  category.name,
  ...category.children.map((channel) => channel.name)
]);
