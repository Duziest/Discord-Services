const Discord = require("discord.js");
const botConfig=require("../botsettings.json");

module.exports.run = async (bot, message, args) => {
    let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!mUser) message.reply("I can't find that user");
    let mReason = args.join(" ").slice(22) || "None";
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the permission to do this.");
    if(mUser.hasPermission("MANAGE_MESSAGES")) return message.reply("I can't mute that user!");
    let mIcon = mUser.user.displayAvatarURL;
    let muteRole = message.guild.roles.find(c => c.name === "Muted");

    
    if(!muteRole){
        try{
            muteRole = await message.guild.createRole({
                name: "Muted",
                color: "Red",
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
    if(mUser.roles.has(muteRole.id)) return message.reply("The user is already muted.");
    let muteEmbed = new Discord.RichEmbed()
    .setColor(botConfig.Red)
    .setThumbnail(mIcon)
    .setTimestamp()
    .addField("Muted user", `${mUser} with ID ${mUser.id}`)
    .addField("Muted by", `<@${message.author.id}>`)
    .addField("Time", message.createdAt.toLocaleString())
    .addField("Reason", mReason);

    let logChannel = message.guild.channels.find(c => c.name === "logs");
    if (!logChannel) return message.channel.send("Couldn't find logs channel!")

    message.delete().catch(O_o=>{});
    mUser.addRole(muteRole);
    logChannel.send(muteEmbed);
}

module.exports.help = {
    name: "mute"
}