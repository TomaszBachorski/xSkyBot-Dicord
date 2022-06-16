const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: "ithomashhelp",
    category : "",
    description: "Informations about command or commands list which are to use bot",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(message);
        }
    }
}
function getAll(message) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    let info = new Discord.MessageEmbed()
    .setDescription(localization.ithomashhelp_commandslist)
    .setColor("RANDOM")
    .setFooter(localization.ithomashhelp_footer)
    .setTimestamp();
    return message.channel.send(info);
}

function getCMD(client, message, input) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    const embed = new Discord.MessageEmbed()
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    let info = localization.ithomashhelp_no_informations_found+input.toLowerCase();
    if (!cmd) return message.channel.send(embed.setColor("RED").setDescription(info));
    if (cmd.aliases) info += localization.ithomashhelp_aliases+cmd.aliases.map(a => `\`${a}\``).join(", ");
    if (cmd.name) info = localization.ithomashhelp_command_name + cmd.name;
    if (cmd.description) info += localization.ithomashhelp_description + cmd.description;
    if (cmd.usage) {info += localization.ithomashhelp_usage+ cmd.usage;}
    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}