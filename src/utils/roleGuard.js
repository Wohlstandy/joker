import { roleNames } from '../config/serverConfig.js';

export function isKlownOrKool(member) {
  return member.roles.cache.some((role) => role.name === roleNames.klown || role.name === roleNames.kool);
}
