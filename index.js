require("dotenv").config();

// ============================================================
// MERGED BOT - astra + JAIL (FIXED)
// One Client • One login • No name conflicts
// ============================================================

const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
  AttachmentBuilder,
  ActivityType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  UserSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  SectionBuilder,
  ThumbnailBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { createCanvas, loadImage } = require("canvas");
const Canvas = require("canvas");

// ============================================================
// CONFIG
// ============================================================
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("Missing DISCORD_TOKEN in .env");
  process.exit(1);
}
const PREFIX = "-";
const COLOR = 0xdfe0ec;
const EMBED_COLOR = 0xdfe0ec;
const COMPONENT_COLOR = 0xdfe0ec;
const MAIN_COLOR = "#dfe0ec";

const NO = "<:emojigg_no:1539137860400324639>";
const CHECK = "<a:Checkmark:1535399839150379058>";
const BAN_EMOJI = "<:Dabingbong:1538785839897649212>";
const PAPER_PLANE = "<:PaperPlane:1538709170189107200>";
const MUTE_EMOJI = "<:server_mute:1535407964066943076>";
const WARN1_EMOJI = "<:LowWarning:1538779458083753985>";
const WARN2_EMOJI = "<:Warn:1538779652003332096>";
const WARN3_EMOJI = "<a:Sentinel_warn:1538779821188849775>";
const PINK_HEARTS = "<a:PinkHearts:1539463428421328947>";
const WATERMELON = "<a:eatingwatermelongoma:1539122698406600744>";
const JAIL_EMOJI = "<:JailPepe:1541009871451856966>";
const DM_EMOJI = "<a:DiamondAnnouncer:1541751015664132186>";

const BOY_COLOR = 0x0af539;
const GIRL_COLOR = 0xf50a93;
const DM_COLOR = 0xdfe0ec;

const VERIFICATION_BANNER = "https://media.discordapp.net/attachments/1537611791021121556/1541557082564731012/8619582e739caab22f923ba8ef77f53b.png?ex=6a8e0669&is=6a8cb4e9&hm=5df5476b59b6fbdb4992dfbdcbc76ff797582014ee94343dfe05953092efe8aa&=&format=webp&quality=lossless";
const VERIFICATION_AVATAR = "https://media.discordapp.net/attachments/1537611791021121556/1542132087518396556/image.png?ex=6a901ded&is=6a8ecc6d&hm=8923654f861ea3e3c17de0139b251149c2a6eaa5471f8be8a13a1fd49f9977b5&=&format=webp&quality=lossless";
const MUSIC_BANNER_URL = "https://media.discordapp.net/attachments/1311838374075568179/1541739938486157362/image.png?ex=6a8eb0b5&is=6a8d5f35&hm=9b08b32790d36e497fc01665ddfd8ffa6a8e70c98d2ca37f5bc9f65481a789c0&=&format=webp&quality=lossless";
const BANNER_URL = "https://media.discordapp.net/attachments/1515171494764875907/1541751594088140800/2f03bd9063e6e89d8f7327dd4565b41b.png";
const TICKET_BANNER_URL = "https://media.discordapp.net/attachments/1537611791021121556/1540327025741398118/0ce6d312c2daaeee7b86e16615d532cd.jpg?ex=6a8f7b94&is=6a8e2a14&hm=083a326ddba3fee3b69c2f73df7f3604133d7eac6230d769f4fa377c1989ed1b&=&format=webp"; // غير إلا بغيتي
const APPLICATION_BANNER_URL = "https://media.discordapp.net/attachments/1518709079881679028/1542132316896497764/image.png?ex=6a901e23&is=6a8ecca3&hm=51b9fb5c25fa15ab672cd02fd71f5987dad3669d4a41e1ac2ade5c010ceeb041&=&format=webp&quality=lossless";
const APPLICATION_RESULT_BANNER_URL = "https://media.discordapp.net/attachments/1518709079881679028/1542132316896497764/image.png?ex=6a901e23&is=6a8ecca3&hm=51b9fb5c25fa15ab672cd02fd71f5987dad3669d4a41e1ac2ade5c010ceeb041&=&format=webp&quality=lossless";

const MUSIC_BOTS = [
  { id: "411916947773587456", prefix: "m!p" },
  { id: "1375965764007366717", prefix: "k!p" },
  { id: "412347257233604609", prefix: "m!p" },
  { id: "412347780841865216", prefix: "m!p" },
  { id: "412347553141751808", prefix: "m!p" }
];

const OWNER_IDS = ["1500974923441639434"];
const OWNER_ID = "1500974923441639434";

const BACKGROUND_PATH = "./background.png";
const INVITE_BACKGROUND = path.join(__dirname, "assets", "background.png");

// ============================================================
// CLIENT (واحد فقط)
// ============================================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences
  ]
});

// ============================================================
// DATA FILES
// ============================================================
const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const MUTE_LOGS_FILE = path.join(DATA_DIR, "mute_logs.json");
const WARN_LOGS_FILE = path.join(DATA_DIR, "warn_logs.json");
const VERIFICATION_FILE = path.join(DATA_DIR, "verification.json");
const INVITES_FILE = path.join(DATA_DIR, "invites.json");
const JAIL_FILE = path.join(DATA_DIR, "jail.json");
const TICKET_FILE = path.join(DATA_DIR, "ticket.json");
const STAFF_FILE = path.join(DATA_DIR, "staff.json");

[MUTE_LOGS_FILE, WARN_LOGS_FILE, VERIFICATION_FILE, INVITES_FILE, JAIL_FILE, TICKET_FILE, STAFF_FILE].forEach(f => {
  if (!fs.existsSync(f)) fs.writeFileSync(f, "{}");
});

// ============================================================
// PENDING / CACHES
// ============================================================
const pendingActions = new Map();
const inviteCache = new Map();
const helpSessions = new Map();
const ticketSetups = new Map();
const staffSetups = new Map();
const ticketCooldowns = new Map();
const applicationCooldowns = new Map();

// ============================================================
// HELPERS
// ============================================================
function isOwner(userOrMember) {
  const id = typeof userOrMember === "string" ? userOrMember : (userOrMember?.id || userOrMember?.user?.id);
  return OWNER_IDS.includes(id);
}

function isAdmin(member) {
  return member?.permissions?.has(PermissionsBitField.Flags.Administrator) || false;
}

function cleanText(text) {
  return String(text || "")
    .replace(/@everyone/g, "@\u200beveryone")
    .replace(/@here/g, "@\u200bhere");
}

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return {}; }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function canManageChannels(member) {
  return member.permissions.has(PermissionFlagsBits.ManageChannels);
}

function canManageMessages(member) {
  return member.permissions.has(PermissionFlagsBits.ManageMessages);
}

// ============================================================
// COMPONENTS V2 HELPERS
// ============================================================
function v2Success(title, description, footer = "Amo • Moderation") {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${CHECK} | ${title}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${footer}`));
  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function v2Error(title, description, footer = "Amo • Moderation") {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${NO} | ${title}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${footer}`));
  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function v2Info(title, description, footer = "Amo • Moderation") {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${title}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${footer}`));
  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function v2Warning(title, description, emoji = "<:Warn:1538779652003332096>", footer = "Amo • Warnings") {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${emoji} | ${title}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${footer}`));
  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function v2Response({ title, description, emoji = "", footer = "Amo • Moderation" }) {
  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`${emoji} **${title}**`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${footer}`));
  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function makeContainer(title, description, accentColor = COLOR) {
  return new ContainerBuilder()
    .setAccentColor(accentColor)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(title))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description));
}

async function replyV2(message, title, description, accentColor = COLOR) {
  return message.reply({
    components: [makeContainer(title, description, accentColor)],
    flags: MessageFlags.IsComponentsV2
  });
}

async function interactionV2(interaction, title, description, accentColor = COLOR) {
  return interaction.reply({
    components: [makeContainer(title, description, accentColor)],
    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
  });
}

function text(content) {
  return new TextDisplayBuilder().setContent(content);
}

function separator() {
  return new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small);
}

function checkText(msg) {
  return `${CHECK} | ${msg}`;
}

function noText(msg) {
  return `${NO} | ${msg}`;
}

function cleaningText(msg) {
  return `<a:Pengu_Mop:1542312983701749911> | ${msg}`;
}

function formatTime(ts) {
  return `<t:${Math.floor(ts / 1000)}:F>`;
}

function remainingTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const EMOJI = {
  check: CHECK,
  no: NO,
  down: "<a:down_pengu:1538797873481785375>",
  home: "<:home:1538682398487613473>",
  close: "<:Background17:1539907260439072944>"
};

// ============================================================
// HELP SYSTEM - COMPLETE (ASTRA STYLE)
// ============================================================
const HELP_BANNER_URL =
  "https://media.discordapp.net/attachments/1536490013838024895/1541827710622503082/495703e73066c569b2c89189a91a881a.png?ex=6a8f0273&is=6a8db0f3&hm=f934cc1d2d98f5066b2a297acd409018e3763efa9814d1c97092a31525038650&=&format=webp&quality=lossless";

const HELP_CATEGORIES = {
  information: {
    name: "Information",
    commands: [
      ["-help", "Shows the help menu."],
      ["-u / -user", "Shows user information."],
      ["-server", "Shows server information."],
      ["-server <id>", "Shows information for a server by ID."],
      ["-a", "Shows a user's avatar."],
      ["-bn", "Shows a user's banner."],
      ["-nickname", "Changes a member's nickname."]
    ]
  },
  moderation: {
    name: "Moderation",
    commands: [
      ["-ban", "Bans a member."],
      ["-unban", "Unbans a user by ID."],
      ["-warn", "Warns a member (3 warns = ban)."],
      ["-warnings", "Shows a member's warnings."],
      ["-lock", "Locks a channel (text/voice)."],
      ["-unlock", "Unlocks a channel (text/voice)."],
      ["-clear", "Clears messages from a channel."],
      ["-esay", "Sends an embed as the bot."]
    ]
  },
  voice: {
    name: "Voice",
    commands: [
      ["-vmute", "Voice mutes a member."],
      ["-vunmute", "Removes voice mute."],
      ["-vmlogs", "Shows voice mute logs."],
      ["-ds", "Disconnects a member from voice."],
      ["-move", "Moves a member to a voice channel."]
    ]
  },
  activity: {
    name: "Activity",
    commands: [
      ["-activity / -act", "Shows activity stats (messages & voice)."],
      ["-rank / -r", "Shows text & voice rank card."],
      ["-invites", "Shows invite statistics."]
    ]
  },
  verification: {
    name: "Verification",
    commands: [
      ["-setup-verification", "Configures the verification system."],
      ["-vb", "Verifies a member as Boy."],
      ["-vg", "Verifies a member as Girl."],
      ["-verificator-list", "Shows the list of verifier roles."]
    ]
  },
  jail: {
    name: "Jail",
    commands: [
      ["-jail", "Jails a member."],
      ["-unjail", "Unjails a member."],
      ["-jaillist", "Shows currently jailed members."],
      ["-jailerlist", "Shows the jailer roles list."],
      ["-setup-jail", "Configures the jail system."],
      ["-jailer", "Configures jailer roles."]
    ]
  },
  setup: {
    name: "Setup",
    commands: [
      ["-setupticket", "Configures the ticket system."],
      ["-setupclear", "Configures roles allowed to use -clear."],
      ["-setupapply", "Configures staff applications."]
    ]
  },
  roles: {
    name: "Roles",
    commands: [
      ["-role", "Opens the role manager (add role)."],
      ["-removerole / -rrole", "Opens the role remover."],
      ["-createrole", "Creates a new role."]
    ]
  },
  fun: {
    name: "Fun",
    commands: [
      ["-kiss", "Sends a kiss GIF."],
      ["-slap", "Sends a slap GIF."],
      ["-hug", "Sends a hug GIF."],
      ["-pat", "Sends a pat GIF."],
      ["-love", "Shows love compatibility percentage."]
    ]
  }
};

function helpSelect(userId, disabled = false) {
  return new StringSelectMenuBuilder()
    .setCustomId(`help_category_${userId}`)
    .setPlaceholder("Select a category")
    .setDisabled(disabled)
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel("Information").setDescription("View Information Commands!").setValue("information"),
      new StringSelectMenuOptionBuilder().setLabel("Moderation").setDescription("View Moderation Commands!").setValue("moderation"),
      new StringSelectMenuOptionBuilder().setLabel("Voice").setDescription("View Voice Commands!").setValue("voice"),
      new StringSelectMenuOptionBuilder().setLabel("Activity").setDescription("View Activity Commands!").setValue("activity"),
      new StringSelectMenuOptionBuilder().setLabel("Verification").setDescription("View Verification Commands!").setValue("verification"),
      new StringSelectMenuOptionBuilder().setLabel("Jail").setDescription("View Jail Commands!").setValue("jail"),
      new StringSelectMenuOptionBuilder().setLabel("Setup").setDescription("View Setup Commands!").setValue("setup"),
      new StringSelectMenuOptionBuilder().setLabel("Roles").setDescription("View Roles Commands!").setValue("roles"),
      new StringSelectMenuOptionBuilder().setLabel("Fun").setDescription("View Fun Commands!").setValue("fun")
    );
}

function buildHelpHome(userId, disabled = false) {
  return new ContainerBuilder()
    .addTextDisplayComponents(text("# ❛ astra help  ❜"))
    .addSeparatorComponents(separator())
    .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(HELP_BANNER_URL))
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text("<a:eatingwatermelongoma:1539122698406600744>  **__Select a category from the menu below__**"))
    .addSeparatorComponents(separator())
    .addActionRowComponents(new ActionRowBuilder().addComponents(helpSelect(userId, disabled)))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`-# <@${OWNER_ID}> ${PINK_HEARTS}`));
}

function buildHelpCategory(userId, category, page = 0) {
  const data = HELP_CATEGORIES[category];
  if (!data) return buildHelpHome(userId);

  const commands = data.commands;
  const start = page * 4;
  const current = commands.slice(start, start + 4);
  const totalPages = Math.max(1, Math.ceil(commands.length / 4));

  const container = new ContainerBuilder()
    .addTextDisplayComponents(text(`# ❛ ${data.name} ❜`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**View ${data.name} Commands!**`))
    .addSeparatorComponents(separator())
    .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(HELP_BANNER_URL))
    )
    .addSeparatorComponents(separator());

  for (const [command, description] of current) {
    container
      .addTextDisplayComponents(text(`\`${command}\`\n↝ ${description}`))
      .addSeparatorComponents(separator());
  }

  container
    .addTextDisplayComponents(text(`Page ${page + 1}/${totalPages}`))
    .addSeparatorComponents(separator());

  const navRow = new ActionRowBuilder();

  if (page > 0) {
    navRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`help_prev_${userId}_${category}_${page}`)
        .setEmoji("<a:down_pengu:1538797873481785375>")
        .setStyle(ButtonStyle.Secondary)
    );
  } else {
    navRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`help_no_prev_${userId}`)
        .setEmoji("<a:down_pengu:1538797873481785375>")
        .setStyle(ButtonStyle.Secondary)
    );
  }

  if (page < totalPages - 1) {
    navRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`help_next_${userId}_${category}_${page}`)
        .setEmoji("<a:down_pengu:1538797873481785375>")
        .setStyle(ButtonStyle.Secondary)
    );
  } else {
    navRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`help_no_next_${userId}`)
        .setEmoji("<a:down_pengu:1538797873481785375>")
        .setStyle(ButtonStyle.Secondary)
    );
  }

  container
    .addActionRowComponents(navRow)
    .addSeparatorComponents(separator())
    .addActionRowComponents(new ActionRowBuilder().addComponents(helpSelect(userId)))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`-# <@${OWNER_ID}> ${PINK_HEARTS}`));

  return container;
}

// ============================================================
// ========== VERIFICATION SYSTEM ==========
// ============================================================
let verificationDB = readJSON(VERIFICATION_FILE);

function saveVerificationDB() {
  saveJSON(VERIFICATION_FILE, verificationDB);
}

function getVerificationConfig(guildId) {
  if (!verificationDB[guildId]) {
    verificationDB[guildId] = {
      boyRoleId: null,
      girlRoleId: null,
      unverifiedRoleId: null,
      verifierRoleIds: [],
      joinTrackChannelId: null,
      verificationLogsChannelId: null,
      commandChannelId: null,
      verifiedUsers: {}
    };
    saveVerificationDB();
  }
  const config = verificationDB[guildId];
  if (!Array.isArray(config.verifierRoleIds)) config.verifierRoleIds = [];
  if (!config.verifiedUsers) config.verifiedUsers = {};
  return config;
}

function isVerifier(member, config) {
  if (isAdmin(member)) return true;
  return config.verifierRoleIds.some(roleId => member.roles.cache.has(roleId));
}

function setupComplete(config) {
  return Boolean(
    config.boyRoleId &&
    config.girlRoleId &&
    config.unverifiedRoleId &&
    config.verifierRoleIds.length > 0 &&
    config.joinTrackChannelId &&
    config.verificationLogsChannelId &&
    config.commandChannelId
  );
}

function accountAge(timestamp) {
  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  if (remainingDays > 0 || parts.length === 0) parts.push(`${remainingDays} ${remainingDays === 1 ? "day" : "days"}`);
  return parts.join(", ");
}

async function findMember(message, input) {
  if (!input) return null;
  const mentioned = message.mentions.members.first();
  if (mentioned) return mentioned;
  const id = input.replace(/[<@!>]/g, "");
  if (!/^\d{17,20}$/.test(id)) return null;
  try { return await message.guild.members.fetch(id); }
  catch { return null; }
}

