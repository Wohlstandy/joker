import { logAction } from '../utils/logger.js';
import { roleNames } from '../config/serverConfig.js';
import { registerAutoMember, registerAutoSaltimbanque } from '../utils/memberRegistry.js';

function isValidationRoleChange(added, removed) {
  const changedRoleNames = [
    ...added.map((role) => role.name),
    ...removed.map((role) => role.name)
  ];

  return changedRoleNames.every((roleName) =>
    roleName === roleNames.membre ||
    roleName === roleNames.visiteur
  ) && (
    added.some((role) => role.name === roleNames.membre) ||
    removed.some((role) => role.name === roleNames.visiteur)
  );
}

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

    if (added.some((role) => role.name === roleNames.membre)) {
      await registerAutoMember(newMember);
    }

    if (added.some((role) => role.name === roleNames.saltimbanque)) {
      await registerAutoSaltimbanque(newMember);
    }

    if (isValidationRoleChange(added, removed)) {
      return;
    }

    const changes = [
      added.size ? `Ajoutés: ${added.map((role) => role.name).join(', ')}` : null,
      removed.size ? `Retirés: ${removed.map((role) => role.name).join(', ')}` : null
    ].filter(Boolean);

    await logAction(
      newMember.guild,
      '\u{1F4CB} Rôles modifiés',
      `${newMember} | ${changes.join('\n')}`,
      0x3498db
    );
  }
};
