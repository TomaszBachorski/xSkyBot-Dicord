const Discord = require('discord.js');
const fs = require("fs");
const mysql = require("mysql");
module.exports = {
    name: "checkban",
    aliases: [],
    category : "moderation",
    description: "Checking informations about bans",
    usage: "<mention/userID>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let connection = mysql.createConnection({
            host: settings.mySQLhost,
            user: settings.mySQLuser,
            database: "xskyblock database"
        }); 
        let personID = "";
        let bool = false;
        if (message.mentions.members.first()) bool = true;
        if (!args[0]) return message.channel.send(localization.checkban_user_not_specifiecd);
        if (args[0]) {
            if (isNaN(args[0]) && bool === false) {
                return message.channel.send(localization.checkban_number);
            } else if (args[0].length !== 18 && bool === false) {
                return message.channel.send(localization.checkban_18_char);
            } else if (!message.guild.members.cache.get(args[0]) && bool === false) {
                personID = args[0];
            } else {
                if (bool === true) {
                    personID = message.mentions.users.first().id;
                } else {
                    personID = args[0];
                }
            }
        } else {
            personID = message.author.id;
        }
        let user = message.guild.members.cache.get(personID);
        
        connection.query(`SELECT * FROM bans WHERE bannedPersonID = '${personID}'`, function (err ,result) {
            if (err) throw err;
            if (result.length===0) {
                return message.channel.send(localization.checkban_person_not_banned);
            } else {
                let type = "";
                banTimestamp = result[0].banTimestamp;
                if (result[0].isPermament===0){
                    type = localization.checkban_temp + result[0].bannedUntil;
                } else {
                    type = localization.checkban_perm;
                }
                message.channel.send(new Discord.MessageEmbed().setTitle(localization.checkban_checkban).setColor("ORANGE").addField(localization.checkban_user, localization.checkban_monkey+ result[0].bannedPersonID + localization.checkban_ending).addField(localization.checkban_banned_by, localization.checkban_monkey + result[0].bannedBy +localization.checkban_ending)
                .addField(localization.checkban_timestamp, result[0].banTimestamp).addField(localization.checkban_type, type).addField(localization.checkban_reason, result[0].reason));
                return;
            }
        });

    }
}