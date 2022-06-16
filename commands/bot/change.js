const fs = require("fs");
const Discord = require("discord.js");
module.exports = {
    name: "change",
    aliases: [],
    category: "bot",
    description: "Changes bot settings.json",
    usage: "<valueName> [value]",
    permission: 10,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        delete require.cache[require.resolve("../../settings.json")];
        const settings = require("../../settings.json")
        var settings1 = JSON.stringify(fs.readFileSync("./settings.json").toString());
        let result = "";
        if (args.length === 0) {
            let finalValues = "";
            let values = Object.keys(settings);
            for (let i = 0 ; i<values.length;i++) {
                finalValues = finalValues + values[i]+ "\n";
            }
            return message.channel.send(new Discord.MessageEmbed().setTitle(localization.change_give_value_name).setColor("ORANGE").setDescription(localization.change_available_values +finalValues));
        }
        if (args.length === 1) return message.channel.send(localization.change_give_value);
        if (args[0] === "prefix" && args[1].length > 1) return message.channel.send(localization.change_prefix_one_char);
        if (args[0] === "prefix" && Boolean(args[1].charAt(0).match(/[a-zA-Z]/))) return message.channel.send(localization.change_not_alphabet);
        if ((args[0] === "banRefreshTime" || args[0] === "muteRefreshTime") && isNaN(args[1])) return message.channel.send(localization.change_only_number) 
        if (args[0] === "giveawayChannel" || args[0] === "discordChannel" || args[0] === "punishmentChannel" || args[0] === "botOwner") {
        if (args[0]==="statusInterval" && isNaN(args[1])) return message.channel.send(localization.change_status);
        if (args[0]==="statusInterval") message.channel.send(localization.chaneg_restart)
        if (isNaN(args[1])) {
                return message.channel.send(localization.change_number);
            } else if (args[1].length !== 18) {
                return message.channel.send(localization.change_18_char);
            } else if (args[0] === "botOwner" && !message.guild.members.cache.get(args[1])) {
                return message.channel.send(localization.change_user_doesnt_exist);
            } else if (args[0] === "botOwner" && message.author.id !== settings.botOwner) {
                return message.channel.send(localization.change_only_owner)
            } else if ((args[0] === "giveawayChannel" || args[0] === "punishmentChannel" || args[0] === "discordChannel") && !message.guild.channels.cache.find(channel => channel.id === args[1])) {
                return message.channel.send(localization.change_channel_doesnt_exist);
            } else { }
        }
        if (args[0]==="mySQLhost"||args[0]==="mySQLuser"){
            if (message.author.id!==settings.botOwner) {
                return message.channel.send(localization.change_only_owner)
            }
        }
        if (settings1.includes(`\"${args[0]}\\"`)) {
            if (args[0]==="botUsername" || args[0]==="botNickname") {
                let arguments = "";
                for (let i = 1 ; i<args.length;i++) {
                    arguments = arguments + args[i]+" ";
                }
                args[1] = arguments;
                if (args[1].length>32) return message.channel.send(localization.change_too_long)
            }
            let what_to_change = `\\"${args[0]}\\" : \\"${settings[args[0]]}\\"`;
            let what_changed = `\\"${args[0]}\\" : \\"${args[1]}\\"`;
            if (what_to_change === what_changed) return message.channel.send(localization.change_no_change);
            result = settings1.toString().replace(what_to_change, what_changed);
            result = JSON.parse(result);
        } else {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(localization.change_value_doesnt_exist_title)
                .setDescription(localization.change_value_doesnt_exist_desc_1 + args[0] + localization.change_value_doesnt_exist_desc_2)
                .setColor("ORANGE")
            );
        }
        fs.writeFileSync("./settings.json", result);
        delete require.cache[require.resolve("../../settings.json")];
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(localization.change_success_title)
            .setDescription(localization.change_success_desc_1 + args[0] + localization.change_success_desc_2 + args[1] + localization.change_success_desc_3)
            .setColor("ORANGE")
            .setTimestamp()
            .setFooter(message.author.username)
        );
        const settings2 = require("../../settings.json");
        if (args[0]==="botUsername" || args[0]==="botNickname") {
            let arguments = "";
            for (let i = 1 ; i<args.length;i++) {
                arguments = arguments + args[i]+" ";
            }
            args[1] = arguments;
            if (args[0]==="botNickname") {
                message.guild.members.cache.get(client.user.id).setNickname(settings2.botNickname);
            } else if (args[0] === "botUsername") {
                client.user.setUsername(settings2.botUsername);
            }   
        }
        delete require.cache[require.resolve("../../settings.json")];
    }
}