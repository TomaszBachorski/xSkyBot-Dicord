const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: "about",
    aliases: [],
    category : "info",
    description: "Informations about bot",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        const about = new Discord.MessageEmbed()
         .setColor("572386") //rng zwane karolem to wylosowało
         .setTitle(localization.about_title)
         .addField(localization.about_owner, "<@" + settings.botOwner+">")
         .addField(localization.about_version, settings.botVersion)
         .addField(localization.about_usage, localization.about_usage_1 + settings.prefix + localization.about_usage_2+ settings.prefix+localization.about_usage_3)
         .addField(localization.about_function, localization.about_function_1);
        message.channel.send(about);
    }
}