import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as db from '../database/queries.js';

const data = new SlashCommandBuilder()
	.setName('power')
	.setDescription('Get Vampire the Masquerade power info.')
	.addStringOption((option) =>
		option.setName('power-name')
			.setDescription('The name of the power you are looking for')
			.setRequired(true)
			.setAutocomplete(true));

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

	if (obj.error) {
		interaction.reply(`${power} was not found`);
	}
	else {
		const embed = buildEmbed(obj);

		await interaction.reply({ embeds: [embed] });
	}
}

const powers = await db.getAllPowers().then((res) => res.map((power) => power.name));

async function autocomplete(interaction) {
	const focusedValue = interaction.options.getFocused();

	if (focusedValue.length < 1) return;

	const choices = powers;
	const filtered = choices.filter(choice => choice.startsWith(focusedValue));

	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice })),
	);
};

export {
	data,
	execute,
	autocomplete,
};