async function sendVerificationSetup(channel) {
  const config = getVerificationConfig(channel.guild.id);
  const boyRole = config.boyRoleId ? `<@&${config.boyRoleId}>` : "`Not selected`";
  const girlRole = config.girlRoleId ? `<@&${config.girlRoleId}>` : "`Not selected`";
  const unverifiedRole = config.unverifiedRoleId ? `<@&${config.unverifiedRoleId}>` : "`Not selected`";
  const verifierRoles = config.verifierRoleIds.length > 0 ? config.verifierRoleIds.map(id => `<@&${id}>`).join(" ") : "`Not selected`";
  const joinTrack = config.joinTrackChannelId ? `<#${config.joinTrackChannelId}>` : "`Not selected`";
  const logs = config.verificationLogsChannelId ? `<#${config.verificationLogsChannelId}>` : "`Not selected`";
  const commandChannel = config.commandChannelId ? `<#${config.commandChannelId}>` : "`Not selected`";

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("# Verification Setup"))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Boy Role:** ${boyRole}\n**Girl Role:** ${girlRole}\n**Unverified Role:** ${unverifiedRole}\n**Verifier Roles:** ${verifierRoles}\n**Join Track:** ${joinTrack}\n**Verification Logs:** ${logs}\n**Command Channel:** ${commandChannel}`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Boy Role**\nSelect the role assigned after Boy verification."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId("verification_boy_role").setPlaceholder("Select Boy Role").setMinValues(1).setMaxValues(1)
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Girl Role**\nSelect the role assigned after Girl verification."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId("verification_girl_role").setPlaceholder("Select Girl Role").setMinValues(1).setMaxValues(1)
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Unverified Role**\nThis role will be removed automatically after verification."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId("verification_unverified_role").setPlaceholder("Select Unverified Role").setMinValues(1).setMaxValues(1)
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Verifier Roles**\nSelect up to 10 roles allowed to verify members."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId("verification_verifier_roles").setPlaceholder("Select Verifier Roles").setMinValues(1).setMaxValues(10)
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Join Track**\nSelect the channel where member joins will be logged."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId("verification_join_track").setPlaceholder("Select Join Track Channel").setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Verification Logs**\nSelect the channel used for verification logs."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId("verification_logs").setPlaceholder("Select Verification Logs Channel").setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Channel for Commands**\nSelect where `-vb` and `-vg` can be used."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId("verification_command_channel").setPlaceholder("Select Command Channel").setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("verification_refresh").setLabel("Refresh").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("verification_cancel").setLabel("Cancel").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("verification_done").setLabel("Done").setStyle(ButtonStyle.Success)
    ));

  return channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

async function sendJoinLog(member) {
  const config = getVerificationConfig(member.guild.id);
  const channel = member.guild.channels.cache.get(config.joinTrackChannelId);
  if (!channel?.isTextBased()) return;

  const avatar = member.user.displayAvatarURL({ extension: "png", size: 128 });
  const created = Math.floor(member.user.createdTimestamp / 1000);
  const joined = Math.floor((member.joinedTimestamp || Date.now()) / 1000);

  const section = new SectionBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${member.guild.name} • Member Joined`))
    .setThumbnailAccessory(new ThumbnailBuilder().setURL(avatar));

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addSectionComponents(section)
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**User:** ${member}\n**Tag:** ${member.user.tag}\n**ID:** ${member.id}`
    ))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Created:** <t:${created}:F>\n**Age:** ${accountAge(member.user.createdTimestamp)}\n**Joined:** <t:${joined}:F>`
    ));

  return channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

async function sendVerificationLog({ guild, config, target, verifier, type }) {
  const channel = guild.channels.cache.get(config.verificationLogsChannelId);
  if (!channel?.isTextBased()) return;

  const accent = type === "Boy" ? BOY_COLOR : GIRL_COLOR;
  const targetAvatar = target.user.displayAvatarURL({ extension: "png", size: 128 });
  const verifierAvatar = verifier.user.displayAvatarURL({ extension: "png", size: 128 });
  const verifiedAt = Math.floor(Date.now() / 1000);

  const userSection = new SectionBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**User:** ${target}\n**User ID:** ${target.id}\n**Account Age:** ${accountAge(target.user.createdTimestamp)}`
    ))
    .setThumbnailAccessory(new ThumbnailBuilder().setURL(targetAvatar));

  const verifierSection = new SectionBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Verifier:** ${verifier}\n**Verifier ID:** ${verifier.id}\n**Verified At:** <t:${verifiedAt}:F>`
    ))
    .setThumbnailAccessory(new ThumbnailBuilder().setURL(verifierAvatar));

  const container = new ContainerBuilder()
    .setAccentColor(accent)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${guild.name} • ${type} Verified`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addSectionComponents(userSection)
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addSectionComponents(verifierSection);

  return channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

async function sendVerificationDM({ member, guild, type }) {
  const accent = type === "Boy" ? BOY_COLOR : GIRL_COLOR;
  const user = await client.users.fetch(member.id).catch(() => null);
  if (!user) return false;

  const header = new SectionBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${WATERMELON} Verification Successful`))
    .setThumbnailAccessory(new ThumbnailBuilder().setURL(VERIFICATION_AVATAR));

  const info = new TextDisplayBuilder().setContent(
    `✦ Server: **${guild.name}**\n✦ Action: **Verified (${type})**\n✦ Welcome: \`You have been unlocked!\``
  );

  const banner = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(VERIFICATION_BANNER));
  const footer = new TextDisplayBuilder().setContent("-# > Welcome to the community!");

  const container = new ContainerBuilder()
    .setAccentColor(accent)
    .addSectionComponents(header)
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(info)
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addMediaGalleryComponents(banner)
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
    .addTextDisplayComponents(footer);

  try {
    await user.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
    return true;
  } catch {
    return false;
  }
}

function accentColorForType(type) {
  return type === "Boy" ? BOY_COLOR : GIRL_COLOR;
}

async function verifyMember({ message, target, type }) {
  const config = getVerificationConfig(message.guild.id);
  const newRoleId = type === "Boy" ? config.boyRoleId : config.girlRoleId;
  const oppositeRoleId = type === "Boy" ? config.girlRoleId : config.boyRoleId;
  const newRole = message.guild.roles.cache.get(newRoleId);
  const oppositeRole = message.guild.roles.cache.get(oppositeRoleId);
  const unverifiedRole = message.guild.roles.cache.get(config.unverifiedRoleId);

  if (!newRole) return replyV2(message, "# Configuration Error", `${type} Role is not configured correctly.`);
  if (!unverifiedRole) return replyV2(message, "# Configuration Error", "Unverified Role is not configured correctly.");
  if (target.id === message.author.id) return replyV2(message, "# Action Denied", "You cannot verify yourself.");
  if (target.user.bot) return replyV2(message, "# Action Denied", "Bots cannot be verified.");
  if (target.roles.cache.has(newRole.id)) return replyV2(message, "# Already Verified", `${target} is already verified as **${type}**.`);
  if (oppositeRole && target.roles.cache.has(oppositeRole.id)) {
    const oppositeType = type === "Boy" ? "Girl" : "Boy";
    return replyV2(message, "# Already Verified", `${target} is already verified as **${oppositeType}**.`);
  }

  const botMember = message.guild.members.me;
  if (!botMember) return replyV2(message, "# Bot Error", "I could not determine my server permissions.");
  if (newRole.position >= botMember.roles.highest.position) {
    return replyV2(message, "# Role Hierarchy", `I cannot assign ${newRole}. Move my highest role above the verification roles.`);
  }
  if (unverifiedRole.position >= botMember.roles.highest.position) {
    return replyV2(message, "# Role Hierarchy", `I cannot remove ${unverifiedRole}. Move my highest role above the Unverified Role.`);
  }

  try {
    if (target.roles.cache.has(unverifiedRole.id)) {
      await target.roles.remove(unverifiedRole, `Verification by ${message.author.tag}`);
    }
    if (oppositeRole && target.roles.cache.has(oppositeRole.id)) {
      await target.roles.remove(oppositeRole, `Changing verification to ${type}`);
    }
    await target.roles.add(newRole, `Verified as ${type} by ${message.author.tag}`);
  } catch (error) {
    console.error("Verification role error:", error);
    return replyV2(message, "# Verification Failed", "I could not update this member's roles. Check my permissions and role hierarchy.");
  }

  config.verifiedUsers[target.id] = {
    type,
    verifiedBy: message.author.id,
    verifiedAt: Date.now()
  };
  saveVerificationDB();

  await replyV2(message, `# ${CHECK} | Verification Successful`, `${target} has been successfully verified as **${type}**.`, accentColorForType(type));

  try {
    await sendVerificationLog({ guild: message.guild, config, target, verifier: message.member, type });
  } catch (e) {
    console.error("Verification log error:", e);
  }

  await sendVerificationDM({ member: target, guild: message.guild, type });
}

async function sendVerificatorList(message) {
  const config = getVerificationConfig(message.guild.id);
  if (config.verifierRoleIds.length === 0) {
    return replyV2(message, "# Verificator List", "No Verifier Roles have been configured yet.");
  }

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("# Verificator List"))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));

  for (let i = 0; i < config.verifierRoleIds.length; i++) {
    const roleId = config.verifierRoleIds[i];
    const role = message.guild.roles.cache.get(roleId);
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**${i + 1}.** ${role ? role : `Unknown Role \`${roleId}\``}`
    ));
    if (i < config.verifierRoleIds.length - 1) {
      container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
    }
  }

  return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

// ============================================================
// ========== MODERATION (Mute / Warn / Role) ==========
// ============================================================
function readMuteLogs() { return readJSON(MUTE_LOGS_FILE); }
function saveMuteLogs(data) { saveJSON(MUTE_LOGS_FILE, data); }
function saveVMuteLog(targetId, moderatorId, reason, guild) {
  const logs = readMuteLogs();
  if (!logs[targetId]) logs[targetId] = [];
  logs[targetId].push({
    guildId: guild.id,
    moderatorId: moderatorId || "Unknown",
    reason: reason || "No reason provided",
    timestamp: Date.now()
  });
  saveMuteLogs(logs);
}

function readWarnLogs() { return readJSON(WARN_LOGS_FILE); }
function saveWarnLogs(data) { saveJSON(WARN_LOGS_FILE, data); }
function getWarns(userId, guildId) {
  const logs = readWarnLogs();
  return (logs[userId] || []).filter(log => log.guildId === guildId);
}
function saveWarn(userId, moderator, reason, guild) {
  const logs = readWarnLogs();
  if (!logs[userId]) logs[userId] = [];
  logs[userId].push({
    guildId: guild.id,
    moderatorId: moderator.id,
    reason,
    timestamp: Date.now()
  });
  saveWarnLogs(logs);
}
function clearWarns(userId, guildId) {
  const logs = readWarnLogs();
  if (!logs[userId]) return;
  logs[userId] = logs[userId].filter(log => log.guildId !== guildId);
  if (logs[userId].length === 0) delete logs[userId];
  saveWarnLogs(logs);
}

function createRoleActionMessage(type) {
  const isAdd = type === "add";
  const title = isAdd ? "# Role Manager" : "# Remove Role";
  const description = isAdd
    ? "Select the **role** and then select the **member** you want to give the role to.\n\nWhen finished, click **Done**."
    : "Select the **role** and then select the **member** you want to remove the role from.\n\nWhen finished, click **Done**.";

  const roleMenu = new RoleSelectMenuBuilder()
    .setCustomId(`role_action_role_${type}`)
    .setPlaceholder(isAdd ? "Select a role to add" : "Select a role to remove")
    .setMinValues(1).setMaxValues(1);

  const userMenu = new UserSelectMenuBuilder()
    .setCustomId(`role_action_user_${type}`)
    .setPlaceholder("Select a member")
    .setMinValues(1).setMaxValues(1);

  const doneButton = new ButtonBuilder().setCustomId(`role_action_done_${type}`).setLabel("Done").setStyle(ButtonStyle.Success);
  const cancelButton = new ButtonBuilder().setCustomId(`role_action_cancel_${type}`).setLabel("Cancel").setStyle(ButtonStyle.Danger);

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(title))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Role**\nChoose the role."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(roleMenu))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Member**\nChoose the member."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(userMenu))
    .addSeparatorComponents(new SeparatorBuilder())
    .addActionRowComponents(new ActionRowBuilder().addComponents(doneButton, cancelButton));

  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

async function roleCommand(message, type) {
  if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
    return message.reply(v2Error("Missing Permission", "You need the **Manage Roles** permission to use this command."));
  }
  const msg = await message.reply(createRoleActionMessage(type));
  pendingActions.set(msg.id, { userId: message.author.id, type, roleId: null, memberId: null });
  setTimeout(() => { if (pendingActions.has(msg.id)) pendingActions.delete(msg.id); }, 10 * 60 * 1000);
}

function createMusicPanel(guild) {
  const banner = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(MUSIC_BANNER_URL));
  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## <a:MusicNotes:1539155015338295337> ** | ${guild.name} Music Bots Panel**`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("Need some music in your voice channel? Click the button and we'll assign you a free music bot!"))
    .addSeparatorComponents(new SeparatorBuilder())
    .addMediaGalleryComponents(banner)
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("One Click Is All It Takes!"))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("music_get_bot").setLabel("Get A Music Bot").setStyle(ButtonStyle.Secondary)
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# © 2026 ${guild.name}™. All rights reserved.`));
  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

function createWarningsPage(user, warns) {
  if (warns.length === 0) {
    return v2Info(`Warnings • ${user.tag}`, `**${user.tag}** has no warnings in this server.`, "Amo • Warnings");
  }

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## Warnings • ${user.tag}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### Warnings History (${warns.length}/3)`));

  const sortedWarns = warns.slice().sort((a, b) => b.timestamp - a.timestamp);
  sortedWarns.forEach((log, index) => {
    container
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `**${index + 1}.** <t:${Math.floor(log.timestamp / 1000)}:R>\n` +
        `> **Moderator:** <@${log.moderatorId}>\n` +
        `> **Reason:** ${cleanText(log.reason)}\n` +
        `> **Date:** <t:${Math.floor(log.timestamp / 1000)}:F>`
      ))
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`clear_warn_${user.id}_${log.timestamp}`)
          .setLabel("Clear Warning")
          .setStyle(ButtonStyle.Danger)
      ));
  });

  container
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("-# Amo • Warnings"));

  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}// ============================================================
// ========== ACTIVITY SYSTEM ==========
// ============================================================
const activityDB = new Database(path.join(DATA_DIR, "activity.db"));
activityDB.pragma("journal_mode = WAL");
activityDB.exec(`
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS voice_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER
);
CREATE TABLE IF NOT EXISTS level_overrides (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  text_xp INTEGER DEFAULT 0,
  voice_xp INTEGER DEFAULT 0,
  PRIMARY KEY (guild_id, user_id)
);
CREATE INDEX IF NOT EXISTS messages_index ON messages(guild_id, user_id, created_at);
CREATE INDEX IF NOT EXISTS voice_index ON voice_sessions(guild_id, user_id, started_at);
`);

const addMessage = activityDB.prepare(`INSERT INTO messages (guild_id, user_id, channel_id, created_at) VALUES (?, ?, ?, ?)`);
const addVoice = activityDB.prepare(`INSERT INTO voice_sessions (guild_id, user_id, channel_id, started_at) VALUES (?, ?, ?, ?)`);
const endVoice = activityDB.prepare(`UPDATE voice_sessions SET ended_at = ? WHERE guild_id = ? AND user_id = ? AND ended_at IS NULL`);

const DAY = 24 * 60 * 60 * 1000;

function formatNumber(n) { return Number(n || 0).toLocaleString("en-US"); }
function formatDuration(ms) {
  if (!ms || ms < 60000) return "0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
function short(text, max = 16) {
  text = String(text || "");
  return text.length <= max ? text : text.slice(0, max - 3) + "...";
}
function formatDate(date) {
  if (!date) return "Unknown";
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}

function getMessages(guildId, userId, since) {
  return activityDB.prepare(`SELECT COUNT(*) AS count FROM messages WHERE guild_id = ? AND user_id = ? AND created_at >= ?`).get(guildId, userId, since).count;
}
function getMessagesBetween(guildId, userId, start, end = Date.now()) {
  return activityDB.prepare(`SELECT COUNT(*) AS count FROM messages WHERE guild_id = ? AND user_id = ? AND created_at >= ? AND created_at < ?`).get(guildId, userId, start, end).count;
}
function getVoice(guildId, userId, since = 0, until = Date.now()) {
  const rows = activityDB.prepare(`SELECT started_at, ended_at FROM voice_sessions WHERE guild_id = ? AND user_id = ? AND (ended_at IS NULL OR ended_at > ?)`).all(guildId, userId, since);
  let total = 0;
  for (const row of rows) {
    const start = Math.max(row.started_at, since);
    const end = Math.min(row.ended_at || until, until);
    if (end > start) total += end - start;
  }
  return total;
}
function getDaily(guildId, userId) {
  const result = [];
  const now = Date.now();
  for (let i = 13; i >= 0; i--) {
    const end = now - i * DAY;
    const start = end - DAY;
    result.push({
      messages: getMessagesBetween(guildId, userId, start, end),
      voice: getVoice(guildId, userId, start, end)
    });
  }
  return result;
}
function getTopTextChannels(guildId, userId, since) {
  return activityDB.prepare(`SELECT channel_id, COUNT(*) AS count FROM messages WHERE guild_id = ? AND user_id = ? AND created_at >= ? GROUP BY channel_id ORDER BY count DESC LIMIT 4`).all(guildId, userId, since);
}
function getTopVoiceChannels(guildId, userId, since) {
  const rows = activityDB.prepare(`SELECT channel_id, started_at, ended_at FROM voice_sessions WHERE guild_id = ? AND user_id = ? AND (ended_at IS NULL OR ended_at > ?)`).all(guildId, userId, since);
  const channels = {};
  for (const row of rows) {
    const start = Math.max(row.started_at, since);
    const end = row.ended_at || Date.now();
    if (end <= start) continue;
    channels[row.channel_id] = (channels[row.channel_id] || 0) + (end - start);
  }
  return Object.entries(channels).map(([channel_id, ms]) => ({ channel_id, ms })).sort((a, b) => b.ms - a.ms).slice(0, 4);
}

function roundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
function write(ctx, text, x, y, size, color = "#fff", weight = "normal") {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Sans`;
  ctx.fillText(String(text), x, y);
}
function drawChart(ctx, x, y, w, h, daily) {
  const messages = daily.map(d => d.messages);
  const voice = daily.map(d => Math.floor(d.voice / 60000));
  const max = Math.max(...messages, ...voice, 1);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const yy = y + (h / 3) * i;
    ctx.beginPath();
    ctx.moveTo(x, yy);
    ctx.lineTo(x + w, yy);
    ctx.stroke();
  }
  ctx.beginPath();
  messages.forEach((val, i) => {
    const px = x + (w / 13) * i;
    const py = y + h - (val / max) * h;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.beginPath();
  voice.forEach((val, i) => {
    const px = x + (w / 13) * i;
    const py = y + h - (val / max) * h;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.strokeStyle = "#ec4899";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();
}

async function createActivityImage(user, guild, data) {
  const WIDTH = 1000, HEIGHT = 620;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  try {
    const bg = await loadImage(BACKGROUND_PATH);
    const scale = Math.max(WIDTH / bg.width, HEIGHT / bg.height);
    const bw = bg.width * scale, bh = bg.height * scale;
    ctx.drawImage(bg, (WIDTH - bw) / 2, (HEIGHT - bh) / 2, bw, bh);
    ctx.fillStyle = "rgba(0,0,0,0.58)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } catch {
    ctx.fillStyle = "#0f1014";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke(); }
  for (let y = 0; y < HEIGHT; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke(); }

  try {
    const avatar = await loadImage(user.displayAvatarURL({ extension: "png", size: 128 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(70, 60, 32, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 38, 28, 64, 64);
    ctx.restore();
  } catch {}

  write(ctx, user.globalName || user.username, 120, 50, 26, "#ffffff", "bold");
  write(ctx, `@${user.username} • ACTIVITY PROFILE`, 120, 75, 13, "#9ca3af");

  roundRect(ctx, 720, 30, 120, 40, 10, "rgba(30,31,36,0.85)");
  write(ctx, "JOINED SERVER", 732, 47, 10, "#9ca3af");
  write(ctx, formatDate(data.joinedAt), 732, 63, 13, "#ffffff", "bold");

  roundRect(ctx, 855, 30, 120, 40, 10, "rgba(30,31,36,0.85)");
  write(ctx, "CREATED ON", 867, 47, 10, "#9ca3af");
  write(ctx, formatDate(data.createdAt), 867, 63, 13, "#ffffff", "bold");

  roundRect(ctx, 30, 110, 300, 200, 16, "rgba(25,26,31,0.82)");
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(45, 125, 40, 3);
  write(ctx, "MESSAGES", 45, 155, 16, "#ffffff", "bold");
  [
    { label: "LAST 24H", value: data.messages24 },
    { label: "LAST 7 DAYS", value: data.messages7 },
    { label: "LAST 14 DAYS", value: data.messages14 }
  ].forEach((row, i) => {
    const y = 175 + i * 38;
    roundRect(ctx, 45, y, 270, 32, 8, "rgba(15,16,20,0.7)");
    write(ctx, row.label, 58, y + 21, 12, "#9ca3af");
    write(ctx, formatNumber(row.value), 250, y + 21, 14, "#ffffff", "bold");
    write(ctx, "Messages", 200, y + 21, 11, "#6b7280");
  });

  roundRect(ctx, 350, 110, 300, 200, 16, "rgba(25,26,31,0.82)");
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(365, 125, 40, 3);
  write(ctx, "VOICE TIME", 365, 155, 16, "#ffffff", "bold");
  [
    { label: "LAST 24H", value: data.voice24 },
    { label: "LAST 7 DAYS", value: data.voice7 },
    { label: "LAST 14 DAYS", value: data.voice14 }
  ].forEach((row, i) => {
    const y = 175 + i * 38;
    roundRect(ctx, 365, y, 270, 32, 8, "rgba(15,16,20,0.7)");
    write(ctx, row.label, 378, y + 21, 12, "#9ca3af");
    write(ctx, formatDuration(row.value), 560, y + 21, 14, "#ffffff", "bold");
    write(ctx, "Time", 520, y + 21, 11, "#6b7280");
  });

  roundRect(ctx, 670, 110, 300, 200, 16, "rgba(25,26,31,0.82)");
  write(ctx, "Charts", 685, 140, 15, "#ffffff", "bold");
  ctx.fillStyle = "#22c55e";
  ctx.beginPath(); ctx.arc(780, 135, 5, 0, Math.PI * 2); ctx.fill();
  write(ctx, "Message", 790, 139, 12, "#d1d5db");
  ctx.fillStyle = "#ec4899";
  ctx.beginPath(); ctx.arc(870, 135, 5, 0, Math.PI * 2); ctx.fill();
  write(ctx, "Voice", 880, 139, 12, "#d1d5db");
  drawChart(ctx, 690, 160, 260, 125, data.daily);

  roundRect(ctx, 30, 330, 940, 110, 16, "rgba(25,26,31,0.82)");
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(45, 345, 40, 3);
  write(ctx, "YOUR TOP TEXT CHANNELS", 45, 375, 14, "#ffffff", "bold");
  data.topText.slice(0, 4).forEach((item, i) => {
    const channel = guild.channels.cache.get(item.channel_id);
    const x = 45 + i * 230;
    roundRect(ctx, x, 395, 215, 32, 8, "rgba(15,16,20,0.75)");
    write(ctx, `#${channel ? short(channel.name, 16) : "unknown"}`, x + 12, 416, 12, "#ffffff");
    write(ctx, `${formatNumber(item.count)} msgs`, x + 145, 416, 11, "#9ca3af");
  });

  roundRect(ctx, 30, 460, 940, 110, 16, "rgba(25,26,31,0.82)");
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(45, 475, 40, 3);
  write(ctx, "YOUR TOP VOICE CHANNELS", 45, 505, 14, "#ffffff", "bold");
  data.topVoice.slice(0, 4).forEach((item, i) => {
    const channel = guild.channels.cache.get(item.channel_id);
    const x = 45 + i * 230;
    roundRect(ctx, x, 525, 215, 32, 8, "rgba(15,16,20,0.75)");
    write(ctx, channel ? short(channel.name, 16) : "unknown", x + 12, 546, 12, "#ffffff");
    write(ctx, formatDuration(item.ms), x + 145, 546, 11, "#9ca3af");
  });

  write(ctx, "All metrics based on a 14-day lookback period", 30, 595, 12, "#6b7280");
  return canvas.toBuffer("image/png");
}

