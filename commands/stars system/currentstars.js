const fs = require("fs");
const Discord = require('discord.js');
const mysql = require("mysql");
module.exports = {
    name: "currentstars",
    aliases: ["totalstars"],
    category : "",
    description: "Shows user stars and permissions",
    usage: "[mention/userID]",
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
            if (result.length===0) {
                return 
            } else if (result[0].permission === 0) {
                return;
            } else if (result[0].permissions === 5 || result[0].permissions === 10) {
                if (!args[0]) {
                    connection.query(`SELECT * FROM starssystem WHERE id = '${message.author.id}'`, function(err, result) {
                        if (err) throw err;
                        if (result.length===0) return message.channel.send(new Discord.MessageEmbed().setTitle(localization.stars_error_occured).setColor("RED").setDescription(localization.stars_you_are_fatal_error));
                        let user = message.guild.members.cache.get(result[0].id);
                        return message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle(localization.stars_user_info).setDescription(localization.stars_user_tag + user.user.tag + localization.stars_user_current_stars + result[0].currentstars + localization.stars_total_stars+ result[0].totalstars))
                    });
                } else {
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
                    connection.query(`SELECT * FROM starssystem WHERE id = '${personID}'`, function(err, result ){
                        if (err) throw err;
                        if (result.length===0) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(localization.stars_not_found).setDescription(localization.stars_not_yet_in_db + settings.prefix + localization.stars_stars))
                        return message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle(localization.stars_user_info).setDescription(localization.stars_user_tag + user.user.tag + localization.stars_user_current_stars + result[0].currentstars + localization.stars_total_stars + result[0].totalstars));
                    });
                }
            } else {
                return message.channel.send(localization.stars_fuck_permissions_im_better)
            }
        });
    }
}