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

class IllegalCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "illegal",
            group: "imageshit",
            memberName: "illegal",
            description: "***President Trump's First Order.*** This command only has a text parameter.",
            examples: ["`!illegal <text>`", "`!illegal anime is now illegal`"]
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

        if(args.length > 0 && args.length <= 135)
        {
            var file = shortid.generate() + ".png";
            
                Jimp.read("trump.JPG").then(function (trumpImage) {
                    Jimp.loadFont("Arial_24.fnt").then(function (font) {
                        var textWidth = 200;
                        var textHeight = 170;
                        var textRot = 7;
                        var textX = 400;
                        var textY = 250;

                        var textImage = new Jimp(textWidth, textHeight);
                        textImage.print(font, 0, 0, args.toString(), textWidth);
                        textImage.rotate(textRot);

                        trumpImage.composite(textImage, textX, textY).write(file, function(error){  
                            if(error) {message.channel.stopTyping(); console.log(error); return;};
                        message.channel.send("***Trump's First Order***", {
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
                            });
                    });
                 }).catch(function (err) {
                    console.log(err.message);
                    message.channel.stopTyping();
                });
        }
        else
        {
            if(args.length > 0)
             message.channel.send("<@" + message.author.id + "> Character limit for the text parameter is 135 characters, use `" + commandPrefix + "help illegal` for help.").catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
            else
             message.channel.send("<@" + message.author.id + "> Text not given, use `" + commandPrefix + "help illegal` for help.").catch(error => {console.log("Send Error - " + error); message.channel.stopTyping();});
            message.channel.stopTyping();
        }
    }
}

module.exports = IllegalCommand;