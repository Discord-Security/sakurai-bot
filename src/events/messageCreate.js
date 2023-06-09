const discord = require("discord.js");

module.exports = async (client, message) => {
  if (message.guild === null) return;
  if (message.author.bot) return 0;
  if (
    (message.content.startsWith("sk?") &&
      message.author.id === "354233941550694400") ||
    (message.content.startsWith("sk?") &&
      message.author.id === "799673406014095440")
  )
    require("../messages/" + message.content.replace("sk?", ""))(
      client,
      message
    ).catch((err) => {
      return message.reply(err);
    });

  if (message.guild.id === process.env.GUILD_ID) {
    if (
      message.member &&
      !message.member.permissions.has(discord.PermissionFlagsBits.Administrator)
    )
      return;
    if (message.content.startsWith(`<@${client.user.id}>`)) {
      const embed = new discord.EmbedBuilder()
        .setTitle("Control - A fast and efficient control")
        .setDescription(
          "Comandos de desenvolvimento tudo num menu de controlo rápido e eficiente!"
        )
        .setColor(client.cor);
      const row = new discord.ActionRowBuilder().addComponents(
        new discord.StringSelectMenuBuilder()
          .setCustomId("control")
          .setPlaceholder("Controle tudo imediatamente!")
          .addOptions({
            label: "Faça evaluate de um código (dev only)",
            description: "Cuidado isto pode ser perigoso!",
            value: "eval",
          })
      );
      message.reply({ embeds: [embed], components: [row] });
    }
  }
};
