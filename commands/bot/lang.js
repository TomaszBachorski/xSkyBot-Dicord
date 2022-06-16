const fs = require("fs");
module.exports = {
    name: "lang",
    aliases: ["language"],
    category : "bot",
    description: "Changing bot language",
    usage: "<language/config>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        if (args.length<1) return message.channel.send(localization.lang_not_specified);
        path = "./language/lang-" + args[0]+ ".json";
        if (args[0]==="config"){
            fs.writeFileSync("./language/language.txt", "./config.json\n../../config.json");
            return message.channel.send(localization.lang_success_config + args[0]);
        }
        if (!fs.existsSync(path)) return message.channel.send(localization.lang_doesnt_exist);
        fs.writeFileSync("./language/language.txt", path + "\n../."+path);
        message.channel.send(localization.lang_success_other + args[0]);
    }
}