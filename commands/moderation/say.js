const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: "say",
    aliases: ["bc, broadcast"],
    category: "moderation",
    description: "Says everyhing what you say",
    usage: "[embed] <text>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
        if (message.deletable) message.delete();
        if (args.length<1) return message.reply(localization.say_more_arguments).then(m => m.delete({timeout: 5000}));
        if (args[0].toLowerCase() === "embed") {
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setTitle(localization.say_from + message.author.username)
                .setTimestamp();
            message.channel.send(exampleEmbed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}