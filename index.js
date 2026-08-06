const { Client, GatewayIntentBits, ChannelType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const TOKEN = process.env.TOKEN;
const PREFIX = '!';
const OWNER_ID = '1500974923441639434';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});
client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
});
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  // ========== ILA CHI WA7D TAGGA L-OWNER ==========
  if (message.mentions.users.has(OWNER_ID) && message.author.id !== OWNER_ID) {
    const embed = new EmbedBuilder()
      .setTitle('𝑺𝒊𝒓 𝒕7𝒂𝒘𝒂')
      .setDescription(`<a:Bhacker:1534988560053178508> 𝒂 𝒌𝒉𝒐𝒚𝒂, 𝒎𝒂 𝒕𝒔𝒅𝒂3𝒄𝒉 𝒍𝒊𝒂 𝒓𝒂𝒔𝒔𝒊 <a:Bhacker:1534988560053178508>`)
      .setColor(0x000000)
      .setImage('https://media.discordapp.net/attachments/1533386555484409940/1534989272216764616/image.png?ex=6a7621a9&is=6a74d029&hm=fd2e238c0c4a5b284dd7781da5485d678ecbe9e596c14ce4d544a2821d62e43c&=&format=webp&quality=lossless');
    return message.reply({ embeds: [embed] });
  }
  // ========== COMMANDS ==========
  if (!message.content.startsWith(PREFIX)) return;
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  // إلا ماشي المالك
  if (message.author.id !== OWNER_ID) {
    return message.reply('𝑺𝒊𝒓 𝒕7𝒂𝒘𝒂 <:09_EvilSmile:1004290569088028702>');
  }
  // ========== BACKUP (!b) ==========
  if (command === 'b') {
    try {
      const guild = message.guild;
      const backupData = {
        name: guild.name,
        roles: [],
        channels: []
      };
      const roles = [...guild.roles.cache.values()]
        .filter(r => r.id !== guild.id)
        .sort((a, b) => b.position - a.position);
      for (const role of roles) {
        backupData.roles.push({
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          permissions: role.permissions.bitfield.toString(),
          mentionable: role.mentionable,
          position: role.position
        });
      }
      const channels = [...guild.channels.cache.values()]
        .sort((a, b) => a.rawPosition - b.rawPosition);
      for (const ch of channels) {
        const channelData = {
          name: ch.name,
          type: ch.type,
          position: ch.rawPosition,
          parent: ch.parent ? ch.parent.name : null,
          topic: ch.topic || null,
          nsfw: ch.nsfw || false,
          bitrate: ch.bitrate || null,
          userLimit: ch.userLimit || null,
          rateLimitPerUser: ch.rateLimitPerUser || 0,
          permissionOverwrites: []
        };
        ch.permissionOverwrites.cache.forEach(overwrite => {
          channelData.permissionOverwrites.push({
            id: overwrite.id,
            type: overwrite.type,
            allow: overwrite.allow.bitfield.toString(),
            deny: overwrite.deny.bitfield.toString()
          });
        });
        backupData.channels.push(channelData);
      }
      const fileName = `backup-${guild.id}-${Date.now()}.json`;
      const filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
      await message.reply(`تم الحفظ: \`${fileName}\``);
    } catch (err) {
      console.error(err);
      message.reply('وقع خطأ أثناء الـbackup.');
    }
  }
  // ========== RESTORE (!r) ==========
  if (command === 'r') {
    const fileName = args[0];
    if (!fileName) {
      return message.reply('كتب اسم الملف: `!r backup-xxxxx.json`');
    }
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
      return message.reply('الملف ما كاينش.');
    }
    try {
      const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const guild = message.guild;
      await message.reply('بديت نمسح كلشي + restore... صبر شوية.');
      // Clear
      const channels = [...guild.channels.cache.values()];
      for (const ch of channels) {
        await ch.delete().catch(() => {});
        await new Promise(r => setTimeout(r, 300));
      }
      const roles = [...guild.roles.cache.values()]
        .filter(r => r.id !== guild.id && !r.managed && r.editable)
        .sort((a, b) => b.position - a.position);
      for (const role of roles) {
        await role.delete().catch(() => {});
        await new Promise(r => setTimeout(r, 300));
      }
      // Restore roles
      for (const roleData of backupData.roles.reverse()) {
        try {
          await guild.roles.create({
            name: roleData.name,
            color: roleData.color,
            hoist: roleData.hoist,
            permissions: BigInt(roleData.permissions),
            mentionable: roleData.mentionable,
            reason: 'Server restore'
          });
          await new Promise(r => setTimeout(r, 350));
        } catch (e) {
          console.log(`Role failed: ${roleData.name}`);
        }
      }
      // Restore channels
      const channelMap = new Map();
      for (const chData of backupData.channels.filter(c => c.type === ChannelType.GuildCategory)) {
        try {
          const cat = await guild.channels.create({
            name: chData.name,
            type: ChannelType.GuildCategory,
            reason: 'Server restore'
          });
          channelMap.set(chData.name, cat);
          await new Promise(r => setTimeout(r, 400));
        } catch (e) {
          console.log(`Category failed: ${chData.name}`);
        }
      }
      for (const chData of backupData.channels.filter(c => c.type !== ChannelType.GuildCategory)) {
        try {
          const parent = chData.parent ? channelMap.get(chData.parent) : null;
          const options = {
            name: chData.name,
            type: chData.type,
            parent: parent,
            topic: chData.topic || undefined,
            nsfw: chData.nsfw || false,
            rateLimitPerUser: chData.rateLimitPerUser || 0,
            reason: 'Server restore'
          };
          if (chData.type === ChannelType.GuildVoice) {
            options.bitrate = chData.bitrate || 64000;
            options.userLimit = chData.userLimit || 0;
          }
          await guild.channels.create(options);
          await new Promise(r => setTimeout(r, 400));
        } catch (e) {
          console.log(`Channel failed: ${chData.name}`);
        }
      }
      console.log('Restore salat mzyan');
    } catch (err) {
      console.error(err);
    }
  }
  // ========== CLEAR / NUKE (!c) ==========
  if (command === 'c') {
    try {
      await message.reply('بديت نمسح كلشي... صبر شوية.');
      const channels = [...message.guild.channels.cache.values()];
      for (const ch of channels) {
        await ch.delete().catch(() => {});
        await new Promise(r => setTimeout(r, 350));
      }
      const roles = [...message.guild.roles.cache.values()]
        .filter(r => r.id !== message.guild.id && !r.managed && r.editable)
        .sort((a, b) => b.position - a.position);
      for (const role of roles) {
        await role.delete().catch(() => {});
        await new Promise(r => setTimeout(r, 350));
      }
      console.log('تم مسح جميع القنوات والرولات');
    } catch (err) {
      console.error(err);
    }
  }
  // ========== MASS DM (!dmall) ==========
  if (command === 'dmall') {
    const dmMessage = args.join(' ');
    if (!dmMessage) {
      return message.reply('كتب الرسالة: `!dmall مرحبا بكم`');
    }
    const startEmbed = new EmbedBuilder()
      .setDescription('<:Rebel:1535004350903091360> **𝑰\'𝒗𝒆 𝒔𝒕𝒂𝒓𝒕𝒆𝒅 𝒔𝒆𝒏𝒅𝒊𝒏𝒈.**\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒃𝒆 𝒑𝒂𝒕𝒊𝒆𝒏𝒕, 𝒊𝒕 𝒎𝒂𝒚 𝒕𝒂𝒌𝒆 𝒂 𝒇𝒆𝒘 𝒎𝒐𝒎𝒆𝒏𝒕𝒔. <:stopwatch_blue_hand_timer_YT:1535004623126003883>')
      .setColor(0x2b2d31);
    await message.reply({ embeds: [startEmbed] });
    try {
      await message.guild.members.fetch();
      const members = message.guild.members.cache.filter(m => !m.user.bot);
      let success = 0;
      let failed = 0;
      for (const [, member] of members) {
        try {
          await member.send(dmMessage);
          success++;
          await new Promise(r => setTimeout(r, 1600));
        } catch (err) {
          failed++;
        }
      }
      try {
        const resultEmbed = new EmbedBuilder()
          .setDescription(`**__done__**\n<:Verified_Green:1535003147494490132> *Tsiftat* : **${success}**\n<:emojigg_X:1535003265635319878> *Failed*: **${failed}**`)
          .setColor(0x2b2d31);
        await message.channel.send({ embeds: [resultEmbed] });
      } catch {
        console.log(`DMALL salat | Success: ${success} | Failed: ${failed}`);
      }
    } catch (err) {
      console.error(err);
      message.reply('وقع خطأ f mass DM.');
    }
  }
});
client.login(TOKEN);