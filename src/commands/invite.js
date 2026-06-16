import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { categoryDefinitions } from '../config/serverConfig.js';
import { logAction } from '../utils/logger.js';

function cleanUserQuery(query) {
  return query
    .trim()
    .replace(/^<@!?/, '')
    .replace(/>$/, '');
}

async function resolveUser(client, guild, query) {
  const cleaned = cleanUserQuery(query);

  const byId = cleaned.match(/^\d{17,20}$/)
    ? await guild.members.fetch(cleaned).catch(() => null) ?? await client.users.fetch(cleaned).catch(() => null)
    : null;

  if (byId?.user) {
    return byId.user;
  }

  if (byId) {
    return byId;
  }

  const normalized = cleaned.toLowerCase();
  const foundMembers = await guild.members.search({ query: cleaned, limit: 10 }).catch(() => null);
  const foundMember = foundMembers?.find((member) => {
    const candidates = [
      member.user.tag,
      member.user.username,
      member.user.globalName,
      member.displayName,
      member.nickname
    ]
      .filter(Boolean)
      .map((value) => value.toLowerCase());

    return candidates.some((value) => value === normalized || value.includes(normalized));
  });

  return foundMember?.user ?? null;
}

function getInviteChannel(guild) {
  const rulesName = categoryDefinitions
    .find((category) => category.key === 'sas')
    ?.children.find((channel) => channel.key === 'rules')
    ?.name;

  return guild.channels.cache.find(
    (channel) => channel.name === rulesName && channel.type === ChannelType.GuildText
  ) ?? guild.channels.cache.find((channel) => channel.type === ChannelType.GuildText);
}

async function createPermanentInvite(guild) {
  const channel = getInviteChannel(guild);

  if (!channel) {
    throw new Error('Aucun salon texte disponible pour creer une invitation.');
  }

  return channel.createInvite({
    maxAge: 0,
    maxUses: 0,
    unique: false,
    reason: 'Invitation permanente Kool Klown Klanx'
  });
}

export default {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Envoie une invitation permanente du serveur a un utilisateur.')
    .addStringOption((option) =>
      option
        .setName('user')
        .setDescription('Pseudo, tag, mention ou ID Discord')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite)
    .setDMPermission(false),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const query = interaction.options.getString('user', true);
    const user = await resolveUser(client, interaction.guild, query);

    if (!user) {
      await interaction.editReply(
        [
          "Je n'ai pas trouve cet utilisateur sur les serveurs accessibles au bot.",
          'Utilise une mention ou un ID Discord si le bot partage deja un serveur avec lui.'
        ].join('\n')
      );
      return;
    }

    const invite = await createPermanentInvite(interaction.guild);
    const sent = await user.send([
      "**Kool Klown Klanx** t'ouvre le chapiteau !",
      '',
      `Voici ton invitation permanente : ${invite.url}`
    ].join('\n')).then(() => true).catch(() => false);

    await logAction(
      interaction.guild,
      '\u{1F4E8} Invitation envoyee',
      `${interaction.user} a cree une invitation permanente pour **${user.tag}**. DM envoye : ${sent ? 'oui' : 'non'}.`
    );

    if (!sent) {
      await interaction.editReply(
        `Invitation creee, mais impossible d'envoyer un DM a **${user.tag}**.`
      );
      return;
    }

    await interaction.editReply(`Invitation envoyee en message prive a **${user.tag}**.`);
  }
};
