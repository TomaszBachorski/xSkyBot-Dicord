const fs = require("fs");
const Discord = require('discord.js');
const mysql = require("mysql");
module.exports = {
    name: "setpermission",
    aliases: ["setpermision", "setpermissions", "setpermisions"],
    category: "bot",
    description: "Sets user permissions to use bot",
    usage: "<userID/userMention> <permissionLevel>",
    permission: 10,
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
        if (!args[0]) return message.channel.send(localization.setpermissions_user_no_specified);
        if (isNaN(args[0]) && bool === false) {
            return message.channel.send(localization.setpermissions_has_to_be_umber);
        } else if (args[0].length !== 18 && bool === false) {
            return message.channel.send(localization.setpermissions_18_char);
        } else if (!message.guild.members.cache.get(args[0]) && bool === false) {
            return message.channel.send(localization.setpermissions_not_found);
        } else {
            if (bool === true) {
                personID = message.mentions.users.first().id;
            } else {
                personID = args[0];
            }
            number = 0;
        }
        if (!args[1]) return message.channel.send(localization.setpermissions_no_permission)
        if (isNaN(args[1])) return message.channel.send(localization.setpermissions_number)
        if (args[1]<0 || args[1]>10) return message.channel.send(localization.setpermissions_range)
        connection.query(`UPDATE users SET permissions = ${args[1]} WHERE id = ${personID}`, function(err, result) {
            if (err) throw err;
            return message.channel.send(new Discord.MessageEmbed().setDescription(localization.setpermissions_change + personID + localization.setpermissions_for + args[1]).setColor('#0099ff'))
        });
    }
}