require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.modals = new Collection();


// --- Commando’s laden ---
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// --- Modals laden ---
const modalsPath = path.join(__dirname, 'modals');
for (const file of fs.readdirSync(modalsPath)) {
    const modal = require(`./modals/${file}`);
    client.modals.set(modal.customId, modal);
}

// --- Events laden ---
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath)) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(process.env.TOKEN);

// --- KEEP-ALIVE SERVER FOR RAILWAY ---
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("JKValley Staff Bot is running."));
app.listen(process.env.PORT || 3000, () => {
  console.log("Keep-alive server running on port " + (process.env.PORT || 3000));
});
