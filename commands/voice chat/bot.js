const ytdl = require("ytdl-core");
const queue = new Map();
const fs = require("fs");
module.exports = {
        name: "bot",
        aliases: [],
        category : "voice chat",
        description: "plays/skips/stops music in voice channel",
        usage: "<play/stop/skip> <link to youtube>",
        permission: 5,
        run: async (client, message, args) => {
            const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
            const serverQueue = queue.get(message.guild.id);
            if (args.length<2) return message.channel.send(localization.bot_more_arguments)
            if (args.length>2 )if (!args[1].startsWith("https://www.youtube.com/watch")) return message.channel.send(localization.bot_only_youtube)
            if (args[0].toLowerCase()==="play") {
                execute(message, serverQueue);
                return;
            } else if (args[0].toLowerCase()==="skip") {
                skip(message, serverQueue);
                return;
            } else if (args[0].toLowerCase()==="stop") {
                stop(message, serverQueue);
                return;
            } else {
                message.channel.send(localization.bot_invalid_argument);
        }
    }
}

async function execute(message, serverQueue) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(localization.bot_you_need_to_join_channel);
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(localization.bot_no_permission);
    }
    const songInfo = await ytdl.getInfo(args[2]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`**${song.title}**`+ localization.bot_success_add);
    }
}

function skip(message, serverQueue) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    if (!message.member.voice.channel)
        return message.channel.send(localization.bot_failed_to_stop);
    if (!serverQueue)
        return message.channel.send(localization.bot_nothing_to_skip);
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    if (!message.member.voice.channel)
        return message.channel.send(localization.bot_failed_to_stop);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const localization = require(fs.readFileSync("./language/language.txt").toString().split("\n")[1]);
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(localization.bot_started_playing+`**${song.title}**`);
}