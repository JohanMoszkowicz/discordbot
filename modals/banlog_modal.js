module.exports = {
    customId: 'banlog_modal',

    async execute(interaction, client) {

        // Direct defer reply zodat Discord geen error gooit
        await interaction.deferReply({ ephemeral: true });

        const name = interaction.fields.getTextInputValue('playerName');
        const id = interaction.fields.getTextInputValue('discordId');
        const reason = interaction.fields.getTextInputValue('reason');
        const evidence = interaction.fields.getTextInputValue('evidence');

        const embed = {
            color: 0xff0000,
            title: '🔨 Nieuwe Ban Log',
            fields: [
                { name: '👤 Speler', value: name },
                { name: '🆔 Discord ID', value: id },
                { name: '📄 Reden', value: reason },
                { name: '🎥 Bewijs', value: evidence || 'Geen link toegevoegd' }
            ],
            timestamp: new Date(),
        };

        const logChannel = client.channels.cache.get(process.env.BANLOG_CHANNEL);

        await logChannel.send({ embeds: [embed] });

        await interaction.editReply({
            content: 'Banlog succesvol verstuurd! ✅'
        });
    }
}
