const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const Discord = require('discord.js');
const fs = require("fs");
const functions = require("./functions.js");
const mysql = require("mysql");

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on("ready", () => {
    console.log(functions.today() + " | " + functions.time());
    let textByLines = fs.readFileSync("./language/language.txt").toString().split("\n");
    if (!textByLines[0] || !textByLines[0].endsWith(".json") || !textByLines[0].startsWith("./")) { fs.writeFileSync("./language/language.txt", "./config.json\n../../config.json"); console.log("I was unable to read proper language localization"); fs.appendFileSync(`./logs/` + formatDate() + ".txt", "While turning on I detected that localization directory was wrong") };
    if (!textByLines[1] || !textByLines[1].endsWith(".json") || !textByLines[1].startsWith("../../")) { fs.writeFileSync("./language/language.txt", "./config.json\n../../config.json"); console.log("I was unable to read proper language localization"); fs.appendFileSync(`./logs/` + formatDate() + ".txt", "While turning on I detected that localization directory was wrong") };
    client.user.setStatus('ONLINE')
    client.user.setActivity(functions.today() + " | " + functions.time());
    const settings = require("./settings.json");
    setInterval(function () {
        return client.user.setActivity(functions.today() + " | " + functions.time());
    }, settings.statusInterval * 1000)
});

//giveaways roller
client.on("ready", () => {
    const settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    setInterval(function () {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[0]);
        let currentTime = functions.today2() + " " + functions.time();
        connection.query(`SELECT * FROM giveaways WHERE hasEnded = false AND enddate < '${currentTime}'`, function (err, result) {
            if (err) throw err;
            if (result.length === 0) return;
            const guild = client.guilds.cache.get('586972740695883790');
            let winnerrole = guild.roles.cache.find(role => role.id === settings.giveawayWinnerRole);
            if (!winnerrole) return;
            let winnersArray = []
            let finalWinners = "";
            let winnersCount = result[0].numberOfWinners;
            let msg = client.channels.cache.get(settings.giveawayChannel).messages.fetch(result[0].messageID).then(message => {
                message.reactions.cache.get("🎉").users.fetch().then(user => {
                    if (message.reactions.cache.get("🎉").count - 1 < winnersCount) {
                        connection.query(`UPDATE giveaways SET hasEnded = true, winners = 'error' WHERE messageID = '${result[0].messageID}'`, function (err, result) {
                            if (err) throw err;
                        });
                        return client.channels.cache.get(settings.giveawayChannel).send(localization.giveaway_too_small)
                    }
                    for (let i = 0; i < winnersCount;) {
                        userRandom = user.filter(u => !u.bot).random();
                        if (winnersArray.includes(userRandom.id)) {
                        } else {
                            winnersArray.push(userRandom.id)
                            i++;
                        }
                    }
                    for (let i = 0; i < winnersArray.length; i++) {
                        finalWinners = finalWinners + "<@" + winnersArray[i] + ">, ";
                    }
                    if (winnersCount == 1) {
                        client.channels.cache.get(settings.giveawayChannel).send(finalWinners + localization.giveaway_winner_wins + result[0].rewards + localization.giveaway_congrats);
                    } else {
                        client.channels.cache.get(settings.giveawayChannel).send(finalWinners + localization.giveaway_winners_wins + result[0].rewards + localization.giveaway_congrats);
                    }
                    connection.query(`UPDATE giveaways SET hasEnded = true, winners = '${winnersArray}' WHERE messageID =  '${result[0].messageID}'`, function (err, result) {
                        if (err) throw err;
                        return;
                    });
                });
            });
        });
    }, settings.giveawayRefreshTime * 1000);
});

