require('dotenv').config();
const express = require("express");
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// --- EXPRESS HEALTHCHECK SERVER START DIRECT ---
const app = express();
app.get("/", (req, res) => res.status(200).send("OK"));
app.head("/", (req, res) => res.status(200).end());
app.listen(process.env.PORT || 3000, () => {
    console.log("Healthcheck server running on port " + (process.env.PORT || 3000));
});

// --- DISCORD CLIENT ---
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.modals = new Collection();

// --- Load commands ---
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// --- Load modals ---
const modalsPath = path.join(__dirname, 'modals');
for (const file of fs.readdirSync(modalsPath)) {
    const modal = require(`./modals/${file}`);
    client.modals.set(modal.customId, modal);
}

// --- Load events ---
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
