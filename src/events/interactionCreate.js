import { privateWelcomeDm } from '../config/serverConfig.js';
import { logAction } from '../utils/logger.js';
import { ACCEPT_RULES_CUSTOM_ID, grantMemberAccess } from '../utils/setupManager.js';

export default {
  name: 'interactionCreate',

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        console.warn(`Commande inconnue recue: ${interaction.commandName}`);
        await interaction.reply({
          content: 'Cette commande est enregistrée sur Discord, mais elle n’est pas chargée par le bot actif. Redéploie ou redémarre le service.',
          ephemeral: true
        }).catch(() => null);
        return;
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        const message = `Une erreur est survenue: ${error.message}`;

        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(message).catch(() => null);
        } else {
          await interaction.reply({ content: message, ephemeral: true }).catch(() => null);
        }
      }

      return;
    }

    if (!interaction.isButton() || interaction.customId !== ACCEPT_RULES_CUSTOM_ID) {
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const access = await grantMemberAccess(interaction.member);
      if (!access.skipDm) {
        await interaction.member.send(privateWelcomeDm).catch(() => null);
      }
      await logAction(
        interaction.guild,
        '\u2705 Règlement accepté',
        `${interaction.user} a accepté le règlement et rejoint la troupe.`
      );
      await interaction.editReply('Règlement accepté. Bienvenue dans Kool Klown Klanx !');
    } catch (error) {
      await interaction.editReply(`Impossible de valider ton accès: ${error.message}`);
    }
  }
};
