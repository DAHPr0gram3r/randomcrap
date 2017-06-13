const Discord = require("discord.js");
const fs = require("fs");
const _ = require("underscore");
const client = new Discord.Client();


var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
var prefix = config["prefix"];
var blacklist = config["blacklist"]
var newConfig = undefined;
var victim = undefined;


function reloadConfig(){

  config = JSON.parse(fs.readFileSync("./config.json", "utf8"))
  prefix = config["prefix"]

}


client.login("MzI0MTk4MzE2MjQzOTQzNDI3.DCGhHA.UbWNpoboKEIaAo5fojJ08quqSkw");

client.on("ready", () => {
  console.log("I am ready!");
  console.log("Current prefix is: " + prefix);
});

client.on("message", (message) => {
  if (message.author.bot) return;
  // Moderator commands
  if (!message.content.startsWith(prefix)) {
    let muteRole = message.guild.roles.find("name", "Muted")
    let msg = message.content.toLowerCase().split(" ")
    if (blacklist.some(word => ~msg.indexOf(word.toLowerCase())) ) {
      message.member.addRole(muteRole);
      message.channel.send(message.member.displayName + " has been muted for using a blacklisted word");
      console.log(message.member.displayName + " has been muted for using blacklisted word")
    }
    else if (!blacklist.some(word => ~msg.indexOf(word.toLowerCase()))) {
      console.log("Non command issued: " + message);
      return;
    }

  }
  let
  if (message.content.startsWith(prefix = "blacklistadd")) {
    let modRole = message.guild.roles.find("name", "Moderator")
    let args = message.content.split(" ").slice(1)
    if (!message.member.roles.has(modRole)){
      message.channel.send("Insufficient Permissions.")
    }
    else if (args[0] === undefined){
      message.channel.send("argument missing, use command like this: " + prefix + "blacklistadd [Word to add to blacklist]" )

    }
    else{
      blacklist.push(args[0])

      newConfig = {
        "prefix": prefix,
        "blacklist": blacklist
      }
      fs.writeFile("./config.json", JSON.stringify(newConfig), (err) => {
        if (err) console.error(err)
      });

    }
  }
    if (message.content.startsWith(prefix + "setprefix")){
      let modRole = message.guild.roles.find("name", "Moderator")
      let args = message.content.split(" ").slice(1)
      if (!message.member.roles.has(modRole)){
        message.channel.send("Insufficient Permissions.")
      }
      else if (args[0] === undefined) {
        message.channel.send("Argument missing, use command like this: " + prefix + "setprefix [Symbol you want the prefix to be]")
      }
      else {
        prefix = args[0]

        newConfig = {
          "prefix": prefix,
          "blacklist": blacklist
        }
        fs.writeFile("./config.json", JSON.stringify(newConfig), (err) => {
          if (err) console.error(err)
        });
      }
    }



  if (message.content.startsWith(prefix + "reloadconfig")){
    let modRole = message.guild.roles.find("name", "Moderator")
    if (!message.member.roles.has(modRole)){
      message.channel.send("Insufficient Permissions.")
    }
    else{
      reloadConfig();
      message.channel.send("Configs Reloaded successfully");
      message.channel.send("Current prefix is: " + prefix);
    }
  }

  if (message.content.startsWith(prefix + "mute")){
    let modRole = message.guild.roles.find("name", "Moderator")
    let muteRole = message.guild.roles.find("name", "Muted")
    let args = message.content.split(" ").slice(1)
    victim = message.mentions.members.first();
    if (!message.member.roles.has(modRole)){
      message.channel.send("Insufficient Permissions.")
    }
    else if (message.mentions.members.size < 1) {
      message.channel.send("Argument missing, use command like this: " + prefix + "mute [mention person you wish to mute]")
    }
    else {
      victim.addRole(muteRole);
      console.log(victim + " has been muted")
    }
  }

  if (message.content.startsWith(prefix + "unmute")){
    let modRole = message.guild.roles.find("name", "Moderator")
    let muteRole = message.guild.roles.find("name", "Muted")
    let args = message.content.split(" ").slice(1)
    if (!message.member.roles.has(modRole)){
      message.channel.send("Insufficient Permissions.")
    }
    else if (message.mentions.members.size < 1) {
      message.channel.send("Argument missing, use command like this: " + prefix + "unmute [mention person you wish to unmute]")
    }
    else {
      c
      victim.removeRole(muteRole);
      console.log(victim + " has been unuted")
    }
  }


//non moderator commands
  if (message.content.startsWith(prefix + "ping")) {
    message.channel.send("pong!");
  }

  if (message.content.startsWith(prefix + "help")){

    message.author.send("This is a list of all commands that are curretly usable:")
    message.author.send(prefix + "help (Shows this prompt)")
    message.author.send(prefix + "ping (Makes me say pong)")
    message.author.send("That is all the non moderator commands use '" + prefix + "modhelp' for the moderator commands")
  }

  if (message.content.startsWith(prefix + "modhelp")){

    message.author.send("This is a list of all moderator commands that are curretly usable:")
    message.author.send(prefix + "modhelp (Shows this prompt)")
    message.author.send(prefix + "setprefix [Symbol you wish to use] (Makes me say pong)")
    message.author.send(prefix + "reloadconfig (reloads config files)")
    message.author.send(prefix + "blacklistadd [word you wish to add to blacklist] (adds a word to blacklist)")
    message.author.send(prefix + "mute [mention person you wish to mute] (mutes said person)")
    message.author.send(prefix + "unmute [mention person you wish to unmute] (unmutes said person)")
    message.author.send("That is all the moderator commands use '" + prefix + "help' for the non moderator commands")
  }
});
