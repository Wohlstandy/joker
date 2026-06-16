import { sendCircusDeparture, sendCircusWelcome } from './welcomePoster.js';

export async function logMemberEntry(member) {
  await sendCircusWelcome(member).catch(() => null);
}

export async function logMemberExit(member) {
  await sendCircusDeparture(member).catch(() => null);
}
