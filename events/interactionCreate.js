module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        // Slash command handler
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) return command.execute(interaction, client);
        }

        // Modal handler
        if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (modal) return modal.execute(interaction, client);
        }
    }
};
