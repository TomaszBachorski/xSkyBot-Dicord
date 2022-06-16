const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: "generate",
    aliases: [],
    category : "fun",
    description: "Generating fun",
    usage: "<length> <amount>",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        if (args.length===0) return message.channel.send(localization.generate_none_arguments);
        if (args.length===1) return message.channel.send(localization.generate_where_is_second_argument);
        if (isNaN(args[0])) return message.channel.send(localization.generate_numers_only);
        if (args[0]>2000) return message.channel.send(localization.generate_too_high_number)
        if (isNaN(args[1])) return message.channel.send(localization.generate_numers_only);
        if (args[0]<0 || args[1]<0) return message.channel.send(localization.generate_negative_number)
        
        function genPass(n) {
            let c='abcdefghijklmnopqrstuvwxyz'; 
            c+=c.toUpperCase()+1234567890;
            return '-'.repeat(n).replace(/./g,b=>c[~~(Math.random()*62)])
        }
        for (let i = 0;i<parseInt(args[1]);i++) {
            code = genPass(parseInt(args[0]));
            message.channel.send(localization.generate_random_code + code);
        }
        
    }
}