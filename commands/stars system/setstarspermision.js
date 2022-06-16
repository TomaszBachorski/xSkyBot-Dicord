const fs = require("fs");
const Discord = require('discord.js');
const mysql = require("mysql");
module.exports = {
    name: "setstarspermission",
    aliases: ["setstarspermissions", "setstarspermision", "setstarspermisions", "setstarpermissions", "setstarpermision", "setstarpermisions", "setstarpermission"],
    category : "",
    description: "Adds user permissions to use advanced stars commands",
    usage: "<mention/userID> <permission level>",
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
            if (result.length === 0 ) {
                return;
            } else if (result[0].permissions===0){
                return;
            } else if (result[0].permissions===5) {
                return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(localization.stars_no_permissions).setDescription(localization.stars_no_permissions_desc));
            } else if (result[0].permissions===10) {
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
                if (args.length===1) return message.channel.send(localization.stars_permision_wrong);
                if (args[1]!=="0" && args[1]!=="5" && args[1]!=="10" ) return message.channel.send(localization.stars_incorrect_permission)
                connection.query(`UPDATE starssystem SET permissions = ${parseInt(args[1])} WHERE id = ${personID}`, function(err, result) {
                    if (err) throw err;
                    return message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setTitle(localization.stars_success_permission + user.user.tag).setDescription(localization.stars_successfull_changes + user.user.tag + localization.stars_into + args[1] + localization.stars_wrr))
                })
            } else {
                return message.channel.send(localization.stars_fuck_permissions_im_better)
            }
        });
    }
}