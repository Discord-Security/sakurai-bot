module.exports = async (client, interaction) => {
	const argumentos = interaction.customId.split(" ");

	interaction.reply({ content: "Feito!" });

	const guildDoc = await client.db.Guilds.findOne({ _id: argumentos[2] });
	if (guildDoc) {
		guildDoc.staffs.push({ _id: argumentos[1], function: argumentos[3] });
		const guildMember = interaction.guild.members.cache.get(argumentos[1]);
		guildMember.roles.add("1106772024472379523");
		const guildCache = client.guilds.cache.get(argumentos[2]);
		if (!guildCache)
			return interaction.channel.send({
				content:
					"Constelação não definida pois não tenho esse servidor na minha cache.",
			});
		if (guildCache.memberCount > 10000)
			guildMember.roles.add("1106772076574019664");
		else if (
			guildCache.memberCount > 8000 &&
			guildCache.memberCount <= 10000
		)
			guildMember.roles.add("1120015301065584661");
		else if (
			guildCache.memberCount > 6000 &&
			guildCache.memberCount <= 8000
		)
			guildMember.roles.add("1106772078046228501");
		else if (
			guildCache.memberCount > 4000 &&
			guildCache.memberCount <= 6000
		)
			guildMember.roles.add("1106772077492576266");
		else if (
			guildCache.memberCount > 2000 &&
			guildCache.memberCount <= 4000
		)
			guildMember.roles.add("1120015317003943946");
		else if (
			guildCache.memberCount > 1000 &&
			guildCache.memberCount <= 2000
		)
			guildMember.roles.add("1120015320694927360");
		else if (guildCache.memberCount > 500 && guildCache.memberCount <= 1000)
			guildMember.roles.add("1120015323790331945");
		else if (guildCache.memberCount > 100 && guildCache.memberCount <= 500)
			guildMember.roles.add("1120015324528521277");
		else
			interaction.channel.send({
				content:
					"Este servidor não cumpre os requisitos mínimos da sua constelação...",
			});

		if (guildDoc.roleId && guildDoc.roleId !== "") {
			guildMember.roles.add(guildDoc.roleId);
			guildDoc.save();
		} else {
			interaction.guild.roles
				.create({
					name: guildCache
						? guildCache.name
						: "Sakurai não detectou?",
					reason: "Novo cargo para registro do utilizador",
					position:
						interaction.guild.roles.cache.get("1121892199932629092")
							.position + 1,
				})
				.then((role) => {
					guildMember.roles.add(role);
					guildDoc.roleId = role.id;
					guildDoc.save();
				});
		}
	} else {
		return interaction.reply(
			"O servidor precisa ser registrado primeiro..."
		);
	}
};
