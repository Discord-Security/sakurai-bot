const discord = require('discord.js');

module.exports = {
	data: new discord.SlashCommandBuilder()
		.setName('server')
		.setDescription('Coisas para servidores!')
		.setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Informações sobre um servidor guardadas.')
				.addStringOption(option =>
					option
						.setName('server')
						.setNameLocalizations({
							'en-US': 'server',
							'pt-BR': 'servidor',
						})
						.setDescription('ID de um servidor')
						.setAutocomplete(true)
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('retirar')
				.setDescription('Retirar um servidor.')
				.addStringOption(option =>
					option
						.setName('server')
						.setNameLocalizations({
							'en-US': 'server',
							'pt-BR': 'servidor',
						})
						.setDescription('ID de um servidor')
						.setAutocomplete(true)
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('change_invite')
				.setNameLocalizations({
					'pt-BR': 'editar_invite',
					'en-US': 'change_invite',
				})
				.setDescription('Altere o convite do servidor')
				.addStringOption(option =>
					option
						.setName('server')
						.setNameLocalizations({
							'en-US': 'server',
							'pt-BR': 'servidor',
						})
						.setDescription('ID de um servidor')
						.setAutocomplete(true)
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('invite')
						.setDescription('Defina um invite novo')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('change_rep')
				.setNameLocalizations({
					'pt-BR': 'editar_representante',
					'en-US': 'change_rep',
				})
				.setDescription('Altere o representante do servidor')
				.addStringOption(option =>
					option
						.setName('server')
						.setNameLocalizations({
							'en-US': 'server',
							'pt-BR': 'servidor',
						})
						.setDescription('ID de um servidor')
						.setAutocomplete(true)
						.setRequired(true),
				)
				.addUserOption(option =>
					option
						.setName('representante')
						.setDescription('Defina um representante novo')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('embed').setDescription('Coloque a embed'),
		),
	async autocomplete(interaction, client) {
		const focusedValue = interaction.options.getFocused(true);
		const guild = await client.db.Guilds.find({});

		if (guild) {
			const choices = await Promise.all(
				guild
					.filter(sv => sv._id.includes(focusedValue.value))
					.map(async choice => ({
						name: await client.guilds
							.fetch(choice._id)
							.then(guild => guild.name.split(0, 25))
							.catch(() => choice._id),
						value: choice._id,
					})),
			);

			await interaction.respond(choices);
		} else {
			await interaction.respond({
				name: 'Não há nada listado.',
				value: 'Não há nada listado.',
			});
		}
	},
	async execute(interaction, client) {
		const server = interaction.options.getString('server') || null;
		switch (interaction.options._subcommand) {
			case 'info': {
				const doc = await client.db.Guilds.findOne({ _id: server });
				if (doc) {
					const emb = new discord.EmbedBuilder()
						.setTitle('Info do servidor ' + server)
						.setDescription(
							`Invite: ${doc.invite}\nAprovado: ${doc.approved
								.toString()
								.replace('true', 'Sim')
								.replace('false', 'Não')}\nCargo: <@&${
								doc.roleId
							}>\nRepresentante: <@${doc.representative}> ${
								doc.representative
							}`,
						)
						.setColor(client.cor);
					interaction.reply({ embeds: [emb] });
				} else {
					interaction.reply({
						content: 'Não há nada encontrado por minha parte.',
					});
				}
				break;
			}
			case 'change_invite': {
				const doc = await client.db.Guilds.findOne({ _id: server });
				if (doc) {
					doc.invite = interaction.options.getString('invite');
					doc.save();
					interaction.reply({ content: 'Sucesso!' });
				} else {
					interaction.reply({
						content:
							'Não foi possível encontrar o servidor no meu banco de dados... estranho!',
					});
				}
				break;
			}
			case 'change_rep': {
				const doc = await client.db.Guilds.findOne({ _id: server });
				if (doc) {
					doc.representative =
						interaction.options.getString('representante');
					doc.save();
					interaction.reply({ content: 'Sucesso!' });
				} else {
					interaction.reply({
						content:
							'Não foi possível encontrar o servidor no meu banco de dados... estranho!',
					});
				}
				break;
			}
			case 'retirar': {
				const guild = client.guilds.cache.get(server);
				const doc = await client.db.Guilds.findOne({ _id: server });
				const central = client.guilds.cache.get(client.central);
				if (doc) {
					if (doc.roleId && central.roles.cache.get(doc.roleId))
						await central.roles.cache.get(doc.roleId).delete();
					if (doc.representative) {
						const checkUser = async userId =>
							(
								await client.db.Guilds.find({
									$or: [
										{ representative: userId },
										{ 'staffs._id': userId },
									],
								}).exec()
							).length === 1;

						if (await checkUser(doc.representative))
							await central.members.kick(doc.representative);

						for (const { _id } of doc.staffs) {
							if (await checkUser(_id))
								await central.members.kick(_id);
						}
					}
				}
				if (guild) guild.leave();
				await client.db.Guilds.deleteOne({ _id: server });
				interaction.reply({ content: 'Sucesso.' });
				break;
			}
			case 'embed': {
				const doc = await client.db.Guilds.find({ approved: true });
				const constellations = {
					hanabi: [],
					hana: [],
					sakura: [],
					kareru: [],
					hatsuga: [],
					koeda: [],
					tsubomi: [],
					saku: [],
				};

				await doc.map(async server => {
					const guild = await client.guilds.fetch(server._id);
					if (guild && server.invite) {
						const message = `[${guild.name}](${server.invite})`;
						if (guild.memberCount > 10000) {
							constellations.hanabi.push(message);
						} else if (guild.memberCount > 8000) {
							constellations.hana.push(message);
						} else if (guild.memberCount > 6000) {
							constellations.sakura.push(message);
						} else if (guild.memberCount > 4000) {
							constellations.kareru.push(message);
						} else if (guild.memberCount > 2000) {
							constellations.hatsuga.push(message);
						} else if (guild.memberCount > 1000) {
							constellations.koeda.push(message);
						} else if (guild.memberCount > 500) {
							constellations.tsubomi.push(message);
						} else if (guild.memberCount <= 500) {
							constellations.saku.push(message);
						}
					} else {
						client.channels.cache
							.get('1120077184346902589')
							.send({
								content: `Servidor ${server._id} não foi detectado, logo não entrou na embed.`,
							});
					}
				});

				const emb = new discord.EmbedBuilder()
					.setTitle('***桜井 Central Sakurai***')
					.setDescription(
						'> <:Cs_10:1108104342109696000>**_Boas-vindas, somos a 桜井  Central Sakurai, temos como objetivo tornar a nossa comunidade animes & games um lugar melhor para todos, visando o Respeito entre todos,a 桜井 C.S é um ótimo lugar pra aprender a administrar vosso servidor, temos donos e staff competentes e experientes dispostos a ajudar com o seu servidor. _**\n> <:CS_7:1107973357531570216>**_Caso queira ingressar basta entra no nosso [Servidor](https://discord.gg/2p3Rb3YkgN)  _**',
					)
					.setColor('#e2adad')
					.setImage('https://imgur.com/5ahR9Yp.gif')
					.setFooter({
						text: '© 2023 桜井 Central Sakurai Todos os direitos reservados.',
					});

				Object.entries(constellations).forEach(
					([constellation, servers]) => {
						if (servers.length > 0) {
							const chunks = chunkArray(servers, 999);
							chunks.forEach((chunk, index) => {
								const name =
									index === 0
										? `<:Cs_10:1108104342109696000> | ${capitalizeFirstLetter(
												constellation,
										  )}`
										: `<:Cs_10:1108104342109696000> | ${capitalizeFirstLetter(
												constellation,
										  )} ${index + 1}`;
								emb.addFields({
									name,
									value: chunk.join('\n'),
								});
							});
						}
					},
				);

				interaction.reply({ content: 'Sucesso!', ephemeral: true });
				interaction.channel.send({
					embeds: [emb],
				});

				function chunkArray(arr, size) {
					const chunkedArr = [];
					let index = 0;
					while (index < arr.length) {
						chunkedArr.push(arr.slice(index, size + index));
						index += size;
					}
					return chunkedArr;
				}

				function capitalizeFirstLetter(str) {
					return str.charAt(0).toUpperCase() + str.slice(1);
				}
				break;
			}
		}
	},
};