async function activityCommand(message, args) {
  if (!message.guild) return;
  await message.channel.sendTyping();

  let user = message.mentions.users.first() || null;
  if (!user && args[0] && /^\d{17,20}$/.test(args[0])) {
    user = await client.users.fetch(args[0]).catch(() => null);
    if (!user) return message.reply(v2Error("Activity", "I couldn't find a user with that ID."));
  }
  if (!user) user = message.author;

  let member = message.mentions.members?.first() || null;
  if (!member && user.id === message.author.id) member = message.member;
  if (!member) member = await message.guild.members.fetch(user.id).catch(() => null);

  const guild = message.guild;
  const now = Date.now();
  const data = {
    messages24: getMessages(guild.id, user.id, now - DAY),
    messages7: getMessages(guild.id, user.id, now - DAY * 7),
    messages14: getMessages(guild.id, user.id, now - DAY * 14),
    voice24: getVoice(guild.id, user.id, now - DAY),
    voice7: getVoice(guild.id, user.id, now - DAY * 7),
    voice14: getVoice(guild.id, user.id, now - DAY * 14),
    daily: getDaily(guild.id, user.id),
    topText: getTopTextChannels(guild.id, user.id, now - DAY * 14),
    topVoice: getTopVoiceChannels(guild.id, user.id, now - DAY * 14),
    createdAt: user.createdAt,
    joinedAt: member?.joinedAt || null
  };

  const image = await createActivityImage(user, guild, data);
  const attachment = new AttachmentBuilder(image, { name: `activity-${user.id}.png` });
  await message.channel.send({ files: [attachment] });
}

// Rank helpers
function getTotalMessages(guildId, userId) {
  return activityDB.prepare(`SELECT COUNT(*) AS count FROM messages WHERE guild_id = ? AND user_id = ?`).get(guildId, userId).count;
}
function getOverride(guildId, userId) {
  return activityDB.prepare(`SELECT text_xp, voice_xp FROM level_overrides WHERE guild_id = ? AND user_id = ?`).get(guildId, userId) || { text_xp: 0, voice_xp: 0 };
}
function setOverride(guildId, userId, type, xp) {
  const current = getOverride(guildId, userId);
  if (type === "text") current.text_xp = xp;
  if (type === "voice") current.voice_xp = xp;
  activityDB.prepare(`
    INSERT INTO level_overrides (guild_id, user_id, text_xp, voice_xp)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(guild_id, user_id) DO UPDATE SET text_xp = excluded.text_xp, voice_xp = excluded.voice_xp
  `).run(guildId, userId, current.text_xp, current.voice_xp);
}
function getTextXP(guildId, userId) {
  const override = getOverride(guildId, userId);
  if (override.text_xp > 0) return override.text_xp;
  return Math.floor(getTotalMessages(guildId, userId) * 0.4);
}
function getVoiceXP(guildId, userId) {
  const override = getOverride(guildId, userId);
  if (override.voice_xp > 0) return override.voice_xp;
  const minutes = Math.floor(getVoice(guildId, userId, 0) / 60000);
  return minutes * 2;
}
function getLevelInfo(xp) {
  let level = 1, remaining = xp, needed = 100;
  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed += 50;
    if (level > 100) break;
  }
  return { level: Math.min(level, 100), current: remaining, needed, totalXP: xp };
}
function xpForLevel(level) {
  if (level <= 1) return 0;
  let xp = 0, needed = 100;
  for (let i = 1; i < level; i++) {
    xp += needed;
    needed += 50;
  }
  return xp;
}

async function createRankImage(user, textInfo, voiceInfo) {
  const WIDTH = 700, HEIGHT = 260;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  let usedBanner = false;

  try {
    const fullUser = await client.users.fetch(user.id, { force: true });
    if (fullUser.banner) {
      const bannerURL = fullUser.bannerURL({ size: 1024, extension: "png" });
      const banner = await loadImage(bannerURL);
      const scale = Math.max(WIDTH / banner.width, HEIGHT / banner.height);
      const bw = banner.width * scale, bh = banner.height * scale;
      ctx.drawImage(banner, (WIDTH - bw) / 2, (HEIGHT - bh) / 2, bw, bh);
      usedBanner = true;
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  } catch {}

  if (!usedBanner) {
    try {
      const bg = await loadImage(BACKGROUND_PATH);
      const scale = Math.max(WIDTH / bg.width, HEIGHT / bg.height);
      const bw = bg.width * scale, bh = bg.height * scale;
      ctx.drawImage(bg, (WIDTH - bw) / 2, (HEIGHT - bh) / 2, bw, bh);
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    } catch {
      ctx.fillStyle = "#0f1014";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }

  roundRect(ctx, 15, 15, WIDTH - 30, HEIGHT - 30, 20, "rgba(20, 21, 26, 0.72)");

  try {
    const avatar = await loadImage(user.displayAvatarURL({ extension: "png", size: 128 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(90, 100, 45, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 45, 55, 90, 90);
    ctx.restore();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(90, 100, 47, 0, Math.PI * 2);
    ctx.stroke();
  } catch {}

  write(ctx, user.globalName || user.username, 160, 70, 24, "#ffffff", "bold");
  write(ctx, `@${user.username}`, 160, 95, 14, "#9ca3af");

  write(ctx, `${textInfo.current} / ${textInfo.needed} XP`, 160, 135, 14, "#e5e7eb");
  write(ctx, "TEXT LEVEL", 480, 120, 12, "#9ca3af");
  write(ctx, textInfo.level, 610, 125, 22, "#3b82f6", "bold");
  roundRect(ctx, 160, 145, 400, 14, 8, "rgba(55, 65, 81, 0.8)");
  const textProgress = Math.min(textInfo.current / textInfo.needed, 1);
  if (textProgress > 0) roundRect(ctx, 160, 145, 400 * textProgress, 14, 8, "#3b82f6");

  write(ctx, `${voiceInfo.current} / ${voiceInfo.needed} XP (Voice)`, 160, 185, 14, "#e5e7eb");
  write(ctx, "VOICE LEVEL", 480, 170, 12, "#9ca3af");
  write(ctx, voiceInfo.level, 610, 175, 22, "#22c55e", "bold");
  roundRect(ctx, 160, 195, 400, 14, 8, "rgba(55, 65, 81, 0.8)");
  const voiceProgress = Math.min(voiceInfo.current / voiceInfo.needed, 1);
  if (voiceProgress > 0) roundRect(ctx, 160, 195, 400 * voiceProgress, 14, 8, "#22c55e");

  return canvas.toBuffer("image/png");
}

async function rankCommand(message, args) {
  await message.channel.sendTyping();
  let user = message.mentions.users.first() || null;
  if (!user && args[0] && /^\d+$/.test(args[0])) {
    user = await client.users.fetch(args[0]).catch(() => null);
  }
  if (!user) user = message.author;

  const textInfo = getLevelInfo(getTextXP(message.guild.id, user.id));
  const voiceInfo = getLevelInfo(getVoiceXP(message.guild.id, user.id));
  const image = await createRankImage(user, textInfo, voiceInfo);
  const attachment = new AttachmentBuilder(image, { name: `rank-${user.id}.png` });
  await message.channel.send({ files: [attachment] });
}

async function ranklCommand(message, args) {
  if (!isOwner(message.author.id)) {
    return message.reply({ embeds: [{ color: 0x3a3b3b, description: `${NO} Only the **bot owner** can use this command.` }] });
  }
  if (args.length < 3) {
    return message.reply({ embeds: [{ color: 0x3a3b3b, description: `${NO} Usage: \`-rankl @user text 5\` or \`-rankl @user voice 3\`` }] });
  }

  let user = message.mentions.users.first() || null;
  if (!user && /^\d+$/.test(args[0])) user = await client.users.fetch(args[0]).catch(() => null);
  if (!user) return message.reply({ embeds: [{ color: 0x3a3b3b, description: `${NO} User not found.` }] });

  const type = args[1]?.toLowerCase();
  const level = parseInt(args[2]);
  if (type !== "text" && type !== "voice") {
    return message.reply({ embeds: [{ color: 0x3a3b3b, description: `${NO} Please use \`text\` or \`voice\`.` }] });
  }
  if (isNaN(level) || level < 1 || level > 100) {
    return message.reply({ embeds: [{ color: 0x3a3b3b, description: `${NO} Level must be between **1** and **100**.` }] });
  }

  const xp = xpForLevel(level);
  setOverride(message.guild.id, user.id, type, xp);
  return message.reply({ embeds: [{ color: 0x3a3b3b, description: `${CHECK} Successfully set **${type === "text" ? "Text" : "Voice"} Level** of **${user.username}** to **${level}**.` }] });
}

// ============================================================
// ========== INVITE TRACKER ==========
// ============================================================
let inviteDB = readJSON(INVITES_FILE);

function saveInviteDB() { saveJSON(INVITES_FILE, inviteDB); }
function getUserData(guildId, userId) {
  if (!inviteDB[guildId]) inviteDB[guildId] = {};
  if (!inviteDB[guildId][userId]) {
    inviteDB[guildId][userId] = { total: 0, left: 0, joined: 0, members: {} };
  }
  return inviteDB[guildId][userId];
}

async function cacheInvites(guild) {
  try {
    const invites = await guild.invites.fetch();
    const map = new Map();
    for (const invite of invites.values()) {
      map.set(invite.code, { uses: invite.uses || 0, inviterId: invite.inviter?.id || null });
    }
    inviteCache.set(guild.id, map);
  } catch {}
}

async function findUsedInvite(guild) {
  try {
    const oldInvites = inviteCache.get(guild.id) || new Map();
    const newInvites = await guild.invites.fetch();
    let usedInvite = null;
    for (const invite of newInvites.values()) {
      const oldInvite = oldInvites.get(invite.code);
      if (!oldInvite) continue;
      if ((invite.uses || 0) > (oldInvite.uses || 0)) {
        usedInvite = invite;
        break;
      }
    }
    const updatedCache = new Map();
    for (const invite of newInvites.values()) {
      updatedCache.set(invite.code, { uses: invite.uses || 0, inviterId: invite.inviter?.id || null });
    }
    inviteCache.set(guild.id, updatedCache);
    return usedInvite;
  } catch {
    return null;
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStatBox(ctx, x, y, title, value) {
  const width = 175, height = 105;
  roundedRect(ctx, x, y, width, height, 14);
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.fill();
  ctx.strokeStyle = MAIN_COLOR;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = MAIN_COLOR;
  const valueText = String(value);
  const valueWidth = ctx.measureText(valueText).width;
  ctx.fillText(valueText, x + (width - valueWidth) / 2, y + 48);
  ctx.font = "bold 12px Arial";
  ctx.fillStyle = "#ffffff";
  const titleWidth = ctx.measureText(title).width;
  ctx.fillText(title, x + (width - titleWidth) / 2, y + 76);
}

async function createInviteImage(user, stats) {
  const WIDTH = 1000, HEIGHT = 500;
  const canvas = Canvas.createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  if (fs.existsSync(INVITE_BACKGROUND)) {
    try {
      const background = await Canvas.loadImage(INVITE_BACKGROUND);
      const scale = Math.max(WIDTH / background.width, HEIGHT / background.height);
      const bgWidth = background.width * scale, bgHeight = background.height * scale;
      ctx.drawImage(background, (WIDTH - bgWidth) / 2, (HEIGHT - bgHeight) / 2, bgWidth, bgHeight);
    } catch {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  } else {
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  roundedRect(ctx, 40, 35, 920, 430, 25);
  ctx.fillStyle = "rgba(0,0,0,0.60)";
  ctx.fill();
  ctx.strokeStyle = MAIN_COLOR;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.font = "bold 34px Arial";
  ctx.fillStyle = MAIN_COLOR;
  ctx.fillText("Invite Stats For", 85, 95);
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`@${user.username}`, 360, 95);

  ctx.beginPath();
  ctx.moveTo(85, 120);
  ctx.lineTo(915, 120);
  ctx.strokeStyle = MAIN_COLOR;
  ctx.globalAlpha = 0.30;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;

  try {
    const avatarURL = user.displayAvatarURL({ extension: "png", size: 256 });
    const avatar = await Canvas.loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(175, 235, 70, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 105, 165, 140, 140);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(175, 235, 74, 0, Math.PI * 2);
    ctx.strokeStyle = MAIN_COLOR;
    ctx.lineWidth = 3;
    ctx.stroke();
  } catch {}

  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#ffffff";
  const username = `@${user.username}`;
  const usernameWidth = ctx.measureText(username).width;
  ctx.fillText(username, 175 - usernameWidth / 2, 330);

  drawStatBox(ctx, 320, 165, "TOTAL", stats.total);
  drawStatBox(ctx, 510, 165, "LEFT", stats.left);
  drawStatBox(ctx, 700, 165, "JOINED", stats.joined);

  ctx.beginPath();
  ctx.moveTo(85, 390);
  ctx.lineTo(915, 390);
  ctx.strokeStyle = MAIN_COLOR;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.font = "bold 11px Arial";
  ctx.fillStyle = MAIN_COLOR;
  ctx.fillText("INVITE TRACKER", 85, 420);

  return canvas.toBuffer("image/png");
}

async function sendInviteStats(message, targetUser, stats) {
  const image = await createInviteImage(targetUser, stats);
  const attachment = new AttachmentBuilder(image, { name: "invite-stats.png" });
  const media = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL("attachment://invite-stats.png"));
  const container = new ContainerBuilder()
    .setAccentColor(parseInt(MAIN_COLOR.slice(1), 16))
    .addMediaGalleryComponents(media);
  await message.reply({ components: [container], files: [attachment], flags: MessageFlags.IsComponentsV2 });
}

// ============================================================
// ========== FUN GIFS ==========
// ============================================================
const kissGifs = [
  "https://media.discordapp.net/attachments/1537611791021121556/1540723269852991538/megumi-kato-kiss.gif",
  "https://media.discordapp.net/attachments/1537611791021121556/1540724043291033600/hh.gif",
  "https://media.discordapp.net/attachments/1537611791021121556/1540724150769815642/gg.gif",
  "https://media.discordapp.net/attachments/1537611791021121556/1540724353250103366/aa.gif",
  "https://media.discordapp.net/attachments/1537611791021121556/1540724421063610518/rr.gif",
  "https://media.discordapp.net/attachments/1537611791021121556/1540724512411353229/tt.gif",
  "https://media.discordapp.net/attachments/1537611791021121556/1540724702522114208/kk.gif"
];
const slapGifs = [
  "https://cdn.discordapp.com/attachments/1540722743123644516/1540725350810648636/pp.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540725858203869205/ttt.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540726109899849759/vvv.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540726286408744990/nnn.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540726525450518659/mmm.gif"
];
const hugGifs = [
  "https://media.discordapp.net/attachments/1540722743123644516/1540729097934737418/1a31becb4ece049dad5d510d396c7baa.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540729098232406196/40b55a15311c73bbe06081641444ac48.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540729098593374238/5aa4d783948c46752eabba352952a1a1.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540729098978984007/16f4ef8659534c88264670265e2a1626.gif"
];
const patGifs = [
  "https://media.discordapp.net/attachments/1540722743123644516/1540729941430370324/bd25fd31c0be1c6e9287517aef0546f6.gif",
  "https://cdn.discordapp.com/attachments/1540722743123644516/1540729941854003270/3d38f642281c92930241b7d65a71cd6d.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540729942231220224/44cafa4ee1657fe13e7dbeddaf039818.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540729942688661505/c951e51e68e3aadbcb388acc41527c64.gif",
  "https://media.discordapp.net/attachments/1540722743123644516/1540729943049244682/d7c326bd43776f1e0df6f63956230eb4.gif"
];

function randomGif(gifs) {
  return gifs[Math.floor(Math.random() * gifs.length)];
}
function randomPercent() {
  return Math.floor(Math.random() * 101);
}

async function selfMessage(message, action) {
  const embed = new EmbedBuilder()
    .setColor(COLOR)
    .setDescription(`<a:down_pengu:1538797873481785375> | **You cannot ${action} yourself!**`);
  return message.reply({ embeds: [embed] });
}

// ============================================================
// ========== JAIL SYSTEM ==========
// ============================================================
let jailDB = readJSON(JAIL_FILE);

function saveJailDB() {
  saveJSON(JAIL_FILE, jailDB);
}

function getJailConfig(guildId) {
  if (!jailDB[guildId]) {
    jailDB[guildId] = {
      logsChannelId: null,
      unjailLogsChannelId: null,
      jailerRoleIds: [],
      jailChannelId: null,
      jailRoleId: null,
      jailedUsers: {}
    };
    saveJailDB();
  }
  if (!Array.isArray(jailDB[guildId].jailerRoleIds)) jailDB[guildId].jailerRoleIds = [];
  if (!jailDB[guildId].jailedUsers) jailDB[guildId].jailedUsers = {};
  return jailDB[guildId];
}

function canJail(member, config) {
  if (isAdmin(member)) return true;
  return config.jailerRoleIds.some(roleId => member.roles.cache.has(roleId));
}

function jailConfigured(config) {
  return Boolean(
    config.logsChannelId &&
    config.unjailLogsChannelId &&
    config.jailerRoleIds.length > 0 &&
    config.jailChannelId &&
    config.jailRoleId
  );
}

function createJailDMContainer(type, guild, moderator, reason) {
  const isJail = type === "jail";
  const title = isJail
    ? `## ◜${DM_EMOJI} ◞ You Have Been Placed in Jail`
    : `## ◜${DM_EMOJI} ◞ Your Jail Punishment Has Been Removed`;
  const description = isJail
    ? "***You have been placed in **Jail** in this server.***"
    : "***Your jail punishment in this server has been **removed**.***";
  const firstText =
    `**Moderator:** ${moderator}\n` +
    `**Reason:** ${reason || "No reason provided"}\n` +
    `**Date:** <t:${Math.floor(Date.now() / 1000)}:F>`;

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(title))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(firstText))
    .addSeparatorComponents(new SeparatorBuilder())
    .addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(BANNER_URL))
    )
    .addSeparatorComponents(new SeparatorBuilder());

  if (isJail) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent("**__Please respect the server rules and make sure this does not happen again.__**")
    );
  } else {
    container
      .addTextDisplayComponents(new TextDisplayBuilder().setContent("***Your jail punishment has been successfully removed and your previous roles have been restored.***"))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent("**__Please make sure to follow the server rules going forward.__**"));
  }

  container
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**__Jail System • ${guild.name}__**`));

  return container;
}

async function sendJailDM(member, guild, moderator, reason) {
  try {
    await member.send({ components: [createJailDMContainer("jail", guild, moderator, reason)], flags: MessageFlags.IsComponentsV2 });
  } catch {}
}

async function sendUnjailDM(member, guild, moderator, reason) {
  try {
    await member.send({ components: [createJailDMContainer("unjail", guild, moderator, reason)], flags: MessageFlags.IsComponentsV2 });
  } catch {}
}

async function sendJailSetupPanel(channel) {
  const config = getJailConfig(channel.guild.id);
  const logs = config.logsChannelId ? `<#${config.logsChannelId}>` : "Not selected";
  const unjailLogs = config.unjailLogsChannelId ? `<#${config.unjailLogsChannelId}>` : "Not selected";
  const jailers = config.jailerRoleIds.length ? config.jailerRoleIds.map(id => `<@&${id}>`).join(" ") : "Not selected";
  const jailChannel = config.jailChannelId ? `<#${config.jailChannelId}>` : "Not selected";
  const jailRole = config.jailRoleId ? `<@&${config.jailRoleId}>` : "Not selected";

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${JAIL_EMOJI} | Jail System Setup`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `**Logs Channel:** ${logs}\n**Unjail Logs:** ${unjailLogs}\n**Jailer Roles:** ${jailers}\n**Jail Channel:** ${jailChannel}\n**Jail Role:** ${jailRole}`
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Logs Channel**\nSelect the channel used for jail logs."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId("setup_jail_logs").setPlaceholder("Select Logs Channel").setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Unjail Logs**\nSelect the channel used for unjail logs."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId("setup_unjail_logs").setPlaceholder("Select Unjail Logs Channel").setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Jailer Roles**\nSelect all roles allowed to use jail commands."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId("setup_jailer_roles").setPlaceholder("Select Jailer Roles").setMinValues(1).setMaxValues(10)
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Jail Channel**\nSelect where `-jail` and `-unjail` can be used."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId("setup_jail_channel").setPlaceholder("Select Jail Channel").setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Jail Role**\nSelect the role assigned to jailed members."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId("setup_jail_role").setPlaceholder("Select Jail Role").setMinValues(1).setMaxValues(1)
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("setup_jail_refresh").setLabel("Refresh").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("setup_jail_done").setLabel("Done").setStyle(ButtonStyle.Success)
    ));

  return channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

async function sendJailerPanel(channel) {
  const config = getJailConfig(channel.guild.id);
  const current = config.jailerRoleIds.length ? config.jailerRoleIds.map(id => `<@&${id}>`).join(" ") : "No Jailer Roles configured.";

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${JAIL_EMOJI} | Jailer Roles`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Current Jailer Roles**\n${current}`))
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("**Add Jailer Roles**\nSelect one or more roles. Existing Jailer Roles will remain."))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId("jailer_only_select").setPlaceholder("Select Jailer Roles").setMinValues(1).setMaxValues(10)
    ))
    .addSeparatorComponents(new SeparatorBuilder())
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("jailer_only_refresh").setLabel("Refresh").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("jailer_only_done").setLabel("Done").setStyle(ButtonStyle.Success)
    ));

  return channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

function buildJailActionLog({ guild, target, moderator, reason, action }) {
  const isJail = action === "JAILED";
  return new EmbedBuilder()
    .setColor(COLOR)
    .setAuthor({ name: `${guild.name} • Moderation`, iconURL: guild.iconURL({ extension: "png", size: 128 }) || undefined })
    .setTitle(isJail ? `${JAIL_EMOJI} | Jail Action` : `${CHECK} | Unjail Action`)
    .setDescription(isJail ? "A member has been placed under a jail punishment." : "A member has been released from the jail punishment.")
    .addFields(
      { name: "Member", value: `${target}\n\`\`\`${target.id}\`\`\``, inline: true },
      { name: "Moderator", value: `${moderator}\n\`\`\`${moderator.id}\`\`\``, inline: true },
      { name: "Status", value: `\`${action}\``, inline: false },
      { name: "Reason", value: `\`\`\`\n${reason || "No reason provided"}\n\`\`\``, inline: false }
    )
    .setThumbnail(target.displayAvatarURL({ extension: "png", size: 256 }))
    .setFooter({ text: guild.name })
    .setTimestamp();
}

