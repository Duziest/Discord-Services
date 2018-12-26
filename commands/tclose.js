const Discord = require("discord.js")
const botconfig = require("../botsettings.json")



module.exports.run = async (bot, message, args) => {

  let noEmbed = new Discord.RichEmbed()
  .setColor("#E00808")
  .setDescription(`You can't use the close command outside of a ticket channel.`)
  .setFooter(`${botconfig.name}`)

  let confEmbed = new Discord.RichEmbed()
  .setColor("#FFFFFF")
  .setDescription(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`${botconfig.prefix}confirm\`. This will time out in 10 seconds and be cancelled.`)
  .setFooter(`${botconfig.name}`)

  let timeOutEmbed = new Discord.RichEmbed()
  .setColor("#E00808")
  .setDescription(`Ticket close timed out, the ticket was not closed.`)
  .setFooter(`${botconfig.name}`)

    let channelName = message.channel.name
    if (!channelName.startsWith(`ticket-`)) return message.channel.send(noEmbed);
    message.channel.send(confEmbed)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === `${botconfig.prefix}confirm`, {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit(timeOutEmbed).then(m2 => {
          }, 15000);
        });
    });
    

}


module.exports.help = {
	name: "close"
}