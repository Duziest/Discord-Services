const Discord = require("discord.js");
const botConfig=require("../botsettings.json");

module.exports.run = async (bot, message, args) => {
    let umUser = message.mentions.members.first();
    if(!umUser) message.reply("I can't find that user");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the permission to do this.");
    let umReason = args.join(" ").slice(22) || "None";
    let muteRole = message.guild.roles.find(c => c.name === "Muted");
    if(!umUser.roles.has(muteRole.id)) return message.reply("the user is not muted.");
    let umIcon = umUser.user.displayAvatarURL;

    let umEmbed = new Discord.RichEmbed()
    .setColor(botConfig.Red)
    .setThumbnail(umIcon)
    .setTimestamp()
    .addField("User unmuted", `${umUser} with ID ${umUser.id}`)
    .addField("Unmuted by", `<@${message.author.id}> at ${message.createdAt.toLocaleString()}`)
    .addField("Reason for unmute", umReason);

    let logChannel = message.guild.channels.find(c => c.name === "logs");
    if (!logChannel) return message.channel.send("Couldn't find #logs channel!");

    message.delete().catch(O_o=>{});
    umUser.removeRole(muteRole.id);
    logChannel.send(umEmbed);
}

module.exports.help = {
    name: "unmute"
}