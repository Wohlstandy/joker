import { logAction } from '../utils/logger.js';

export default {
  name: 'guildMemberUpdate',

  async execute(oldMember, newMember) {
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    const added = newRoles.filter((role) => !oldRoles.has(role.id));
    const removed = oldRoles.filter((role) => !newRoles.has(role.id));

    if (!added.size && !removed.size) {
      return;
    }

    const changes = [
      added.size ? `Ajoutes: ${added.map((role) => role.name).join(', ')}` : null,
      removed.size ? `Retires: ${removed.map((role) => role.name).join(', ')}` : null
    ].filter(Boolean);

    await logAction(
      newMember.guild,
      '\u{1F4CB} Roles modifies',
      `${newMember} | ${changes.join('\n')}`,
      0x3498db
    );
  }
};
