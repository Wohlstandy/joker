import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { roleNames } from '../config/serverConfig.js';

const registryPath = path.resolve('data', 'auto-members.json');

async function readIds() {
  try {
    const data = JSON.parse(await readFile(registryPath, 'utf8'));
    if (Array.isArray(data.ids)) {
      return {
        members: new Set(data.ids),
        saltimbanques: new Set()
      };
    }
    return {
      members: new Set(Array.isArray(data.members) ? data.members : []),
      saltimbanques: new Set(Array.isArray(data.saltimbanques) ? data.saltimbanques : [])
    };
  } catch {
    return {
      members: new Set(),
      saltimbanques: new Set()
    };
  }
}

async function writeIds(registry) {
  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, `${JSON.stringify({
    members: [...registry.members].sort(),
    saltimbanques: [...registry.saltimbanques].sort()
  }, null, 2)}\n`);
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
  registry.members.add(member.id);
  await writeIds(registry);
}

export async function registerAutoSaltimbanque(member) {
  if (hasSpecialRole(member)) {
    return;
  }

  const registry = await readIds();
  registry.saltimbanques.add(member.id);
  await writeIds(registry);
}

export async function unregisterAutoMember(memberOrId) {
  const id = typeof memberOrId === 'string' ? memberOrId : memberOrId.id;
  const registry = await readIds();
  registry.members.delete(id);
  registry.saltimbanques.delete(id);
  await writeIds(registry);
}

export async function getAutoMemberIds() {
  return (await readIds()).members;
}

export async function getAutoSaltimbanqueIds() {
  return (await readIds()).saltimbanques;
}

export async function rememberCurrentMembers(guild) {
  await guild.members.fetch().catch(() => null);
  const memberRole = guild.roles.cache.find((role) => role.name === roleNames.membre);
  const saltimbanqueRole = guild.roles.cache.find((role) => role.name === roleNames.saltimbanque);
  if (!memberRole && !saltimbanqueRole) {
    return;
  }

  const registry = await readIds();
  for (const member of guild.members.cache.values()) {
    if (memberRole && member.roles.cache.has(memberRole.id) && !hasSpecialRole(member)) {
      registry.members.add(member.id);
    }
    if (saltimbanqueRole && member.roles.cache.has(saltimbanqueRole.id) && !hasSpecialRole(member)) {
      registry.saltimbanques.add(member.id);
    }
  }
  await writeIds(registry);
}
