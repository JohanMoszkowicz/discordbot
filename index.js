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

// -------------------------------------------
// 🔍 LOAD COMMANDS
// -------------------------------------------
console.log("🔎 Loading commands...");
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
    console.log(" → Found command file:", file);
    const command = require(`./commands/${file}`);

    if (!command?.data?.name) {
        console.log(" ⚠️  Skipped file (missing command name):", file);
        continue;
    }

    console.log("   ✔ Loaded command:", command.data.name);
    client.commands.set(command.data.name, command);
}

console.log("📌 Commands registered:", [...client.commands.keys()]);

// -------------------------------------------
// 🔍 LOAD MODALS
// -------------------------------------------
console.log("\n🔎 Loading modals...");
const modalsPath = path.join(__dirname, 'modals');
for (const file of fs.readdirSync(modalsPath)) {
    console.log(" → Found modal file:", file);
    const modal = require(`./modals/${file}`);

    if (!modal?.customId) {
        console.log(" ⚠️  Skipped file (missing customId):", file);
        continue;
    }

    console.log("   ✔ Loaded modal:", modal.customId);
    client.modals.set(modal.customId, modal);
}

console.log("📌 Modals registered:", [...client.modals.keys()]);

// -------------------------------------------
// 🔍 LOAD EVENTS
// -------------------------------------------
console.log("\n🔎 Loading events...");
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath)) {
    console.log(" → Found event file:", file);
    const event = require(`./events/${file}`);

    if (!event?.name) {
        console.log(" ⚠️  Skipped file (missing event name):", file);
        continue;
    }

    console.log("   ✔ Loaded event:", event.name);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

console.log("🎉 Events registered!");

// LOGIN
client.login(process.env.TOKEN);
