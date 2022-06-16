const fs = require("fs");
const Discord = require('discord.js');
const mysql = require("mysql");
module.exports = {
    name: "addstars",
    aliases: ["addstar", "starsadd", "staradd"],
    category : "",
    description: "Adds stars for user",
    usage: "<mention/userID> <stars amount>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let connection = mysql.createConnection({
            host: settings.mySQLhost,
            user: settings.mySQLuser,
            database: "xskyblock database"
        });
        connection.query(`SELECT * FROM starssystem WHERE id = '${message.author.id}'`, function(err, result) {
            if (err) throw err;
            if (result.length === 0) {
                return
            } else if (result[0].permissions === 0) {
                return;
            } else if (result[0].permissions === 5) {
                return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(localization.stars_no_permissions).setDescription(localization.stars_no_permissions_desc));
            } else if (result[0].permissions === 10) {
                if (args.length===0) return message.channel.send(localization.stars_no_person_specified)
                let personID = "";
                let bool = false;
                if (message.mentions.members.first()) bool = true;
                if (isNaN(args[0]) && bool === false) {
                    return message.channel.send(localization.stars_id_number);
                } else if (args[0].length !== 18 && bool === false) {
                    return message.channel.send(localization.stars_id_18);
                } else if (!message.guild.members.cache.get(args[0]) && bool === false) {
                    return message.channel.send(localization.stars_no_available);
                } else {
                    if (bool === true) {
                        personID = message.mentions.users.first().id;
                    } else {
                        personID = args[0];
                    }
                }
                let user = message.guild.members.cache.get(personID);
                if (args.length===1) return message.channel.send(localization.stars_stars_no_specified);
                if (isNaN(args[1])) return message.channel.send(localization.stars_dot_system);
                let numberGiven = args[1];
                connection.query(`SELECT * FROM starssystem WHERE id = '${personID}'`, function(err, result) {
                    if (err) throw err;
                    if (result.length===0) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(localization.stars_not_found).setDescription(localization.stars_not_yet_in_db + settings.prefix + localization.stars_stars));
                    let currentStars = (parseFloat(result[0].currentstars) + parseFloat(numberGiven)).toFixed(2);
                    let totalStars = (parseFloat(result[0].totalstars) + parseFloat(numberGiven)).toFixed(2);
                    if (numberGiven<0) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(localization.stars_stay_positive).setDescription(localization.stars_stay_positive_desc + settings.prefix + localization.stars_stay_positive_desc_2))
                    if (numberGiven==="0") return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(localization.stars_stay_positive).setDescription(localization.stars_neutral))
                    connection.query(`UPDATE starssystem SET username = '${user.user.username}', currentstars = ${currentStars}, totalstars = ${totalStars} WHERE id = '${personID}'`, function(err, result) {
                        if (err) throw err;
                        const embed = new Discord.MessageEmbed().setColor("GREEN").setTitle(localization.stars_added_to + user.user.tag).setDescription(localization.stars_given_stars +user.user.tag +localization.stars_hmm + numberGiven + localization.stars_now_they_have + currentStars + localization.stars_stars_e);
                        return message.channel.send(embed)
                    });
                });
                
            } else {
                return message.channel.send(localization.stars_fuck_permissions_im_better)
            }
        });
    }
}