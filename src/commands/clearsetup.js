import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { clearSetup } from '../utils/setupManager.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clearsetup')
    .setDescription('Supprime uniquement les roles et salons crees par le setup Kool Klown Klanx.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const deleted = await clearSetup(interaction.guild);

    await interaction.editReply(
      `Nettoyage termine : ${deleted.channels} salon(s)/categorie(s) et ${deleted.roles} role(s) supprime(s).`
    );
  }
};
