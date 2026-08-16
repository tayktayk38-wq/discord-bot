function createCategoryMenu() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId('help_category')
    .setPlaceholder('Choose the command category')
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('Moderation')
        .setDescription('View moderation commands')
        .setValue('moderation')
        .setEmoji('🛡️'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Utility')
        .setDescription('View utility commands')
        .setValue('utility')
        .setEmoji('🛠️')
    );

  return new ActionRowBuilder().addComponents(menu);
}
