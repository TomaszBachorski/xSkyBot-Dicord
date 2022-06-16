const mysql = require("mysql");
const fs = require("fs");
const Discord = require('discord.js');
module.exports = {
    name: "checkpermission",
    aliases: ["checkpermision", "checkpermissions", "checkpermisions"],
    category : "bot",
    description: "Shows user list with permissions over 0",
    usage: "",
    permission: 10,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let connection = mysql.createConnection({
            host: settings.mySQLhost,
            user: settings.mySQLuser,
            database: "xskyblock database"
        });
        connection.query(`SELECT * FROM users WHERE permissions>0 ORDER BY permissions ASC`, function(err, result) {
            if (err) throw err;
            if (result.length===0) return message.channel.send(new Discord.MessageEmbed().setDescription(localization.checkpermission_no_one))
            let embed = new Discord.MessageEmbed().setColor("ORANGE");
            for (let i = 0 ; i < result.length; i++){
                embed.addField(result[i].username, localization.checkpermission_monkey + result[i].id + localization.checkpermission_dash + result[i].permissions);
            }
            return message.channel.send(embed)
        });
        return;
    }
}