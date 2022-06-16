const fs = require("fs");
module.exports = {
    name: "discord",
    aliases: [],
    category: "moderation",
    description: "displays message in channel with changelog",
    usage: "<changes after +/-/!//>",
    permission: 10,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let channelid = settings.discordChannel;
        let string = "";

        /*var today = new Date();
        today.getDate()<10  ? nope="0" : nope="";
        today.getMonth()+1<10 ? nopev2="0": nopev2="";

        if (message.channel.id!==channelid) return message.channel.send(localization.discord_wrong_channel1 + channelid + localization.discord_wrong_channel2);
        if (args.length<1) return message.channel.send(localization.discord_none_arguments).then(message.delete()).then( msg => msg.delete({timeout: 10000}));
        for (let i = 0;i<args.length; i-=-1){string = string + args[i] + " ";}
        message.channel.send(("```diff" +"\n#" +nope+today.getDate()+"."+nopev2+(today.getMonth()+1)+"."+today.getFullYear()+ "\n" + string.toString().replace("+", "\n+").replace("-", "\n-").replace("!", "\n!").replace("/", "\n/")+"```")).then(message.delete());
        */

        let value = 0;
        let tablica = [];
        if (message.channel.id !== channelid) return message.channel.send(localization.discord_wrong_channel1 + channelid + localization.discord_wrong_channel2).then(message.delete()).then(m => m.delete({ timeout: 10000 }));
        for (let i = 0; i < args.length; i++) {
            if (args[i].startsWith("-") || args[i].startsWith("+") || args[i].startsWith("/") || args[i].startsWith("!")) {
                string = string + args[i] + " ";
            } else {
                string = string + args[i] + " ";
                if (typeof args[i + 1] === 'undefined') {
                    value = 1;
                } else {
                    if (args[i + 1].startsWith("-") || args[i + 1].startsWith("+") || args[i + 1].startsWith("/") || args[i + 1].startsWith("!")) {
                        value = 1;
                    }
                }
            }
            if (value === 1) {
                if (string.startsWith(",")) {
                    string.split(",");
                    console.log(string)
                }
                tablica.push(string + "\n");
                string = "";
                value = 0;
            }
        }
        for (let i = 0; i < tablica.length; i++) {
            string = string + tablica[i];
        }
        var today = new Date();
        today.getDate() < 10 ? nope = "0" : nope = "";
        today.getMonth() + 1 < 10 ? nopev2 = "0" : nopev2 = "";
        message.channel.send("```diff\n#" + nope + today.getDate() + "." + nopev2 + (today.getMonth() + 1) + "." + today.getFullYear() + "\n\n" + string + "```").then(message.delete());
    }
}