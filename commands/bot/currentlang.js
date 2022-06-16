const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: "currentlang",
    aliases: ["currentlanguage"],
    category : "bot",
    description: "Informations about current language",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        var zmienna = fs.readFileSync("./language/language.txt").toString().split("\n");
        if (zmienna[0]==="./config.json") {
            return message.channel.send(localization.currentlang_changed_to_config);
        } else {
            let s1 = zmienna[0].split("-")[1];
            let s2 = s1.split(".")[0];
            message.channel.send(localization.currentlang_changed_to_other+s2);
        }
    }
}