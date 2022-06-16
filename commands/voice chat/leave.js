const fs = require("fs");
module.exports = {
    name: "leave",
    aliases: ["disconnect"],
    category : "voice chat",
    description: "leaves voice channel",
    usage: "",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        let channel = message.member.voice.channel;
        if(!channel) return message.channel.send(localization.leave_need_to_join_channel)
        channel.leave(channel);
    }
}