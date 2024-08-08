import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('hello')
	.setDescription('Say hello to Lily!');

async function execute(interaction) {
	await interaction.reply(`Hello ${interaction.user.username}!`);
}

export {
	data,
	execute,
};
