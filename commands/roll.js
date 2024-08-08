import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('roll')
	.setDescription('Roll a dice')
	.addIntegerOption((option) =>
		option.setName('size')
	        .setDescription('The size of the dice'))
	.addIntegerOption((option) =>
		option.setName('amount')
			    .setDescription('Amount of dices to roll'));

async function execute(interaction) {
	const size = interaction.options.getInteger('size') ?? 20;
	const amount = interaction.options.getInteger('amount') ?? 1;

	const result = [];

	for (let i = 0; i < amount; i++) {
		result.push(Math.floor(Math.random() * size) + 1);
	}

	await interaction.reply(`Rolling ${amount} d${size}: Result: [ ${result.join(', ')} ]`);
}

export {
	data,
	execute,
};
