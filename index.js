import 'dotenv/config';

import fs from 'node:fs';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${file} is missing a required 'data' or 'execute' property.`);
	}
}

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = await import(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);

import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.json({
		message: 'Hello, world!',
	});
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
