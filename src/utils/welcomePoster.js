import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import path from 'node:path';
import { memberEntryChannelName, memberExitChannelName } from '../config/serverConfig.js';

const WELCOME_IMAGE_PATH = path.resolve('server-icon-existing.png');

function findTextChannel(guild, channelName) {
  return guild.channels.cache.find(
    (candidate) => candidate.name === channelName && candidate.isTextBased()
  );
}

function createWelcomeImage() {
  return new AttachmentBuilder(WELCOME_IMAGE_PATH, {
    name: 'kool-klown-klanx.png'
  });
}

export async function sendCircusWelcome(member, channelName = memberEntryChannelName) {
  const channel = findTextChannel(member.guild, channelName);

  if (!channel) {
    throw new Error(`Salon introuvable: ${channelName}`);
  }

  const image = createWelcomeImage();

  const embed = new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle('Un nouveau Klown approche !')
    .setDescription([
      `${member}, bienvenue sous le chapiteau de **Kool Klown Klanx** !`,
      '',
      'Attrape ton nez rouge, fais ton entree sur la piste, et prepare-toi a faire rire les donjons.'
    ].join('\n'))
    .setThumbnail('attachment://kool-klown-klanx.png')
    .setFooter({ text: "La troupe t'attend derriere le rideau." });

  return channel.send({
    content: `${member} vient de pousser la porte du cirque !`,
    embeds: [embed],
    files: [image],
    allowedMentions: { users: [member.id] }
  });
}

export async function sendCircusDeparture(member) {
  const channel = findTextChannel(member.guild, memberExitChannelName);

  if (!channel) {
    throw new Error(`Salon introuvable: ${memberExitChannelName}`);
  }

  const image = createWelcomeImage();
  const embed = new EmbedBuilder()
    .setColor(0xf39c12)
    .setTitle('Un Klown quitte la piste !')
    .setDescription([
      `<@${member.id}> vient de sortir du chapiteau de **Kool Klown Klanx**.`,
      '',
      'Le rideau se referme, mais les confettis restent dans les souvenirs.'
    ].join('\n'))
    .setThumbnail('attachment://kool-klown-klanx.png')
    .setFooter({ text: 'La troupe garde une chaise libre sous le chapiteau.' });

  return channel.send({
    content: `<@${member.id}> vient de quitter le cirque.`,
    embeds: [embed],
    files: [image],
    allowedMentions: { users: [member.id] }
  });
}
