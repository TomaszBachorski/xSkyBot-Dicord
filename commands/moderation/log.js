const fs = require("fs");
module.exports = {
    name: "log",
    category : "moderation",
    aliases: ["logs"],
    description: "Requestint log files",
    usage: "<date/yesterday/today/tomorrow>",
    permission: 10,
    run: async (client, message, args) => {
        var date = new Date();
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        let today = date.getFullYear()+"-"+(date.getMonth()+1) + "-"+date.getDate();
        let yesterday = date.getFullYear()+"-"+(date.getMonth()+1) + "-"+(date.getDate()-1);
        if (args.length<1) return message.channel.send(localization.log_null_date);
        if (args.length>1) return message.channel.send(localization.log_too_many_arguments);
        if (args[0].startsWith("..")) return message.channel.send(localization.log_im_smarter);
        if (args[0].toString().toLowerCase()==="today") return message.channel.send({files: [{attachment: "./logs/" + today + ".txt"}]});
        if (args[0].toString().toLowerCase()==="yesterday") return message.channel.send({files: [{attachment: "./logs/" + yesterday + ".txt"}]});
        if (args[0].toString().toLowerCase()==="tomorrow") return message.channel.send(localization.log_future);
        let path = "./logs/"+args+".txt";
        if (!fs.existsSync(path)) return message.channel.send(localization.log_doesnt_exist).then(message.channel.send(localization.log_correct_format));
        message.channel.send({
           	files: [{
           		attachment: path,
           		name: path
           	}]
        });
    }
}