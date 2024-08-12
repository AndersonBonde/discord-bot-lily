import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('spell')
	.setDescription('Get d&d 5e spell info.')
	.addStringOption((option) =>
		option.setName('spell-name')
			.setDescription('The name of the spell you are looking for')
			.setRequired(true)
			.setAutocomplete(true));

function parseSpellName(spell) {
	return spell
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/['"]/g, '');
}

function buildEmbed(result) {
	const { name, desc, level, school, range, components, duration, concentration, casting_time } = result;

	const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`${name}`)
		.setDescription(`${desc}`);

	if (result['higher_level'].length) {
		embed.addFields(
			{ name: 'Higher Level', value: `${result.higher_level}` },
		);
	}

	embed.addFields(
		{ name: 'Level', value: `${level} ${school.name}`, inline: true },
		{ name: 'Range', value: `${range}`, inline: true },
		{ name: 'Components', value: `${components}`, inline: true },
		{ name: 'Duration', value: `${duration}`, inline: true },
		{ name: 'Concentration', value: `${concentration}`, inline: true },
		{ name: 'Casting Time', value: `${casting_time}`, inline: true },
	);

	return embed;
}

const spells = await fillSpellAutoComplete();

async function fillSpellAutoComplete() {
	const result = await fetch('https://www.dnd5eapi.co/api/spells/')
		.then((res) => res.json())
		.then((res) => res.results.map((spell) => spell.name));

	return result;
};

async function autocomplete(interaction) {
	const focusedValue = interaction.options.getFocused();
	const choices = spells;
	const filtered = choices.filter(choice => choice.startsWith(focusedValue));

	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice })),
	);
};

async function execute(interaction) {
	let spell = interaction.options.getString('spell-name');
	spell = parseSpellName(spell);

	const result = await fetch(`https://www.dnd5eapi.co/api/spells/${spell}`)
		.then((res) => res.json());

	if (result.error) {
  	interaction.reply(`${spell} was not found`);
	}
	else {
		const embed = buildEmbed(result);

		await interaction.reply({ embeds: [embed] });
	}
}

export {
	data,
	execute,
	autocomplete,
};