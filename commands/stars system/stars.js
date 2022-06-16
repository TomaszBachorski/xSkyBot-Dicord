const fs = require("fs");
const Discord = require('discord.js');
const functions = require("../../functions.js");
const mysql = require("mysql");
module.exports = {
    name: "stars",
    aliases: ["star"],
    category : "",
    description: "Informations about stars system",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let connection = mysql.createConnection({
            host: settings.mySQLhost,
            user: settings.mySQLuser,
            database: "xskyblock database"
        });
        connection.query(`SELECT * FROM starssystem WHERE id = '${message.author.id}'`, function(err, result ) {
            if (err) throw err;
            if (result.length===0) {
                let values = [message.author.id, message.author.username, 0, 0.0, 0.0];
                connection.query(`INSERT INTO starssystem (id, username, permissions, currentstars, totalstars) VALUES (?)`, [values], function(err, result) {
                    if (err) throw err;
                });
            } else if (result && result[0].permissions===0){
                //user was in stars system and is no longer so return nothing (incorrect command)
                return;
            } else {
                return message.channel.send(new Discord.MessageEmbed()
                .setColor("ORANGE")
                .setTitle(localization.stars_title)
                .setFooter(message.author.username)
                .setTimestamp()
                .addField(localization.stars_important, `[${localization.stars_here}](https://discordapp.com/channels/586972740695883790/764852495842541568/765444443524038667)`)
                .addField(localization.stars_receive, `[${localization.stars_here}](https://discordapp.com/channels/586972740695883790/764182706980388884/764863880643084338)`)
                .addField(localization.stars_buy, `[${localization.stars_here}](https://discordapp.com/channels/586972740695883790/764182111355404299/764863439448440833)`)
                .addField(localization.stars_commands, localization.stars_wrr+settings.prefix + localization.stars_stars1+ settings.prefix + localization.stars_stars2 + settings.prefix + localization.stars_stars3 + settings.prefix + localization.stars_stars4 + settings.prefix + localization.stars_stars5))
            }
        });
    }
}