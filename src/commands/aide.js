import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const commands = [
  {
    name: '/aide',
    access: 'Tous les membres',
    description: 'Affiche la liste des commandes du bot.'
  },
  {
    name: '/ms',
    access: 'Administrateur',
    description: 'Envoie un message avec le bot dans un salon.'
  },
  {
    name: '/del',
    access: 'Administrateur',
    description: 'Supprime un message par ID.'
  },
  {
    name: '/membre',
    access: 'Administrateur ou modérateur avec gestion des rôles',
    description: 'Donne manuellement le rôle Klown à un utilisateur.'
  },
  {
    name: '/kick',
    access: 'Administrateur ou modérateur avec expulsion',
    description: 'Expulse un utilisateur avec une raison et un log automatique.'
  },
  {
    name: '/setup',
    access: 'Administrateur',
    description: 'Configure tout le serveur Kool Klown Klanx.'
  },
  {
    name: '/clearsetup',
    access: 'Administrateur',
    description: 'Supprime uniquement les rôles et salons créés par le setup.'
  }
];

function formatCommand(command) {
  return [
    `**${command.name}**`,
    `Accès : ${command.access}`,
    command.description
  ].join('\n');
}

export default {
  data: new SlashCommandBuilder()
    .setName('aide')
    .setDescription('Affiche la liste des commandes du bot.')
    .setDMPermission(false),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('Commandes Kool Klown Klanx')
      .setDescription(commands.map(formatCommand).join('\n\n'))
      .setFooter({ text: 'Les permissions Discord peuvent aussi limiter certaines commandes.' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
