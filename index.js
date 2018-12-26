const antispam = require("discord-anti-spam");
const Discord = require("discord.js");
const fs = require("fs");
const botSettings = require("./botSettings.json")
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();
const bot = new Discord.Client({disableEveryone: true})
bot.commands = new Discord.Collection();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube("AIzaSyAfIu0OjJtPz4-lpYtR-zTYvipNcnMist4");
const queue = new Map();
var opusscript = require("opusscript");
var servers = {};
var prefix = "+";
const lblue = "#ADD8E6";
//const ms = require("ms");

fs.readdir("./commands/", (err, files) => {
    
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0){
        console.log("Couldn't find any commands.");
        return;
    }

    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        client.commands.set(props.help.name, props)
    });
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botSettings.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

})

client.on("message", async message => {
	var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;

  
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
 let cmd = messageArray[0];
	switch (args[0].toLowerCase()) {
		case "say":
if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You're not an admin!");
await message.delete();
let embed = new Discord.RichEmbed()
.setDescription(args.join(" ").slice(3))
.setColor("#FFFFF");

message.channel.send(embed);
break; 
case "help":
let helpEmbed = new Discord.RichEmbed()
.addField("**Commands**",
"** **")
.addField(`+say [message]`, "Have the bot say something using RichEmbed.")
.addField("+announce [announce_title]", "Sends an announcement to a channel called #announcements using RichEmbed.")
.addField("+help", "Displays this message.")
.addField("+purge", "Delete several messages at once.")
.addField("+mute", "Mute a user.")
.addField("+tempmute", "Temporally mute a user.")
.addField("+unmute", "Unmute a user.")
.addField("+bot", "Displays some info about the bot.")
.addField("**Music Commands**",
"** **")
.addField("+play [yt_search]", "Search and play audio from YouTube.")
.addField("+pause", "Pause currently playing audio.")
.addField("+resume", "Resume paused audio.")
.addField("+stop", "Stop all audio and end queue.")
.addField("+queue", "Displays all songs in the queue.")
.addField("+skip", "Skip currently playing audio.")
.addField("+nowplaying", "Displays the title of the current song.")
.addField("+volume [int]", "Set audio volume.")
.addField("**Ticket Commands**",
"** **")
.addField("+new", "Create a ticket for support.")
.addField("+close", "Close an open ticket.")
.setColor("#ADD8E6")
.setFooter(`Coded by Duziest#5104 | ${botSettings.name}`);
message.channel.send(helpEmbed);
break; 
case "bot":
let botEmbed = new Discord.RichEmbed()
.addField("**Info**",
"** **")
.addField(`Description`, "A multipurpose bot that does music, tickets, announcement and say commands.")
.addField("Bot Invite Link", "https://discordapp.com/oauth2/authorize?client_id=526807055722610688&permissions=8&scope=bot")
.addField("Support Server", "https://discord.gg/wtjsBcq")
.setColor("#ADD8E6")
.setFooter(`Coded by Duziest#5104 | ${botSettings.name}`);
message.channel.send(botEmbed);
break;
    case "announce":
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You're not an admin!");
let mAuth = message.author.username;
let mIcon = message.author.iconURL;
let mDiscrim = message.author.discriminator;
        let aTitle = args.join(" ").slice(8);
message.channel.send("Setting up...");
await message.delete();
const filter = m => m.author.id === message.author.id;
message.channel.send(`The title of your announcement will be: **${aTitle}**. Your next message should be the content of your announcement. Send "cancel" at any time to cancel your announcement.`).then(q => q.delete(15000))
message.channel.awaitMessages(filter, {
max: 2,
time: 300000
}).then(collected => {
collected.delete(15000);
if (collected.first().content === 'cancel') {
  return message.reply("Canceled.");
}
let appealContent = collected.first().content;
message.delete();
 message.delete();
let appealsChannel = message.guild.channels.find(`name`, "announcements");

let appealEmbed = new Discord.RichEmbed()
.setTitle(aTitle)
.setDescription(collected.first().content)
.setFooter(`Announcement by ${message.member.user.username} | ${message.createdAt.toLocaleString()}`)
.setColor("#ADD8E6")    
.setThumbnail(mIcon);
 
appealsChannel.send(appealEmbed);

}).catch(err => {
message.reply("Cancelled...").then(r => r.delete(5000));
console.log("Time exceeded. Message await cancelled.");
});

break;
case "devleave":
    if(!message.member.id === "516827401385410561") return message.channel.send("no");
await message.channel.send("Leaving. Bye!");
message.guild.leave();
break;
}
});
client.on("message", async message => {
	var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
	
  var searchString = args.slice(1).join(' ');
	var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	var serverQueue = queue.get(message.guild.id);
    switch (args[0].toLowerCase()) {
      case "play":
    var voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		var permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
			var videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				var video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					var index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					var videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
        break;
      case "skip":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
        break;
      case "stop":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
break;
      case "volume":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return message.channel.send(`I set the volume to: **${args[1]}**`);
break;
      case "nowplaying":
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
break;
      case "queue":
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
break;
      case "pause":
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
		return message.channel.send('There is nothing playing.');
break;
      case "resume":
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	

	return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
	var serverQueue = queue.get(message.guild.id);
	console.log(video);
	var song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		var queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}
  function play(guild, song) {
	var serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
      message.channel.send('``The queue of songs has ended.``');
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}
  
  if(message.author.client) return;
  if(message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(client,message,args);
	 
});

client.on("ready", async () => {
	console.log(`${client.user.username} is online on ${client.guilds.size} servers!`);
	client.user.setActivity(`${botSettings.prefix}help | ${botSettings.name}`, {type: "WATCHING"});
  });

client.login(botSettings.token);