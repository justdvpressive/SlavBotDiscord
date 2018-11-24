const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class LeaveCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "leave",
            group: "audioshit",
            memberName: "leave",
            description: "Make Slav Bot leave a voice channel.",
            examples: ["`!leave`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)

        if(!message.guild.voiceConnection)
        {
            message.channel.send("<@" + message.author.id + "> Slav Bot is not in any Voice Channel.").catch(error => console.log("Send Error - " + error));
        }
        else
        {
            if(message.member.hasPermission("MANAGE_CHANNELS"))
            {
                message.guild.voiceConnection.disconnect()
                .then(() => {
                    message.channel.send("<@" + message.author.id + "> Slav Bot has left the Voice Channel.").catch(error => console.log("Send Error - " + error));
                }).catch(error => message.channel.send("Connection Error - " + error));
            }
            else
            {
                message.channel.send("<@" + message.author.id + "> You need the Manage Channels permission to use this command.").catch(error => console.log("Send Error - " + error));
            }
        }
    }
}

module.exports = LeaveCommand;