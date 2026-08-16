require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = '&';

// حط رابط الـbanner ديالك هنا
const BANNER_URL = 'https://YOUR-BANNER-URL-HERE';

// ==============================
// CATEGORIES
// ==============================

const categories = {
    admin: {
        name: 'Admin',
        emoji: '🔧',
        description: 'View commands in Admin category',
        commands: [
            ['&alias', 'Manage custom aliases for commands in this server'],
            ['&autorole', 'Setup role to be given when a member joins the server'],
            ['&counter', 'Setup counter channel in the guild'],
            ['&denylist', 'Manage excluded users from the leaderboard'],
            ['&command', 'Enable, disable or view disabled commands']
        ]
    },

    anime: {
        name: 'Anime',
        emoji: '👤',
        description: 'View commands in Anime category',
        commands: [
            ['&anime', 'Search for an anime'],
            ['&manga', 'Search for a manga'],
            ['&waifu', 'Get a random waifu'],
            ['&hug', 'Hug a member'],
            ['&pat', 'Pat a member']
        ]
    },

    economy: {
        name: 'Economy',
        emoji: '💰',
        description: 'View commands in Economy category',
        commands: [
            ['&balance', 'Check your balance'],
            ['&daily', 'Claim your daily reward'],
            ['&work', 'Work and earn coins'],
            ['&pay', 'Pay another member'],
            ['&leaderboard', 'View the economy leaderboard']
        ]
    },

    fun: {
        name: 'Fun',
        emoji: '⚡',
        description: 'View commands in Fun category',
        commands: [
            ['&8ball', 'Ask the magic 8ball'],
            ['&coinflip', 'Flip a coin'],
            ['&dice', 'Roll a dice'],
            ['&ship', 'Check compatibility'],
            ['&meme', 'Get a random meme']
        ]
    },

    giveaway: {
        name: 'Giveaway',
        emoji: '🎉',
        description: 'View commands in Giveaway category',
        commands: [
            ['&giveaway', 'Create a giveaway'],
            ['&gstart', 'Start a giveaway'],
            ['&gend', 'End a giveaway'],
            ['&greroll', 'Reroll a giveaway']
        ]
    },

    information: {
        name: 'Information',
        emoji: 'ℹ️',
        description: 'View commands in Information category',
        commands: [
            ['&userinfo', 'View information about a user'],
            ['&serverinfo', 'View information about the server'],
            ['&avatar', 'View a user avatar'],
            ['&botinfo', 'View information about the bot'],
            ['&ping', 'Check bot latency']
        ]
    }
};

// ==============================
// CATEGORY MENU
// ==============================

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

// ==============================
// HELP HOME
// ==============================

function createHelpHome() {
    const embed = new EmbedBuilder()
        .setColor('#2f6f3e')
        .setImage(BANNER_URL)
        .setDescription(
            `## 👋 Hello dear\n\n` +
            `I am **YourBot**, an entertaining and engaging Discord bot designed to bring laughter and excitement to communities.\n\n` +
            `Packed with a variety of useful features and commands, ensuring that your community members never have a dull moment.\n\n` +
            `If you need any help, use the \`&support\` command to get in touch with the developers.`
        )
        .setFooter({
            text: 'YourBot - help'
        });

    return {
        embeds: [embed],
        components: [createCategoryMenu()]
    };
}

// ==============================
// CATEGORY PAGE
// ==============================

function createCategoryPage(categoryId, page = 0) {
    const category = categories[categoryId];

    if (!category) return null;

    const perPage = 5;

    const totalPages = Math.max(
        1,
        Math.ceil(category.commands.length / perPage)
    );

    page = Math.max(
        0,
        Math.min(page, totalPages - 1)
    );

    const start = page * perPage;

    const commands = category.commands.slice(
        start,
        start + perPage
    );

    let description = `## ${category.emoji} ${category.name}\n\n`;

    for (const [command, text] of commands) {
        description += `\`${command}\`\n↳ ${text}\n\n`;
    }

    const embed = new EmbedBuilder()
        .setColor('#2f6f3e')
        .setImage(BANNER_URL)
        .setDescription(description)
        .setFooter({
            text: `Page ${page + 1} of ${totalPages} • &help <command>`
        });

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

    const buttons = new ActionRowBuilder()
        .addComponents(back, next);

    return {
        embeds: [embed],
        components: [
            createCategoryMenu(),
            buttons
        ]
    };
}

// ==============================
// BOT READY
// ==============================

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online!`);

    client.user.setPresence({
        activities: [
            {
                name: '&help'
            }
        ],
        status: 'online'
    });
});

// ==============================
// PREFIX COMMANDS
// ==============================

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/\s+/);

    const command = args.shift()?.toLowerCase();

    if (command === 'help') {
        return message.reply(createHelpHome());
    }

    if (command === 'ping') {
        return message.reply(`🏓 Pong! \`${client.ws.ping}ms\``);
    }
});

// ==============================
// BUTTONS + SELECT MENU
// ==============================

client.on('interactionCreate', async interaction => {

    if (interaction.isStringSelectMenu()) {

        if (interaction.customId !== 'help_category') return;

        const categoryId = interaction.values[0];

        return interaction.update(
            createCategoryPage(categoryId, 0)
        );
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

        return interaction.update(
            createCategoryPage(categoryId, newPage)
        );
    }
});

// ==============================
// LOGIN
// ==============================

if (!process.env.TOKEN) {
    console.error('❌ TOKEN is missing!');
    process.exit(1);
}

client.login(process.env.TOKEN);
