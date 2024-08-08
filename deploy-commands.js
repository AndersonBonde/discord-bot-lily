import 'dotenv/config';

import { REST, Routes } from 'discord.js';
import fs from 'node:fs';

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}
	else {
		console.log(`[WARNING] The command ${file} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(() => {
	try {
		const guilds = process.env.SERVERID.split(' ');
		console.log(`Started refreshing ${commands.length} application (/) commands for ${guilds.length} guilds.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		guilds.forEach(async (guild) => {
			const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, guild), {
				body: commands,
			});

			console.log(`Successfully reloaded ${data.length} application (/) commands for ${guild} guild.`);
		});
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
