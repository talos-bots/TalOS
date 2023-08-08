import { ipcMain } from 'electron';
import { ActivityType, Client, GatewayIntentBits, Collection, REST, Routes, Partials, TextChannel, DMChannel, NewsChannel, Snowflake, Webhook } from 'discord.js';

const intents = { 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, GatewayIntentBits.GuildEmojisAndStickers, 
    GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildModeration], 
    partials: [Partials.Channel, Partials.GuildMember, Partials.User, Partials.Reaction, Partials.Message] 
};
type ValidStatus = 'online' | 'dnd' | 'idle' | 'invisible';

function cleanUsername(username: string) {
    // Remove leading characters
    let cleaned = username.replace(/^[._-]+/, '');
  
    // Remove trailing characters
    cleaned = cleaned.replace(/[._-]+$/, '');
  
    return cleaned;
}

function cleanEmoji(text: string) {
    // Remove emoji characters using regex
    return text.replace(/<:[a-zA-Z0-9_]+:[0-9]+>/g, '');
}

export function DiscordJSRoutes(){
    let disClient = new Client(intents);
    const commands = new Collection();
    let isReady = false;
    let token = '';
    let applicationID = '';

    ipcMain.on('discord-get-token', async (event) => {
        event.sender.send('discord-get-token-reply', token);
    });

    ipcMain.on('discord-get-application-id', async (event) => {
        event.sender.send('discord-get-application-id-reply', applicationID);
    });

    ipcMain.on('discord-get-commands', async (event) => {
        event.sender.send('discord-get-commands-reply', commands);
    });

    ipcMain.on('discord-get-command', async (event, commandName: string) => {
        event.sender.send('discord-get-command-reply', commands.get(commandName));
    });

    ipcMain.on('discord-add-command', async (event, commandName: string, commandFunction: Function) => {
        commands.set(commandName, commandFunction);
        event.sender.send('discord-add-command-reply', commands);
    });

    ipcMain.on('discord-remove-command', async (event, commandName: string) => {
        commands.delete(commandName);
        event.sender.send('discord-remove-command-reply', commands);
    });

    ipcMain.on('discord-remove-all-commands', async (event) => {
        commands.clear();
        event.sender.send('discord-remove-all-commands-reply', commands);
    });

    ipcMain.on('discord-get-guilds', async (event) => {
        if(!isReady) return false;
        const guilds = disClient.guilds.cache.map(guild => {
            const channels = guild.channels.cache
              .filter(channel => channel.type === 0)
              .map(channel => ({
                id: channel.id,
                name: channel.name,
              }));
            return {
              id: guild.id,
              name: guild.name,
              channels,
            };
        });
        event.sender.send('discord-get-guilds-reply', guilds);
    });

    disClient.on('messageCreate', async (message) => {
        if (message.author.id === disClient.user?.id) return;
        ipcMain.emit('discord-message', message);
    });

    disClient.on('messageUpdate', async (oldMessage, newMessage) => {
        if (newMessage.author?.id === disClient.user?.id) return;
        ipcMain.emit('discord-message-update', oldMessage, newMessage);
    });

    disClient.on('messageDelete', async (message) => {
        if (message.author?.id === disClient.user?.id) return;
        ipcMain.emit('discord-message-delete', message);
    });

    disClient.on('messageReactionAdd', async (reaction, user) => {
        if (user.id === disClient.user?.id) return;
        ipcMain.emit('discord-message-reaction-add', reaction, user);
    });

    disClient.on('messageReactionRemove', async (reaction, user) => {
        if (user.id === disClient.user?.id) return;
        ipcMain.emit('discord-message-reaction-remove', reaction, user);
    });

    disClient.on('messageReactionRemoveAll', async (message) => {
        if (message.author?.id === disClient.user?.id) return;
        ipcMain.emit('discord-message-reaction-remove-all', message);
    });

    disClient.on('messageReactionRemoveEmoji', async (reaction) => {
        ipcMain.emit('discord-message-reaction-remove-emoji', reaction);
    });

    disClient.on('channelCreate', async (channel) => {
        ipcMain.emit('discord-channel-create', channel);
    });

    disClient.on('channelDelete', async (channel) => {
        ipcMain.emit('discord-channel-delete', channel);
    });

    disClient.on('channelPinsUpdate', async (channel, time) => {
        ipcMain.emit('discord-channel-pins-update', channel, time);
    });

    disClient.on('channelUpdate', async (oldChannel, newChannel) => {
        ipcMain.emit('discord-channel-update', oldChannel, newChannel);
    });

    disClient.on('emojiCreate', async (emoji) => {
        ipcMain.emit('discord-emoji-create', emoji);
    });

    disClient.on('emojiDelete', async (emoji) => {
        ipcMain.emit('discord-emoji-delete', emoji);
    });

    disClient.on('emojiUpdate', async (oldEmoji, newEmoji) => {
        ipcMain.emit('discord-emoji-update', oldEmoji, newEmoji);
    });

    disClient.on('guildBanAdd', async (ban) => {
        ipcMain.emit('discord-guild-ban-add', ban);
    });

    disClient.on('guildBanRemove', async (ban) => {
        ipcMain.emit('discord-guild-ban-remove', ban);
    });

    disClient.on('guildCreate', async (guild) => {
        ipcMain.emit('discord-guild-create', guild);
    });

    disClient.on('guildDelete', async (guild) => {
        ipcMain.emit('discord-guild-delete', guild);
    });

    disClient.on('guildUnavailable', async (guild) => {
        ipcMain.emit('discord-guild-unavailable', guild);
    });

    disClient.on('guildIntegrationsUpdate', async (guild) => {
        ipcMain.emit('discord-guild-integrations-update', guild);
    });

    disClient.on('guildMemberAdd', async (member) => {
        ipcMain.emit('discord-guild-member-add', member);
    });

    disClient.on('guildMemberRemove', async (member) => {
        ipcMain.emit('discord-guild-member-remove', member);
    });

    disClient.on('guildMemberAvailable', async (member) => {
        ipcMain.emit('discord-guild-member-available', member);
    });

    disClient.on('guildMemberUpdate', async (oldMember, newMember) => {
        ipcMain.emit('discord-guild-member-update', oldMember, newMember);
    });

    disClient.on('guildMembersChunk', async (members, guild) => {
        ipcMain.emit('discord-guild-members-chunk', members, guild);
    });

    disClient.on('guildUpdate', async (oldGuild, newGuild) => {
        ipcMain.emit('discord-guild-update', oldGuild, newGuild);
    });

    disClient.on('interactionCreate', async (interaction) => {
        ipcMain.emit('discord-interaction-create', interaction);
    });

    disClient.on('inviteCreate', async (invite) => {
        ipcMain.emit('discord-invite-create', invite);
    });

    disClient.on('inviteDelete', async (invite) => {
        ipcMain.emit('discord-invite-delete', invite);
    });

    disClient.on('presenceUpdate', async (oldPresence, newPresence) => {
        ipcMain.emit('discord-presence-update', oldPresence, newPresence);
    });

    disClient.on('ready', () => {
        if(!disClient.user) return;
        isReady = true;
        console.log(`Logged in as ${disClient.user.tag}!`);
        ipcMain.emit('discord-ready', disClient);
    });

    async function setDiscordBotInfo(botName: string, base64Avatar: string): Promise<void> {
        if(!isReady) return;
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

            // If the first attempt fails, add an underscore and try again
            try {
                newName = "_" + botName;
                await disClient.user.setUsername(newName);
                console.log(`My new username is ${newName}`);
            } catch (error) {
                console.error(`Failed to set username to ${newName}:`, error);
    
                // If the second attempt fails, add a dot and try again
                try {
                    newNameDot = "." + botName;
                    await disClient.user.setUsername(newNameDot);
                    console.log(`My new username is ${newNameDot}`);
                } catch (error) {
                    console.error(`Failed to set username to ${newNameDot}:`, error);
                }
            }
        }
    
        // Change bot's avatar
        try {
            const buffer = Buffer.from(base64Avatar, 'base64');
            await disClient.user.setAvatar(buffer);
            console.log('New avatar set!');
        } catch (error) {
            console.error('Failed to set avatar:', error);
        }
    }

    async function setStatus(message: string, type: string){
        if(!disClient.user) return;
        if(!isReady) return;
    
        let activityType: ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing;
    
        switch (type) {
            case 'Playing':
                activityType = ActivityType.Playing;
                break;
            case 'Watching':
                activityType = ActivityType.Watching;
                break;
            case 'Listening':
                activityType = ActivityType.Listening;
                break;
            case 'Streaming':
                activityType = ActivityType.Streaming;
                break;
            case 'Competing':
                activityType = ActivityType.Competing;
                break;
            default:
                activityType = ActivityType.Playing;
                break;
        }
    
        disClient.user.setActivity(`${message}`, {type: activityType});
    }

    async function setOnlineMode(type: ValidStatus) {
        if(!disClient.user) return;
        if(!isReady) return;
        disClient.user.setStatus(type);
    }
    
    async function sendMessage(channelID: Snowflake, message: string): Promise<void> {
        if(!isReady) return;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return;
        }
        const channel = await disClient.channels.fetch(channelID);
    
        // Check if the channel is one of the types that can send messages
        if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel) {
            channel.send(message);
        }
    }

    async function getWebhookForCharacter(charName: string, channelID: Snowflake): Promise<Webhook | undefined> {
        if(!isReady) return;
        const channel = disClient.channels.cache.get(channelID);
    
        if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
            return undefined;
        }
    
        const webhooks = await channel.fetchWebhooks();
        return webhooks.find(webhook => webhook.name === charName);
    }
    
    async function sendMessageAsCharacter(charName: string, channelID: Snowflake, message: string): Promise<void> {
        if(!isReady) return;
        const webhook = await getWebhookForCharacter(charName, channelID);
        
        if (!webhook) {
            throw new Error(`Webhook for character ${charName} not found.`);
        }
    
        await webhook.send(message);
    }
    
    async function getWebhooksForChannel(channelID: Snowflake): Promise<string[]> {
        if(!isReady) return [];
        const channel = disClient.channels.cache.get(channelID);
    
        if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
            return [];
        }
    
        const webhooks = await channel.fetchWebhooks();
        return webhooks.map(webhook => webhook.name);
    }

    ipcMain.handle('discord-login', async (event, rawToken: string, appId: string) => {
        await disClient.login(rawToken);
        token = rawToken;
        applicationID = appId;
        return true;
    });

    ipcMain.handle('discord-logout', async (event) => {
        await disClient.destroy();
        disClient.removeAllListeners();
        isReady = false;
        disClient = new Client(intents);
        ipcMain.emit('discord-disconnected');
        return true;
    });

    ipcMain.handle('discord-set-bot-info', async (event, botName: string, base64Avatar: string) => {
        if(!isReady) return false;
        await setDiscordBotInfo(botName, base64Avatar);
        return true;
    });

    ipcMain.handle('discord-set-status', async (event, message: string, type: string) => {
        if(!isReady) return false;
        await setStatus(message, type);
        return true;
    });

    ipcMain.handle('discord-set-online-mode', async (event, type: ValidStatus) => {
        if(!isReady) return false;
        await setOnlineMode(type);
        return true;
    });

    ipcMain.handle('discord-send-message', async (event, channelID: Snowflake, message: string) => {
        if(!isReady) return false;
        await sendMessage(channelID, message);
        return true;
    });

    ipcMain.handle('discord-send-message-as-character', async (event, charName: string, channelID: Snowflake, message: string) => {
        if(!isReady) return false;
        await sendMessageAsCharacter(charName, channelID, message);
        return true;
    });

    ipcMain.on('discord-get-webhooks-for-channel', async (event, channelID: Snowflake) => {
        if(!isReady) return false;
        const webhooks = await getWebhooksForChannel(channelID);
        event.sender.send('discord-get-webhooks-for-channel-reply', webhooks);
    });

    ipcMain.on('discord-get-webhook-for-character', async (event, charName: string, channelID: Snowflake) => {
        if(!isReady) return false;
        const webhook = await getWebhookForCharacter(charName, channelID);
        event.sender.send('discord-get-webhook-for-character-reply', webhook);
    });

    ipcMain.on('discord-get-user', async (event) => {
        if(!isReady) return false;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return false;
        }
        event.sender.send('discord-get-user-reply', disClient.user);
    });

    ipcMain.on('discord-get-user-id', async (event) => {
        if(!isReady) return false;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return false;
        }
        event.sender.send('discord-get-user-id-reply', disClient.user.id);
    });

    ipcMain.on('discord-get-user-username', async (event) => {
        if(!isReady) return false;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return false;
        }
        event.sender.send('discord-get-user-username-reply', disClient.user.username);
    });

    ipcMain.on('discord-get-user-avatar', async (event) => {
        if(!isReady) return false;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return false;
        }
        event.sender.send('discord-get-user-avatar-reply', disClient.user.avatarURL());
    });

    ipcMain.on('discord-get-user-discriminator', async (event) => {
        if(!isReady) return false;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return false;
        }
        event.sender.send('discord-get-user-discriminator-reply', disClient.user.discriminator);
    });

    ipcMain.on('discord-get-user-tag', async (event) => {
        if(!isReady) return false;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return false;
        }
        event.sender.send('discord-get-user-tag-reply', disClient.user.tag);
    });

    ipcMain.on('discord-get-user-createdAt', async (event) => {
        if(!isReady) return false;
        if (!disClient.user) {
            console.error("Discord client user is not initialized.");
            return false;
        }
        event.sender.send('discord-get-user-createdAt-reply', disClient.user.createdAt);
    });

    ipcMain.on('discord-bot-status', async (event) => {
        event.sender.send('discord-bot-status-reply', isReady);
    });
};