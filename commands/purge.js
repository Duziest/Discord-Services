const Discord = require("discord.js");
const prefix = "+";
module.exports.run = async (bot, message, args) => {
  if(!message.content.startsWith(prefix)) return ;
  message.delete();
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have enough permissions to run this command.");
  if(!args[0]) return message.channel.send("Specify an amount of messages to clear.");
  message.channel.bulkDelete(args[0]).then(() => {
  message.channel.send(`Purged ${args[0]} messages.`).then(msg => msg.delete(2000));
});

}

module.exports.help = {
  name: "purge"
}
