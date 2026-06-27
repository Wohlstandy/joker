import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { privateWelcomeDm, roleNames } from '../config/serverConfig.js';
import { logAction } from '../utils/logger.js';
import { grantMemberAccess, grantSaltimbanqueAccess } from '../utils/setupManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('membre')
    .setDescription('Donne manuellement le rôle Klown ou Saltimbanque à un utilisateur.')
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription('Utilisateur à valider')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('role')
        .setDescription('Rôle à attribuer (Klown par défaut)')
        .addChoices(
          { name: roleNames.membre, value: 'klown' },
          { name: roleNames.saltimbanque, value: 'saltimbanque' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser('utilisateur', true);
    const role = interaction.options.getString('role') ?? 'klown';
    const member = await interaction.guild.members.fetch(user.id);
    const isSaltimbanque = role === 'saltimbanque';
    const access = isSaltimbanque
      ? await grantSaltimbanqueAccess(member)
      : await grantMemberAccess(member);

    if (!isSaltimbanque && !access.skipDm) {
      await member.send(privateWelcomeDm).catch(() => null);
    }

    const grantedRoleName = isSaltimbanque ? roleNames.saltimbanque : roleNames.membre;
    await logAction(
      interaction.guild,
      '\u2705 Validation manuelle',
      `${interaction.user} a attribué le rôle ${grantedRoleName} à ${member}.`
    );

    await interaction.editReply(`${member} a maintenant le rôle ${grantedRoleName}.`);
  }
};
