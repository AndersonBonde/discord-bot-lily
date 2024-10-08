import { Events } from 'discord.js';

const name = Events.InteractionCreate;

async function execute(interaction) {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if (interaction.isChatInputCommand()) {
		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
	else if (interaction.isAutocomplete()) {
		try {
			await command.autocomplete(interaction);
		}
		catch (error) {
			console.error(error);
		}
	}
}

export {
	name,
	execute,
};
