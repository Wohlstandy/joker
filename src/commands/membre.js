import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { privateWelcomeDm } from '../config/serverConfig.js';
import { logAction } from '../utils/logger.js';
import { grantMemberAccess } from '../utils/setupManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('membre')
    .setDescription('Donne manuellement le rôle Klown à un utilisateur.')
    .addUserOption((option) =>
      option
        .setName('utilisateur')
        .setDescription('Utilisateur à valider')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser('utilisateur', true);
    const member = await interaction.guild.members.fetch(user.id);
    const access = await grantMemberAccess(member);

    if (!access.skipDm) {
      await member.send(privateWelcomeDm).catch(() => null);
    }

    await logAction(
      interaction.guild,
      '\u2705 Validation manuelle',
      `${interaction.user} a donné l'accès membre à ${member}.`
    );

    await interaction.editReply(`${member} a maintenant accès au serveur.`);
  }
};
