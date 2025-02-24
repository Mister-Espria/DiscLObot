// Import Data form config.ts

//Production
import * as ConfigFile from "./config";

//Development
//import * as ConfigFile from "./configdev";

const Discord = require("discord.js");
const bot = new Discord.Client();

// Bot Logs in, Using token provided in config.ts
bot.login(ConfigFile.config.token);

//log in console to show bot is ready!
console.log("Bot Fired Up!");

// Bot subscribes to voiceStateupdate, which is fired every time a user Joins/leaves or Mutes/Unmutes
bot.on("voiceStateUpdate", (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

  // Channel for logging in just plain text. ENTER CHANNEL ID in config.ts
  const channellog = bot.channels.get(ConfigFile.config.channel_log);

  // Channel for only joining, with nice formatted message. ENTER CHANNEL ID in config.ts
  const channeljoin = bot.channels.get(ConfigFile.config.channel_join); // 427146486623633420

  if (oldUserChannel === undefined && newUserChannel !== undefined) {
    // User Joins a voice channel
    if (ConfigFile.config.mute_state_on_join === true) {
      if (newMember.selfMute === true) {
        if (channellog) {
          channellog.send(newMember.displayName + " Is Muted.");
        }
      }
      if (newMember.selfMute === false) {
        // User unmutes himself
        if (channellog) {
          channellog.send(newMember.displayName + " Is Unmuted.");
        }
      }
    }

    if (channellog) {
      channellog.send(
        newMember.displayName + " Joined! Channel: " + newUserChannel.name
      );
    }

    if (ConfigFile.config.receive_join_messages === true) {
      if (ConfigFile.config.message_layout_join === "big") {
        const attachment = new Discord.Attachment(
          "./card_images/approved.png",
          "approved.png"
        );
        const embed = new Discord.RichEmbed()
          .setTitle(newMember.displayName + " Joined A Voicechannel")
          .setAuthor("Room Notifications", newMember.guild.iconURL)
          .setColor(ConfigFile.config.embed_message_color)
          .setDescription(
            "Welcome to the **" + newUserChannel.name + "** Channel.🤔"
          )
          .setFooter("Message was sent on")
          .setImage(newMember.user.displayAvatarURL)
          .attachFile(attachment)
          .setThumbnail("attachment://approved.png")
          .setTimestamp()
          .setURL("https://discordapp.com/")
          .addField(
            newMember.displayName,
            "Enjoy your stay **" + newMember.displayName + "**!"
          );

        channeljoin.send("", { embed });
      }

      if (ConfigFile.config.message_layout_join === "small") {
        const embed = new Discord.RichEmbed()
          .setTitle(newMember.displayName + " Joined A Voicechannel")
          .setAuthor("Room Notifications", newMember.guild.iconURL)
          .setColor(ConfigFile.config.embed_message_color)
          .setDescription(
            "Welcome to the **" + newUserChannel.name + "** Channel.🤔"
          )
          .setFooter("Message was sent on")
          .setThumbnail(newMember.user.displayAvatarURL)
          .setTimestamp()
          .setURL("https://discordapp.com/")
          .addField(
            newMember.displayName,
            "Enjoy your stay **" + newMember.displayName + "**!"
          );

        channeljoin.send("", { embed });
      }
    }
  } else if (newUserChannel === undefined) {
    // User leaves a voice channel or Mutes/ Unmutes
    //Sends Message in Channel log with which user left which channel
    if (channellog) {
      channellog.send(
        newMember.displayName + " Left! Channel: " + oldUserChannel.name
      );
    }
  } else if (oldMember.voiceChannelID !== newMember.voiceChannelID) {
    // user moved from one voice channel to another (old channel ID is different from the new one)
    bot.channels
      .get(ConfigFile.config.channel_log)
      .send(
        `${newMember} moved from voice channel ${oldUserChannel} to ${newUserChannel}`
      );
  } else if (oldMember.voiceChannelID === newMember.voiceChannelID) {
    //user stays in same channel (old channel ID is same as the new one), check if user did mute/unmute
    // User mutes himself

    if (newMember.selfMute === true) {
      if (channellog) {
        channellog.send(newMember.displayName + " Is Muted.");
      }
    }
    if (newMember.selfMute === false) {
      // User unmutes himself
      if (channellog) {
        channellog.send(newMember.displayName + " Is Unmuted.");
      }
    }
  }
});
