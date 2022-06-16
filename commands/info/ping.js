const fs = require("fs");
module.exports = {
    name: "ping",
    category : "info",
    description: "Informations about connection to server",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        const msg = await message.channel.send(localization.ping_pinging);
        msg.edit("Pong!")
        //msg.edit(localization.ping_nick + message.author.username+localization.ping_ping+ Math.floor(msg.createdTimestamp - message.createdTimestamp));
    }
}