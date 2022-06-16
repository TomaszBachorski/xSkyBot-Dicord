const Discord = require('discord.js');
const fs = require("fs");
const mysql = require("mysql");
const functions = require('../../functions');
const moment = require("moment");
module.exports = {
    name: "mute",
    aliases: [],
    category: "moderation",
    description: "Muting person for a time",
    usage: "<mention/userID> <time> [reason]",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let personID = "";
        let bool = false;
        let monthLettersIntoNumber = {
            Jan : 1,
            Feb: 2,
            Mar: 3,
            Apr: 4,
            May: 5,
            Jun: 6,
            Jul: 7,
            Aug: 8,
            Sep: 9,
            Oct: 10,
            Nov: 11,
            Dec: 12
        };
        let muterole = message.guild.roles.cache.find(role => role.id === settings.muteRole);
        if (!muterole) return message.channel.send(localization.mute_role_not_found);
        if (message.mentions.members.first()) bool = true;
        if (!args[0]) return message.channel.send(localization.mute_user_not_specified);
        if (args[0]) {
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
        } else {
            personID = message.author.id;
        }
        let user = message.guild.members.cache.get(personID);
        let CanIBeMuted = true;
        connection.query(`SELECT * FROM users WHERE id = ${personID}`, function(err, result) {
            if (err) throw err;
            if (!result) return;
            if (result[0].permissions===10) return CanIBeMuted=false;
            return CanIBeMuted=true
        });

        if (!args[1]) return message.channel.send(localization.mute_time_not_specified);
        let timeUnit = "";
        let enddate ="";
        if (args[1].endsWith("s")) { 
            timeUnit = "seconds";
            timeNumber = args[1].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 1000);
        } else if (args[1].endsWith("m")) { 
            timeUnit = "minutes";
            timeNumber = args[1].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 60*1000);
        } else if (args[1].endsWith("h")) { 
            timeUnit = "hours";
            timeNumber = args[1].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 60*60*1000);
        } else if (args[1].endsWith("d")) { 
            timeUnit = "days";
            timeNumber = args[1].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 24*60*60*1000);
        } else if (args[1].endsWith("M")) { 
            timeUnit = "months";
            timeNumber = args[1].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 30*24*60*60*1000);
        } else if (args[1].endsWith("y")) {
            timeUnit = "years";
            timeNumber = args[1].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 365*24*60*60*1000);
        } else {
            return message.channel.send(localization.mute_wrong_time_format);
        }
        if (!timeNumber) return message.channel.send(localization.mute_no_time_number);
        if (isNaN(timeNumber)) return message.channel.send(localization.mute_wrong_time)

        let reason = "";
        if (args.length===2) {
            reason = localization.mute_my_life_is_too_short;
        } else {
            for (let i =2; i<args.length; i++) {
                reason = reason+args[i]+" ";
            }
        }
        const embed = new Discord.MessageEmbed();
        let connection = mysql.createConnection({
            host: settings.mySQLhost,
            user: settings.mySQLuser,
            database: "xskyblock database"
        });
        connection.query(`SELECT * FROM mutes WHERE mutedPersonID = '${user.user.id}'`, function(err, result) {
            if (CanIBeMuted === false) return message.channel.send(localization.mute_muteproof);
            if (err) throw err;
            if (result.length===0) {
                mutedUntill = moment().add(timeNumber, timeUnit).calendar();
                let insertValues = [user.user.id, message.author.id, functions.today2() + " " + functions.time(), args[1], enddate, reason];
                enddate = enddate.toString().split(" ");
                enddate = enddate[3]+"-"+monthLettersIntoNumber[enddate[1]]+"-"+enddate[2] + " " + enddate[4];
                connection.query(`INSERT INTO mutes (mutedPersonID, muteBy, muteTimestamp, muteTime, mutedUntil, muteReason) VALUES (?)`, [insertValues],function(err, result) {
                    if (err) throw err;
                    embed.setColor("ORANGE").setTitle(localization.mute_mute).addField(localization.mute_muted_user, localization.mute_monkey+user.user.id+localization.mute_ending).addField(localization.mute_by, message.author.tag).addField(localization.mute_for, args[1] + localization.mute_until+enddate+ localization.mute_until2).addField(localization.mute_date, new Date()).addField(localization.mute_reason, reason);
                    message.guild.members.cache.get(personID).roles.add(settings.muteRole);
                    let values = [message.author.id, "mute", functions.today2() + " " + functions.time()]
                    connection.query(`INSERT INTO counter (userID, action, timestamp) VALUES (?)`, [values], function(err,result) {
                        if (err) throw err;
                        return;
                    });
                    return client.channels.cache.get(settings.punishmentChannel).send(embed);
                });
                return;
            } else {
                //ta osoba już jest wyciszona
                return message.channel.send(embed.setColor("RED").setTitle(localization.mute_error).setDescription(localization.mute_already_muted));
            }
        });
        return;
    }
}