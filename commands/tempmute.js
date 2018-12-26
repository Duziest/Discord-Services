const Discord = require("discord.js");
const botconfig=require("../botsettings.json");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!toMute) return message.reply("Couldn't find user.");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the permission to do this.");
    if(toMute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
    let muteRole = message.guild.roles.find(c => c.name === "Muted");
    let mIcon = toMute.user.displayAvatarURL;

    //Start of create role
    if(!muteRole){
        try{
            muteRole = await message.guild.createRole({
                name: "Muted",
                color: "#444444",
                permissions:[]
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        }catch(e){
            console.log(e.stack)
        }
    }
    //End of create role
    let muteTime = args[1];
    if(!muteTime) return message.reply("You didn't specify a time!");

    await(toMute.addRole(muteRole.id));
    let tempEmbed = new Discord.RichEmbed()
    .setColor(botconfig.Red)
    .setThumbnail(mIcon)
    .setTimestamp()
    .addField("Muted user", `${toMute} with ID ${toMute.id}`)
    .addField("Muted by", `<@${message.author.id}>`)
    .addField("Muted for", `${ms(ms(muteTime))}`);

    let logChannel = message.guild.channels.find(c => c.name === "logs");
    if(!logChannel) return message.channel.send("Couldn't find logs channel!")

    message.delete().catch(O_o=>{});
    logChannel.send(tempEmbed);

    setTimeout(function(){
        toMute.removeRole(muteRole.id);
        let tempunEmbed = new Discord.RichEmbed()
        .setColor(botconfig.Purple)
        .setThumbnail(mIcon)
        .addField("User unmuted", `${toMute}`)
        .addField("Muted for", `${ms(ms(muteTime))}`)

        logChannel.send(tempunEmbed)
    }, ms(muteTime));
}

module.exports.help = {
    name: "tempmute"
}