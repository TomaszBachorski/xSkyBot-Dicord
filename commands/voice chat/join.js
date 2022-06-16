const fs = require("fs");
module.exports = {
    name: "join",
    aliases: [],
    category : "voice chat",
    description: "joins voice channel",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        let channel = message.member.voice.channel;
        if (!channel) return message.channel.send(localization.join_you_are_not_in_channel);
        //let channel = client.channels.cache.get('586972741874352168');
        channel.join().then(connection => {
            message.channel.send(localization.join_success)
        }).catch(error => {
            console.error(error);
        });
    }
}