async function sendJailLog(guild, config, target, moderator, reason) {
  const channel = guild.channels.cache.get(config.logsChannelId);
  if (!channel?.isTextBased()) return;
  try {
    await channel.send({ embeds: [buildJailActionLog({ guild, target, moderator, reason, action: "JAILED" })] });
  } catch (e) { console.error("Jail log error:", e); }
}

async function sendUnjailLog(guild, config, target, moderator, reason) {
  const channel = guild.channels.cache.get(config.unjailLogsChannelId);
  if (!channel?.isTextBased()) return;
  try {
    await channel.send({ embeds: [buildJailActionLog({ guild, target, moderator, reason, action: "UNJAILED" })] });
  } catch (e) { console.error("Unjail log error:", e); }
}

async function showJailerList(message) {
  const config = getJailConfig(message.guild.id);
  if (!config.jailerRoleIds.length) return replyV2(message, "# Jailer Roles", "There are currently no Jailer Roles configured.");
  const validRoles = config.jailerRoleIds.map(id => message.guild.roles.cache.get(id)).filter(Boolean);
  if (!validRoles.length) return replyV2(message, "# Jailer Roles", "No valid Jailer Roles were found.");

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("# Jailer Roles"))
    .addSeparatorComponents(new SeparatorBuilder());

  validRoles.forEach((role, index) => {
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${index + 1}.** ${role}`));
    if (index < validRoles.length - 1) container.addSeparatorComponents(new SeparatorBuilder());
  });

  container
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Total:** ${validRoles.length} role${validRoles.length === 1 ? "" : "s"}`));

  return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

async function showJailList(message) {
  const config = getJailConfig(message.guild.id);
  if (!config.jailRoleId) return replyV2(message, "# Jailed Members", "No Jail Role has been configured.");
  const jailRole = message.guild.roles.cache.get(config.jailRoleId);
  if (!jailRole) return replyV2(message, "# Jailed Members", "The configured Jail Role no longer exists.");

  try { await message.guild.members.fetch(); } catch {}
  const jailedMembers = [...jailRole.members.values()];
  if (!jailedMembers.length) return replyV2(message, "# Jailed Members", "There are currently no jailed members.");

  const container = new ContainerBuilder()
    .setAccentColor(COLOR)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("# Jailed Members"))
    .addSeparatorComponents(new SeparatorBuilder());

  jailedMembers.forEach((member, index) => {
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${index + 1}.** ${member}`));
    if (index < jailedMembers.length - 1) container.addSeparatorComponents(new SeparatorBuilder());
  });

  container
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Total:** ${jailedMembers.length} member${jailedMembers.length === 1 ? "" : "s"}`));

  return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

// ============================================================
// ========== TICKET + STAFF (ASTRA) ==========
// ============================================================
let ticketDB = readJSON(TICKET_FILE);
let staffDB = readJSON(STAFF_FILE);

function saveTicketConfig() { saveJSON(TICKET_FILE, ticketDB); }
function saveStaffConfig() { saveJSON(STAFF_FILE, staffDB); }

function getGuildConfig(guildId) {
  if (!ticketDB[guildId]) {
    ticketDB[guildId] = {
      ticketRoles: [],
      ticketLogs: null,
      ticketChannel: null,
      ticketCategory: null,
      clearRoles: []
    };
    saveTicketConfig();
  }
  return ticketDB[guildId];
}

function getStaffConfig(guildId) {
  if (!staffDB[guildId]) {
    staffDB[guildId] = {
      applyChannelId: null,
      logsChannelId: null,
      staffRoleId: null,
      gameRoleId: null,
      eventRoleId: null
    };
    saveStaffConfig();
  }
  return staffDB[guildId];
}

function buildTicketSetupMessage(draft) {
  const roles = draft.ticketRoles?.length ? draft.ticketRoles.map(id => `<@&${id}>`).join(', ') : 'Not selected';
  const logs = draft.ticketLogs ? `<#${draft.ticketLogs}>` : 'Not selected';
  const channel = draft.ticketChannel ? `<#${draft.ticketChannel}>` : 'Not selected';
  const category = draft.ticketCategory ? `<#${draft.ticketCategory}>` : 'Not selected';

  return new ContainerBuilder()
    .addTextDisplayComponents(text('# ❛ Ticket System Setup ❜'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Configure the ticket system using the menus below.**'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Select all four options, then press Send to save the configuration and publish the ticket panel.**'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Ticket Staff Roles**\nSelect 1 to 10 roles.\n\n${roles}`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId('setup_ticket_role').setPlaceholder('Select Ticket Staff Roles').setMinValues(1).setMaxValues(10)
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Ticket Logs**\n${logs}`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId('setup_ticket_logs').setPlaceholder('Select Ticket Logs').setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Ticket Panel Channel**\n${channel}`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId('setup_ticket_channel').setPlaceholder('Select Ticket Panel Channel').setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Ticket Category**\n${category}`))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId('setup_ticket_category').setPlaceholder('Select Ticket Category').setChannelTypes(ChannelType.GuildCategory)
    ))
    .addSeparatorComponents(separator())
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('setup_ticket_send').setLabel('Send').setEmoji(EMOJI.check).setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('setup_ticket_cancel').setLabel('Cancel').setEmoji(EMOJI.no).setStyle(ButtonStyle.Danger)
    ));
}

function buildStaffSetupPanel(guildId, userId, draft) {
  const apply = draft.applyChannelId ? `<#${draft.applyChannelId}>` : 'Not selected';
  const logs = draft.logsChannelId ? `<#${draft.logsChannelId}>` : 'Not selected';
  const staff = draft.staffRoleId ? `<@&${draft.staffRoleId}>` : 'Not selected';
  const game = draft.gameRoleId ? `<@&${draft.gameRoleId}>` : 'Not selected';
  const event = draft.eventRoleId ? `<@&${draft.eventRoleId}>` : 'Not selected';

  return new ContainerBuilder()
    .addTextDisplayComponents(text('# <:staff:1538421193898459196> Staff Applications Setup'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Apply Channel:** ${apply}\n**Logs Channel:** ${logs}\n**Staff Role:** ${staff}\n**Game Mode Role:** ${game}\n**Event Hoster Role:** ${event}`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Apply Channel**'))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId(`setup_apply_channel_${userId}`).setPlaceholder('Select Apply Channel').setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Logs Channel**'))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder().setCustomId(`setup_logs_channel_${userId}`).setPlaceholder('Select Logs Channel').setChannelTypes(ChannelType.GuildText)
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Staff Role**'))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId(`setup_staff_role_${userId}`).setPlaceholder('Select Staff Role')
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Game Mode Role**'))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId(`setup_game_role_${userId}`).setPlaceholder('Select Game Mode Role')
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Event Hoster Role**'))
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder().setCustomId(`setup_event_role_${userId}`).setPlaceholder('Select Event Hoster Role')
    ))
    .addSeparatorComponents(separator())
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`setup_send_application_${userId}`).setLabel('Send Application Panel').setEmoji(EMOJI.check).setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`setup_refresh_${userId}`).setLabel('Refresh').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`setup_staff_cancel_${userId}`).setLabel('Cancel').setEmoji(EMOJI.no).setStyle(ButtonStyle.Danger)
    ));
}

function buildTicketPanel(guildName) {
  return new ContainerBuilder()
    .addTextDisplayComponents(text(`# ◜${guildName} Support Center◞`))
    .addTextDisplayComponents(text('# How can we assist you today?'))
    .addSeparatorComponents(separator())
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(TICKET_BANNER_URL)))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('# Ticket'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(
      '<:mail:1539886992551186535> **Pub** : ⇝ **__Report spam or advertisement__**\n\n' +
      '<:discord_bughunterlv2:1539888189110755390> **Bugs** : ⇝ **__Found a glitch? Let us know__**\n\n' +
      '<:moderation:1538420590866858075> **Abuse** : ⇝ **__Report any form of user abuse__**\n\n' +
      '<a:down_pengu:1538797873481785375> **Server** : ⇝ **__General issues or inquiries__**'
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('<a:PinkHearts:1539463428421328947> | **Select a category below to open a ticket**'))
    .addSeparatorComponents(separator())
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_create_pub').setLabel('Pub').setEmoji({ id: '1539886992551186535', name: 'mail' }).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket_create_bugs').setLabel('Bugs').setEmoji({ id: '1539888189110755390', name: 'discord_bughunterlv2' }).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket_create_abuse').setLabel('Abuse').setEmoji({ id: '1538420590866858075', name: 'moderation' }).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket_create_server').setLabel('Server').setEmoji(EMOJI.down).setStyle(ButtonStyle.Secondary)
    ));
}

function buildApplicationPanel(guildName) {
  return new ContainerBuilder()
    .addTextDisplayComponents(text(`# ❛ ${guildName} Applications! ❜`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`<a:PinkHearts:1539463428421328947> | **Hey ${guildName} Members, We're Officially Accepting Applications To Join Our Team!**`))
    .addSeparatorComponents(separator())
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(APPLICATION_BANNER_URL)))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('<a:eatingwatermelongoma:1539122698406600744> | **Do You Enjoy Helping Members, Keeping Lobby Games Clean Or Hosting Fun Events? This Is Your Chance To Join Our Team!**'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(
      '<a:PandaSpin:1539126794979123250> | **There Are A Few Requirements To Be Accepted:**\n\n' +
      '~ **You Must Be 17 Years Old Or Older**\n\n' +
      '~ **You Must Be Active In The Server**'
    ))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('› | **Select the position you want to apply for!**'))
    .addSeparatorComponents(separator())
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('application_staff').setLabel('Apply For staff').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('application_game').setLabel('Apply For game mode').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('application_event').setLabel('Apply For event hoster').setStyle(ButtonStyle.Primary)
    ));
}

function buildApplicationModal(type) {
  let whyLabel = 'Why do you want to be staff?';
  let whyId = 'why';
  if (type === 'game') { whyLabel = 'Why do you want to be game mode?'; whyId = 'why_game'; }
  if (type === 'event') { whyLabel = 'Why do you want to be event hoster?'; whyId = 'why_event'; }

  const modal = new ModalBuilder()
    .setCustomId(`application_modal_${type}`)
    .setTitle(`${type === 'staff' ? 'Staff' : type === 'game' ? 'Game Mode' : 'Event Hoster'} Application`);

  modal.addComponents(
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('name').setLabel('What is your name').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('age').setLabel('What is your age').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(3)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('experience').setLabel('Do you have moderation experience').setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(1000)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId(whyId).setLabel(whyLabel).setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(1500)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('active').setLabel('How active are you daily?').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(200))
  );
  return modal;
}

function buildApplicationLog(guild, user, type, answers, applicationId) {
  const typeName = type === 'staff' ? 'Staff' : type === 'game' ? 'Game Mode' : 'Event Hoster';
  const why = answers.why || answers.why_game || answers.why_event;

  return new ContainerBuilder()
    .addTextDisplayComponents(text(`## <:Ticket:1539907881585999873> ${typeName} Application`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Server:** ${guild.name}\n**User:** ${user}\n**Type:** ${typeName}\n**Application ID:** ${applicationId}\n**Time:** ${formatTime(Date.now())}`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**What is your name**\n${answers.name}`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**What is your age**\n${answers.age}`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Do you have moderation experience**\n${answers.experience}`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**${type === 'staff' ? 'Why do you want to be staff' : type === 'game' ? 'Why do you want to be game mode' : 'Why do you want to be event hoster'}**\n${why}`))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**How active are you daily?**\n${answers.active}`))
    .addSeparatorComponents(separator())
    .addActionRowComponents(new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`application_accept_${applicationId}`).setLabel('Accept').setEmoji(EMOJI.check).setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`application_cancel_${applicationId}`).setLabel('Cancel').setEmoji(EMOJI.no).setStyle(ButtonStyle.Danger)
    ));
}

