const fs = require("fs");
const Discord = require('discord.js');
const MojangAPI = require("mojang-api")
module.exports = {
    name: "account",
    aliases: [""],
    category: "info",
    description: "Mojang account information",
    usage: "<account name>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        if (!args[0]) return message.channel.send("No args")
        MojangAPI.uuidAt(args[0], new Date(), function(err, res) {
            if (err) return message.channel.send(new Discord.MessageEmbed().setDescription("This name is not taken yet").setColor("ORANGE").setTimestamp())
            MojangAPI.nameHistory(res.id, function(err, res) {
                if (err) return message.channel.send(new Discord.MessageEmbed().setDescription("This name is not taken yet").setColor("ORANGE").setTimestamp())
                const embed = new Discord.MessageEmbed()
                    .setColor("ORANGE")
                    .setTimestamp()
                    .setDescription("")
                for (let i = 0 ; i< res.length; i++){
                    let name = res[i].name.split("_").join("\\_")
                    if (i===0){
                        embed.setDescription(embed.description+ "**"+name +"** - bought name\n") 
                    } else {
                        embed.setDescription(embed.description+ "**"+name +"** "+new Date(res[i].changedToAt) +"\n") 
                    }
                }
                message.channel.send(embed)
            })
        });
    }
}