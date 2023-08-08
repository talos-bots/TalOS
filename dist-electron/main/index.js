"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_os = require("node:os");
const node_path = require("node:path");
const path = require("path");
const electronUpdater = require("electron-updater");
const discord_js = require("discord.js");
const PouchDB = require("pouchdb");
const Store = require("electron-store");
const fs = require("fs");
function update(win2) {
  electronUpdater.autoUpdater.autoDownload = false;
  electronUpdater.autoUpdater.disableWebInstaller = false;
  electronUpdater.autoUpdater.allowDowngrade = false;
  electronUpdater.autoUpdater.on("checking-for-update", function() {
  });
  electronUpdater.autoUpdater.on("update-available", (arg) => {
    win2.webContents.send("update-can-available", { update: true, version: electron.app.getVersion(), newVersion: arg == null ? void 0 : arg.version });
  });
  electronUpdater.autoUpdater.on("update-not-available", (arg) => {
    win2.webContents.send("update-can-available", { update: false, version: electron.app.getVersion(), newVersion: arg == null ? void 0 : arg.version });
  });
  electron.ipcMain.handle("check-update", async () => {
    if (!electron.app.isPackaged) {
      const error = new Error("The update feature is only available after the package.");
      return { message: error.message, error };
    }
    try {
      return await electronUpdater.autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      return { message: "Network error", error };
    }
  });
  electron.ipcMain.handle("start-download", (event) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          event.sender.send("update-error", { message: error.message, error });
        } else {
          event.sender.send("download-progress", progressInfo);
        }
      },
      () => {
        event.sender.send("update-downloaded");
      }
    );
  });
  electron.ipcMain.handle("quit-and-install", () => {
    electronUpdater.autoUpdater.quitAndInstall(false, true);
  });
}
function startDownload(callback, complete) {
  electronUpdater.autoUpdater.on("download-progress", (info) => callback(null, info));
  electronUpdater.autoUpdater.on("error", (error) => callback(error, null));
  electronUpdater.autoUpdater.on("update-downloaded", complete);
  electronUpdater.autoUpdater.downloadUpdate();
}
const intents = {
  intents: [
    discord_js.GatewayIntentBits.Guilds,
    discord_js.GatewayIntentBits.GuildMessages,
    discord_js.GatewayIntentBits.MessageContent,
    discord_js.GatewayIntentBits.GuildEmojisAndStickers,
    discord_js.GatewayIntentBits.DirectMessages,
    discord_js.GatewayIntentBits.DirectMessageReactions,
    discord_js.GatewayIntentBits.GuildMessageTyping,
    discord_js.GatewayIntentBits.GuildModeration
  ],
  partials: [discord_js.Partials.Channel, discord_js.Partials.GuildMember, discord_js.Partials.User, discord_js.Partials.Reaction, discord_js.Partials.Message]
};
function DiscordJSRoutes() {
  let disClient = new discord_js.Client(intents);
  const commands = new discord_js.Collection();
  let isReady = false;
  let token = "";
  let applicationID = "";
  electron.ipcMain.on("discord-get-token", async (event) => {
    event.sender.send("discord-get-token-reply", token);
  });
  electron.ipcMain.on("discord-get-application-id", async (event) => {
    event.sender.send("discord-get-application-id-reply", applicationID);
  });
  electron.ipcMain.on("discord-get-commands", async (event) => {
    event.sender.send("discord-get-commands-reply", commands);
  });
  electron.ipcMain.on("discord-get-command", async (event, commandName) => {
    event.sender.send("discord-get-command-reply", commands.get(commandName));
  });
  electron.ipcMain.on("discord-add-command", async (event, commandName, commandFunction) => {
    commands.set(commandName, commandFunction);
    event.sender.send("discord-add-command-reply", commands);
  });
  electron.ipcMain.on("discord-remove-command", async (event, commandName) => {
    commands.delete(commandName);
    event.sender.send("discord-remove-command-reply", commands);
  });
  electron.ipcMain.on("discord-remove-all-commands", async (event) => {
    commands.clear();
    event.sender.send("discord-remove-all-commands-reply", commands);
  });
  electron.ipcMain.on("discord-get-guilds", async (event) => {
    if (!isReady)
      return false;
    const guilds = disClient.guilds.cache.map((guild) => {
      const channels = guild.channels.cache.filter((channel) => channel.type === 0).map((channel) => ({
        id: channel.id,
        name: channel.name
      }));
      return {
        id: guild.id,
        name: guild.name,
        channels
      };
    });
    event.sender.send("discord-get-guilds-reply", guilds);
  });
  disClient.on("messageCreate", async (message) => {
    var _a;
    if (message.author.id === ((_a = disClient.user) == null ? void 0 : _a.id))
      return;
    electron.ipcMain.emit("discord-message", message);
  });
  disClient.on("messageUpdate", async (oldMessage, newMessage) => {
    var _a, _b;
    if (((_a = newMessage.author) == null ? void 0 : _a.id) === ((_b = disClient.user) == null ? void 0 : _b.id))
      return;
    electron.ipcMain.emit("discord-message-update", oldMessage, newMessage);
  });
  disClient.on("messageDelete", async (message) => {
    var _a, _b;
    if (((_a = message.author) == null ? void 0 : _a.id) === ((_b = disClient.user) == null ? void 0 : _b.id))
      return;
    electron.ipcMain.emit("discord-message-delete", message);
  });
  disClient.on("messageReactionAdd", async (reaction, user) => {
    var _a;
    if (user.id === ((_a = disClient.user) == null ? void 0 : _a.id))
      return;
    electron.ipcMain.emit("discord-message-reaction-add", reaction, user);
  });
  disClient.on("messageReactionRemove", async (reaction, user) => {
    var _a;
    if (user.id === ((_a = disClient.user) == null ? void 0 : _a.id))
      return;
    electron.ipcMain.emit("discord-message-reaction-remove", reaction, user);
  });
  disClient.on("messageReactionRemoveAll", async (message) => {
    var _a, _b;
    if (((_a = message.author) == null ? void 0 : _a.id) === ((_b = disClient.user) == null ? void 0 : _b.id))
      return;
    electron.ipcMain.emit("discord-message-reaction-remove-all", message);
  });
  disClient.on("messageReactionRemoveEmoji", async (reaction) => {
    electron.ipcMain.emit("discord-message-reaction-remove-emoji", reaction);
  });
  disClient.on("channelCreate", async (channel) => {
    electron.ipcMain.emit("discord-channel-create", channel);
  });
  disClient.on("channelDelete", async (channel) => {
    electron.ipcMain.emit("discord-channel-delete", channel);
  });
  disClient.on("channelPinsUpdate", async (channel, time) => {
    electron.ipcMain.emit("discord-channel-pins-update", channel, time);
  });
  disClient.on("channelUpdate", async (oldChannel, newChannel) => {
    electron.ipcMain.emit("discord-channel-update", oldChannel, newChannel);
  });
  disClient.on("emojiCreate", async (emoji) => {
    electron.ipcMain.emit("discord-emoji-create", emoji);
  });
  disClient.on("emojiDelete", async (emoji) => {
    electron.ipcMain.emit("discord-emoji-delete", emoji);
  });
  disClient.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    electron.ipcMain.emit("discord-emoji-update", oldEmoji, newEmoji);
  });
  disClient.on("guildBanAdd", async (ban) => {
    electron.ipcMain.emit("discord-guild-ban-add", ban);
  });
  disClient.on("guildBanRemove", async (ban) => {
    electron.ipcMain.emit("discord-guild-ban-remove", ban);
  });
  disClient.on("guildCreate", async (guild) => {
    electron.ipcMain.emit("discord-guild-create", guild);
  });
  disClient.on("guildDelete", async (guild) => {
    electron.ipcMain.emit("discord-guild-delete", guild);
  });
  disClient.on("guildUnavailable", async (guild) => {
    electron.ipcMain.emit("discord-guild-unavailable", guild);
  });
  disClient.on("guildIntegrationsUpdate", async (guild) => {
    electron.ipcMain.emit("discord-guild-integrations-update", guild);
  });
  disClient.on("guildMemberAdd", async (member) => {
    electron.ipcMain.emit("discord-guild-member-add", member);
  });
  disClient.on("guildMemberRemove", async (member) => {
    electron.ipcMain.emit("discord-guild-member-remove", member);
  });
  disClient.on("guildMemberAvailable", async (member) => {
    electron.ipcMain.emit("discord-guild-member-available", member);
  });
  disClient.on("guildMemberUpdate", async (oldMember, newMember) => {
    electron.ipcMain.emit("discord-guild-member-update", oldMember, newMember);
  });
  disClient.on("guildMembersChunk", async (members, guild) => {
    electron.ipcMain.emit("discord-guild-members-chunk", members, guild);
  });
  disClient.on("guildUpdate", async (oldGuild, newGuild) => {
    electron.ipcMain.emit("discord-guild-update", oldGuild, newGuild);
  });
  disClient.on("interactionCreate", async (interaction) => {
    electron.ipcMain.emit("discord-interaction-create", interaction);
  });
  disClient.on("inviteCreate", async (invite) => {
    electron.ipcMain.emit("discord-invite-create", invite);
  });
  disClient.on("inviteDelete", async (invite) => {
    electron.ipcMain.emit("discord-invite-delete", invite);
  });
  disClient.on("presenceUpdate", async (oldPresence, newPresence) => {
    electron.ipcMain.emit("discord-presence-update", oldPresence, newPresence);
  });
  disClient.on("ready", () => {
    if (!disClient.user)
      return;
    isReady = true;
    console.log(`Logged in as ${disClient.user.tag}!`);
    electron.ipcMain.emit("discord-ready", disClient);
  });
  async function setDiscordBotInfo(botName, base64Avatar) {
    if (!isReady)
      return;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return;
    }
    let newName;
    let newNameDot;
    try {
      await disClient.user.setUsername(botName);
      console.log(`My new username is ${botName}`);
    } catch (error) {
      console.error(`Failed to set username to ${botName}:`, error);
      try {
        newName = "_" + botName;
        await disClient.user.setUsername(newName);
        console.log(`My new username is ${newName}`);
      } catch (error2) {
        console.error(`Failed to set username to ${newName}:`, error2);
        try {
          newNameDot = "." + botName;
          await disClient.user.setUsername(newNameDot);
          console.log(`My new username is ${newNameDot}`);
        } catch (error3) {
          console.error(`Failed to set username to ${newNameDot}:`, error3);
        }
      }
    }
    try {
      const buffer = Buffer.from(base64Avatar, "base64");
      await disClient.user.setAvatar(buffer);
      console.log("New avatar set!");
    } catch (error) {
      console.error("Failed to set avatar:", error);
    }
  }
  async function setStatus(message, type) {
    if (!disClient.user)
      return;
    if (!isReady)
      return;
    let activityType;
    switch (type) {
      case "Playing":
        activityType = discord_js.ActivityType.Playing;
        break;
      case "Watching":
        activityType = discord_js.ActivityType.Watching;
        break;
      case "Listening":
        activityType = discord_js.ActivityType.Listening;
        break;
      case "Streaming":
        activityType = discord_js.ActivityType.Streaming;
        break;
      case "Competing":
        activityType = discord_js.ActivityType.Competing;
        break;
      default:
        activityType = discord_js.ActivityType.Playing;
        break;
    }
    disClient.user.setActivity(`${message}`, { type: activityType });
  }
  async function setOnlineMode(type) {
    if (!disClient.user)
      return;
    if (!isReady)
      return;
    disClient.user.setStatus(type);
  }
  async function sendMessage(channelID, message) {
    if (!isReady)
      return;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return;
    }
    const channel = await disClient.channels.fetch(channelID);
    if (channel instanceof discord_js.TextChannel || channel instanceof discord_js.DMChannel || channel instanceof discord_js.NewsChannel) {
      channel.send(message);
    }
  }
  async function getWebhookForCharacter(charName, channelID) {
    if (!isReady)
      return;
    const channel = disClient.channels.cache.get(channelID);
    if (!(channel instanceof discord_js.TextChannel || channel instanceof discord_js.NewsChannel)) {
      return void 0;
    }
    const webhooks = await channel.fetchWebhooks();
    return webhooks.find((webhook) => webhook.name === charName);
  }
  async function sendMessageAsCharacter(charName, channelID, message) {
    if (!isReady)
      return;
    const webhook = await getWebhookForCharacter(charName, channelID);
    if (!webhook) {
      throw new Error(`Webhook for character ${charName} not found.`);
    }
    await webhook.send(message);
  }
  async function getWebhooksForChannel(channelID) {
    if (!isReady)
      return [];
    const channel = disClient.channels.cache.get(channelID);
    if (!(channel instanceof discord_js.TextChannel || channel instanceof discord_js.NewsChannel)) {
      return [];
    }
    const webhooks = await channel.fetchWebhooks();
    return webhooks.map((webhook) => webhook.name);
  }
  electron.ipcMain.handle("discord-login", async (event, rawToken, appId) => {
    await disClient.login(rawToken);
    token = rawToken;
    applicationID = appId;
    return true;
  });
  electron.ipcMain.handle("discord-logout", async (event) => {
    await disClient.destroy();
    disClient.removeAllListeners();
    isReady = false;
    disClient = new discord_js.Client(intents);
    electron.ipcMain.emit("discord-disconnected");
    return true;
  });
  electron.ipcMain.handle("discord-set-bot-info", async (event, botName, base64Avatar) => {
    if (!isReady)
      return false;
    await setDiscordBotInfo(botName, base64Avatar);
    return true;
  });
  electron.ipcMain.handle("discord-set-status", async (event, message, type) => {
    if (!isReady)
      return false;
    await setStatus(message, type);
    return true;
  });
  electron.ipcMain.handle("discord-set-online-mode", async (event, type) => {
    if (!isReady)
      return false;
    await setOnlineMode(type);
    return true;
  });
  electron.ipcMain.handle("discord-send-message", async (event, channelID, message) => {
    if (!isReady)
      return false;
    await sendMessage(channelID, message);
    return true;
  });
  electron.ipcMain.handle("discord-send-message-as-character", async (event, charName, channelID, message) => {
    if (!isReady)
      return false;
    await sendMessageAsCharacter(charName, channelID, message);
    return true;
  });
  electron.ipcMain.on("discord-get-webhooks-for-channel", async (event, channelID) => {
    if (!isReady)
      return false;
    const webhooks = await getWebhooksForChannel(channelID);
    event.sender.send("discord-get-webhooks-for-channel-reply", webhooks);
  });
  electron.ipcMain.on("discord-get-webhook-for-character", async (event, charName, channelID) => {
    if (!isReady)
      return false;
    const webhook = await getWebhookForCharacter(charName, channelID);
    event.sender.send("discord-get-webhook-for-character-reply", webhook);
  });
  electron.ipcMain.on("discord-get-user", async (event) => {
    if (!isReady)
      return false;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return false;
    }
    event.sender.send("discord-get-user-reply", disClient.user);
  });
  electron.ipcMain.on("discord-get-user-id", async (event) => {
    if (!isReady)
      return false;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return false;
    }
    event.sender.send("discord-get-user-id-reply", disClient.user.id);
  });
  electron.ipcMain.on("discord-get-user-username", async (event) => {
    if (!isReady)
      return false;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return false;
    }
    event.sender.send("discord-get-user-username-reply", disClient.user.username);
  });
  electron.ipcMain.on("discord-get-user-avatar", async (event) => {
    if (!isReady)
      return false;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return false;
    }
    event.sender.send("discord-get-user-avatar-reply", disClient.user.avatarURL());
  });
  electron.ipcMain.on("discord-get-user-discriminator", async (event) => {
    if (!isReady)
      return false;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return false;
    }
    event.sender.send("discord-get-user-discriminator-reply", disClient.user.discriminator);
  });
  electron.ipcMain.on("discord-get-user-tag", async (event) => {
    if (!isReady)
      return false;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return false;
    }
    event.sender.send("discord-get-user-tag-reply", disClient.user.tag);
  });
  electron.ipcMain.on("discord-get-user-createdAt", async (event) => {
    if (!isReady)
      return false;
    if (!disClient.user) {
      console.error("Discord client user is not initialized.");
      return false;
    }
    event.sender.send("discord-get-user-createdAt-reply", disClient.user.createdAt);
  });
  electron.ipcMain.on("discord-bot-status", async (event) => {
    event.sender.send("discord-bot-status-reply", isReady);
  });
}
function PouchDBRoutes() {
  let agentDB = new PouchDB("agents", { prefix: dataPath });
  let chatsDB = new PouchDB("chats", { prefix: dataPath });
  let commandDB = new PouchDB("commands", { prefix: dataPath });
  let attachmentDB = new PouchDB("attachments", { prefix: dataPath });
  electron.ipcMain.on("get-agents", (event, arg) => {
    agentDB.allDocs({ include_docs: true }).then((result) => {
      event.sender.send("get-agents-reply", result.rows);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("get-agent", (event, arg) => {
    agentDB.get(arg).then((result) => {
      event.sender.send("get-agent-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("add-agent", (event, arg) => {
    agentDB.put(arg).then((result) => {
      event.sender.send("add-agent-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("update-agent", (event, arg) => {
    agentDB.get(arg._id).then((doc) => {
      let updatedDoc = { ...doc, ...arg };
      agentDB.put(updatedDoc).then((result) => {
        event.sender.send("update-agent-reply", result);
      }).catch((err) => {
        console.error("Error while updating document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("delete-agent", (event, arg) => {
    agentDB.get(arg).then((doc) => {
      agentDB.remove(doc).then((result) => {
        event.sender.send("delete-agent-reply", result);
      }).catch((err) => {
        console.error("Error while deleting document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("get-chats", (event, arg) => {
    chatsDB.allDocs({ include_docs: true }).then((result) => {
      event.sender.send("get-chats-reply", result.rows);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("get-chat", (event, arg) => {
    chatsDB.get(arg).then((result) => {
      event.sender.send("get-chat-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("add-chat", (event, arg) => {
    chatsDB.put(arg).then((result) => {
      event.sender.send("add-chat-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("update-chat", (event, arg) => {
    chatsDB.get(arg._id).then((doc) => {
      let updatedDoc = { ...doc, ...arg };
      chatsDB.put(updatedDoc).then((result) => {
        event.sender.send("update-chat-reply", result);
      }).catch((err) => {
        console.error("Error while updating document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("delete-chat", (event, arg) => {
    chatsDB.get(arg).then((doc) => {
      chatsDB.remove(doc).then((result) => {
        event.sender.send("delete-chat-reply", result);
      }).catch((err) => {
        console.error("Error while deleting document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("get-commands", (event, arg) => {
    commandDB.allDocs({ include_docs: true }).then((result) => {
      event.sender.send("get-commands-reply", result.rows);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("get-command", (event, arg) => {
    commandDB.get(arg).then((result) => {
      event.sender.send("get-command-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("add-command", (event, arg) => {
    commandDB.put(arg).then((result) => {
      event.sender.send("add-command-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("update-command", (event, arg) => {
    commandDB.get(arg._id).then((doc) => {
      let updatedDoc = { ...doc, ...arg };
      commandDB.put(updatedDoc).then((result) => {
        event.sender.send("update-command-reply", result);
      }).catch((err) => {
        console.error("Error while updating document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("delete-command", (event, arg) => {
    commandDB.get(arg).then((doc) => {
      commandDB.remove(doc).then((result) => {
        event.sender.send("delete-command-reply", result);
      }).catch((err) => {
        console.error("Error while deleting document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("get-attachments", (event, arg) => {
    attachmentDB.allDocs({ include_docs: true }).then((result) => {
      event.sender.send("get-attachments-reply", result.rows);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("get-attachment", (event, arg) => {
    attachmentDB.get(arg).then((result) => {
      event.sender.send("get-attachment-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("add-attachment", (event, arg) => {
    attachmentDB.put(arg).then((result) => {
      event.sender.send("add-attachment-reply", result);
    }).catch((err) => {
      console.log(err);
    });
  });
  electron.ipcMain.on("update-attachment", (event, arg) => {
    attachmentDB.get(arg._id).then((doc) => {
      let updatedDoc = { ...doc, ...arg };
      attachmentDB.put(updatedDoc).then((result) => {
        event.sender.send("update-attachment-reply", result);
      }).catch((err) => {
        console.error("Error while updating document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("delete-attachment", (event, arg) => {
    attachmentDB.get(arg).then((doc) => {
      attachmentDB.remove(doc).then((result) => {
        event.sender.send("delete-attachment-reply", result);
      }).catch((err) => {
        console.error("Error while deleting document: ", err);
      });
    }).catch((err) => {
      console.error("Error while getting document: ", err);
    });
  });
  electron.ipcMain.on("clear-data", (event, arg) => {
    agentDB.destroy();
    chatsDB.destroy();
    commandDB.destroy();
    attachmentDB.destroy();
    createDBs();
  });
  function createDBs() {
    agentDB = new PouchDB("agents", { prefix: dataPath });
    chatsDB = new PouchDB("chats", { prefix: dataPath });
    commandDB = new PouchDB("commands", { prefix: dataPath });
    attachmentDB = new PouchDB("attachments", { prefix: dataPath });
  }
  return {
    agentDB,
    chatsDB,
    commandDB,
    attachmentDB
  };
}
function FsAPIRoutes() {
  electron.ipcMain.handle("read-file", async (event, filePath) => {
    try {
      const data = await fs.promises.readFile(filePath, "utf8");
      return data;
    } catch (err) {
      console.error(`Error reading file at ${filePath}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("write-file", async (event, filePath, data) => {
    try {
      await fs.promises.writeFile(filePath, data, "utf8");
      return { success: true };
    } catch (err) {
      console.error(`Error writing to file at ${filePath}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("mkdir", async (event, dirPath) => {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
      return { success: true };
    } catch (err) {
      console.error(`Error creating directory at ${dirPath}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("readdir", async (event, dirPath) => {
    try {
      const files = await fs.promises.readdir(dirPath);
      return files;
    } catch (err) {
      console.error(`Error reading directory at ${dirPath}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("rename", async (event, oldPath, newPath) => {
    try {
      await fs.promises.rename(oldPath, newPath);
      return { success: true };
    } catch (err) {
      console.error(`Error renaming from ${oldPath} to ${newPath}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("unlink", async (event, filePath) => {
    try {
      await fs.promises.unlink(filePath);
      return { success: true };
    } catch (err) {
      console.error(`Error removing file at ${filePath}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("exists", (event, path2) => {
    return fs.existsSync(path2);
  });
  electron.ipcMain.handle("stat", async (event, filePath) => {
    try {
      const stats = await fs.promises.stat(filePath);
      return stats;
    } catch (err) {
      console.error(`Error getting stats for file at ${filePath}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("copy-file", async (event, src, dest, flags) => {
    try {
      await fs.promises.copyFile(src, dest, flags);
      return { success: true };
    } catch (err) {
      console.error(`Error copying file from ${src} to ${dest}:`, err);
      throw err;
    }
  });
  electron.ipcMain.handle("open-file", async (event, path2, flags, mode) => {
    try {
      const fd = await fs.promises.open(path2, flags, mode);
      return fd.fd;
    } catch (err) {
      console.error(`Error opening file at ${path2}:`, err);
      throw err;
    }
  });
}
process.env.DIST_ELECTRON = node_path.join(__dirname, "../");
process.env.DIST = node_path.join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? node_path.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (node_os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
let win = null;
const preload = node_path.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = node_path.join(process.env.DIST, "index.html");
const dataPath = path.join(electron.app.getPath("userData"), "data/");
const store = new Store();
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Main window",
    icon: node_path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    fullscreenable: true,
    frame: true,
    transparent: false,
    autoHideMenuBar: true,
    resizable: true,
    maximizable: true,
    minimizable: false
  });
  if (url) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron.shell.openExternal(url2);
    return { action: "deny" };
  });
  update(win);
}
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
electron.ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new electron.BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
electron.ipcMain.handle("get-data-path", () => {
  return dataPath;
});
electron.ipcMain.on("set-data", (event, arg) => {
  store.set(arg.key, arg.value);
});
electron.ipcMain.on("get-data", (event, arg) => {
  event.sender.send("get-data-reply", store.get(arg));
});
DiscordJSRoutes();
PouchDBRoutes();
FsAPIRoutes();
exports.dataPath = dataPath;
exports.store = store;
//# sourceMappingURL=index.js.map
