const Discord = require('discord.js');
const fs = require("fs");
const ping = require('minecraft-server-util');
module.exports = {
    name: "status",
    aliases: [],
    category : "info",
    description: "Informations about server",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        ping(settings.serverAddress, settings.port, (error, reponse) => {
            if (error) throw error;
            const embed = new Discord.MessageEmbed()
                .setColor("ORANGE")
                .setTitle(localization.status_title)
                .addField(localization.status_ip, reponse.host)
                .addField(localization.status_version, reponse.version)
                .addField(localization.status_online, reponse.onlinePlayers)
                .addField(localization.status_max, reponse.maxPlayers);
            message.channel.send(embed);
        });
    }
}