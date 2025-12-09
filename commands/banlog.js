const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlog')
        .setDescription('Open een formulier om een banlog in te vullen.'),

    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('banlog_modal')
            .setTitle('Ban Log Formulier');

        const playerName = new TextInputBuilder()
            .setCustomId('playerName')
            .setLabel('Speler naam')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const discordId = new TextInputBuilder()
            .setCustomId('discordId')
            .setLabel('Discord ID')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const reason = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel('Reden')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const evidence = new TextInputBuilder()
            .setCustomId('evidence')
            .setLabel('Bewijs link (video/foto)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(playerName),
            new ActionRowBuilder().addComponents(discordId),
            new ActionRowBuilder().addComponents(reason),
            new ActionRowBuilder().addComponents(evidence)
        );

        // IMPORTANT FIX
        return interaction.showModal(modal);
    }
};
