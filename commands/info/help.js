const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const fs = require("fs");
const settings = require("../../settings.json");
module.exports = {
    name: "help",
    category : "info",
    description: "Informations about command or commands list",
    usage: "[command name]",
    permission: 5,
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
        }
    }
}
function getAll(client, message) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM");
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join( "\n");
    }
    let info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);
    info = info.replace("**Stars system**", "")
    return message.channel.send(embed.setDescription(info).setFooter(localization.help_footer+ "\n" + localization.help_other_help_1 + settings.prefix + localization.help_other_help_2).setTimestamp());
}

function getCMD(client, message, input) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    const embed = new Discord.MessageEmbed()
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    let info = localization.help_no_informations_found+ input.toLowerCase();
    if (!cmd) return message.channel.send(embed.setColor("RED").setDescription(info));
    if (cmd.aliases) info += localization.help_aliases+cmd.aliases.map(a => `\`${a}\``).join(", ");
    if (cmd.name) info = localization.help_command_name+ cmd.name;
    if (cmd.description) info += localization.help_description +cmd.description;
    if (cmd.usage) info += localization.help_usage + cmd.usage;
    if (cmd.permission) info += localization.help_permission + cmd.permission;
    return message.channel.send(embed.setColor("GREEN").setDescription(info).setFooter(localization.help_footer));
}