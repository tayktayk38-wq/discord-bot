const { Client, GatewayIntentBits, ChannelType, EmbedBuilder, ActivityType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.TOKEN;
const OWNER_ID = '1500974923441639434';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`Bot online: ${client.user.tag}`);
  client.user.setActivity('Guarda', { type: ActivityType.Watching });
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

  let content = message.content.trim();
  let args, command;

  // ========== الأوامر العامة (بلا prefix) ==========
  if (!content.startsWith('>')) {
    args = content.split(/ +/);
    command = args.shift()?.toLowerCase();

    if (!command) return;

    // AVATAR
    if (command === 'a' || command === 'avatar') {
      let user = message.mentions.users.first() || message.author;
      if (args[0] && !message.mentions.users.first()) {
        try { user = await client.users.fetch(args[0]); } 
        catch { return message.reply('ما لقيت هاد العضو.'); }
      }
      const embed = new EmbedBuilder()
        .setTitle(`Avatar ديال ${user.tag}`)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setColor(0x2b2d31)
        .setFooter({ text: `ID: ${user.id}` });
      return message.reply({ embeds: [embed] });
    }

    // BANNER
    if (command === 'bn' || command === 'banner') {
      let user = message.mentions.users.first() || message.author;
      if (args[0] && !message.mentions.users.first()) {
        try { user = await client.users.fetch(args[0]); } 
        catch { return message.reply('ما لقيت هاد العضو.'); }
      }
      user = await client.users.fetch(user.id, { force: true });
      if (!user.banner) return message.reply('هاد العضو ما عندوش بانر.');
      const embed = new EmbedBuilder()
        .setTitle(`Banner ديال ${user.tag}`)
        .setImage(user.bannerURL({ dynamic: true, size: 4096 }))
        .setColor(0x2b2d31)
        .setFooter({ text: `ID: ${user.id}` });
      return message.reply({ embeds: [embed] });
    }

    // SALAM
    if (command === 'slm' || command === 'salam') {
      return message.reply('salam cv 3lik');
    }

    // JOIN VOICE
    if (command === 'join') {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return message.reply('خصك تكون فـ رووم صوتية أولاً.');
      try {
        const oldConnection = getVoiceConnection(message.guild.id);
        if (oldConnection) oldConnection.destroy();
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
          selfDeaf: true,
          selfMute: false
        });
        return message.reply(`دخلت لـ **${voiceChannel.name}** وغادي نبقى هنا.`);
      } catch (err) {
        console.error(err);
        return message.reply('وقع خطأ، ما قدرتش ندخل.');
      }
    }

    return; // رسالة عادية → ما يدير والو
  }

  // ========== الأوامر الخاصة بـ > (غير للمالك) ==========
  content = content.slice(1).trim();
  args = content.split(/ +/);
  command = args.shift()?.toLowerCase();

  if (!command) return;

  // إلا ماشي المالك
  if (message.author.id !== OWNER_ID) {
    return message.reply('𝑺𝒊𝒓 𝒕7𝒂𝒘𝒂 <:Ghostface:1535045884415574058>');
  }

  // ========== BACKUP (>b) ==========
  if (command === 'b') {
    try {
      const guild = message.guild;
      const backupData = { name: guild.name, roles: [], channels: [] };

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

  // ========== RESTORE (>r) ==========
  if (command === 'r') {
    const fileName = args[0];
    if (!fileName) return message.reply('كتب اسم الملف: `>r backup-xxxxx.json`');

    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) return message.reply('الملف ما كاينش.');

    try {
      const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const guild = message.guild;
      await message.reply('بديت نمسح كلشي + restore... صبر شوية.');

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

  // ========== CLEAR / NUKE (>c) ==========
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

  // ========== MASS DM (>dmall) ==========
  if (command === 'dmall') {
    const dmMessage = args.join(' ');
    if (!dmMessage) return message.reply('كتب الرسالة: `>dmall مرحبا بكم`');

    const startEmbed = new EmbedBuilder()
      .setDescription('<:Rebel:1535004350903091360> **𝑰\'𝒗𝒆 𝒔𝒕𝒂𝒓𝒕𝒆𝒅 𝒔𝒆𝒏𝒅𝒊𝒏𝒈.**\n𝑷𝒍𝒆𝒂𝒔𝒆 𝒃𝒆 𝒑𝒂𝒕𝒊𝒆𝒏𝒕, 𝒊𝒕 𝒎𝒂𝒚 𝒕𝒂𝒌𝒆 𝒂 𝒇𝒆𝒘 𝒎𝒐𝒎𝒆𝒏𝒕𝒔. <:stopwatch_blue_hand_timer_YT:1535004623126003883>')
      .setColor(0x2b2d31);
    await message.reply({ embeds: [startEmbed] });

    try {
      await message.guild.members.fetch();
      const members = message.guild.members.cache.filter(m => !m.user.bot);
      let success = 0, failed = 0;

      for (const [, member] of members) {
        try {
          await member.send(dmMessage);
          success++;
          await new Promise(r => setTimeout(r, 1600));
        } catch { failed++; }
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

  // ========== BANRAID (>babo) ==========
  if (command === 'babo') {
    const minutes = parseInt(args[0]);
    if (!minutes || isNaN(minutes) || minutes < 1) {
      return message.reply('كتب عدد الدقائق: `>babo 15`');
    }

    try {
      await message.reply(`بديت نبحث على الأعضاء اللي دخلو فـ آخر ${minutes} دقيقة...`);
      await message.guild.members.fetch();
      const now = Date.now();
      const timeLimit = minutes * 60 * 1000;

      const recentMembers = message.guild.members.cache.filter(member => {
        if (member.user.bot) return false;
        if (member.id === OWNER_ID) return false;
        if (!member.joinedTimestamp) return false;
        return (now - member.joinedTimestamp) < timeLimit;
      });

      if (recentMembers.size === 0) return message.reply('ما لقيت حتى واحد دخل فهاد المدة.');

      let banned = 0, failed = 0;
      for (const [, member] of recentMembers) {
        try {
          await member.ban({ reason: `Anti-raid | Joined in last ${minutes} minutes` });
          banned++;
          await new Promise(r => setTimeout(r, 1200));
        } catch { failed++; }
      }
      await message.channel.send(`سالا.\nتم الحظر: **${banned}**\nفشل: **${failed}**`);
    } catch (err) {
      console.error(err);
      message.reply('وقع خطأ أثناء الـbabo.');
    }
  }

  // ========== MUTE VOICE (>mute) ==========
  if (command === 'mute') {
    let member = message.mentions.members.first();

    if (!member && args[0]) {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch {
        member = message.guild.members.cache.find(m =>
          m.user.username.toLowerCase() === args[0].toLowerCase() ||
          m.displayName.toLowerCase() === args[0].toLowerCase()
        );
      }
    }

    if (!member) return message.reply('كتب العضو: `>mute @member` أو `>mute ID`');
    if (!member.voice.channel) return message.reply('هاد العضو ماشي فـ رووم صوتية.');

    let duration = parseInt(args[1]);
    let reason = args.slice(duration ? 2 : 1).join(' ') || 'ما كاينش سبب';

    try {
      await member.voice.setMute(true, reason);

      const embed = new EmbedBuilder()
        .setTitle('<a:Check:1535043575522525345> Success')
        .setColor(0x57F287)
        .setDescription(
          duration && !isNaN(duration) && duration > 0
            ? `• **${member.user.username}** has been muted\n• **Duration :** ${duration}m`
            : `• **${member.user.username}** has been muted\n• **Duration :** Permanent`
        );

      await message.reply({ embeds: [embed] });

      if (duration && !isNaN(duration) && duration > 0) {
        setTimeout(async () => {
          try {
            if (member.voice.channel) {
              await member.voice.setMute(false, 'انتهت مدة الـMute');
            }
          } catch (err) {
            console.log('ما قدرتش نفك الـmute:', err.message);
          }
        }, duration * 60 * 1000);
      }
    } catch (err) {
      console.error(err);
      message.reply('وقع خطأ، تأكد أن البوت عندو صلاحية Mute Members.');
    }
  }
});

client.login(TOKEN);
