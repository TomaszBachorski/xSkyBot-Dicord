const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    command_name: "stop",
    aliases: [""],
    category : "",
    description: "Stopping bot",
    usage: "",
    permission: 10,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json")
        
        if (message.author.id!==settings.botOwner) return message.channel.send(localization.stop_only_owner)
        function genPass(n) {
            let c='abcdefghijklmnopqrstuvwxyz'; 
            c+=c.toUpperCase()+1234567890;
            return '-'.repeat(n).replace(/./g,b=>c[~~(Math.random()*62)])
        } 
        code = genPass(10);
        message.channel.send(localization.stop_rewrite + code);
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1
        }).then(msg => {
            msg = msg.first()
            if (msg.content === code) {
                process.exit();
            } else {
                return message.channel.send(localization.stop_wrong_code);
            }
        });
    }
}