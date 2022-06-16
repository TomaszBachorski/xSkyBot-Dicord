const fs = require("fs");
module.exports = {
    name: "rng",
    aliases: ["random"],
    category : "fun",
    description: "Random number from range",
    usage: "<first range> [second range]",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        if (args.length<1) return message.reply(localization.rng_more_arguments);
        if (args[0]==="yes" || args[0]==="no" || args[0]==="yesorno" || args[0]==="yes/no") {
            const array = [localization.rng_yes, localization.rng_no];
            const random = Math.floor(Math.random() * array.length);
            return message.channel.send(array[random]);
        }
        if (args[0]>Number.MAX_SAFE_INTEGER) return message.reply(localization.rng_too_high_number1 + Number.MAX_SAFE_INTEGER +localization.rng_too_high_number2);
        if (args[0]<Number.MIN_SAFE_INTEGER) return message.channel.send(localization.rng_too_low_number1 + Number.MIN_SAFE_INTEGER + localization.rng_too_low_number2);
        if (isNaN(args[0])) return message.reply(localization.rng_invalid_input);
        if (args.length===1) return message.reply(Math.floor(Math.random() * args[0]))
        if (args.length===2)
            args[0] = Math.ceil(parseInt(args[0]));
            args[1] = Math.floor(parseInt(args[1]));
            if (parseInt(args[0])>parseInt(args[1])) {
                return message.reply(Math.floor(Math.random() * (args[0]-args[1])+ args[1])).then(message.channel.send(localization.rng_different_order))
            } else {
                return message.reply(Math.floor(Math.random() * (args[1]-args[0])+ args[0]))
            }  
    }
}