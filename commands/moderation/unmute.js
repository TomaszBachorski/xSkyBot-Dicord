const Discord = require('discord.js');
const fs = require("fs");
const mysql = require("mysql");
module.exports = {
    name: "unmute",
    aliases: [],
    category : "moderation",
    description: "Removing mute",
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
        
        let muterole = message.guild.roles.cache.find(role => role.id === settings.muteRole);
        if (!muterole) return message.channel.send(localization.unmute_role_not_found);

        if (!args[0]) return message.channel.send(localization.unmute_person_not_specified);
        let bool = false;
        if (message.mentions.members.first()) bool = true;
        let personID = "";
        if (args.length!==0) {
            if (isNaN(args[0])&&bool===false) {
                return message.channel.send(localization.unmute_id_is_a_number);
            } else if (args[0].length!==18&&bool===false) {
                return message.channel.send(localization.unmute_id_18_char);
            } else if (!message.guild.members.cache.get(args[0])&&bool===false) {
                personID = args[0];
                message.channel.send(localization.unmute_not_found);
            } else {
                if (bool===true) {
                    personID = message.mentions.users.first().id;
                }else {
                    personID = args[0];
                }
            }
        } else {
            personID = message.author.id;
        }
        let user = message.guild.members.cache.get(personID);
        const embed = new Discord.MessageEmbed();
        connection.query(`SELECT * FROM mutes WHERE mutedPersonID = '${personID}'`, function(err, result) {
            if (err) throw err;
            if (result.length===0) {
                return message.channel.send(new Discord.MessageEmbed().setTitle(localization.unmute_error).setColor("RED").setDescription(localization.unmute_not_muted))
            } else {
                connection.query(`DELETE FROM mutes WHERE mutedPersonID = '${result[0].mutedPersonID}'`, function(err, result) {
                    if (err) throw err;
                    embed.setColor("ORANGE").setTitle(localization.unmute_successfull_unmute).setDescription(localization.unmute_by + message.author.username+localization.unmmute_dot).setTimestamp().setFooter(localization.unmute_automatic);
                    if (!user) {
                        message.channel.send(new Discord.MessageEmbed().setDescription(localization.unmute_not_on_server_but_still).setColor("GREEN").setTitle(localization.unmute_success))
                    } else {
                        message.channel.send(new Discord.MessageEmbed().setDescription(localization.unmute_success_unmute + personID + localization.unmute_close).setTitle(localization.unmute_success).setColor("GREEN"));
                        message.guild.members.cache.get(personID).roles.remove(settings.muteRole);
                        user.send(embed);
                    }
                    return;
                });
            }
        });
        return;
    }
}