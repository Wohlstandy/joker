import { EmbedBuilder } from 'discord.js';
import { privateWelcomeDm, roleNames } from '../config/serverConfig.js';
import { logEmbed } from '../utils/logger.js';
import { ACCEPT_RULES_CUSTOM_ID, grantMemberAccess } from '../utils/setupManager.js';

const validatedRoleNames = new Set([
  roleNames.klown,
  roleNames.kool,
  roleNames.queen,
  roleNames.saltimbanque,
  roleNames.membre
]);

function hasValidatedRole(member) {
  return member.roles.cache.some((role) => validatedRoleNames.has(role.name));
}

function buildRulesAcceptedEmbed(interaction) {
  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle('Règlement accepté')
    .setDescription(`${interaction.user} a validé le règlement.`)
    .addFields(
      {
        name: 'Changement de rôle',
        value: `${roleNames.visiteur} → ${roleNames.membre}`,
        inline: false
      },
      {
        name: 'Résultat',
        value: 'Accès membre accordé.',
        inline: false
      }
    )
    .setTimestamp();
}

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
      const member = await interaction.guild.members.fetch(interaction.user.id);

      if (hasValidatedRole(member)) {
        await interaction.editReply('Ton acc\u00E8s est d\u00E9j\u00E0 valid\u00E9.');
        return;
      }

      const access = await grantMemberAccess(member);
      if (!access.skipDm) {
        await member.send(privateWelcomeDm).catch(() => null);
      }
      await logEmbed(interaction.guild, buildRulesAcceptedEmbed(interaction));
      await interaction.editReply('Règlement accepté. Bienvenue dans Kool Klown Klanx !');
    } catch (error) {
      await interaction.editReply(`Impossible de valider ton accès: ${error.message}`);
    }
  }
};
