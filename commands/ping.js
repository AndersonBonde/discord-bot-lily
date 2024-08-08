import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Measure the bot ping');

async function execute(interaction) {
	const sent = await interaction.reply({ content: 'measuring...', fetchReply: true });
	interaction.editReply(`Ping: ${sent.createdTimestamp - interaction.createdTimestamp} ms`);
}

export {
	data,
	execute,
};