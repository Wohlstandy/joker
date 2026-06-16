import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { sendCircusWelcome } from '../src/utils/welcomePoster.js';

const SEARCH_TERMS = ['wohlstand', 'wohlstandy'];

function matchesMember(member) {
  const values = [
    member.displayName,
    member.nickname,
    member.user.username,
    member.user.globalName,
    member.user.tag
  ]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  return SEARCH_TERMS.some((term) => values.some((value) => value.includes(term)));
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('clientReady', async () => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const fullGuild = await guild.fetch();
    await fullGuild.members.fetch();
    await fullGuild.channels.fetch();

    const member = fullGuild.members.cache.find(matchesMember);
    if (!member) {
      throw new Error('Membre de test introuvable: Wohlstand.');
    }

    await sendCircusWelcome(member);
    console.log(`test_welcome_ok member=${member.user.tag}`);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
});

await client.login(process.env.DISCORD_TOKEN);
