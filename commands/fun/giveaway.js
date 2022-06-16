const Discord = require('discord.js');
const fs = require("fs");
const moment = require("moment");
const ms = require('ms');
const mysql = require("mysql");
const functions = require('../../functions');
module.exports = {
    name: "giveaway",
    aliases: [],
    category: "fun",
    description: "Making giveaways",
    usage: "<time> <winners count> <prize>",
    permission: 10,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let connection = mysql.createConnection({
            host: settings.mySQLhost,
            user: settings.mySQLuser,
            database: "xskyblock database"
        });
        if (!args[0]) return message.channel.send(localization.giveaway_time_not_specified);
        if (!args[0].endsWith("d") && !args[0].endsWith("h") && !args[0].endsWith("m") && !args[0].endsWith("s")) return message.channel.send(localization.giveaway_invalid_format);
        if (isNaN(args[0][0])) return message.channel.send(localization.giveaway_not_a_number);
        let giveawayChannel = settings.giveawayChannel;
        if (!args[1]) return message.channel.send(localization.giveaway_winners_not_specified);
        if (isNaN(args[1])) return message.channel.send(localization.giveaway_winners_not_a_number);
        let winnersCount = args[1];
        if (winnersCount === '0') return message.channel.send(localization.giveaway_more_winners);
        let prize = args.slice(2).join(" ");
        if (!prize) return message.channel.send(localization.giveaway_prize_not_specified);
        message.channel.send(localization.giveaway_start_1 + giveawayChannel + localization.giveaway_start_2);
        let giveawayMessage = new Discord.MessageEmbed()
            .setTitle(localization.giveaway_message_title)
            .setDescription(localization.giveaway_message_host + message.author.id + localization.giveaway_message_winners_count + winnersCount + localization.giveaway_message_prize + prize + localization.giveaway_message_react)
            .setFooter(localization.giveaway_message_footer)
            .setTimestamp(Date.now() + ms(args[0]))
            .setColor("ORANGE");
        client.channels.cache.get(giveawayChannel).send(localization.giveaway_ping);
        let msg = await client.channels.cache.get(giveawayChannel).send(giveawayMessage);
        msg.react("🎉");

        //stworzenie giveaway'a ^
        //wpisanie do bazy \/

        let timeUnit = "";
        let enddate ="";
        if (args[0].endsWith("s")) { 
            timeUnit = "seconds";
            timeNumber = args[0].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 1000);
        } else if (args[0].endsWith("m")) { 
            timeUnit = "minutes";
            timeNumber = args[0].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 60*1000);
        } else if (args[0].endsWith("h")) { 
            timeUnit = "hours";
            timeNumber = args[0].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 60*60*1000);
        } else if (args[0].endsWith("d")) { 
            timeUnit = "days";
            timeNumber = args[0].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 24*60*60*1000);
        } else if (args[0].endsWith("M")) { 
            timeUnit = "months";
            timeNumber = args[0].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 30*24*60*60*1000);
        } else if (args[0].endsWith("y")) {
            timeUnit = "years";
            timeNumber = args[0].slice(0, -1);
            enddate = new Date(Date.now() + timeNumber * 365*24*60*60*1000);
        } else {
            return message.channel.send(localization.giveaway_wrong_time);
        }
        if (!timeNumber) return message.channel.send(localization.giveaway_no_time_number);
        if (isNaN(timeNumber)) return message.channel.send(localization.giveaway_wrong_time2)
        let values = [false, message.author.id, winnersCount, args[0], enddate, prize, null, msg.id];
        connection.query(`INSERT INTO giveaways (hasEnded, creator, numberOfWinners, time, enddate, rewards, winners, messageID) VALUES (?)`, [values] ,function(err, result) {
            if (err) throw err;
        });
    }
}