const Discord = require('discord.js');
const fs = require("fs");
const mysql = require("mysql");
const functions = require("../../functions.js")
module.exports = {
    name: "kick",
    aliases: [],
    category: "moderation",
    description: "Kicking users from discord server",
    usage: "<mention/userID> [reason]",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let connection = mysql.createConnection({
            host: settings.mySQLhost,
            user: settings.mySQLuser,
            database: "xskyblock database"
        });
        let arguments = "";
        let personID = "";
        let bool = false;
        if (!args[0]) return message.channel.send(localization.kick_user_not_specified);

        if (message.mentions.members.first()) bool = true;
        if (isNaN(args[0]) && bool === false) {
            return message.channel.send(localization.mute_id_is_a_number);
        } else if (args[0].length !== 18 && bool === false) {
            return message.channel.send(localization.mute_id_18_char_long);
        } else if (!message.guild.members.cache.get(args[0]) && bool === false) {
            return message.channel.send(localization.mute_not_found);
        } else {
            if (bool === true) {
                personID = message.mentions.users.first().id;
            } else {
                personID = args[0];
            }
        }
        let user = message.guild.members.cache.get(personID);

        if (args.length === 1) {
            arguments = localization.kick_no_reason;
        } else {
            for (let i = 1; i < args.length; i++) {
                arguments = arguments + args[i] + " ";
            }
        }

        const successKick = new Discord.MessageEmbed()
            .setTimestamp()
            .setDescription("~KICK~")
            .setColor("ORANGE")
            .addField(localization.kick_kicked_user, "<@" + personID + ">")
            .addField(localization.kick_kicked_by, message.author.username + "#" + message.author.discriminator)
            .addField(localization.kick_date, new Date())
            .addField(localization.kick_reason, arguments);

        /*const uAreKicked = new Discord.MessageEmbed()
            .setTitle(localization.kick_priv_title)
            .setDescription(localization.kick_priv_desc_1 + message.author.username + localization.kick_priv_desc_2 + arguments + localization.kick_priv_desc_3 + message.author.username + localization.kick_priv_desc_4)
            .setColor("ORANGE");
            */
        connection.query(`SELECT * FROM users WHERE id = ${personID}`, function (err, result) {
            if (result[0].permissions === 10) return message.channel.send(localization.kick_kickproof);
            if (err) throw err;
            if (!result) return;
            message.delete();
            //client.users.cache.get(personID).send(uAreKicked);
            client.channels.cache.get(settings.punishmentChannel).send(successKick);
            user.kick();
            let values = [message.author.id, "kick", functions.today2() + " " + functions.time()]
            connection.query(`INSERT INTO counter (userID, action, timestamp) VALUES (?)`, [values], function (err, result) {
                if (err) throw err;
                return;
            });
        });
    }
}