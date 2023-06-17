module.exports = (client, interaction) => {
	if (interaction.isStringSelectMenu()) {
		require("../menu/" + interaction.values[0])(client, interaction);
	}
	if (interaction.isButton()) {
		if (interaction.customId.startsWith("approve"))
			return require("../buttons/approve")(client, interaction);
		if (interaction.customId.startsWith("reject"))
			return require("../buttons/reject")(client, interaction);
		if (interaction.customId.startsWith("Registrar"))
			return require("../buttons/registrar")(client, interaction);
		if (interaction.customId.endsWith("confirm")) return;
		require("../buttons/" + interaction.customId)(client, interaction);
	}
	if (interaction.isAutocomplete()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) {
			const guildOnlyCommand = client.commandsGuild.get(
				interaction.commandName
			);
			guildOnlyCommand.autocomplete(interaction, client);
		} else command.autocomplete(interaction, client);
	}
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) {
			const guildOnlyCommand = client.commandsGuild.get(
				interaction.commandName
			);
			if (!guildOnlyCommand) return;
			try {
				guildOnlyCommand.execute(interaction, client);
			} catch (err) {
				if (err) return interaction.reply(err);
			}
		} else {
			try {
				command.execute(interaction, client);
			} catch (err) {
				if (err) console.error(err);
				interaction.reply({
					content: "Um erro foi executado no meu grande algoritmo.",
					ephemeral: true,
				});
			}
		}
	}
};