//unmuter
client.on("ready", () => {
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    delete require.cache[require.resolve("./settings.json")], settings;
    setInterval(function () {
        const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[0]);
        let settings = require("./settings.json");
        const guild = client.guilds.cache.get('586972740695883790');
        let muterole = guild.roles.cache.find(role => role.id === settings.muteRole);
        if (!muterole) return client.channels.cache.get(settings.punishmentChannel).send(localization.mute_role_not_found);
        let currentTime = functions.today2() + " " + functions.time();
        const embed = new Discord.MessageEmbed().setColor("ORANGE");
        connection.query(`SELECT * FROM mutes WHERE mutedUntil<'${currentTime}'`, function (err, result) {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                let user = guild.members.cache.get(result[i].mutedPersonID);
                embed.setTitle(localization.mute_success_unmute).setDescription(localization.mute_muted_by2 + result[i].muteBy + localization.mute_because2 + result[i].muteReason + localization.mute_hope2).setFooter(localization.mute_automatic).setTimestamp();
                connection.query(`DELETE FROM mutes WHERE mutedPersonID = '${result[i].mutedPersonID}'`, function (err, result) {
                    if (err) throw err;
                    if (!user) {
                        return;
                    } else {
                        user.roles.remove(muterole);
                        user.send(embed);
                    }
                    return;
                });
            }
            return;
        });
    }, settings.muteRefreshTime * 1000);
    return;
});

//unbanner
client.on("ready", () => {
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    delete require.cache[require.resolve("./settings.json")], settings;
    setInterval(function () {
        const guild = client.guilds.cache.get('586972740695883790');
        let currentTime = functions.today2() + " " + functions.time();
        connection.query(`SELECT * FROM bans WHERE bannedUntil<'${currentTime}'`, function (err, result) {
            if (err) throw err;
            if (result.length === 0) return;
            for (let i = 0; i < result.length; i++) {
                connection.query(`DELETE FROM bans WHERE bannedPersonID = '${result[i].bannedPersonID}'`, function (err, result2) {
                    if (err) throw err;
                    if (result[i].isBanned === 0) {
                        return;
                    } else {
                        guild.fetchBans().then(bans => {
                            let bUser = bans.find(b => b.user.id == result[i].bannedPersonID);
                            guild.members.unban(bUser.user);
                            return;
                        });
                    }
                });
            }
            return;
        });
    }, settings.banRefreshTime * 1000);
    return;
});

//checker if person is not muted, and tries to pass security
client.on("guildMemberAdd", function (user) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[0]);
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    const guild = client.guilds.cache.get('586972740695883790');
    let muterole = guild.roles.cache.find(role => role.id === settings.muteRole);
    if (!muterole) return client.channels.cache.get(settings.punishmentChannel).send(localization.mute_role_not_found);
    connection.query(`SELECT * FROM mutes WHERE mutedPersonID = '${user.id}'`, function (err, result) {
        if (err) throw (err);
        if (result.length === 0) {
            return;
        } else {
            let userJoined = guild.members.cache.get(result[0].mutedPersonID);
            userJoined.roles.add(muterole.id)
        }
    });
});

//checker if person has not been banned and left before ban
client.on("guildMemberAdd", function (user) {
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    connection.query(`SELECT * FROM bans WHERE bannedPersonID = '${user.id}'`, function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            return;
        } else {
            user.ban({ reason: result[0].reason });
            connection.query(`UPDATE bans SET isBanned = true WHERE bannedPersonID = ${user.id}`, function (err, result) {
                if (err) throw err;
                return;
            });
        }
    });
})
client.on('messageDelete', async message => {
    if (!message.guild) return;
    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
    });
    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);
    const { executor, target } = deletionLog;
    var today = new Date();
    var time = today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ":" + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
    fs.appendFileSync("./logs/deletedMessages.txt", "[" + today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + ": " + time + "] A message by " + message.author.username + " (id: " + message.author.id + ") was deleted by " + executor.username + " (" + executor.id + ") and message content was " + message.content + "\n");

});
client.on('messageDeleteBulk', message => {
    if (!message.guild) return;
    var today = new Date();
    var time = today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ":" + today.getSeconds();
    fs.appendFileSync("./logs/deletedMessages.txt", "[" + today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + ": " + time + "] " + "There was used bulkDelete and removed was " + message.size + " messages.\n")
});

