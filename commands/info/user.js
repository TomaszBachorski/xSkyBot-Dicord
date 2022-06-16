const Discord = require('discord.js');
const { getMember, formatDate} = require("../../functions.js");
const fs = require("fs");
module.exports = {
    name: "user",
    category : "info",
    description: "Informations about user",
    usage: "[mention/id]",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const member = getMember(message, args.join(" "));

        // Variables
        const joined = formatDate(member.joinedAt);
        const role = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(", ") || "none"
        const created = formatDate(member.user.createdAt);
        const id = member.user.id;
        const username = member.user.username;
        const tag = member.user.tag;
        
        var s = '';
        var onlytag = tag.split('').slice(-5);
        for (let i =0;i<5;i++)
            var s = s+onlytag[i];
        var onlytag = s;

        let bool = false;
        if (message.mentions.members.first()) bool = true;
        let personID = "";
        if (args.length!==0) {
            if (isNaN(args[0])&&bool===false) {
                return message.channel.send(localization.user_id_is_number);
            } else if (args[0].length!==18&&bool===false) {
                return message.channel.send(localization.user_18_char_long)
            } else if (!message.guild.members.cache.get(args[0])&&bool===false) {
                return message.channel.send(localization.user_not_on_this_server)
            } else {
                if (bool===true) {
                    personID = message.mentions.users.first().id
                }else {
                    personID = args[0];
                }
            }
        } else {
            personID = message.author.id;
        }
        let user = message.guild.members.cache.get(personID);
        const embed = new Discord.MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle(localization.user_informations_about + user.user.username)
            .setDescription(localization.user_roles+ role +localization.user_joined + joined + localization.user_created + created+ localization.user_name + user.user.username + localization.user_tag + onlytag + localization.user_id + id);
        message.channel.send(embed);
    }
}