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

function buildEmbed(obj) {
	const { name, desc, level, school, range, components, duration, concentration, casting_time } = obj;

	const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`${name}`)
		.setDescription(`${desc}`);

	if (obj['higher_level'].length) {
		embed.addFields(
			{ name: 'Higher Level', value: `${obj.higher_level}` },
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

async function execute(interaction) {
	let spell = interaction.options.getString('spell-name');
	spell = parseSpellName(spell);

	const obj = await fetch(`https://www.dnd5eapi.co/api/spells/${spell}`)
		.then((res) => res.json());

	if (obj.error) {
		interaction.reply(`${spell} was not found`);
	}
	else {
		const embed = buildEmbed(obj);

		await interaction.reply({ embeds: [embed] });
	}
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

	if (focusedValue.length < 1) return;

	const choices = spells;
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