function buildApplicationAcceptedMessage(guildName) {
  return new ContainerBuilder()
    .addTextDisplayComponents(text('# <a:Checkmark:1535399839150379058> __Application Accepted__'))
    .addSeparatorComponents(separator())
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(APPLICATION_RESULT_BANNER_URL)))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Congratulations! Your application has been successfully accepted. We’re pleased to have you join our team**'))
    .addTextDisplayComponents(text('**__Please check the designated channels for further information regarding your role__**'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Welcome aboard! <a:PinkHearts:1539463428421328947>**'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`-# ${guildName}`));
}

function buildApplicationDeclinedMessage() {
  return new ContainerBuilder()
    .addTextDisplayComponents(text('# <:emojigg_no:1539137860400324639> __Application Declined__'))
    .addSeparatorComponents(separator())
    .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(APPLICATION_RESULT_BANNER_URL)))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**Thank you for taking the time to apply. Unfortunately, your application has not been accepted at this time**'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text('**We appreciate your interest and wish you the best of luck!** <a:PinkHearts:1539463428421328947>'));
}

function buildTicketOpenLog(guild, user, type, channel) {
  return new ContainerBuilder()
    .addTextDisplayComponents(text('## <:Ticket:1539907881585999873> Ticket Opened'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Server:** ${guild.name}\n**User:** ${user}\n**Type:** ${type}\n**Channel:** ${channel}\n**Time:** ${formatTime(Date.now())}`));
}

function buildTicketCloseLog(guild, user, closedBy, type, channel) {
  return new ContainerBuilder()
    .addTextDisplayComponents(text('## <:Background17:1539907260439072944> Ticket Closed'))
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(text(`**Server:** ${guild.name}\n**User:** ${user}\n**Closed by:** ${closedBy}\n**Type:** ${type}\n**Channel:** ${channel}\n**Time:** ${formatTime(Date.now())}`));
}// ============================================================
// ========== EVENTS ==========
// ============================================================

// Message tracking (Activity)
client.on("messageCreate", message => {
  if (!message.guild || message.author.bot) return;
  try {
    addMessage.run(message.guild.id, message.author.id, message.channel.id, Date.now());
  } catch (e) {
    console.error("Message tracking:", e);
  }
});

// Voice tracking (Activity)
client.on("voiceStateUpdate", (oldState, newState) => {
  if (oldState.channelId === newState.channelId) return;
  if (newState.member?.user?.bot) return;
  const guildId = newState.guild.id;
  const userId = newState.id;
  const now = Date.now();
  try {
    if (oldState.channelId) endVoice.run(now, guildId, userId);
    if (newState.channelId) addVoice.run(guildId, userId, newState.channelId, now);
  } catch (e) {
    console.error("Voice tracking:", e);
  }
});

// Auto Mute Logger
client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.serverMute === newState.serverMute) return;
  if (newState.serverMute !== true) return;
  const member = newState.member;
  if (!member || member.user.bot) return;

  let moderatorId = "Unknown";
  let reason = "No reason provided";
  try {
    const fetchedLogs = await newState.guild.fetchAuditLogs({ limit: 8, type: 24 });
    const muteLog = fetchedLogs.entries.find(entry => {
      const isRecent = entry.createdTimestamp > Date.now() - 20000;
      const isTarget = entry.target?.id === member.id;
      return isRecent && isTarget;
    });
    if (muteLog?.executor) {
      moderatorId = muteLog.executor.id;
      reason = muteLog.reason || "No reason provided";
    }
  } catch {}
  saveVMuteLog(member.id, moderatorId, reason, newState.guild);
});

// Join Track + Invite Tracker + Clear Warns
client.on("guildMemberAdd", async member => {
  const warns = getWarns(member.id, member.guild.id);
  if (warns.length > 0) clearWarns(member.id, member.guild.id);

  try { await sendJoinLog(member); } catch {}

  try {
    const invite = await findUsedInvite(member.guild);
    if (!invite || !invite.inviter) return;
    const inviterId = invite.inviter.id;
    const userData = getUserData(member.guild.id, inviterId);
    if (userData.members[member.id]) return;
    userData.total++;
    userData.joined++;
    userData.members[member.id] = { left: false, joinedAt: Date.now() };
    saveInviteDB();
  } catch {}
});

client.on("guildMemberRemove", async member => {
  const guildData = inviteDB[member.guild.id];
  if (!guildData) return;
  for (const inviterId of Object.keys(guildData)) {
    const userData = guildData[inviterId];
    if (!userData.members) continue;
    const invitedMember = userData.members[member.id];
    if (invitedMember && !invitedMember.left) {
      invitedMember.left = true;
      invitedMember.leftAt = Date.now();
      userData.left++;
      if (userData.joined > 0) userData.joined--;
      saveInviteDB();
      break;
    }
  }
});

client.on("inviteCreate", async invite => { await cacheInvites(invite.guild); });
client.on("inviteDelete", async invite => { await cacheInvites(invite.guild); });

// ============================================================
// ========== INTERACTION CREATE (MERGED) ==========
// ============================================================
client.on("interactionCreate", async interaction => {
  if (!interaction.guild) return;

  try {
    // ========== VERIFICATION SETUP ==========
    const isSetupInteraction = interaction.isRoleSelectMenu() || interaction.isChannelSelectMenu() || interaction.isButton();
    if (isSetupInteraction && (
      interaction.customId?.startsWith("verification_") ||
      ["verification_boy_role","verification_girl_role","verification_unverified_role","verification_verifier_roles","verification_join_track","verification_logs","verification_command_channel","verification_refresh","verification_cancel","verification_done"].includes(interaction.customId)
    )) {
      if (!isAdmin(interaction.member)) {
        return interactionV2(interaction, "# Permission Denied", "Only members with **Administrator** permission can modify the Verification Setup.");
      }
      const config = getVerificationConfig(interaction.guild.id);

      if (interaction.isRoleSelectMenu()) {
        if (interaction.customId === "verification_boy_role") config.boyRoleId = interaction.values[0];
        else if (interaction.customId === "verification_girl_role") config.girlRoleId = interaction.values[0];
        else if (interaction.customId === "verification_unverified_role") config.unverifiedRoleId = interaction.values[0];
        else if (interaction.customId === "verification_verifier_roles") {
          config.verifierRoleIds = [...new Set(interaction.values)].slice(0, 10);
        } else return;
        saveVerificationDB();
        return interaction.deferUpdate();
      }

      if (interaction.isChannelSelectMenu()) {
        const channelId = interaction.values[0];
        if (interaction.customId === "verification_join_track") config.joinTrackChannelId = channelId;
        else if (interaction.customId === "verification_logs") config.verificationLogsChannelId = channelId;
        else if (interaction.customId === "verification_command_channel") config.commandChannelId = channelId;
        else return;
        saveVerificationDB();
        return interaction.deferUpdate();
      }

      if (interaction.customId === "verification_refresh") {
        await interaction.deferUpdate();
        try { await interaction.message.delete(); } catch {}
        return sendVerificationSetup(interaction.channel);
      }
      if (interaction.customId === "verification_cancel") {
        await interaction.deferUpdate();
        try { await interaction.message.delete(); } catch {}
        return;
      }
      if (interaction.customId === "verification_done") {
        if (!setupComplete(config)) {
          return interactionV2(interaction, "# Setup Incomplete", "Please configure all Verification settings before completing the setup.");
        }
        await interaction.deferUpdate();
        try { await interaction.message.delete(); } catch {}
        const container = new ContainerBuilder()
          .setAccentColor(COLOR)
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${CHECK} | Setup Complete`))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
          .addTextDisplayComponents(new TextDisplayBuilder().setContent("Verification setup completed successfully."));
        return interaction.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
      }
    }

    // ========== ROLE MANAGER ==========
    if (interaction.isRoleSelectMenu() && interaction.customId.startsWith("role_action_role_")) {
      const type = interaction.customId.replace("role_action_role_", "");
      const data = pendingActions.get(interaction.message.id);
      if (!data || data.userId !== interaction.user.id || data.type !== type) {
        return interaction.reply({ ...v2Error("Action Expired", "This role action is no longer active."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      data.roleId = interaction.values[0];
      return interaction.deferUpdate();
    }

    if (interaction.isUserSelectMenu() && interaction.customId.startsWith("role_action_user_")) {
      const type = interaction.customId.replace("role_action_user_", "");
      const data = pendingActions.get(interaction.message.id);
      if (!data || data.userId !== interaction.user.id || data.type !== type) {
        return interaction.reply({ ...v2Error("Action Expired", "This role action is no longer active."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      data.memberId = interaction.values[0];
      return interaction.deferUpdate();
    }

    // ========== JAIL SETUP INTERACTIONS ==========
    if (interaction.isChannelSelectMenu()) {
      if (["setup_jail_logs", "setup_unjail_logs", "setup_jail_channel"].includes(interaction.customId)) {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ content: "You need Administrator permission to edit the Jail System.", ephemeral: true });
        }
        const config = getJailConfig(interaction.guild.id);
        const value = interaction.values[0];
        if (interaction.customId === "setup_jail_logs") config.logsChannelId = value;
        else if (interaction.customId === "setup_unjail_logs") config.unjailLogsChannelId = value;
        else if (interaction.customId === "setup_jail_channel") config.jailChannelId = value;
        saveJailDB();
        return interaction.reply({ content: "Setting saved successfully.", ephemeral: true });
      }
    }

    if (interaction.isRoleSelectMenu()) {
      if (["setup_jailer_roles", "setup_jail_role", "jailer_only_select"].includes(interaction.customId)) {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ content: "You need Administrator permission to edit the Jail System.", ephemeral: true });
        }
        const config = getJailConfig(interaction.guild.id);
        if (interaction.customId === "setup_jailer_roles" || interaction.customId === "jailer_only_select") {
          config.jailerRoleIds = [...new Set([...config.jailerRoleIds, ...interaction.values])];
        } else if (interaction.customId === "setup_jail_role") {
          config.jailRoleId = interaction.values[0];
        }
        saveJailDB();
        return interaction.reply({ content: "Setting saved successfully.", ephemeral: true });
      }
    }

    if (interaction.isButton()) {
      // Music
      if (interaction.customId === "music_get_bot") {
        const member = interaction.member;
        if (!member.voice?.channel) {
          return interaction.reply({ ...v2Error("Not In Voice", "You need to be in a voice channel to use this button!"), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        const availableBots = [];
        for (const bot of MUSIC_BOTS) {
          try {
            const guildMember = await interaction.guild.members.fetch(bot.id).catch(() => null);
            if (guildMember) availableBots.push(bot);
          } catch {}
        }
        if (availableBots.length === 0) {
          return interaction.reply({ ...v2Error("No Bots Available", "No music bots are available in this server."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        const bot = availableBots[Math.floor(Math.random() * availableBots.length)];
        const container = new ContainerBuilder()
          .setAccentColor(COLOR)
          .addTextDisplayComponents(new TextDisplayBuilder().setContent("## <a:MusicNotes:1539155015338295337> ** | Your Music Bot Is Ready!**"))
          .addSeparatorComponents(new SeparatorBuilder())
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Here's your music bot:**\n<@${bot.id}>\n\n**Join a voice channel and type:**\n\`${bot.prefix} <song name>\``))
          .addSeparatorComponents(new SeparatorBuilder())
          .addTextDisplayComponents(new TextDisplayBuilder().setContent("-# Amo • Music Bots"));
        return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }

      // Clear Warning
      if (interaction.customId.startsWith("clear_warn_")) {
        if (!isOwner(interaction.member) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({ ...v2Error("Missing Permission", "Only Administrators can clear warnings."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        const parts = interaction.customId.split("_");
        const targetUserId = parts[2];
        const warnTimestamp = parseInt(parts[3]);
        if (!targetUserId || isNaN(warnTimestamp)) {
          return interaction.reply({ ...v2Error("Error", "Invalid warning data."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        const logs = readWarnLogs();
        if (!logs[targetUserId]) {
          return interaction.reply({ ...v2Error("Not Found", "This warning no longer exists."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        logs[targetUserId] = logs[targetUserId].filter(log => !(log.guildId === interaction.guild.id && log.timestamp === warnTimestamp));
        if (logs[targetUserId].length === 0) delete logs[targetUserId];
        saveWarnLogs(logs);
        const targetUser = await client.users.fetch(targetUserId).catch(() => null);
        const remainingWarns = getWarns(targetUserId, interaction.guild.id);
        await interaction.update(createWarningsPage(targetUser || { tag: targetUserId, id: targetUserId }, remainingWarns));
        return;
      }

      // Role Done / Cancel
      if (interaction.customId.startsWith("role_action_done_")) {
        const type = interaction.customId.replace("role_action_done_", "");
        const data = pendingActions.get(interaction.message.id);
        if (!data || data.userId !== interaction.user.id || data.type !== type) {
          return interaction.reply({ ...v2Error("Action Expired", "This role action is no longer active."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        if (!data.roleId || !data.memberId) {
          return interaction.reply({ ...v2Error("Incomplete Selection", "Please select both a **role** and a **member** before clicking Done."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        const role = interaction.guild.roles.cache.get(data.roleId);
        const member = await interaction.guild.members.fetch(data.memberId).catch(() => null);
        if (!role) return interaction.reply({ ...v2Error("Role Not Found", "I couldn't find that role."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        if (!member) return interaction.reply({ ...v2Error("Member Not Found", "I couldn't find that member."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });

        const botMember = interaction.guild.members.me;
        if (!botMember) return interaction.reply({ ...v2Error("Bot Error", "I couldn't find my member information."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        if (role.position >= botMember.roles.highest.position) {
          return interaction.reply({ ...v2Error("Role Hierarchy", "I can't manage this role. Move my highest role above it."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }
        if (!isOwner(interaction.member) && role.position >= interaction.member.roles.highest.position) {
          return interaction.reply({ ...v2Error("Role Hierarchy", "You cannot manage a role that is higher than or equal to your highest role."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
        }

        try {
          if (data.type === "add") {
            if (member.roles.cache.has(role.id)) {
              pendingActions.delete(interaction.message.id);
              await interaction.reply({ ...v2Info("Already Has Role", `**${member.user.tag}** already has ${role}.`), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
              await interaction.message.delete().catch(() => {});
              return;
            }
            await member.roles.add(role, `Role added by ${interaction.user.tag}`);
            pendingActions.delete(interaction.message.id);
            await interaction.reply({ ...v2Success("Role Added", `Successfully added ${role} to **${member.user.tag}**.`), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
          } else {
            if (!member.roles.cache.has(role.id)) {
              pendingActions.delete(interaction.message.id);
              await interaction.reply({ ...v2Info("Role Not Found", `**${member.user.tag}** doesn't have ${role}.`), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
              await interaction.message.delete().catch(() => {});
              return;
            }
            await member.roles.remove(role, `Role removed by ${interaction.user.tag}`);
            pendingActions.delete(interaction.message.id);
            await interaction.reply({ ...v2Success("Role Removed", `Successfully removed ${role} from **${member.user.tag}**.`), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
          }
          await interaction.message.delete().catch(() => {});
        } catch (error) {
          console.error("Role action error:", error);
          if (!interaction.replied) {
            return interaction.reply({ ...v2Error("Role Action Failed", "I couldn't update this member's roles."), flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
          }
        }
        return;
      }

      if (interaction.customId.startsWith("role_action_cancel_")) {
        const type = interaction.customId.replace("role_action_cancel_", "");
        const data = pendingActions.get(interaction.message.id);
        if (data && data.userId === interaction.user.id && data.type === type) pendingActions.delete(interaction.message.id);
        await interaction.deferUpdate();
        await interaction.message.delete().catch(() => {});
        return;
      }

      // Jail buttons
      if (interaction.customId === "setup_jail_refresh") {
        if (!isAdmin(interaction.member)) return interaction.reply({ content: "You need Administrator permission.", ephemeral: true });
        try { await interaction.message.delete(); } catch {}
        return sendJailSetupPanel(interaction.channel);
      }
      if (interaction.customId === "setup_jail_done") {
        if (!isAdmin(interaction.member)) return interaction.reply({ content: "You need Administrator permission.", ephemeral: true });
        const config = getJailConfig(interaction.guild.id);
        if (!jailConfigured(config)) {
          return interaction.reply({ content: "Please complete all Jail System settings before finishing the setup.", ephemeral: true });
        }
        try { await interaction.message.delete(); } catch {}
        return interaction.channel.send({
          components: [new ContainerBuilder().setAccentColor(COLOR).addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${CHECK} | Success`)).addSeparatorComponents(new SeparatorBuilder()).addTextDisplayComponents(new TextDisplayBuilder().setContent("Jail setup completed successfully."))],
          flags: MessageFlags.IsComponentsV2
        });
      }
      if (interaction.customId === "jailer_only_refresh") {
        if (!isAdmin(interaction.member)) return interaction.reply({ content: "You need Administrator permission.", ephemeral: true });
        try { await interaction.message.delete(); } catch {}
        return sendJailerPanel(interaction.channel);
      }
      if (interaction.customId === "jailer_only_done") {
        if (!isAdmin(interaction.member)) return interaction.reply({ content: "You need Administrator permission.", ephemeral: true });
        const config = getJailConfig(interaction.guild.id);
        if (!config.jailerRoleIds.length) {
          return interaction.reply({ content: "Please select at least one Jailer Role.", ephemeral: true });
        }
        try { await interaction.message.delete(); } catch {}
        return interaction.channel.send({
          components: [new ContainerBuilder().setAccentColor(COLOR).addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${CHECK} | Success`)).addSeparatorComponents(new SeparatorBuilder()).addTextDisplayComponents(new TextDisplayBuilder().setContent("Jailer roles updated successfully."))],
          flags: MessageFlags.IsComponentsV2
        });
      }
    }

    // ========== TICKET + STAFF + HELP INTERACTIONS (from ASTRA) ==========
    // Ticket role select
    if (interaction.isRoleSelectMenu() && interaction.customId === "setup_ticket_role") {
      const key = `${interaction.guild.id}:${interaction.user.id}`;
      const draft = ticketSetups.get(key);
      if (!draft) return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("This ticket setup has expired.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      draft.ticketRoles = [...interaction.values];
      return interaction.update({ components: [buildTicketSetupMessage(draft)], flags: MessageFlags.IsComponentsV2 });
    }

    // Ticket channel selects
    if (interaction.isChannelSelectMenu() && ["setup_ticket_logs", "setup_ticket_channel", "setup_ticket_category"].includes(interaction.customId)) {
      const key = `${interaction.guild.id}:${interaction.user.id}`;
      const draft = ticketSetups.get(key);
      if (!draft) return;
      if (interaction.customId === "setup_ticket_logs") draft.ticketLogs = interaction.values[0];
      else if (interaction.customId === "setup_ticket_channel") draft.ticketChannel = interaction.values[0];
      else if (interaction.customId === "setup_ticket_category") draft.ticketCategory = interaction.values[0];
      return interaction.update({ components: [buildTicketSetupMessage(draft)], flags: MessageFlags.IsComponentsV2 });
    }

    // Ticket send / cancel
    if (interaction.isButton() && interaction.customId === "setup_ticket_send") {
      const key = `${interaction.guild.id}:${interaction.user.id}`;
      const draft = ticketSetups.get(key);
      if (!draft) return;
      if (!draft.ticketRoles?.length || !draft.ticketLogs || !draft.ticketChannel || !draft.ticketCategory) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("Please select all four ticket setup options before pressing Send.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      const config = getGuildConfig(interaction.guild.id);
      Object.assign(config, { ticketRoles: [...draft.ticketRoles], ticketLogs: draft.ticketLogs, ticketChannel: draft.ticketChannel, ticketCategory: draft.ticketCategory });
      saveTicketConfig();
      const panelChannel = interaction.guild.channels.cache.get(draft.ticketChannel);
      if (!panelChannel || panelChannel.type !== ChannelType.GuildText) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("The selected ticket panel channel no longer exists.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      await panelChannel.send({ components: [buildTicketPanel(interaction.guild.name)], flags: MessageFlags.IsComponentsV2 });
      ticketSetups.delete(key);
      return interaction.update({ components: [new ContainerBuilder().addTextDisplayComponents(text(checkText("Ticket System configured successfully.")))], flags: MessageFlags.IsComponentsV2 });
    }

    if (interaction.isButton() && interaction.customId === "setup_ticket_cancel") {
      ticketSetups.delete(`${interaction.guild.id}:${interaction.user.id}`);
      return interaction.update({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("Ticket setup cancelled.")))], flags: MessageFlags.IsComponentsV2 });
    }

    // Create Ticket
    const ticketTypes = {
      ticket_create_pub: { key: "pub", label: "Pub", title: "Welcome to your Pub ticket!" },
      ticket_create_bugs: { key: "bugs", label: "Bugs", title: "Welcome to your Bugs ticket!" },
      ticket_create_abuse: { key: "abuse", label: "Abuse", title: "Welcome to your Abuse ticket!" },
      ticket_create_server: { key: "server", label: "Server", title: "Welcome to your Server ticket!" }
    };
    const ticketType = ticketTypes[interaction.customId];
    if (interaction.isButton() && ticketType) {
      const config = getGuildConfig(interaction.guild.id);
      if (!config.ticketCategory || !config.ticketRoles?.length) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("The ticket system has not been configured correctly.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      const cooldownKey = `${interaction.guild.id}:${interaction.user.id}`;
      const lastTicket = ticketCooldowns.get(cooldownKey);
      if (lastTicket && Date.now() - lastTicket < 60 * 60 * 1000) {
        const left = 60 * 60 * 1000 - (Date.now() - lastTicket);
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText(`You must wait **${remainingTime(left)}** before opening another ticket.`)))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      const existing = interaction.guild.channels.cache.find(c => c.topic?.includes(`ticket-owner:${interaction.user.id}`));
      if (existing) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText(`You already have an open ticket: ${existing}`)))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }

      const permissions = [
        { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
      ];
      for (const roleId of config.ticketRoles) {
        permissions.push({ id: roleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages] });
      }

      const safeUsername = interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 25) || "user";
      const ticketChannel = await interaction.guild.channels.create({
        name: `${ticketType.key}-${safeUsername}`,
        type: ChannelType.GuildText,
        parent: config.ticketCategory,
        topic: `ticket-owner:${interaction.user.id};ticket-type:${ticketType.key}`,
        permissionOverwrites: permissions
      });

      ticketCooldowns.set(cooldownKey, Date.now());
      const staffMentions = config.ticketRoles.map(id => `<@&${id}>`).join(" ");

      const ticketMessage = new ContainerBuilder()
        .addTextDisplayComponents(text(`# <a:eatingwatermelongoma:1539122698406600744> | ${ticketType.title}`))
        .addSeparatorComponents(separator())
        .addTextDisplayComponents(text(`${interaction.user}`))
        .addSeparatorComponents(separator())
        .addTextDisplayComponents(text(staffMentions))
        .addSeparatorComponents(separator())
        .addTextDisplayComponents(text("**__Please describe your issue in detail. Our staff will assist you as soon as possible.__**"))
        .addSeparatorComponents(separator())
        .addActionRowComponents(new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("ticket_close").setLabel("Close Ticket").setEmoji(EMOJI.close).setStyle(ButtonStyle.Danger)
        ));

      await ticketChannel.send({ components: [ticketMessage], flags: MessageFlags.IsComponentsV2 });

      const logs = config.ticketLogs ? interaction.guild.channels.cache.get(config.ticketLogs) : null;
      if (logs) {
        await logs.send({ components: [buildTicketOpenLog(interaction.guild, interaction.user, ticketType.label, ticketChannel)], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
      }

      return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(checkText(`Your ${ticketType.label} ticket has been created: ${ticketChannel}`)))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    }

    // Close Ticket
    if (interaction.isButton() && interaction.customId === "ticket_close") {
      const config = getGuildConfig(interaction.guild.id);
      const ownerMatch = interaction.channel.topic?.match(/ticket-owner:(\d+)/);
      const ownerId = ownerMatch ? ownerMatch[1] : null;
      const typeMatch = interaction.channel.topic?.match(/ticket-type:([a-z]+)/);
      const type = typeMatch ? typeMatch[1] : "Unknown";
      const isTicketOwner = ownerId === interaction.user.id;
      const hasTicketRole = config.ticketRoles?.some(roleId => interaction.member.roles.cache.has(roleId));

      if (!isTicketOwner && !hasTicketRole && !isAdmin(interaction.member) && !isOwner(interaction.user.id)) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("You do not have permission to close this ticket.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }

      const logs = config.ticketLogs ? interaction.guild.channels.cache.get(config.ticketLogs) : null;
      if (logs) {
        await logs.send({ components: [buildTicketCloseLog(interaction.guild, ownerId ? `<@${ownerId}>` : "Unknown", interaction.user, type, interaction.channel)], flags: MessageFlags.IsComponentsV2 }).catch(console.error);
      }

      await interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(checkText("This ticket will be deleted in 5 seconds.")))], flags: MessageFlags.IsComponentsV2 });
      setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
      return;
    }

    // Staff Application setup interactions (simplified for length - same logic as original)
    if (interaction.isChannelSelectMenu() && interaction.customId.startsWith("setup_apply_channel_")) {
      const userId = interaction.customId.replace("setup_apply_channel_", "");
      if (interaction.user.id !== userId) return;
      const key = `${interaction.guild.id}:${userId}`;
      const draft = staffSetups.get(key);
      if (!draft) return;
      draft.applyChannelId = interaction.values[0];
      return interaction.update({ components: [buildStaffSetupPanel(interaction.guild.id, userId, draft)], flags: MessageFlags.IsComponentsV2 });
    }
    if (interaction.isChannelSelectMenu() && interaction.customId.startsWith("setup_logs_channel_")) {
      const userId = interaction.customId.replace("setup_logs_channel_", "");
      if (interaction.user.id !== userId) return;
      const key = `${interaction.guild.id}:${userId}`;
      const draft = staffSetups.get(key);
      if (!draft) return;
      draft.logsChannelId = interaction.values[0];
      return interaction.update({ components: [buildStaffSetupPanel(interaction.guild.id, userId, draft)], flags: MessageFlags.IsComponentsV2 });
    }
    if (interaction.isRoleSelectMenu() && interaction.customId.startsWith("setup_staff_role_")) {
      const userId = interaction.customId.replace("setup_staff_role_", "");
      if (interaction.user.id !== userId) return;
      const draft = staffSetups.get(`${interaction.guild.id}:${userId}`);
      if (!draft) return;
      draft.staffRoleId = interaction.values[0];
      return interaction.update({ components: [buildStaffSetupPanel(interaction.guild.id, userId, draft)], flags: MessageFlags.IsComponentsV2 });
    }
    if (interaction.isRoleSelectMenu() && interaction.customId.startsWith("setup_game_role_")) {
      const userId = interaction.customId.replace("setup_game_role_", "");
      if (interaction.user.id !== userId) return;
      const draft = staffSetups.get(`${interaction.guild.id}:${userId}`);
      if (!draft) return;
      draft.gameRoleId = interaction.values[0];
      return interaction.update({ components: [buildStaffSetupPanel(interaction.guild.id, userId, draft)], flags: MessageFlags.IsComponentsV2 });
    }
    if (interaction.isRoleSelectMenu() && interaction.customId.startsWith("setup_event_role_")) {
      const userId = interaction.customId.replace("setup_event_role_", "");
      if (interaction.user.id !== userId) return;
      const draft = staffSetups.get(`${interaction.guild.id}:${userId}`);
      if (!draft) return;
      draft.eventRoleId = interaction.values[0];
      return interaction.update({ components: [buildStaffSetupPanel(interaction.guild.id, userId, draft)], flags: MessageFlags.IsComponentsV2 });
    }

    if (interaction.isButton() && interaction.customId.startsWith("setup_send_application_")) {
      const userId = interaction.customId.replace("setup_send_application_", "");
      if (interaction.user.id !== userId) return;
      const key = `${interaction.guild.id}:${userId}`;
      const draft = staffSetups.get(key);
      if (!draft) return;
      if (!draft.applyChannelId || !draft.logsChannelId || !draft.staffRoleId || !draft.gameRoleId || !draft.eventRoleId) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("Please select all five options before sending the application panel.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      const config = getStaffConfig(interaction.guild.id);
      Object.assign(config, draft);
      saveStaffConfig();
      const applyChannel = interaction.guild.channels.cache.get(draft.applyChannelId);
      if (!applyChannel || applyChannel.type !== ChannelType.GuildText) return;
      await applyChannel.send({ components: [buildApplicationPanel(interaction.guild.name)], flags: MessageFlags.IsComponentsV2 });
      staffSetups.delete(key);
      return interaction.update({ components: [new ContainerBuilder().addTextDisplayComponents(text(checkText("Staff Applications configured successfully.")))], flags: MessageFlags.IsComponentsV2 });
    }

    if (interaction.isButton() && interaction.customId.startsWith("setup_refresh_")) {
      const userId = interaction.customId.replace("setup_refresh_", "");
      if (interaction.user.id !== userId) return;
      const draft = staffSetups.get(`${interaction.guild.id}:${userId}`) || getStaffConfig(interaction.guild.id);
      return interaction.update({ components: [buildStaffSetupPanel(interaction.guild.id, userId, draft)], flags: MessageFlags.IsComponentsV2 });
    }

    if (interaction.isButton() && interaction.customId.startsWith("setup_staff_cancel_")) {
      const userId = interaction.customId.replace("setup_staff_cancel_", "");
      if (interaction.user.id !== userId) return;
      staffSetups.delete(`${interaction.guild.id}:${userId}`);
      return interaction.update({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("Staff application setup cancelled.")))], flags: MessageFlags.IsComponentsV2 });
    }

    // Application buttons + modal
    const applicationTypes = {
      application_staff: { type: "staff", roleKey: "staffRoleId" },
      application_game: { type: "game", roleKey: "gameRoleId" },
      application_event: { type: "event", roleKey: "eventRoleId" }
    };
    const applicationType = applicationTypes[interaction.customId];
    if (interaction.isButton() && applicationType) {
      const key = `${interaction.guild.id}:${interaction.user.id}`;
      const last = applicationCooldowns.get(key);
      if (last && Date.now() - last < 5 * 24 * 60 * 60 * 1000) {
        const left = 5 * 24 * 60 * 60 * 1000 - (Date.now() - last);
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText(`You must wait **${remainingTime(left)}** before submitting another application.`)))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      return interaction.showModal(buildApplicationModal(applicationType.type));
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith("application_modal_")) {
      const type = interaction.customId.replace("application_modal_", "");
      const config = getStaffConfig(interaction.guild.id);
      const roleKey = type === "staff" ? "staffRoleId" : type === "game" ? "gameRoleId" : "eventRoleId";
      if (!config[roleKey]) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("This application position is not configured.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }

      const answers = {
        name: interaction.fields.getTextInputValue("name"),
        age: interaction.fields.getTextInputValue("age"),
        experience: interaction.fields.getTextInputValue("experience"),
        active: interaction.fields.getTextInputValue("active")
      };
      if (type === "staff") answers.why = interaction.fields.getTextInputValue("why");
      else if (type === "game") answers.why_game = interaction.fields.getTextInputValue("why_game");
      else answers.why_event = interaction.fields.getTextInputValue("why_event");

      const applicationId = `${interaction.user.id}-${Date.now()}`;
      applicationCooldowns.set(`${interaction.guild.id}:${interaction.user.id}`, Date.now());

      const logs = interaction.guild.channels.cache.get(config.logsChannelId);
      if (logs) {
        await logs.send({ components: [buildApplicationLog(interaction.guild, interaction.user, type, answers, applicationId)], flags: MessageFlags.IsComponentsV2 });
      }

      return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(checkText("Your application has been submitted successfully.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    }

    // Accept / Decline Application
    if (interaction.isButton() && interaction.customId.startsWith("application_accept_")) {
      if (!isAdmin(interaction.member) && !isOwner(interaction.user.id)) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("You do not have permission to accept applications.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      const applicationId = interaction.customId.replace("application_accept_", "");
      const applicantId = applicationId.split("-")[0];
      const applicant = await client.users.fetch(applicantId).catch(() => null);
      if (applicant) {
        await applicant.send({ components: [buildApplicationAcceptedMessage(interaction.guild.name)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
      return interaction.update({
        components: [new ContainerBuilder().addTextDisplayComponents(text(checkText(`Application accepted by ${interaction.user}.`))).addSeparatorComponents(separator()).addTextDisplayComponents(text("The application has been accepted successfully."))],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (interaction.isButton() && interaction.customId.startsWith("application_cancel_")) {
      if (!isAdmin(interaction.member) && !isOwner(interaction.user.id)) {
        return interaction.reply({ components: [new ContainerBuilder().addTextDisplayComponents(text(noText("You do not have permission to cancel applications.")))], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      const applicationId = interaction.customId.replace("application_cancel_", "");
      const applicantId = applicationId.split("-")[0];
      const applicant = await client.users.fetch(applicantId).catch(() => null);
      if (applicant) {
        await applicant.send({ components: [buildApplicationDeclinedMessage()], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      }
      return interaction.update({
        components: [new ContainerBuilder().addTextDisplayComponents(text(noText(`Application declined by ${interaction.user}.`))).addSeparatorComponents(separator()).addTextDisplayComponents(text("The application has been declined."))],
        flags: MessageFlags.IsComponentsV2
      });
    }

    // ========== HELP SYSTEM INTERACTIONS (ASTRA STYLE) ==========
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith("help_category_")) {
      const userId = interaction.customId.replace("help_category_", "");
      if (interaction.user.id !== userId) return;
      if (!helpSessions.has(userId) || helpSessions.get(userId) < Date.now()) {
        return interaction.reply({
          components: [new ContainerBuilder().addTextDisplayComponents(text(noText("This help menu has expired.")))],
          flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
        });
      }
      const category = interaction.values[0];
      return interaction.update({
        components: [buildHelpCategory(userId, category, 0)],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (interaction.isButton() && interaction.customId.startsWith("help_home_")) {
      const userId = interaction.customId.replace("help_home_", "");
      if (interaction.user.id !== userId) return;
      if (!helpSessions.has(userId) || helpSessions.get(userId) < Date.now()) {
        return interaction.reply({
          components: [new ContainerBuilder().addTextDisplayComponents(text(noText("This help menu has expired.")))],
          flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
        });
      }
      return interaction.update({
        components: [buildHelpHome(userId)],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (interaction.isButton() && interaction.customId.startsWith("help_category_back_")) {
      const userId = interaction.customId.replace("help_category_back_", "");
      if (interaction.user.id !== userId) return;
      if (!helpSessions.has(userId) || helpSessions.get(userId) < Date.now()) {
        return interaction.reply({
          components: [new ContainerBuilder().addTextDisplayComponents(text(noText("This help menu has expired.")))],
          flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
        });
      }
      return interaction.update({
        components: [buildHelpHome(userId)],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (
      interaction.isButton() &&
      (interaction.customId.startsWith("help_next_") || interaction.customId.startsWith("help_prev_"))
    ) {
      const parts = interaction.customId.split("_");
      const userId = parts[2];
      const category = parts[3];
      const oldPage = Number(parts[4]);
      if (interaction.user.id !== userId) return;
      if (!helpSessions.has(userId) || helpSessions.get(userId) < Date.now()) {
        return interaction.reply({
          components: [new ContainerBuilder().addTextDisplayComponents(text(noText("This help menu has expired.")))],
          flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
        });
      }
      const newPage = interaction.customId.startsWith("help_next_") ? oldPage + 1 : oldPage - 1;
      return interaction.update({
        components: [buildHelpCategory(userId, category, Math.max(0, newPage))],
        flags: MessageFlags.IsComponentsV2
      });
    }

    if (
      interaction.isButton() &&
      (interaction.customId.startsWith("help_no_next_") || interaction.customId.startsWith("help_no_prev_"))
    ) {
      return interaction.reply({
        components: [
          new ContainerBuilder().addTextDisplayComponents(text(noText("There are no more pages.")))
        ],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

  } catch (error) {
    console.error("Interaction Error:", error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(text(noText("An unexpected error occurred. Please try again.")))],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      }).catch(() => {});
    }
  }
});

// ============================================================
// ========== MAIN MESSAGE HANDLER (MERGED) ==========
// ============================================================
client.on("messageCreate", async message => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim();
  const args = content.startsWith(PREFIX) ? content.slice(PREFIX.length).trim().split(/\s+/) : [];
  const command = args.shift()?.toLowerCase();
  const words = content.split(/\s+/);
  const firstCommand = words[0]?.toLowerCase();

  // s?u alias
  if (content.toLowerCase().startsWith("s?u")) {
    const after = content.slice(3).trim();
    const actArgs = after ? after.split(/\s+/).filter(Boolean) : [];
    try { await activityCommand(message, actArgs); } catch (e) { console.error(e); }
    return;
  }

  if (!content.startsWith(PREFIX)) return;

  // ========== HELP ==========
  if (command === "help" || command === "h") {
    const expires = Date.now() + 5 * 60 * 1000;
    helpSessions.set(message.author.id, expires);

    const msg = await message.reply({
      components: [buildHelpHome(message.author.id)],
      flags: MessageFlags.IsComponentsV2
    });

    setTimeout(async () => {
      if (helpSessions.get(message.author.id) !== expires) return;
      helpSessions.delete(message.author.id);
      await msg.edit({
        components: [buildHelpHome(message.author.id, true)],
        flags: MessageFlags.IsComponentsV2
      }).catch(() => {});
    }, 5 * 60 * 1000);

    return;
  }

  // ========== USER INFO ==========
  if (["u", "user", "-u", "-user"].includes(firstCommand) || command === "u" || command === "user") {
    let user = message.author;
    const targetArg = words[1] || args[0];
    if (targetArg) {
      const userId = targetArg.replace(/[<@!>]/g, "");
      try { user = await client.users.fetch(userId); }
      catch { return message.reply(v2Error("User Not Found", "User not found.", "astra • User")); }
    }
    const member = await message.guild.members.fetch(user.id).catch(() => null);
    const accountCreated = Math.floor(user.createdTimestamp / 1000);
    const joinedServer = member?.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : null;
    const status = member?.presence?.status || "offline";
    const statusNames = { online: "Online", offline: "Offline", dnd: "Do Not Disturb", idle: "Idle" };
    const statusEmoji = {
      online: "<a:StatusOnline:1540302405147697232>",
      offline: "<a:offline_invisible:1540304769455882314>",
      dnd: "<a:Do_not_disturb:1540305280062070866>",
      idle: "<a:aIdle:1540305190035390615>"
    };
    const statusText = statusNames[status] || "Offline";
    const statusIcon = statusEmoji[status] || statusEmoji.offline;
    let roles = "None";
    if (member) {
      const roleList = member.roles.cache
        .filter(role => role.id !== message.guild.id)
        .sort((a, b) => b.position - a.position)
        .first(5);
      if (roleList.length > 0) roles = roleList.map(role => role.toString()).join(" ");
    }
    const requestTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const embed = new EmbedBuilder()
      .setColor("#101418")
      .setAuthor({ name: "User", iconURL: user.displayAvatarURL({ size: 128 }) })
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      .setDescription(
        `**__USER__**\n・${user}\n\n` +
        `**__USERNAME__**\n・\`${user.username}\`\n\n` +
        `**__ID__**\n・\`${user.id}\`\n\n` +
        `**__ACCOUNT CREATED__**\n・<t:${accountCreated}:F>\n\n` +
        `**__JOINED SERVER__**\n・${joinedServer ? `<t:${joinedServer}:F>` : "Unknown"}\n\n` +
        `**__STATUS__**\n・${statusIcon} \`${statusText}\`\n\n` +
        `**__ROLES__**\n・${roles}`
      )
      .setFooter({ text: `Requested by ${message.author.username} | Today at ${requestTime}`, iconURL: message.author.displayAvatarURL({ size: 128 }) });
    return message.reply({ embeds: [embed] });
  }

  // ========== ESAY ==========
  if (command === "esay") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply(v2Error("Missing Permission", "You need the **Administrator** permission to use this command.", "astra • Moderation"));
    }
    const textMsg = args.join(" ");
    const attachment = message.attachments.first();
    if (!textMsg && !attachment) {
      return message.reply(v2Error("Usage", "**Usage**\n`-esay <message>`\nYou can also attach an image.", "astra • Moderation"));
    }
    await message.delete().catch(() => {});
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
    if (textMsg) embed.setDescription(textMsg);
    if (attachment) embed.setImage(attachment.url);
    return message.channel.send({ embeds: [embed] });
  }

  // ========== SERVER INFO ==========
  if (["server", "-server"].includes(firstCommand) || command === "server") {
    try {
      let guild = message.guild;
      const maybeId = (args[0] || "").replace(/[<#>]/g, "");
      if (maybeId && /^\d{17,20}$/.test(maybeId)) {
        guild = client.guilds.cache.get(maybeId) || await client.guilds.fetch(maybeId).catch(() => null);
        if (!guild) {
          return message.reply(v2Error("Server Not Found", "I couldn't find a server with that ID.\nThe bot must be in that server.", "astra • Server"));
        }
      }
      await guild.fetch();
      await guild.members.fetch().catch(() => {});
      const owner = await guild.fetchOwner().catch(() => null);
      const totalMembers = guild.memberCount;
      const bots = guild.members.cache.filter(m => m.user.bot).size;
      const humans = Math.max(totalMembers - bots, 0);
      const online = guild.members.cache.filter(m => {
        const status = m.presence?.status;
        return status === "online" || status === "idle" || status === "dnd";
      }).size;
      const offline = Math.max(totalMembers - online, 0);
      const channels = guild.channels.cache;
      const totalChannels = channels.size;
      const categoriesCount = channels.filter(c => c.type === ChannelType.GuildCategory).size;
      const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
      const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
      const stageChannels = channels.filter(c => c.type === ChannelType.GuildStageVoice).size;
      const nsfwChannels = channels.filter(c => c.nsfw === true).size;
      const roles = Math.max(guild.roles.cache.size - 1, 0);
      const emojis = guild.emojis.cache.size;
      const stickers = guild.stickers.cache.size;
      const boosts = guild.premiumSubscriptionCount || 0;
      const boosters = guild.members.cache.filter(m => m.premiumSince).size;
      const created = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;
      const icon = guild.iconURL({ extension: "png", size: 1024 });
      const fallbackBanner = "https://media.discordapp.net/attachments/1537611791021121556/1540321499381239979/69e96fe0ad6a08f301d6351b70a94c20.png";
      const serverBanner = guild.bannerURL({ extension: "png", size: 2048 });
      const banner = serverBanner || fallbackBanner;

      const container = new ContainerBuilder();
      if (icon) {
        container.addMediaGalleryComponents(
          new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(icon).setDescription(`${guild.name} avatar`))
        );
      }
      container
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${guild.name}\n\`${guild.id}\``))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`<:OwnerCrown:1536485446018662543> ୨୧ **Owner** : ${owner || "Unknown"}`))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`<:EventWinner:1540314742801965076> ୨୧ **Created** : **${created}**`))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `<:Members:1540314970548342837> ୨୧ **Members** : **${totalMembers}**\nHumans : **${humans}**\nBots : **${bots}**\n\nOnline : **${online}**\nOffline : **${offline}**`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `Channels : **${totalChannels}**\nCategories **${categoriesCount}**:\nText : **${textChannels}**\nVoice : **${voiceChannels}**\nStage : **${stageChannels}**\nNSFW : **${nsfwChannels}**`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `<:Pinkdiamondheart:1540316169389482015> ୨୧ ** Server Content**\nRoles : **${roles}**\nEmojis : **${emojis}**\nStickers : **${stickers}**`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(
          `<a:Server_Boost:1540316440153034832> ୨୧ **Boosts**\nBoosts : **${boosts}**\nBoosters : **${boosters}**`
        ))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(
          new MediaGalleryItemBuilder().setURL(banner).setDescription(serverBanner ? `${guild.name} banner` : "Default server banner")
        ))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Requested by ${message.author}`));

      return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } catch (error) {
      console.error("SERVER ERROR:", error);
      return message.reply(v2Error("Server Error", `An error occurred: \`${error.message}\``, "astra • Server"));
    }
  }

  // ========== BANNER ==========
  if (["bn", "-bn"].includes(firstCommand) || command === "bn") {
    let user = message.mentions.users.first();
    if (!user && words[1]) {
      try { user = await client.users.fetch(words[1]); } catch { user = null; }
    }
    if (!user) user = message.author;
    try {
      const fetchedUser = await client.users.fetch(user.id, { force: true });
      if (!fetchedUser.banner) {
        return message.channel.send(v2Error("No Banner", `**${user.tag}** doesn't have a banner.`, "Amo • Banner"));
      }
      const bannerURL = fetchedUser.bannerURL({ dynamic: true, size: 4096 });
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${user.tag}'s Banner`, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setTitle("Banner Link")
        .setURL(bannerURL)
        .setImage(bannerURL)
        .setColor(EMBED_COLOR)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
      return message.channel.send({ embeds: [embed] });
    } catch {
      return message.channel.send(v2Error("Banner Error", "I couldn't fetch this user's banner.", "Amo • Banner"));
    }
  }

  // ========== AVATAR ==========
  if (["a", "-a"].includes(firstCommand) || command === "a") {
    let user = message.mentions.users.first();
    if (!user && words[1]) {
      try { user = await client.users.fetch(words[1]); } catch { user = null; }
    }
    if (!user) user = message.author;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });
    const embed = new EmbedBuilder()
      .setAuthor({ name: `${user.tag}'s Avatar`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setTitle("Avatar Link")
      .setURL(avatarURL)
      .setImage(avatarURL)
      .setColor(EMBED_COLOR)
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
    return message.channel.send({ embeds: [embed] });
  }

  // ========== NICKNAME ==========
  if (command === "nickname") {
    if (!message.member.permissions.has("ManageNicknames")) {
      return message.reply({
        components: [makeContainer(`# ${NO} | Nickname`, "You need **Manage Nicknames** permission to use this command.")],
        flags: MessageFlags.IsComponentsV2
      });
    }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply({
        components: [makeContainer(`# ${NO} | Invalid Usage`, "**Usage**\n`-nickname <@member|memberID> <nickname>`\n\n**Example**\n`-nickname @User New Nickname`")],
        flags: MessageFlags.IsComponentsV2
      });
    }
    const nickname = args.slice(1).join(" ");
    if (!nickname) {
      return message.reply({
        components: [makeContainer(`# ${NO} | Invalid Usage`, "**Usage**\n`-nickname <@member|memberID> <nickname>`")],
        flags: MessageFlags.IsComponentsV2
      });
    }
    if (nickname.length > 32) {
      return message.reply({
        components: [makeContainer(`# ${NO} | Nickname`, "Nickname cannot exceed **32 characters**.")],
        flags: MessageFlags.IsComponentsV2
      });
    }
    if (!member.manageable) {
      return message.reply({
        components: [makeContainer(`# ${NO} | Nickname`, `I can't change **${member}**'s nickname.`)],
        flags: MessageFlags.IsComponentsV2
      });
    }
    try {
      await member.setNickname(nickname);
      const timestamp = Math.floor(Date.now() / 1000);
      const container = new ContainerBuilder()
        .setAccentColor(COLOR)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${CHECK} | Nickname Updated`))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Member**\n${member}`))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**New Nickname**\n> \`${nickname}\``))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Updated by ${message.author} • <t:${timestamp}:R>`));
      return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } catch (error) {
      console.error(error);
      return message.reply({
        components: [makeContainer(`# ${NO} | Nickname`, "Something went wrong while changing the nickname.")],
        flags: MessageFlags.IsComponentsV2
      });
    }
  }

  // ========== ACTIVITY / RANK ==========
  if (command === "activity" || command === "act") {
    try { await activityCommand(message, args); } catch (e) { console.error(e); }
    return;
  }
  if (command === "rank" || command === "r") {
    try { await rankCommand(message, args); } catch (e) { console.error(e); }
    return;
  }
  if (command === "rankl") {
    try { await ranklCommand(message, args); } catch (e) { console.error(e); }
    return;
  }

  // ========== INVITES ==========
  if (command === "invites") {
    try {
      let targetUser = message.author;
      if (message.mentions.users.size > 0) targetUser = message.mentions.users.first();
      else if (args[0]) {
        const userId = args[0].replace(/[<@!>]/g, "");
        if (!/^\d{17,20}$/.test(userId)) {
          return message.reply(`${NO} Use \`-invites\`, \`-invites @user\` or \`-invites USER_ID\`.`);
        }
        try { targetUser = await client.users.fetch(userId); }
        catch { return message.reply(`${NO} I couldn't find this user.`); }
      }
      const stats = getUserData(message.guild.id, targetUser.id);
      saveInviteDB();
      await sendInviteStats(message, targetUser, stats);
    } catch (error) {
      console.error(`${NO} -invites error:`, error);
      await message.reply(`${NO} An error occurred with Invite Stats.`).catch(() => {});
    }
    return;
  }

  // ========== FUN ==========
  if (["kiss", "slap", "hug", "pat", "love"].includes(command)) {
    const user = message.mentions.users.first();
    if (!user) return message.reply(`${NO} Mention someone! Example: \`${PREFIX}${command} @user\``);
    if (user.id === message.author.id) return selfMessage(message, command);

    if (command === "love") {
      const percentage = randomPercent();
      const filled = Math.round(percentage / 10);
      const empty = 10 - filled;
      const bar = "█".repeat(filled) + "░".repeat(empty);
      const container = new ContainerBuilder()
        .setAccentColor(COLOR)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`<a:PinkHearts:1539463428421328947> | ${message.author} <:Pinkdiamondheart:1540316169389482015> ${user}`))
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Love compatibility**\n${bar} **${percentage}%**`))
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Requested by ${message.author}`));
      return message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }

    let gifs, emoji, text;
    if (command === "kiss") {
      gifs = kissGifs;
      emoji = "<a:PinkHearts:1539463428421328947>";
      text = `${message.author} **lovingly kisses** ${user} **under the cherry blossoms**`;
    }
    if (command === "slap") {
      gifs = slapGifs;
      emoji = "<a:PandaSpin:1539126794979123250>";
      text = `${message.author} **slaps** ${user} **across the face**`;
    }
    if (command === "hug") {
      gifs = hugGifs;
      emoji = "<a:BlackHeartExclaim:1538839892891799603>";
      text = `${message.author} **warmly hugs** ${user} **with lots of love**`;
    }
    if (command === "pat") {
      gifs = patGifs;
      emoji = "<a:BlackHeartExclaim:1538839892891799603>";
      text = `${message.author} **gently pats** ${user} **on the head**`;
    }

    const gif = randomGif(gifs);
    const container = new ContainerBuilder()
      .setAccentColor(COLOR)
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`${emoji} | ${text}`))
      .addSeparatorComponents(new SeparatorBuilder())
      .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL(gif).setDescription(`${command} GIF`)
      ))
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Requested by ${message.author}`));

    try {
      await message.channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    } catch (error) {
      console.error(`${NO} Error with ${command}:`, error);
    }
    return;
  }

  // ========== VERIFICATION ==========
  if (command === "setup-verification") {
    if (!isAdmin(message.member)) {
      return replyV2(message, "# Permission Denied", "Only members with **Administrator** permission can use `-setup-verification`.");
    }
    return sendVerificationSetup(message.channel);
  }
  if (command === "verificator" || command === "verificatorlist") {
    return sendVerificatorList(message);
  }
  if (command === "vb" || command === "vg") {
    const config = getVerificationConfig(message.guild.id);
    if (!setupComplete(config)) {
      return replyV2(message, "# Configuration Required", "The Verification System has not been fully configured.\n\nUse `-setup-verification` first.");
    }
    if (!isVerifier(message.member, config)) {
      return replyV2(message, "# Permission Denied", "You don't have a configured **Verifier Role**.");
    }
    if (message.channel.id !== config.commandChannelId) {
      return replyV2(message, "# Wrong Channel", `You can only use verification commands in <#${config.commandChannelId}>.`);
    }
    const target = await findMember(message, args[0]);
    if (!target) {
      return replyV2(message, "# Invalid Usage", `**Correct usage:**\n\`${PREFIX}${command} @user / ID\``);
    }
    return verifyMember({ message, target, type: command === "vb" ? "Boy" : "Girl" });
  }

  // ========== MODERATION ==========
  if (command === "role") return roleCommand(message, "add");
  if (command === "removerole" || command === "rrole") return roleCommand(message, "remove");

  if (command === "ban") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply(v2Error("Missing Permission", "You need the **Ban Members** permission."));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-ban @user/ID [reason]`"));
    const reason = cleanText(args.slice(1).join(" ")) || "No reason provided";
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    try {
      if (target) {
        if (!target.bannable) return message.reply(v2Error("Cannot Ban", "I don't have enough permissions to ban this member."));
        try {
          await target.send(v2Response({
            title: "You have been banned",
            description: `You have been banned from **${message.guild.name}**.\n\n**Reason**\n> ${reason}\n\n**Moderator**\n> ${message.author.tag}`,
            emoji: BAN_EMOJI
          }));
        } catch {}
        await target.ban({ reason });
        return message.reply(v2Success("Member Banned", `**${target.user.tag}** has been banned.\n\n**Reason**\n> ${reason}`));
      }
      await message.guild.members.ban(args[0], { reason });
      return message.reply(v2Success("User Banned", `User \`${args[0]}\` has been banned.\n\n**Reason**\n> ${reason}`));
    } catch (error) {
      console.error(error);
      return message.reply(v2Error("Ban Failed", "I couldn't ban this user."));
    }
  }

  if (command === "unban") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply(v2Error("Missing Permission", "You need the **Ban Members** permission."));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-unban <user ID>`"));
    try {
      await message.guild.members.unban(args[0]);
      return message.reply(v2Success("Member Unbanned", `User \`${args[0]}\` has been unbanned.`));
    } catch {
      return message.reply(v2Error("Unban Failed", "I couldn't unban this user."));
    }
  }

  if (command === "ds") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return message.reply(v2Error("Missing Permission", "You need the **Move Members** permission.", "Amo • Voice"));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-ds @user/ID`", "Amo • Voice"));
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!target) return message.reply(v2Error("Member Not Found", "I couldn't find the specified member.", "Amo • Voice"));
    if (!target.voice.channel) return message.reply(v2Error("Not In Voice", `**${target.user.tag}** is not in a voice channel.`, "Amo • Voice"));
    try {
      await target.voice.disconnect();
      return message.reply(v2Success("Member Disconnected", `**${target.user.tag}** has been disconnected.`, "Amo • Voice"));
    } catch {
      return message.reply(v2Error("Disconnect Failed", "I couldn't disconnect this member.", "Amo • Voice"));
    }
  }

  if (command === "move") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return message.reply(v2Error("Missing Permission", "You need the **Move Members** permission.", "Amo • Voice"));
    }
    if (!args[0]) {
      return message.reply(v2Error("Usage", "`-move @user` → to your channel\n`-move @user channelID` → to specific channel", "Amo • Voice"));
    }
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!target) return message.reply(v2Error("Member Not Found", "I couldn't find the specified member.", "Amo • Voice"));
    if (!target.voice.channel) return message.reply(v2Error("Not In Voice", `**${target.user.tag}** is not in a voice channel.`, "Amo • Voice"));
    let channel;
    if (args[1]) {
      channel = message.guild.channels.cache.get(args[1]);
      if (!channel || channel.type !== ChannelType.GuildVoice) {
        return message.reply(v2Error("Invalid Channel", "Please provide a valid voice channel ID.", "Amo • Voice"));
      }
    } else {
      channel = message.member.voice.channel;
      if (!channel) return message.reply(v2Error("Not In Voice", "You need to be in a voice channel.", "Amo • Voice"));
    }
    try {
      await target.voice.setChannel(channel);
      return message.reply(v2Success("Member Moved", `**${target.user.tag}** moved to **${channel.name}**.`, "Amo • Voice"));
    } catch {
      return message.reply(v2Error("Move Failed", "I couldn't move this member.", "Amo • Voice"));
    }
  }

  if (command === "vmute") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply(v2Error("Missing Permission", "You need the **Mute Members** permission.", "Amo • Voice Moderation"));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-vmute @user/ID [reason]`", "Amo • Voice Moderation"));
    let target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!target) {
      target = message.guild.members.cache.find(m =>
        m.user.username.toLowerCase() === args[0].toLowerCase() ||
        m.displayName.toLowerCase() === args[0].toLowerCase()
      );
    }
    if (!target) return message.reply(v2Error("Member Not Found", "I couldn't find the specified member.", "Amo • Voice Moderation"));
    if (!target.voice.channel) return message.reply(v2Error("Not In Voice", `**${target.user.tag}** is not in a voice channel.`, "Amo • Voice Moderation"));
    const reason = cleanText(args.slice(1).join(" ")) || "No reason provided";
    try {
      await target.voice.setMute(true, reason);
      return message.reply(v2Success("Voice Mute", `**${target.user.tag}** has been voice muted.\n\n**Reason**\n> ${reason}`, "Amo • Voice Moderation"));
    } catch {
      return message.reply(v2Error("Voice Mute Failed", "I couldn't voice mute this member.", "Amo • Voice Moderation"));
    }
  }

  if (command === "vunmute") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return message.reply(v2Error("Missing Permission", "You need the **Mute Members** permission.", "Amo • Voice Moderation"));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-vunmute @user/ID`", "Amo • Voice Moderation"));
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!target) return message.reply(v2Error("Member Not Found", "I couldn't find the specified member.", "Amo • Voice Moderation"));
    if (!target.voice.channel) return message.reply(v2Error("Not In Voice", `**${target.user.tag}** is not in a voice channel.`, "Amo • Voice Moderation"));
    try {
      await target.voice.setMute(false);
      return message.reply(v2Success("Voice Unmute", `**${target.user.tag}** has been voice unmuted.`, "Amo • Voice Moderation"));
    } catch {
      return message.reply(v2Error("Voice Unmute Failed", "I couldn't unmute this member.", "Amo • Voice Moderation"));
    }
  }

  if (command === "vmlogs") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply(v2Error("Missing Permission", "You need the **Administrator** permission.", "Amo • Voice Logs"));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-vmlogs @user/ID`", "Amo • Voice Logs"));
    let user = message.mentions.users.first();
    if (!user) {
      try { user = await client.users.fetch(args[0]); } catch { user = null; }
    }
    if (!user) return message.reply(v2Error("User Not Found", "I couldn't find this user.", "Amo • Voice Logs"));
    const logs = readMuteLogs();
    const userLogs = (logs[user.id] || []).filter(log => log.guildId === message.guild.id);
    if (userLogs.length === 0) {
      return message.reply(v2Info(`${MUTE_EMOJI} No Logs Found`, `No voice mute logs for **${user.tag}**.`, "Amo • Voice Logs"));
    }
    let text = "### Voice Mute History\n\n";
    for (let i = 0; i < userLogs.length; i++) {
      const log = userLogs[userLogs.length - 1 - i];
      let modLine = "> **Moderator:** Unknown";
      if (log.moderatorId && log.moderatorId !== "Unknown") {
        try {
          const modUser = await client.users.fetch(log.moderatorId);
          modLine = modUser.bot
            ? `> **Responsible Moderator:** ${modUser.tag}`
            : `> **Moderator:** ${modUser.tag}`;
        } catch {
          modLine = `> **Moderator:** <@${log.moderatorId}>`;
        }
      }
      text += `**${i + 1}.** <t:${Math.floor(log.timestamp / 1000)}:R>\n${modLine}\n> **Reason:** ${cleanText(log.reason)}\n> **Date:** <t:${Math.floor(log.timestamp / 1000)}:F>\n\n`;
    }
    return message.reply(v2Info(`${MUTE_EMOJI} Voice Mute Logs • ${user.tag}`, text, "Amo • Voice Logs"));
  }

  if (command === "warn") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply(v2Error("Missing Permission", "You need the **Administrator** permission.", "Amo • Warnings"));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-warn @user/ID <reason>`", "Amo • Warnings"));
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!target) return message.reply(v2Error("Member Not Found", "I couldn't find the specified member.", "Amo • Warnings"));
    const currentWarns = getWarns(target.id, message.guild.id);
    if (currentWarns.length >= 3) {
      return message.reply(v2Error("Max Warnings Reached", `**${target.user.tag}** already has **3 warnings**.`, "Amo • Warnings"));
    }
    const reason = cleanText(args.slice(1).join(" ")) || "No reason provided";
    const newWarnCount = currentWarns.length + 1;
    saveWarn(target.id, message.author, reason, message.guild);
    let warnEmoji = WARN1_EMOJI;
    if (newWarnCount === 2) warnEmoji = WARN2_EMOJI;
    if (newWarnCount >= 3) warnEmoji = WARN3_EMOJI;

    if (newWarnCount >= 3) {
      try {
        await target.send(v2Response({
          title: "You have been banned",
          description: `You reached the maximum of **3 warnings** and have been banned from **${message.guild.name}**.`,
          emoji: BAN_EMOJI,
          footer: "Amo • Warnings"
        })).catch(() => {});
        await target.ban({ reason: `Reached 3 warnings. Last reason: ${reason}` });
        return message.reply(v2Success("Member Banned", `**${target.user.tag}** reached **3 warnings** and has been **banned**.\n\n**Last Reason**\n> ${reason}`, "Amo • Warnings"));
      } catch (error) {
        console.error(error);
        return message.reply(v2Error("Ban Failed", "Reached 3 warnings but I couldn't ban the member.", "Amo • Warnings"));
      }
    }

    try {
      await target.send(v2Warning(
        "You have been warned",
        `You received a warning in **${message.guild.name}**.\n\n**Reason**\n> ${reason}\n\n**Moderator**\n> ${message.author.tag}\n\n**Warnings:** ${newWarnCount}/3`,
        warnEmoji,
        "Amo • Warnings"
      )).catch(() => {});
    } catch {}
    return message.reply(v2Success("Member Warned", `**${target.user.tag}** has been warned.\n\n**Reason**\n> ${reason}\n\n**Total Warnings:** ${newWarnCount}/3`, "Amo • Warnings"));
  }

  if (command === "warnings") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply(v2Error("Missing Permission", "You need the **Administrator** permission.", "Amo • Warnings"));
    }
    if (!args[0]) return message.reply(v2Error("Usage", "**Usage**\n`-warnings @user/ID`", "Amo • Warnings"));
    let user = message.mentions.users.first();
    if (!user) {
      try { user = await client.users.fetch(args[0]); } catch { user = null; }
    }
    if (!user) return message.reply(v2Error("User Not Found", "I couldn't find this user.", "Amo • Warnings"));
    const warns = getWarns(user.id, message.guild.id);
    return message.reply(createWarningsPage(user, warns));
  }

  if (command === "createrole") {
    if (!isOwner(message.member) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply(v2Error("Missing Permission", "You need the **Administrator** permission.", "Amo • Roles"));
    }
    const roleName = args.join(" ");
    if (!roleName) return message.reply(v2Error("Usage", "**Usage**\n`-createrole <role name>`", "Amo • Roles"));
    try {
      const role = await message.guild.roles.create({ name: roleName, reason: `Created by ${message.author.tag}` });
      return message.reply(v2Success("Role Created", `Successfully created the role **${role.name}**.`, "Amo • Roles"));
    } catch (error) {
      console.error(error);
      return message.reply(v2Error("Role Creation Failed", "I couldn't create the role.", "Amo • Roles"));
    }
  }

  if (command === "dmall") {
    if (!isOwner(message.member)) {
      return message.reply(v2Error("Owner Only", "This command is only available for the bot owner."));
    }
    const msgToSend = args.join(" ");
    if (!msgToSend) return message.reply(v2Error("Usage", "**Usage**\n`-dmall <message>`", "Amo • Messaging"));
    await message.reply(v2Response({
      title: "Message Delivery",
      description: "Starting message delivery to server members.\n\nPlease wait...",
      emoji: PAPER_PLANE,
      footer: "Amo • Messaging"
    }));
    let success = 0, failed = 0;
    const members = await message.guild.members.fetch();
    for (const [, member] of members) {
      if (member.user.bot) continue;
      try {
        await member.send(msgToSend);
        success++;
      } catch {
        failed++;
      }
      await new Promise(r => setTimeout(r, 700));
    }
    return message.channel.send(v2Success(
      "Delivery Complete",
      `**Delivered**\n> \`${success}\` members\n\n**Failed**\n> \`${failed}\` members`,
      "Amo • Messaging"
    ));
  }

  if (command === "music") {
    if (!isOwner(message.member)) {
      return message.reply(v2Error("Owner Only", "This command is only available for the bot owner."));
    }
    return message.channel.send(createMusicPanel(message.guild));
  }

  if (command === "c") {
    if (!isOwner(message.member)) {
      return message.reply(v2Error("Owner Only", "This command is only available for the bot owner."));
    }
    await message.reply(v2Warning("Nuking Server", "Starting server nuke...\n\nAll channels and roles will be deleted.", "Amo • Nuke"));
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
      const newChannel = await guild.channels.create({ name: "general", type: ChannelType.GuildText });
      await newChannel.send(v2Success("Server Nuked", "The server has been completely nuked.\n\nOnly this channel remains.", "Amo • Nuke"));
    } catch (error) {
      console.error("Nuke error:", error);
    }
  }

  // ========== JAIL COMMANDS ==========
  if (command === "setup-jail") {
    if (!isAdmin(message.member)) {
      return replyV2(message, "# Permission Denied", "You need **Administrator** permission to use `-setup-jail`.");
    }
    return sendJailSetupPanel(message.channel);
  }
  if (command === "jailer") {
    if (!isAdmin(message.member)) {
      return replyV2(message, "# Permission Denied", "You need **Administrator** permission to use `-jailer`.");
    }
    return sendJailerPanel(message.channel);
  }
  if (command === "jailerlist") {
    if (!isAdmin(message.member)) {
      return replyV2(message, "# Permission Denied", "You need **Administrator** permission to use `-jailerlist`.");
    }
    return showJailerList(message);
  }
  if (command === "jaillist") {
    if (!isAdmin(message.member)) {
      return replyV2(message, "# Permission Denied", "You need **Administrator** permission to use `-jaillist`.");
    }
    return showJailList(message);
  }
  if (command === "jail") {
    const config = getJailConfig(message.guild.id);
    if (!jailConfigured(config)) {
      return replyV2(message, "# Configuration Required", "The Jail System is not fully configured.\n\nUse `-setup-jail` first.");
    }
    if (!canJail(message.member, config)) {
      return replyV2(message, "# Permission Denied", "You do not have permission to use this command.");
    }
    if (message.channel.id !== config.jailChannelId) {
      return replyV2(message, "# Wrong Channel", `You can only use this command in <#${config.jailChannelId}>.`);
    }
    const target = await findMember(message, args[0]);
    if (!target) {
      return replyV2(message, "# Invalid User", "**Usage:** `-jail @user [reason]`");
    }
    if (target.id === message.author.id) {
      return replyV2(message, "# Action Denied", "You cannot jail yourself.");
    }
    if (target.user.bot) {
      return replyV2(message, "# Action Denied", "Bots cannot be jailed.");
    }
    if (config.jailedUsers[target.id]) {
      return replyV2(message, "# Already Jailed", "This member is already jailed.");
    }
    const jailRole = message.guild.roles.cache.get(config.jailRoleId);
    if (!jailRole) {
      return replyV2(message, "# Configuration Error", "The configured Jail Role no longer exists.");
    }
    const botMember = message.guild.members.me;
    if (!botMember) {
      return replyV2(message, "# Bot Error", "I could not find my member information.");
    }
    if (jailRole.position >= botMember.roles.highest.position) {
      return replyV2(message, "# Role Hierarchy", "The Jail Role must be below my highest role.");
    }
    if (target.roles.highest.position >= botMember.roles.highest.position) {
      return replyV2(message, "# Role Hierarchy", "I cannot manage this member's roles.");
    }
    if (!isAdmin(message.member) && target.roles.highest.position >= message.member.roles.highest.position) {
      return replyV2(message, "# Role Hierarchy", "You cannot jail a member with an equal or higher role than yours.");
    }
    const reason = args.slice(1).join(" ").trim() || "No reason provided";
    const oldRoles = target.roles.cache
      .filter(role => role.id !== message.guild.id)
      .map(role => role.id);
    try {
      await target.roles.set([jailRole.id], `Jailed by ${message.author.tag}`);
    } catch (error) {
      console.error("Jail role error:", error);
      return replyV2(message, "# Jail Failed", "I could not assign the Jail Role to this member.");
    }
    config.jailedUsers[target.id] = {
      roles: oldRoles,
      jailedBy: message.author.id,
      reason,
      jailedAt: Date.now()
    };
    saveJailDB();
    await message.channel.send({
      components: [new ContainerBuilder().setAccentColor(COLOR).addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${CHECK} | Success`)).addSeparatorComponents(new SeparatorBuilder()).addTextDisplayComponents(new TextDisplayBuilder().setContent(`${target} has been jailed.`))],
      flags: MessageFlags.IsComponentsV2
    });
    await sendJailLog(message.guild, config, target, message.member, reason);
    await sendJailDM(target, message.guild, message.member, reason);
    return;
  }

  if (command === "unjail") {
    const config = getJailConfig(message.guild.id);
    if (!jailConfigured(config)) {
      return replyV2(message, "# Configuration Required", "The Jail System is not fully configured.\n\nUse `-setup-jail` first.");
    }
    if (!canJail(message.member, config)) {
      return replyV2(message, "# Permission Denied", "You do not have permission to use this command.");
    }
    if (message.channel.id !== config.jailChannelId) {
      return replyV2(message, "# Wrong Channel", `You can only use this command in <#${config.jailChannelId}>.`);
    }
    const target = await findMember(message, args[0]);
    if (!target) {
      return replyV2(message, "# Invalid User", "**Usage:** `-unjail @user [reason]`");
    }
    const jailData = config.jailedUsers[target.id];
    if (!jailData) {
      return replyV2(message, "# Not Jailed", "This member is not currently jailed.");
    }
    const reason = args.slice(1).join(" ").trim() || "No reason provided";
    const rolesToRestore = jailData.roles.filter(roleId => message.guild.roles.cache.has(roleId));
    try {
      await target.roles.set(rolesToRestore, `Unjailed by ${message.author.tag}`);
    } catch (error) {
      console.error("Unjail role error:", error);
      return replyV2(message, "# Unjail Failed", "I could not restore this member's previous roles.");
    }
    delete config.jailedUsers[target.id];
    saveJailDB();
    await message.channel.send({
      components: [new ContainerBuilder().setAccentColor(COLOR).addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${CHECK} | Success`)).addSeparatorComponents(new SeparatorBuilder()).addTextDisplayComponents(new TextDisplayBuilder().setContent(`${target} has been unjailed.`))],
      flags: MessageFlags.IsComponentsV2
    });
    await sendUnjailLog(message.guild, config, target, message.member, reason);
    await sendUnjailDM(target, message.guild, message.member, reason);
    return;
  }

  // ========== ASTRA COMMANDS (lock / unlock / clear / setupclear / setupticket / setupapply) ==========
  if (command === "lock") {
    if (!isOwner(message.author.id) && !canManageChannels(message.member)) return;
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    try {
      if (channel.isVoiceBased()) {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: false });
      } else {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      }
      return message.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(text(checkText(`Channel **${channel.name}** has been locked professionally.`)))],
        flags: MessageFlags.IsComponentsV2
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(text(noText("I could not lock this channel.")))],
        flags: MessageFlags.IsComponentsV2
      });
    }
  }

  if (command === "unlock") {
    if (!isOwner(message.author.id) && !canManageChannels(message.member)) return;
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    try {
      if (channel.isVoiceBased()) {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: null });
      } else {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
      }
      return message.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(text(checkText(`Channel **${channel.name}** has been unlocked professionally.`)))],
        flags: MessageFlags.IsComponentsV2
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(text(noText("I could not unlock this channel.")))],
        flags: MessageFlags.IsComponentsV2
      });
    }
  }

  if (command === "clear") {
    const amount = Number.parseInt(args[0], 10);
    if (Number.isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(text(noText("Please provide a number between 1 and 100.")))],
        flags: MessageFlags.IsComponentsV2
      });
    }
    const config = getGuildConfig(message.guild.id);
    const allowedByRole = config.clearRoles?.some(roleId => message.member.roles.cache.has(roleId));
    if (!allowedByRole && !canManageMessages(message.member) && !isAdmin(message.member) && !isOwner(message.author.id)) return;

    try {
      const deleted = await message.channel.bulkDelete(amount, true);
      const msg = await message.channel.send({
        components: [new ContainerBuilder().addTextDisplayComponents(text(cleaningText(`Successfully deleted **${deleted.size}** messages.`)))],
        flags: MessageFlags.IsComponentsV2
      });
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    } catch (error) {
      console.error(error);
      return message.reply({
        components: [new ContainerBuilder().addTextDisplayComponents(text(noText("I could not delete the messages.")))],
        flags: MessageFlags.IsComponentsV2
      });
    }
    return;
  }

  if (command === "setupclear") {
    if (!isOwner(message.author.id) && !isAdmin(message.member)) return;
    const container = new ContainerBuilder()
      .addTextDisplayComponents(text("# Clear Setup"))
      .addSeparatorComponents(separator())
      .addTextDisplayComponents(text("Select the role(s) that will be allowed to use `-clear`."))
      .addSeparatorComponents(separator())
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder().setCustomId(`setup_clear_role_${message.author.id}`).setPlaceholder("Select Clear Roles").setMinValues(1).setMaxValues(10)
      ))
      .addSeparatorComponents(separator())
      .addActionRowComponents(new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`setup_clear_done_${message.author.id}`).setLabel("Done").setEmoji(EMOJI.check).setStyle(ButtonStyle.Success)
      ));
    return message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }

  if (command === "setupticket") {
    if (!isOwner(message.author.id) && !isAdmin(message.member)) return;
    const config = getGuildConfig(message.guild.id);
    const key = `${message.guild.id}:${message.author.id}`;
    const draft = {
      ticketRoles: [...(config.ticketRoles || [])],
      ticketLogs: config.ticketLogs || null,
      ticketChannel: config.ticketChannel || null,
      ticketCategory: config.ticketCategory || null
    };
    ticketSetups.set(key, draft);
    return message.reply({ components: [buildTicketSetupMessage(draft)], flags: MessageFlags.IsComponentsV2 });
  }

  if (command === "setupapply") {
    if (!isOwner(message.author.id) && !isAdmin(message.member)) return;
    const config = getStaffConfig(message.guild.id);
    const key = `${message.guild.id}:${message.author.id}`;
    const draft = {
      applyChannelId: config.applyChannelId,
      logsChannelId: config.logsChannelId,
      staffRoleId: config.staffRoleId,
      gameRoleId: config.gameRoleId,
      eventRoleId: config.eventRoleId
    };
    staffSetups.set(key, draft);
    const sent = await message.channel.send({
      components: [buildStaffSetupPanel(message.guild.id, message.author.id, draft)],
      flags: MessageFlags.IsComponentsV2
    });
    await message.delete().catch(() => {});
    return sent;
  }
});

// ============================================================
// READY
// ============================================================
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`🆔 Bot ID: ${client.user.id}`);
  console.log("Merged Bot (astra + JAIL) is online.");

  // Cache invites for all guilds
  for (const guild of client.guilds.cache.values()) {
    await cacheInvites(guild).catch(() => {});
  }
});

// ============================================================
// ERRORS
// ============================================================
client.on("error", console.error);
process.on("unhandledRejection", console.error);

// ============================================================
// LOGIN (واحد فقط)
// ============================================================
client.login(TOKEN);
