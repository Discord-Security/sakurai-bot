const moment = require("moment");
moment.locale("pt-br");

module.exports = async (client, member) => {
	if (member.user.bot) return;

	if (member.guild.id === "1106771396757037076") {
		client.channels.cache.get("1106772099529453568").send({
			content: `<a:Welcome:946180052893171722> **Seja bem vindo(a) ao ${member.guild.name} ${member.user}, leia nossas <#1106772093846175794> e se registe no <#1109547884841549824>,caso esteja interessado(a) em recrutar staffs pro seu servidor use o <#1107605928984973353>, caso precise do suporte da aliança crie um ticket em <#1106772102264127558>**`
		});
		const superagent = require("superagent");
		await superagent
			.get(
				`https://api.betterapi.net/youchat?inputs=${encodeURIComponent(
					``
				)}&key=FPWETB472RRB9L67U32US47RBW1D5Y0GH8M`
			)
			.end((err, callback) => {
				if (err) return 0;
				const callbackRes =
					callback._body.generated_text;
				if (callbackRes.length > 0)
					client.channels.cache.get("1106772099529453568").send({
						content: callbackRes
							.replace("&lt;", "<")
							.replace("&gt;", ">")
							.replace(/@(everyone|here)/g, "")
							.replace(/"([^"]*)"/g, ""),
					});			
			});
	}
};
	
