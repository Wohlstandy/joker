import { logAction } from '../utils/logger.js';
import { grantVisitorAccess } from '../utils/setupManager.js';

export default {
  name: 'guildMemberAdd',

  async execute(member) {
    try {
      await grantVisitorAccess(member);
    } catch (error) {
      console.error(error);
      await logAction(
        member.guild,
        '\u26A0\uFE0F Erreur arrivée',
        `Impossible d'ajouter le rôle visiteur à ${member}: ${error.message}`,
        0xe74c3c
      );
    }

    await logAction(member.guild, '\u{1F44B} Arrivée', `${member} a rejoint le serveur.`);
  }
};
