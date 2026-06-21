import { EmbedBuilder } from 'discord.js';
import { logAction, logEmbed } from '../utils/logger.js';
import { roleNames } from '../config/serverConfig.js';
import { registerAutoMember, registerAutoSaltimbanque } from '../utils/memberRegistry.js';

const pendingVisitorMemberTransitions = new Map();

function getVisitorMemberChange(added, removed) {
  const addedMember = added.some((role) => role.name === roleNames.membre);
  const addedVisitor = added.some((role) => role.name === roleNames.visiteur);
  const removedMember = removed.some((role) => role.name === roleNames.membre);
  const removedVisitor = removed.some((role) => role.name === roleNames.visiteur);
  const onlyVisitorMemberChanged = [
    ...added.map((role) => role.name),
    ...removed.map((role) => role.name)
  ].every((roleName) => roleName === roleNames.membre || roleName === roleNames.visiteur);

  if (!onlyVisitorMemberChanged) {
    return null;
  }

  return {
    addedMember,
    addedVisitor,
    removedMember,
    removedVisitor
  };
}

function buildReturnedVisitorEmbed(member) {
  return new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle('Retour en visiteur')
    .setDescription(`${member} est repassé dans le Vestibule.`)
    .addFields(
      {
        name: 'Changement de rôle',
        value: `${roleNames.membre} → ${roleNames.visiteur}`,
        inline: false
      },
      {
        name: 'Résultat',
        value: 'Accès membre retiré.',
        inline: false
      }
    )
    .setTimestamp();
}

function queueVisitorMemberTransition(member, change) {
  const existing = pendingVisitorMemberTransitions.get(member.id);
  if (existing?.timer) {
    clearTimeout(existing.timer);
  }

  const pending = {
    guild: member.guild,
    member,
    addedMember: Boolean(existing?.addedMember || change.addedMember),
    addedVisitor: Boolean(existing?.addedVisitor || change.addedVisitor),
    removedMember: Boolean(existing?.removedMember || change.removedMember),
    removedVisitor: Boolean(existing?.removedVisitor || change.removedVisitor),
    timer: null
  };

  pending.timer = setTimeout(async () => {
    pendingVisitorMemberTransitions.delete(member.id);

    if (pending.addedVisitor && pending.removedMember) {
      await logEmbed(pending.guild, buildReturnedVisitorEmbed(pending.member));
    }
  }, 2500);

  pendingVisitorMemberTransitions.set(member.id, pending);
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

    const visitorMemberChange = getVisitorMemberChange(added, removed);
    if (visitorMemberChange) {
      queueVisitorMemberTransition(newMember, visitorMemberChange);
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
