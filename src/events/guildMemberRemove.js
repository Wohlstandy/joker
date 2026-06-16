import { logAction } from '../utils/logger.js';
import { logMemberExit } from '../utils/memberFlowLogger.js';

export default {
  name: 'guildMemberRemove',

  async execute(member) {
    await logMemberExit(member);
    await logAction(member.guild, '\u{1F44B} Depart', `**${member.user.tag}** a quitte le serveur.`, 0xf39c12);
  }
};