//Updates informations about user in database every message
client.on("message", async message => {
    if (!message.guild) return;
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    delete require.cache[require.resolve("./settings.json")], settings;
    let avatar = message.author.avatarURL();
    let quot = "\'";
    if (!avatar) {
        avatar = null;
    } else {
        avatar = quot + message.author.avatarURL() + quot;
    }
    //"CREATE TABLE Users (id VARCHAR(18) PRIMARY KEY, username VARCHAR(32), discriminator VARCHAR(4), avatarURL VARCHAR(255), creationDate DATE, joinDate DATE, isOnServer BOOLEAN)";
    let insertValues = [message.author.id, message.author.username, message.author.discriminator, avatar, functions.formatDate(message.member.user.createdAt), functions.formatDate(message.member.joinedAt), true];
    connection.query(`SELECT * FROM Users WHERE id = '${message.author.id}'`, function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            connection.query("INSERT INTO Users (id, username, discriminator, avatarURL, creationDate, joinDate, isOnServer) VALUES (?)", [insertValues], function (err, result) {
                if (err) throw err;
                return;
            });
            return;
        } else {
            connection.query(`UPDATE Users SET id = '${message.author.id}', username = '${message.author.username}', discriminator = '${message.author.discriminator}', avatarURL = ${avatar}, creationDate = '${functions.formatDate(message.member.user.createdAt)}', joinDate = '${functions.formatDate(message.member.joinedAt)}', isOnServer = true WHERE id = '${message.author.id}'`, [insertValues], function (err, result) {
                if (err) throw err;
                return;
            });
            return;
        }
    });
    return;
});

//Collects information about user who joined a server
client.on("guildMemberAdd", function (user) {
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    delete require.cache[require.resolve("./settings.json")], settings;
    connection.connect(function (err) {
        if (err) throw err;
        let avatar = user.user.avatarURL();
        if (!avatar) {
            avatar = null;
        } else {
            avatar = user.user.avatarURL();
        }
        //"CREATE TABLE Users (id VARCHAR(18) PRIMARY KEY, username VARCHAR(32), discriminator VARCHAR(4), avatarURL VARCHAR(255), creationDate DATE, joinDate DATE, isOnServer BOOLEAN)";
        let insertValues = [user.user.id, user.user.username, user.user.discriminator, avatar, functions.formatDate(user.user.createdAt), functions.formatDate(user.joinedAt), true];
        connection.query(`SELECT * FROM Users WHERE id = '${user.user.id}'`, function (err, result) {
            if (err) throw err;
            if (result.length === 0) {
                connection.query("INSERT INTO Users (id, username, discriminator, avatarURL, creationDate, joinDate, isOnServer) VALUES (?)", [insertValues], function (err, result) {
                    if (err) throw err;
                });
                return;
            } else {
                connection.query(`UPDATE Users SET id = '${user.user.id}', username = '${user.user.username}', discriminator = '${user.user.discriminator}', avatarURL = ${avatar}, creationDate = '${functions.formatDate(user.user.createdAt)}', joinDate = '${functions.formatDate(user.joinedAt)}', isOnServer = true WHERE id = '${user.user.id}'`, [insertValues], function (err, result) {
                    if (err) throw err;
                });
                return;
            }
        });
    });
});

//Updates informations about user who left server
client.on("guildMemberRemove", function (user) {
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    delete require.cache[require.resolve("./settings.json")], settings;
    connection.connect(function (err) {
        if (err) throw err;
        let avatar = user.user.avatarURL()
        let quot = "\'";
        if (!avatar) {
            avatar = null;
        } else {
            avatar = quot + user.user.avatarURL() + quot;
        }
        //CREATE TABLE Users (id VARCHAR(18) PRIMARY KEY, username VARCHAR(32), discriminator VARCHAR(4), avatarURL VARCHAR(255), creationDate DATE(), joinDate DATE(), isOnServer BOOLEAN);
        connection.query(`SELECT * FROM Users WHERE id = '${user.user.id}'`, function (err, result) {
            if (err) throw err;
            let insertValues = [user.user.id, user.user.username, user.user.discriminator, avatar, functions.formatDate(user.user.createdAt), functions.formatDate(user.joinedAt), false]
            connection.query(`UPDATE Users SET id = '${user.user.id}', username = '${user.user.username}', discriminator = '${user.user.discriminator}', avatarURL = ${avatar}, creationDate = '${functions.formatDate(user.user.createdAt)}', joinDate = '${functions.formatDate(user.joinedAt)}', isOnServer = false WHERE id = '${user.user.id}'`, [insertValues], function (err, result) {
                if (err) throw err;
                return;
            });
        });
    });
});

