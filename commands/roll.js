import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('roll')
	.setDescription('Roll a dice')
	.addStringOption((option) =>
		option.setName('dice')
			.setDescription('Dice expression (e.g. 2d6+3, d20+1)')
			.setRequired(false),
	);

async function execute(interaction) {
	const diceInput = interaction.options.getString('dice') ?? '2d6';
	const match = diceInput.match(/^(\d*)d(\d+)([+-])?(\d+)?$/i);

	if (!match) {
		await interaction.reply({
			content: '❌ Invalid dice format. Use something like `2d6`, `d20+3`, or `3d10-2`.',
			ephemeral: true,
		});
		return;
	}

	const amount = parseInt(match[1]) || 2;
	const size = parseInt(match[2]) || 6;
	const sign = match[3] ? match[3] : '+';
	const modifier = match[4] ? parseInt(match[4]) : 0;

	const result = [];

	for (let i = 0; i < amount; i++) {
		result.push(Math.floor(Math.random() * size) + 1);
	}

	const sum = result.reduce((acc, cur) => acc += cur, 0);
	const total = sign == '+' ? sum + modifier : sum - modifier;

	let emoji = '';
	if (amount === 2 && size === 6) {
		if (total <= 6) emoji = '🔴';
		else if (total <= 9) emoji = '🟡';
		else emoji = '🟢';
	}

	await interaction.reply(`Rolling ${amount}d${size}${sign}${modifier}: Result: [ ${result.join(', ')} ] ${sign}${modifier} Total: ${total}   ${emoji} `);
}

export {
	data,
	execute,
};
