const fs = require("fs");
module.exports = {
    name: "clear",
    aliases: [],
    category : "moderation",
    description: "Informations about connection to server",
    usage: "<number>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        if (args.length<1) return message.channel.send(localization.clear_give_number).then(message.delete()).then(m => m.delete({timeout: 5000}));
        if (isNaN(args[0])) return false;
        if (args[0]>Number.MAX_SAFE_INTEGER) return message.channel.send(localization.clear_too_high1+Number.MAX_SAFE_INTEGER +localization.clear_too_high2);
        if (args[0]<1) return message.channel.send(localization.clear_too_low);
        if (message.deletable) message.delete();
        message.channel.bulkDelete(parseInt(args[0])).then(() => {message.channel.send(localization.clear_success1 + args[0] + localization.clear_success2)
        });
    }
}