//Message counter
client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    let settings = require("./settings.json");
    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    delete require.cache[require.resolve("./settings.json")], settings;
    let date = new Date();
    let columnName = functions.createMysqlTable((date.getMonth() + 1)) + date.getFullYear();
    connection.query("SHOW COLUMNS FROM messages", function (err, result) {
        if (err) throw err;
        let bulion = false;
        for (let i = 0; i < result.length; i++) {
            if (result[i].Field === columnName) {
                bulion = true;
                return;
            }
        }
        if (bulion === false) {
            connection.query("ALTER TABLE messages ADD COLUMN " + columnName + " INT DEFAULT 0", function (err, result) {
                if (err) console.error(err);
                return;
            });
        }
        return;
    });
    connection.query(`SELECT * FROM Messages WHERE id = '${message.author.id}'`, function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            let insertValues = [message.author.id, 1, 1]
            connection.query(`INSERT INTO Messages (id, allMessages, ${columnName}) VALUES (?)`, [insertValues], function (err, result) {
                if (err) throw err;
                return;
            });
            return;
        } else {
            let messageCount = 1;
            if (isNaN((result[0][functions.createMysqlTable((date.getMonth() + 1)) + date.getFullYear()]))) {
                messageCount = 1;
            } else {
                messageCount = (result[0][functions.createMysqlTable((date.getMonth() + 1)) + date.getFullYear()]) + 1;

            }
            let allMessagesCount = (result[0].allMessages) + 1;
            connection.query(`UPDATE Messages SET allMessages = ${allMessagesCount}, ${columnName} = ${messageCount} WHERE id = '${message.author.id}'`, function (err, result) {
                if (err) throw err;
                return;
            });
            return;
        }
    });
    return;
});

client.on("message", async message => {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[0]);
    const settings = require("./settings.json");
    const prefix = settings.prefix;
    if (message.content.toLowerCase() === "good bot") return message.channel.send(localization.beep_boop);
    if (message.author.bot) return;
    if (message.author.id === "294492604123316224" && message.content.toLowerCase() === "już jestem") return message.channel.send(localization.i_am_online1);
    if (message.author.id === "347066433806794763" && message.content.toLowerCase() === "już jestem") return message.channel.send(localization.i_am_online2);
    if (!message.guild) return message.channel.send(localization.only_discord_servers);
    if (!message.content.startsWith(prefix)) return;

    let connection = mysql.createConnection({
        host: settings.mySQLhost,
        user: settings.mySQLuser,
        database: "xskyblock database"
    });
    let CanIuseBot = true;
    const wrongowner = new Discord.MessageEmbed()
        .setDescription(localization.wrong_user)
        .setColor('#0099ff');
    connection.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, function (err, result) {
        if (err) throw err;
        //zebranie informacji o permisji komendy
        const cmd = client.commands.get(message.content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase()) || client.commands.get(client.aliases.get(message.content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase()));
        if (!cmd) return;
        if (result[0].permissions === 0) return message.channel.send(wrongowner);
        if (!result) return message.channel.send(localization.e404);
        if ((!cmd.permission && result[0] < cmd.permission) || result[0].permissions < cmd.permission) CanIuseBot = false;
        if (CanIuseBot === false) {
            return message.channel.send(wrongowner.setDescription(localization.not_enough_permission));
        } else {
            if (!message.member) message.member = message.guild.fetchMember(message);
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            if (cmd.length === 0) return;
            let command = client.commands.get(cmd);
            if (!command) command = client.commands.get(client.aliases.get(cmd));
            if (command) command.run(client, message, args);
        }
    });
});

client.on("message", async message => {
    var today = new Date();
    var time = today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ":" + today.getSeconds();
    fs.appendFileSync(`./logs/` + functions.formatDate() + ".txt", "[" + today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + ": " + time + "] " + message.author.username + " was in channel " + message.channel.name + " and wrote " + message.content + "\n");
});

client.login(process.env.TOKEN);