import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { roleNames } from '../config/serverConfig.js';

const registryPath = path.resolve('data', 'auto-members.json');

async function readIds() {
  try {
    const data = JSON.parse(await readFile(registryPath, 'utf8'));
    return new Set(Array.isArray(data.ids) ? data.ids : []);
  } catch {
    return new Set();
  }
}

async function writeIds(ids) {
  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, `${JSON.stringify({ ids: [...ids].sort() }, null, 2)}\n`);
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

  const ids = await readIds();
  ids.add(member.id);
  await writeIds(ids);
}

export async function unregisterAutoMember(memberOrId) {
  const id = typeof memberOrId === 'string' ? memberOrId : memberOrId.id;
  const ids = await readIds();
  ids.delete(id);
  await writeIds(ids);
}

export async function getAutoMemberIds() {
  return readIds();
}

export async function rememberCurrentMembers(guild) {
  await guild.members.fetch().catch(() => null);
  const memberRole = guild.roles.cache.find((role) => role.name === roleNames.membre);
  if (!memberRole) {
    return;
  }

  const ids = await readIds();
  for (const member of guild.members.cache.values()) {
    if (member.roles.cache.has(memberRole.id) && !hasSpecialRole(member)) {
      ids.add(member.id);
    }
  }
  await writeIds(ids);
}
