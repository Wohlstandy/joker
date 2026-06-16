import { logAction } from '../utils/logger.js';
import { logMemberEntry } from '../utils/memberFlowLogger.js';
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
        '\u26A0\uFE0F Erreur arrivee',
        `Impossible d'ajouter le role visiteur a ${member}: ${error.message}`,
        0xe74c3c
      );
    }

    await logMemberEntry(member);
    await logAction(member.guild, '\u{1F44B} Arrivee', `${member} a rejoint le serveur.`);
  }
};
