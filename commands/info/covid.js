const api = require('covidapi');
const Discord = require('discord.js');
const fs = require("fs");
api.settings({
    baseUrl: 'https://disease.sh'
})
module.exports = {
    name: "covid",
    aliases: [],
    category : "info",
    description: "Informations about covid",
    usage: "[country]",
    permission: 5,
    run: async (client, message, args) => {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
        if (args.length === 0) {
            api.all();
            const data = await api.all();
            const covidAll = new Discord.MessageEmbed()
                .setColor("ff2050")
                .setTitle(localization.covid_global_title)
                .setDescription(localization.covid_desc)
                .addField(localization.covid_cases, data.cases, true)
                .addField(localization.covid_deaths, data.deaths, true)
                .addField(localization.covid_recovered, data.recovered, true)
                .setFooter(localization.covid_source);
            return message.channel.send(covidAll);
        } else {
            const covidcountry = args[0];
            api.all();
            const cdata = await api.countries({country: covidcountry});
            const covidCountry  = new Discord.MessageEmbed()
                .setTitle(localization.covid_local_title + args[0])
                .setDescription(localization.covid_desc)
                .setColor("ff2050")
                .addField(localization.covid_cases, cdata.cases, true)
                .addField(localization.covid_deaths, cdata.deaths, true)
                .addField(localization.covid_recovered, cdata.recovered, true)
                .setFooter(localization.covid_source);
            return message.channel.send(covidCountry);
        }
    }
}