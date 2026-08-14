const { Client, GatewayIntentBits, EmbedBuilder, Partials, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration
  ],
  partials: [Partials.Channel]
});

const PREFIX = '-';
const OWNER_ID = '1500974923441639434';
const MUTE_LOGS_FILE = path.join(__dirname, 'vmute_logs.json');
const PORT = process.env.PORT || 3000;
const EMBED_COLOR = 0x4C4D54;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running');
}).listen(PORT, () => {
  console.log(`Dummy server running on port ${PORT}`);
});

if (!fs.existsSync(MUTE_LOGS_FILE)) {
  fs.writeFileSync(MUTE_LOGS_FILE, JSON.stringify({}, null, 2));
}

function saveVMuteLog(userId, moderator, reason, guild) {
  const logs = JSON.parse(fs.readFileSync(MUTE_LOGS_FILE, 'utf8'));
  if (!logs[userId]) logs[userId] = [];

  logs[userId].unshift({
    moderatorId: moderator.id || 'Unknown',
    moderatorTag: moderator.tag || 'Unknown',
    reason: reason || 'None',
    guildId: guild.id,
    guildName: guild.name,
    timestamp: Date.now()
  });

  if (logs[userId].length > 15) logs[userId] = logs[userId].slice(0, 15);
  fs.writeFileSync(MUTE_LOGS_FILE, JSON.stringify(logs, null, 2));
}

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (!oldState.serverMute && newState.serverMute) {
    try {
      const fetchedLogs = await newState.guild.fetchAuditLogs({
        limit: 5,
        type: 24
      });

      const muteLog = fetchedLogs.entries.find(entry =>
        entry.target?.id === newState.member?.id &&
        Date.now() - entry.createdTimestamp < 10000
      );

      if (muteLog && muteLog.executor?.id === client.user.id) return;

      const moderator = muteLog?.executor || { id: 'Unknown', tag: 'Unknown' };
      const reason = muteLog?.reason || 'None';

      if (newState.member) {
        saveVMuteLog(newState.member.id, moderator, reason, newState.guild);
      }
    } catch (err) {
      console.error('Error saving voice mute log:', err);
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim();
  const args = content.split(/ +/);
  const command = args.shift().toLowerCase();

  // ========== AVATAR ==========
  if (command === 'a') {
    let user = message.mentions.users.first();
    if (!user && args[0]) {
      try { user = await client.users.fetch(args[0]); } catch { user = null; }
    }
    if (!user) user = message.author;

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTitle('Avatar')
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setColor(EMBED_COLOR)
      .setFooter({ text: `Requested by ${message.author.tag}` });

    return message.reply({ embeds: [embed] });
  }

  // ========== BANNER ==========
  if (command === 'bn') {
    let user = message.mentions.users.first();
    if (!user && args[0]) {
      try { user = await client.users.fetch(args[0]); } catch { user = null; }
    }
    if (!user) user = message.author;

    try {
      const fetchedUser = await client.users.fetch(user.id, { force: true });
      if (!fetchedUser.banner) {
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`<:pentacle_asexual:1536545946077495397> | **__This user doesn't have a banner__**`).setColor(EMBED_COLOR)] });
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setTitle('Banner')
        .setImage(fetchedUser.bannerURL({ dynamic: true, size: 4096 }))
        .setColor(EMBED_COLOR)
        .setFooter({ text: `Requested by ${message.author.tag}` });

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription(`<:pentacle_asexual:1536545946077495397> | **__Failed to fetch banner__**`).setColor(EMBED_COLOR)] });
    }
  }

  if (!content.startsWith(PREFIX)) return;

  const prefixArgs = content.slice(PREFIX.length).trim().split(/ +/);
  const prefixCommand = prefixArgs.shift().toLowerCase();

  // ========== DMALL ==========
  if (prefixCommand === 'dmall') {
    if (message.author.id !== OWNER_ID) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('<:OwnerCrown:1536485446018662543> | **__This command is restricted to the bot owner__**').setColor(EMBED_COLOR)] });
    }

    const msgToSend = prefixArgs.join(' ');
    if (!msgToSend) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('<:message:1536486534734151741> | **__Please enter the message you\'d like to send__**').setColor(EMBED_COLOR)] });
    }

    await message.reply({ embeds: [new EmbedBuilder().setDescription(`<a:Loading:1535311556735279144> | **___Starting message delivery__**\n\n\`The message is being sent to all members.\``).setColor(EMBED_COLOR)] });

    let success = 0, failed = 0;
    const members = await message.guild.members.fetch();

    for (const [, member] of members) {
      if (member.user.bot) continue;
      try { await member.send(msgToSend); success++; } catch { failed++; }
      await new Promise(r => setTimeout(r, 700));
    }

    return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`**__Delivery Report__**\n\n<a:Checkmark:1535399839150379058> | **Delivered** : \`${success}\`\n\n<:emojigg_X:1535805640734154782> | **Failed** : \`${failed}\``).setColor(EMBED_COLOR)] });
  }

  // ========== ROLE ==========
  if (prefixCommand === 'role') {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the `Manage Roles` permission to use this command.**').setColor(EMBED_COLOR)] });
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(prefixArgs[0]);
    if (!target) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-role @user @role / role name / role id`').setColor(EMBED_COLOR)] });
    }

    let role = message.mentions.roles.first();
    if (!role) {
      const roleInput = prefixArgs.slice(1).join(' ');
      role = message.guild.roles.cache.get(roleInput) || message.guild.roles.cache.find(r => r.name.toLowerCase() === roleInput.toLowerCase());
    }

    if (!role) return message.reply({ embeds: [new EmbedBuilder().setDescription('**Role not found.**').setColor(EMBED_COLOR)] });
    if (message.guild.members.me.roles.highest.position <= role.position) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**I cannot manage this role because it is higher or equal to my highest role.**').setColor(EMBED_COLOR)] });
    }

    try {
      if (target.roles.cache.has(role.id)) {
        await target.roles.remove(role);
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`<:Spotify_Remove:1536495431213776948> 〉Removed ${role} from ${target}`).setColor(EMBED_COLOR)] });
      } else {
        await target.roles.add(role);
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`<:PlusLogo:1536495735141302343> 〉Added ${role} to ${target}`).setColor(EMBED_COLOR)] });
      }
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to update the role.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== BAN ==========
  if (prefixCommand === 'ban') {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the `Ban Members` permission to use this command.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-ban <ID|@member|username> [reason]`').setColor(EMBED_COLOR)] });
    }

    const reason = prefixArgs.slice(1).join(' ') || 'No reason provided';
    let target = message.mentions.members.first() || message.guild.members.cache.get(prefixArgs[0]);

    try {
      if (target) {
        if (!target.bannable) {
          return message.reply({ embeds: [new EmbedBuilder().setDescription('**I cannot ban this user.**').setColor(EMBED_COLOR)] });
        }

        await target.ban({ reason });

        const embed = new EmbedBuilder()
          .setDescription(`<a:Checkmark:1535399839150379058> **〉** ${target} **__has been banned__** !`)
          .setColor(EMBED_COLOR);

        return message.reply({ embeds: [embed] });
      } else {
        await message.guild.members.ban(prefixArgs[0], { reason });

        let user = null;
        try {
          user = await client.users.fetch(prefixArgs[0]);
        } catch {}

        const displayName = user ? `**${user.tag}**` : `\`${prefixArgs[0]}\``;

        const embed = new EmbedBuilder()
          .setDescription(`<a:Checkmark:1535399839150379058> **〉** ${displayName} **__has been banned__** !`)
          .setColor(EMBED_COLOR);

        return message.reply({ embeds: [embed] });
      }
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to ban this user. Check the ID or permissions.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== UNBAN ==========
  if (prefixCommand === 'unban') {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the `Ban Members` permission to use this command.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-unban <ID>`').setColor(EMBED_COLOR)] });
    }

    try {
      let user = null;
      try {
        user = await client.users.fetch(prefixArgs[0]);
      } catch {}

      await message.guild.members.unban(prefixArgs[0]);

      const displayName = user ? `**${user.tag}**` : `\`${prefixArgs[0]}\``;

      const embed = new EmbedBuilder()
        .setDescription(`<a:Checkmark:1535399839150379058> **〉** ${displayName} **__has been unbanned__** !`)
        .setColor(EMBED_COLOR);

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to unban this user. Check the ID.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== VOICE MUTE ==========
  if (prefixCommand === 'vmute') {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the `Mute Members` permission to use this command.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-vmute <ID|@member|username> [reason]`').setColor(EMBED_COLOR)] });
    }

    let target = message.mentions.members.first();
    if (!target) target = message.guild.members.cache.get(prefixArgs[0]);
    if (!target) {
      target = message.guild.members.cache.find(m =>
        m.user.username.toLowerCase() === prefixArgs[0].toLowerCase() ||
        m.displayName.toLowerCase() === prefixArgs[0].toLowerCase()
      );
    }

    if (!target) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Member not found.**').setColor(EMBED_COLOR)] });
    }

    if (!target.voice.channel) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**This user is not in a voice channel.**').setColor(EMBED_COLOR)] });
    }

    const reason = prefixArgs.slice(1).join(' ') || 'No reason provided';

    try {
      await target.voice.setMute(true, reason);
      saveVMuteLog(target.id, message.author, reason, message.guild);

      return message.reply({ embeds: [new EmbedBuilder().setDescription(`<a:Checkmark:1535399839150379058> | **__Voice muted__** ${target}\n\n**__Reason__** : \`${reason}\`\n\n**__Muted by__** : ${message.author}`).setColor(EMBED_COLOR)] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to voice mute this user.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== VOICE UNMUTE ==========
  if (prefixCommand === 'vunmute') {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the `Mute Members` permission to use this command.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-vunmute <ID|@member|username>`').setColor(EMBED_COLOR)] });
    }

    let target = message.mentions.members.first();
    if (!target) target = message.guild.members.cache.get(prefixArgs[0]);
    if (!target) {
      target = message.guild.members.cache.find(m =>
        m.user.username.toLowerCase() === prefixArgs[0].toLowerCase() ||
        m.displayName.toLowerCase() === prefixArgs[0].toLowerCase()
      );
    }

    if (!target) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Member not found.**').setColor(EMBED_COLOR)] });
    }

    try {
      await target.voice.setMute(false);
      return message.reply({ embeds: [new EmbedBuilder().setDescription(`<a:Checkmark:1535399839150379058> | **__Voice unmuted__** ${target}\n\n**__Unmuted by__** : ${message.author}`).setColor(EMBED_COLOR)] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to voice unmute this user.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== VOICE MUTE LOGS ==========
  if (prefixCommand === 'vmlogs') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the `Administrator` permission to use this command.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-vmlogs <ID|@user>`').setColor(EMBED_COLOR)] });
    }

    let user = message.mentions.users.first();
    if (!user) {
      try { user = await client.users.fetch(prefixArgs[0]); } catch { user = null; }
    }

    if (!user) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**User not found.**').setColor(EMBED_COLOR)] });
    }

    const logs = JSON.parse(fs.readFileSync(MUTE_LOGS_FILE, 'utf8'));
    const userLogs = (logs[user.id] || []).filter(log => log.guildId === message.guild.id);

    if (userLogs.length === 0) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription(`<:pentacle_asexual:1536545946077495397> | **__No voice mute logs found for this user in this server__**`).setColor(EMBED_COLOR)] });
    }

    for (const log of userLogs) {
      const date = new Date(log.timestamp).toLocaleString('en-GB');

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setDescription(
`Voice state of <@${user.id}> has been updated.

<:server_mute:1535407964066943076> • **Server Mute**
True

**Responsible Moderator:**
<@${log.moderatorId}>

**Reason:**
Moderator : ${log.moderatorTag}
Reason : ${log.reason}
${log.guildName} • ${date}`
        )
        .setColor(EMBED_COLOR);

      await message.channel.send({ embeds: [embed] });
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // ========== NUKE (c) ==========
  if (prefixCommand === 'c') {
    if (message.author.id !== OWNER_ID) {
      return message.reply('<:ace_asexual_gay:1536500741525471442>');
    }

    const embed = new EmbedBuilder()
      .setDescription(`<a:Loading:1535311556735279144> | **___Nuking server__**\n\n\`Deleting all channels and roles...\``)
      .setColor(EMBED_COLOR);
    await message.reply({ embeds: [embed] });

    try {
      const guild = message.guild;

      for (const channel of [...guild.channels.cache.values()]) {
        await channel.delete().catch(() => {});
        await new Promise(r => setTimeout(r, 300));
      }

      const rolesToDelete = [...guild.roles.cache.values()]
        .filter(r => r.id !== guild.id && !r.managed && r.editable)
        .sort((a, b) => b.position - a.position);

      for (const role of rolesToDelete) {
        await role.delete().catch(() => {});
        await new Promise(r => setTimeout(r, 300));
      }

      const newChannel = await guild.channels.create({
        name: 'general',
        type: ChannelType.GuildText
      });

      const doneEmbed = new EmbedBuilder()
        .setDescription(`<a:Checkmark:1535399839150379058> | **__Server Nuked__**\n\n\`All channels and roles have been deleted.\``)
        .setColor(EMBED_COLOR);

      await newChannel.send({ embeds: [doneEmbed] });

    } catch (err) {
      console.error(err);
    }
  }
});

client.login(process.env.TOKEN);
