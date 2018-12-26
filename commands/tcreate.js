const Discord = require("discord.js")
const botconfig = require("../botsettings.json")

module.exports.run = async (bot, message, args) => {

    let mRoleEmbed = new Discord.RichEmbed()
    .setColor("#e00808")
    .setTimestamp()
    .setDescription(`Hey! Your server doesn't have a 'Support Team' role! Please create one with that name exactly.`)
    .setFooter(`${botconfig.name}`)
	
	let mCreateEmbed = new Discord.RichEmbed()
	.setColor("#34DB34")
    .setDescription(`:white_check_mark: Your ticket has been created!`)
    .setTimestamp()
	.setFooter(`${botconfig.name}`)

    message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
       message.channel.send(mCreateEmbed);
        let role = message.guild.roles.find("name", "Support Team");
        let role2 = message.guild.roles.find("name", "@everyone");
        if(!role) return message.channel.send(mRoleEmbed)

        if(args[0]) {
            let messageArray = message.content.split(" ")
            for(x = 1; x < messageArray.length; x++) {
                let string = messageArray[x]
                let id = string.slice(2,-1)
                let role = message.guild.roles.find("id", id);
                let user = message.guild.members.find("id", id)
        
                if(role) {
                    c.overwritePermissions(role, {
                        SEND_MESSAGES: true,
                        READ_MESSAGES: true
                    })
                } else if (user) {
                    console.log(user)
                    c.overwritePermissions(user, {
                        SEND_MESSAGES: true,
                        READ_MESSAGES: true
                    })
                }
        
           }

        }


        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });

        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });

        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        
        const embed = new Discord.RichEmbed()
        .setColor("#3498DB")
        .addField(`Hello ${message.author.username}!`, `\n\nThank you for opening a ticket!\nOur team will be here shortly.\n\nKind Regards, \n\ **~ ${botconfig.name}**`)
        .setTimestamp()
        .setFooter(`${botconfig.name}`)
        c.send({ embed: embed });
    })

    
}

module.exports.help = {
	name: "new"
}