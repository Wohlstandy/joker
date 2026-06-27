import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { roleDefinitions, roleNames } from '../config/serverConfig.js';

const registryPath = path.resolve('data', 'auto-members.json');
const roleKeys = new Set(roleDefinitions.map((role) => role.key));
const roleKeyByName = new Map(roleDefinitions.map((role) => [role.name, role.key]));
const legacyBuckets = {
  members: 'membre',
  saltimbanques: 'saltimbanque',
  visitors: 'visiteur'
};

function emptyRegistry() {
  return {
    users: new Map()
  };
}

function ensureUser(registry, id, savedAt = new Date().toISOString()) {
  if (!registry.users.has(id)) {
    registry.users.set(id, {
      roles: new Set(),
      savedAt
    });
  }

  return registry.users.get(id);
}

function addUserRole(registry, id, roleKey) {
  if (!roleKeys.has(roleKey)) {
    return;
  }

  const user = ensureUser(registry, id);
  user.roles.add(roleKey);
  user.savedAt = new Date().toISOString();
}

function removeUserRole(registry, id, roleKey) {
  const user = registry.users.get(id);
  if (!user) {
    return;
  }

  user.roles.delete(roleKey);
  user.savedAt = new Date().toISOString();
  if (!user.roles.size) {
    registry.users.delete(id);
  }
}

function addLegacyIds(registry, ids, roleKey) {
  if (!Array.isArray(ids)) {
    return;
  }

  for (const id of ids) {
    addUserRole(registry, id, roleKey);
  }
}

async function readIds() {
  try {
    const data = JSON.parse(await readFile(registryPath, 'utf8'));
    const registry = emptyRegistry();

    if (data.users && typeof data.users === 'object' && !Array.isArray(data.users)) {
      for (const [id, value] of Object.entries(data.users)) {
        const roles = Array.isArray(value?.roles) ? value.roles : [];
        const user = ensureUser(registry, id, typeof value?.savedAt === 'string' ? value.savedAt : undefined);
        for (const roleKey of roles) {
          if (roleKeys.has(roleKey)) {
            user.roles.add(roleKey);
          }
        }
        if (!user.roles.size) {
          registry.users.delete(id);
        }
      }
    }

    if (Array.isArray(data.ids)) {
      addLegacyIds(registry, data.ids, legacyBuckets.members);
      return registry;
    }

    addLegacyIds(registry, data.members, legacyBuckets.members);
    addLegacyIds(registry, data.saltimbanques, legacyBuckets.saltimbanques);
    addLegacyIds(registry, data.visitors, legacyBuckets.visitors);

    return registry;
  } catch {
    return emptyRegistry();
  }
}

async function writeIds(registry) {
  const users = {};
  for (const [id, user] of [...registry.users.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    users[id] = {
      roles: [...user.roles].sort(),
      savedAt: user.savedAt
    };
  }

  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, `${JSON.stringify({ users }, null, 2)}\n`);
}

function hasSpecialRole(member) {
  return member.roles.cache.some((role) =>
    role.name === roleNames.klown ||
    role.name === roleNames.kool ||
    role.name === roleNames.queen
  );
}

export async function registerAutoMember(member) {
  if (hasSpecialRole(member)) {
    return;
  }

  const registry = await readIds();
  addUserRole(registry, member.id, legacyBuckets.members);
  removeUserRole(registry, member.id, legacyBuckets.visitors);
  await writeIds(registry);
}

export async function registerAutoSaltimbanque(member) {
  if (hasSpecialRole(member)) {
    return;
  }

  const registry = await readIds();
  addUserRole(registry, member.id, legacyBuckets.saltimbanques);
  removeUserRole(registry, member.id, legacyBuckets.members);
  removeUserRole(registry, member.id, legacyBuckets.visitors);
  await writeIds(registry);
}

export async function registerAutoVisitor(member) {
  if (hasSpecialRole(member)) {
    return;
  }

  const registry = await readIds();
  addUserRole(registry, member.id, legacyBuckets.visitors);
  await writeIds(registry);
}

export async function unregisterAutoMember(memberOrId) {
  const id = typeof memberOrId === 'string' ? memberOrId : memberOrId.id;
  const registry = await readIds();
  registry.users.delete(id);
  await writeIds(registry);
}

function getIdsWithRole(registry, roleKey) {
  return new Set(
    [...registry.users.entries()]
      .filter(([, user]) => user.roles.has(roleKey))
      .map(([id]) => id)
  );
}

export async function getAutoMemberIds() {
  return getIdsWithRole(await readIds(), legacyBuckets.members);
}

export async function getAutoSaltimbanqueIds() {
  return getIdsWithRole(await readIds(), legacyBuckets.saltimbanques);
}

export async function getAutoVisitorIds() {
  return getIdsWithRole(await readIds(), legacyBuckets.visitors);
}

export async function getSavedRoleEntries() {
  const registry = await readIds();
  return [...registry.users.entries()].map(([id, user]) => ({
    id,
    roles: [...user.roles].sort(),
    savedAt: user.savedAt
  }));
}

export async function rememberCurrentMembers(guild) {
  await guild.members.fetch().catch(() => null);
  const trackedRoles = roleDefinitions
    .map((definition) => ({
      key: definition.key,
      role: guild.roles.cache.find((candidate) => candidate.name === definition.name)
    }))
    .filter(({ role }) => role);

  if (!trackedRoles.length) {
    return;
  }

  const registry = await readIds();
  for (const member of guild.members.cache.values()) {
    if (member.user.bot) {
      continue;
    }

    let savedRoles = trackedRoles.filter(({ role }) => member.roles.cache.has(role.id));
    if (!savedRoles.length) {
      continue;
    }

    if (savedRoles.some(({ key }) => key !== 'visiteur')) {
      savedRoles = savedRoles.filter(({ key }) => key !== 'visiteur');
    }

    const user = ensureUser(registry, member.id);
    for (const { key } of savedRoles) {
      user.roles.add(key);
    }
    user.savedAt = new Date().toISOString();
  }
  await writeIds(registry);
}

export function getRoleKeyByName(roleName) {
  return roleKeyByName.get(roleName) ?? null;
}
