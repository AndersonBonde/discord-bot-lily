import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as db from '../database/queries.js';

const data = new SlashCommandBuilder()
	.setName('power')
	.setDescription('Get Vampire the Masquerade power info.')
	.addStringOption((option) =>
		option.setName('power-name')
			.setDescription('The name of the power you are looking for')
			.setRequired(true));

function parsePowerName(spell) {
	return spell
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/['"]/g, '');
}

function buildEmbed(obj) {
	const { name, description, cost, system, dice_pools, duration, amalgam } = obj;

	const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`${name}`)
		.setDescription(`${description}`);

	embed.addFields(
		{ name: 'Cost', value: `${cost}` },
		{ name: 'System', value: `${system}` },
		{ name: 'Duration', value: `${duration}` },
		{ name: 'Dice Pools', value: `${dice_pools}` },
		{ name: 'Amalgam', value: `${amalgam}` },
	);

	return embed;
}

async function execute(interaction) {
	let power = interaction.options.getString('power-name');
	power = parsePowerName(power);

	const obj = await db.getPower(power);

	if (obj.error || !obj) {
		interaction.reply(`${power} was not found`);
	}
	else {
		const embed = buildEmbed(obj);

		await interaction.reply({ embeds: [embed] });
	}
}

export {
	data,
	execute,
};
