module.exports = {
    name: 'ready',
    once: true,

    execute(client) {
        console.log(`✅ Bot ingelogd als ${client.user.tag}`);
    }
};
