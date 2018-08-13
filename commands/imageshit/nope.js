const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
var CommandCounter = require("../../index.js")

class NopeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "nope",
            group: "imageshit",
            memberName: "nope",
            description: "***Nope.*** Use the last image uploaded (required).",
            examples: ["`!nope`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }
        var url = "";
        message.channel.fetchMessages({ around: message.id })
        .then(messages => {
            var messageID = "";
            messages.filter(msg => {
                if(msg.attachments.first() != undefined)
                {
                    if(msg.attachments.last().height > 0)
                    {
                        if(messageID == "")
                        {
                            messageID = msg.id;
                            url = msg.attachments.first().url;
                        }
                    }
                }
            });

            if(messageID == "")
            {
                message.channel.send("<@" + message.author.id + "> No image found, use `" + commandPrefix + "help nope` for help.").catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                message.channel.stopTyping();
                return;
            }
            message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
            Jimp.read("nope.png").then(function (nopeImage) {
                console.log("got image");
                Jimp.read(url).then(function (userImage) {
                    
                    userImage.cover(323, nopeImage.bitmap.height)
                    var canvas = new Jimp(nopeImage.bitmap.width, nopeImage.bitmap.height)
                    var mergedImage = canvas.composite(userImage, 335, 0).composite(nopeImage, 0, 0);
                    var file = shortid.generate() + ".png"
                    mergedImage.write(file, function(error){
                        if(error) {message.channel.stopTyping(); console.log(error); return;};
                        console.log("got merged image");
                        console.log(file);
                        message.channel.send("***Nope***", {
                            files: [file]
                        }).then(function(){
                            message.channel.stopTyping();

                            fs.unlink(file, resultHandler);
                        }).catch(function (err) {
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                            console.log(err.message);
                            message.channel.stopTyping();
                            fs.unlink(file, resultHandler);
                        });
                        console.log("Message Sent");
                    });
                }).catch(function (err) {
                    message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }).catch(function (err) {
                console.log(err.message);
                message.channel.stopTyping();
            });
        }).catch(function (err) {
            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
            console.log(err.message);
            message.channel.stopTyping();
        });
    }
}

module.exports = NopeCommand;
