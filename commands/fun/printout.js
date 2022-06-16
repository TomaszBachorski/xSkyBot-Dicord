const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: "printout",
    category : "fun",
    description: "Prints <number> messages",
    usage: "<number>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        if (args.length<1) return message.channel.send(localization.printout_more_arguments);
        if (args[0]>Number.MAX_SAFE_INTEGER) return message.channel.send(localization.printout_too_high_number1 +Number.MAX_SAFE_INTEGER +localization.printout_too_high_number2);
        if (isNaN(args[0])) return message.channel.send(localization.printout_invalid_input);
        if (args[0]<1) return message.channel.send(localization.not_negative_number);
        for(let i =0;i<parseInt(args[0]);i++) {
            message.channel.send(i+1)
        }
    }
}