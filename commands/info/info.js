const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: "info",
    aliases: [],
    category : "info",
    description: "Informations about fuck know what",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const settings = require("../../settings.json");
        let channelDescription = "";
        let channelName = "";
        let channelType = "";
        if (message.channel.type==="text"&&!message.member.voice.channel) {
            channelName = message.channel.name
            channelType = localization.info_channel_type_text;
            if (!message.channel.topic) {
                channelDescription = localization.info_channel_doesnt_have_desc
            } else {
                channelDescription = message.channel.topic;
            }
        } else {
            let channel = message.member.voice.channel;
            if (!channel) {
                channelName = message.channel.name
                channelType = "Hmm odd thing happend"
                channelDescription = localization.info_channel_doesnt_have_desc;
            } else {
                channelName = channel.name;
                channelType = localization.info_channel_type_voice;
                channelDescription = localization.info_channel_doesnt_have_desc;

            }
        }
        let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(", ");
        let emojis = message.guild.emojis.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(", ");

        const embed_channel = new Discord.MessageEmbed()
            .setTitle(localization.info_title)
            .setColor("ORANGE")
            .addField(
                localization.info_channel_info,  
                localization.info_description_channel_name + channelName +
                localization.info_channel_type+ channelType +
                localization.info_channel_desc + channelDescription)
            .setAuthor(message.guild.name, message.guild.iconURL());

        const embed_discord = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .addField(
                localization.info_server_info, 
                localization.info_server_name + message.guild.name + 
                localization.info_server_users + message.guild.memberCount +
                localization.info_server_owner + message.guild.ownerID + ">" +
                localization.info_server_id + message.guild.id +
                localization.info_server_tier + message.guild.premiumTier +
                localization.info_server_boosts + message.guild.premiumSubscriptionCount +
                localization.info_server_invite + settings.inviteLink
            );
        const embed_roles = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .addField(
                localization.info_roles_title,
                localization.info_roles_count  +message.guild.roles.cache.size + 
                localization.info_roles_list + rolemap 
            )
        const embed_emojis = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .addField(
                localization.info_emoji_title,
                localization.info_emoji_count + message.guild.emojis.cache.size +
                localization.info_emoji_list + emojis
            )
            .setTimestamp()
            .setFooter(message.author.username);
        message.channel.send(embed_channel).then(
        message.channel.send(embed_discord)).then(
        message.channel.send(embed_roles)).then(
        message.channel.send(embed_emojis));
    }
}