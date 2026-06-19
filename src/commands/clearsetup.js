import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { clearSetup } from '../utils/setupManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clearsetup')
    .setDescription('Supprime uniquement les rôles et salons créés par le setup Kool Klown Klanx.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const deleted = await clearSetup(interaction.guild);

    await interaction.editReply(
      `Nettoyage terminé : ${deleted.channels} salon(s)/catégorie(s) et ${deleted.roles} rôle(s) supprimé(s).`
    );
  }
};
