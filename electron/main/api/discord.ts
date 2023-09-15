import { ipcMain } from 'electron';
import { ActivityType, Client, GatewayIntentBits, Collection, REST, Routes, Partials, TextChannel, DMChannel, NewsChannel, Snowflake, Webhook, Message, CommandInteraction, Events, PartialGroupDMChannel } from 'discord.js';
import Store from 'electron-store';
import { win } from '..';
import { doImageReaction, getDoStableDiffusion, getMessageIntent, getRegisteredChannels, getUsername, handleDiscordMessage, handleRemoveMessage, handleRengenerateMessage } from '../controllers/DiscordController';
import { ConstructInterface, SlashCommand } from '../types/types';
import { assembleConstructFromData, base642Buffer } from '../helpers/helpers';
import { DefaultCommands, stableDiffusionCommands } from '../controllers/commands';
import { retrieveConstructs } from '../controllers/ConstructController';
import { getConstruct } from './pouchdb';

const intents = { 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, GatewayIntentBits.GuildEmojisAndStickers, 
    GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMessageReactions], 
    partials: [Partials.Channel, Partials.GuildMember, Partials.User, Partials.Reaction, Partials.Message, Partials.ThreadMember, Partials.GuildScheduledEvent] 
};
type ValidStatus = 'online' | 'dnd' | 'idle' | 'invisible';

const store = new Store({
    name: 'discordData',
});

getDiscordData();

export let disClient = new Client(intents);
const commands: SlashCommand[] = [...DefaultCommands];
export let isReady = false;
let token = '';
let applicationID = '';
let characterMode = false;
let multiCharacterMode = false;
let multiConstructMode = false;

function createClient(){
    disClient.on('messageCreate', async (message) => {
        if (message.author.id === disClient.user?.id) return;
        if (message.webhookId) return;
        messageQueue.push(message);
        await processQueue();
        const registeredChannels = getRegisteredChannels();
        let isRegistered = false;
        for(let i = 0; i < registeredChannels.length; i++){
            if(message.channel.id === registeredChannels[i]._id){
                isRegistered = true;
                break;
            }
        }
        if(isRegistered || message.channel.isDMBased()){
            win?.webContents.send(`chat-message-${message.channel.id}`);
            win?.webContents.send('discord-message', message);
        }
    });

    disClient.on('messageUpdate', async (oldMessage, newMessage) => {
        if (newMessage.author?.id === disClient.user?.id) return;
        win?.webContents.send('discord-message-update', oldMessage, newMessage);
    });

    disClient.on('messageDelete', async (message) => {
        if (message.author?.id === disClient.user?.id) return;
        win?.webContents.send('discord-message-delete', message);
    });

    disClient.on("messageReactionAdd", async (reaction, user) => {
        if (user.id === disClient.user?.id) return;
        console.log("Reaction added...");
        try {
            // Ensure the reaction itself is fully fetched
            if (reaction.partial) {
                await reaction.fetch();
                console.log("Fetching reaction...");
            }
    
            // Ensure the associated message of the reaction is fully fetched
            if (reaction.message.partial) {
                await reaction.message.fetch();
                console.log("Fetching message...");
            }
    
            // Now, reaction.message should be the fully fetched message
            const message = reaction.message;
            console.log("Message fetched...");

            if(reaction.emoji.name === '♻️'){
                console.log("Regenerating message...");
                await handleRengenerateMessage(message as Message);
                message.reactions.cache.get('♻️')?.remove();
            }
    
            if(reaction.emoji.name === '🗑️'){
                console.log("Removing message...");
                await handleRemoveMessage(message as Message);
            }

            if(reaction.emoji.name === '🖼️'){
                console.log("Creating image...");
                await doImageReaction(message as Message);
            }

            if(reaction.emoji.name === '❓'){
                await getMessageIntent(message as Message);
            }
            win?.webContents.send('discord-message-reaction-add', reaction, user);
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
        }
    });
    

    disClient.on('messageReactionRemove', async (reaction, user) => {
        if (user.id === disClient.user?.id) return;
        win?.webContents.send('discord-message-reaction-remove', reaction, user);
    });

    disClient.on('messageReactionRemoveAll', async (message) => {
        if (message.author?.id === disClient.user?.id) return;
        win?.webContents.send('discord-message-reaction-remove-all', message);
    });

    disClient.on('messageReactionRemoveEmoji', async (reaction) => {
        win?.webContents.send('discord-message-reaction-remove-emoji', reaction);
    });

    disClient.on('channelCreate', async (channel) => {
        win?.webContents.send('discord-channel-create', channel);
    });

    disClient.on('channelDelete', async (channel) => {
        win?.webContents.send('discord-channel-delete', channel);
    });

    disClient.on('channelPinsUpdate', async (channel, time) => {
        win?.webContents.send('discord-channel-pins-update', channel, time);
    });

    disClient.on('channelUpdate', async (oldChannel, newChannel) => {
        win?.webContents.send('discord-channel-update', oldChannel, newChannel);
    });

    disClient.on('emojiCreate', async (emoji) => {
        win?.webContents.send('discord-emoji-create', emoji);
    });

    disClient.on('emojiDelete', async (emoji) => {
        win?.webContents.send('discord-emoji-delete', emoji);
    });

    disClient.on('emojiUpdate', async (oldEmoji, newEmoji) => {
        win?.webContents.send('discord-emoji-update', oldEmoji, newEmoji);
    });

    disClient.on('guildBanAdd', async (ban) => {
        win?.webContents.send('discord-guild-ban-add', ban);
    });

    disClient.on('guildBanRemove', async (ban) => {
        win?.webContents.send('discord-guild-ban-remove', ban);
    });

    disClient.on('guildCreate', async (guild) => {
        win?.webContents.send('discord-guild-create', guild);
    });

    disClient.on('guildDelete', async (guild) => {
        win?.webContents.send('discord-guild-delete', guild);
    });

    disClient.on('guildUnavailable', async (guild) => {
        win?.webContents.send('discord-guild-unavailable', guild);
    });

    disClient.on('guildIntegrationsUpdate', async (guild) => {
        win?.webContents.send('discord-guild-integrations-update', guild);
    });

    disClient.on('guildMemberAdd', async (member) => {
        win?.webContents.send('discord-guild-member-add', member);
    });

    disClient.on('guildMemberRemove', async (member) => {
        win?.webContents.send('discord-guild-member-remove', member);
    });

    disClient.on('guildMemberAvailable', async (member) => {
        win?.webContents.send('discord-guild-member-available', member);
    });

    disClient.on('guildMemberUpdate', async (oldMember, newMember) => {
        win?.webContents.send('discord-guild-member-update', oldMember, newMember);
    });

    disClient.on('guildMembersChunk', async (members, guild) => {
        win?.webContents.send('discord-guild-members-chunk', members, guild);
    });

    disClient.on('guildUpdate', async (oldGuild, newGuild) => {
        win?.webContents.send('discord-guild-update', oldGuild, newGuild);
    });

    disClient.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        let commandsToCheck = commands;
        if(getDoStableDiffusion()){
            commandsToCheck = [...commands, ...stableDiffusionCommands];
        }
        const command = commandsToCheck.find(cmd => cmd.name === interaction.commandName);
        if (!command) return;
      
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        win?.webContents.send('discord-interaction-create', interaction);
    });

    disClient.on('inviteCreate', async (invite) => {
        win?.webContents.send('discord-invite-create', invite);
    });

    disClient.on('inviteDelete', async (invite) => {
        win?.webContents.send('discord-invite-delete', invite);
    });

    disClient.on('presenceUpdate', async (oldPresence, newPresence) => {
        win?.webContents.send('discord-presence-update', oldPresence, newPresence);
    });

    disClient.on('ready', async () => {
        if(!disClient.user) return;
        isReady = true;
        console.log(`Logged in as ${disClient.user.tag}!`);
        win?.webContents.send('discord-ready', disClient.user.tag);
        registerCommands();
        let constructs = retrieveConstructs();
        let constructRaw = await getConstruct(constructs[0]);
        let construct = assembleConstructFromData(constructRaw);
        if(!construct) return;
        setDiscordBotInfo(construct.name, construct.avatar);
    });
}
export async function registerCommands() {
    if(!isReady) return;
    const rest = new REST().setToken(token);
    let commandsToSet = commands;
    if(getDoStableDiffusion()){
        console.log("Stable diffusion enabled...");
        commandsToSet = [...commands, ...stableDiffusionCommands];
    }
    try {
        console.log('Started refreshing application (/) commands.');
            
        await rest.put(
            Routes.applicationCommands(applicationID),
            { body: commandsToSet.map(cmd => ({ name: cmd.name, description: cmd.description, options: cmd.options })) },
        ).then(() => {
            console.log('Successfully reloaded application (/) commands.');
            console.log('The following commands were set:', commandsToSet.map(cmd => cmd.name));
        }).catch((error) => {
            console.error(error);
            throw new Error('Failed to reload application (/) commands.');
        });

    } catch (error) {
        console.error(error);
    }
}

export function isMultiCharacterMode(){
    return multiCharacterMode;
}

export function isMultiConstructMode(){
    return multiConstructMode;
}

export function isAutoReplyMode(){
    return false;
}

export function cleanUsername(username: string) {
    // Remove leading characters
    let cleaned = username.replace(/^[._-]+/, '');
  
    // Remove trailing characters
    cleaned = cleaned.replace(/[._-]+$/, '');
  
    return cleaned;
}

export function cleanEmoji(text: string) {
    // Remove emoji characters using regex
    return text.replace(/<:[a-zA-Z0-9_]+:[0-9]+>/g, '');
}

export async function doGlobalNicknameChange(newName: string){
    disClient.guilds.cache.forEach(guild => {
        guild.members.cache.filter(member => member.user.id === disClient?.user?.id).forEach(member => {
            member.setNickname(newName);
        });
    });
}

export async function setDiscordBotInfo(botName: string, base64Avatar: string): Promise<void> {
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
        const buffer = await base642Buffer(base64Avatar);
        await disClient.user.setAvatar(buffer);
        console.log('New avatar set!');
    } catch (error) {
        console.error('Failed to set avatar:', error);
    }
    doGlobalNicknameChange(botName);
}

export async function getDiscordGuilds() {
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
    return guilds;
}

export async function setStatus(message: string, type: string){
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

export async function setOnlineMode(type: ValidStatus) {
    if(!disClient.user) return;
    if(!isReady) return;
    disClient.user.setStatus(type);
}

export async function getStopList(guildId: string){
    if(!disClient.user || disClient.user === null) return;
    if(!isReady) return;
    let guild = disClient.guilds.cache.get(guildId);
    let memberList = [];
    if(!guild) return;
    guild.members.cache.forEach(member => {
        if(!disClient.user) return;
        if(member.user.id !== disClient.user.id){
            memberList.push(member.user.displayName);
        }
    });
    for(let i = 0; i < memberList.length; i++){
        let alias = cleanUsername(memberList[i]);
        memberList[i] = `${alias}:`
    }
    console.log("Stop list fetched...");
    return memberList;
}

export function sendTyping(message: Message | CommandInteraction){
    if(!disClient.user) return;
    if(!isReady) return;
    if(message instanceof Message){
        message.channel.sendTyping();
    }else if(message instanceof CommandInteraction){
        if(message.channel instanceof TextChannel || message.channel instanceof DMChannel || message.channel instanceof NewsChannel){
            message.channel.sendTyping();
        }
    }
}

export async function editMessage(message: Message, newMessage: string){
    if(!disClient.user) return;
    if(!isReady) return;
    if(message.content === newMessage) return;
    if(newMessage.length < 1) return;
    try {
        message.edit(newMessage);
    } catch (error) {
        console.error(error);
    }
}

export async function deleteMessage(message: Message){
    if(!disClient.user) return;
    if(!isReady) return;
    try{
        message.delete();
    } catch (error) {
        console.error(error);
    }
}

export async function sendMessage(channelID: Snowflake, message: string){
    if(!isReady) return;
    if (!disClient.user) {
        console.error("Discord client user is not initialized.");
        return;
    }
    const channel = await disClient.channels.fetch(channelID);
    if(!channel) return;
    if(message.length < 1) return;
    // Check if the channel is one of the types that can send messages
    if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel) {
        return channel.send(message);
    }
}

export async function getWebhookForCharacter(charName: string, channelID: Snowflake): Promise<Webhook | undefined> {
    if(!isReady) return;
    const channel = disClient.channels.cache.get(channelID);

    if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
        return undefined;
    }
    const webhooks = await channel.fetchWebhooks();

    return webhooks.find(webhook => webhook.name === charName);
}

export async function sendMessageAsCharacter(char: ConstructInterface, channelID: Snowflake, message: string): Promise<void> {
    if(!isReady) return;
    let webhook = await getWebhookForCharacter(char.name, channelID);
    
    if (!webhook) {
        webhook = await createWebhookForChannel(channelID, char);
    }
    if (!webhook) {
        console.error("Failed to create webhook.");
        sendMessage(channelID, '*Failed to create webhook. Check the number of webhooks in channel, if it is at 15, run /clearallwebhooks. Otherwise, ask your server adminstrator to give you the permissions they removed like a twat.*');
        return;
    }
    if(message.length < 1) return;
    await webhook.send(message);
}

export async function clearWebhooksFromChannel(channelID: Snowflake): Promise<void> {
    if(!isReady) return;
    const channel = disClient.channels.cache.get(channelID);

    if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
        return;
    }

    const webhooks = await channel.fetchWebhooks();
    try{
        await Promise.all(webhooks.map(webhook => webhook.delete()));
    }catch(error){
        console.error(error);
    }
}

export async function createWebhookForChannel(channelID: string, char: ConstructInterface){
    if(!isReady) return;
    if (!disClient.user) return;
    let channel = disClient.channels.cache.get(channelID);
    if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
        return;
    }
    let webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(webhook => webhook.name === char.name);
    let charImage = await base642Buffer(char.avatar);
    if(!webhook){
        webhook = await channel.createWebhook({
            name: char.name,
            avatar: charImage
        });
    }else {
        console.log("Webhook already exists.");
    }
    return webhook;
}

export async function getWebhooksForChannel(channelID: Snowflake): Promise<string[]> {
    if(!isReady) return [];
    const channel = disClient.channels.cache.get(channelID);

    if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
        return [];
    }

    const webhooks = await channel.fetchWebhooks();
    return webhooks.map(webhook => webhook.name);
}

export async function setDiscordAuthToken(token: string): Promise<void> {
    store.set('discordToken', token);
}

export async function setDiscordAppId(appId: string): Promise<void> {
    store.set('discordAppId', appId);
}

export async function getDiscordData(): Promise<{savedToken: string, appId: string, discordCharacterMode: boolean, discordMultiCharacterMode: boolean, discordMultiConstructMode: boolean}> {
    let savedToken;
    const storedToken = store.get('discordToken');
    if (storedToken !== undefined && typeof storedToken === 'string') {
        savedToken = storedToken;
    } else {
        savedToken = '';
    }

    let appId;
    const storedAppId = store.get('discordAppId');
    if (storedAppId !== undefined && typeof storedAppId === 'string') {
        appId = storedAppId;
    } else {
        appId = '';
    }

    let discordCharacterMode;
    const storedDiscordCharacterMode = store.get('discordCharacterMode');
    if (storedDiscordCharacterMode !== undefined && typeof storedDiscordCharacterMode === 'boolean') {
        discordCharacterMode = storedDiscordCharacterMode;
    } else {
        discordCharacterMode = false;
    }

    let discordMultiCharacterMode;
    const storedDiscordMultiCharacterMode = store.get('discordMultiCharacterMode');
    if (storedDiscordMultiCharacterMode !== undefined && typeof storedDiscordMultiCharacterMode === 'boolean') {
        discordMultiCharacterMode = storedDiscordMultiCharacterMode;
    } else {
        discordMultiCharacterMode = false;
    }

    let discordMultiConstructMode;
    const storedDiscordMultiConstructMode = store.get('discordMultiConstructMode');
    if (storedDiscordMultiConstructMode !== undefined && typeof storedDiscordMultiConstructMode === 'boolean') {
        discordMultiConstructMode = storedDiscordMultiConstructMode;
    } else {
        discordMultiConstructMode = false;
    }

    token = savedToken;
    applicationID = appId;
    characterMode = discordCharacterMode;
    multiCharacterMode = discordMultiCharacterMode;
    multiConstructMode = discordMultiConstructMode;
    return {savedToken, appId, discordCharacterMode, discordMultiCharacterMode, discordMultiConstructMode};
}

export function saveDiscordData(newToken: string, newAppId: string, discordCharacterMode: boolean, discordMultiCharacterMode: boolean, discordMultiConstructMode: boolean){
    if (newToken === '') {
        const storedToken = store.get('discordToken');
        
        if (storedToken !== undefined && typeof storedToken === 'string') {
            token = storedToken;
        } else {
            return false; // or return an error message
        }
    } else {
        token = newToken;
        store.set('discordToken', newToken);
    }
    
    if (newAppId === '') {
        const storedAppId = store.get('discordAppId');
        
        if (storedAppId !== undefined && typeof storedAppId === 'string') {
            applicationID = storedAppId;
        } else {
            return false; // or return an error message
        }
    } else {
        applicationID = newAppId;
        store.set('discordAppId', newAppId);
    }
    
    characterMode = discordCharacterMode;
    multiCharacterMode = discordMultiCharacterMode;
    multiConstructMode = discordMultiConstructMode;

    store.set('discordCharacterMode', discordCharacterMode);
    if(!discordCharacterMode){
        store.set('mode', 'Construct');
    }else{
        store.set('mode', 'Character');
    }
    store.set('discordMultiCharacterMode', discordMultiCharacterMode);
    store.set('discordMultiConstructMode', discordMultiConstructMode);
}

let messageQueue: Message[] = [];
let isProcessing = false;

async function processQueue() {
    // If the bot is already processing a message, do not start processing this one
    if (isProcessing) return;

    while (messageQueue.length > 0) {
        isProcessing = true;
        const currentMessage = messageQueue.shift();
            await handleDiscordMessage(currentMessage!);
        isProcessing = false;
    }
}

export function DiscordJSRoutes(){
    ipcMain.on('discord-get-token', async (event) => {
        event.sender.send('discord-get-token-reply', token);
    });

    ipcMain.on('discord-get-data', async (event) => {
        let data = await getDiscordData();
        event.sender.send('discord-get-data-reply', data);
    });

    ipcMain.on('discord-save-data', async (event, newToken: string, newAppId: string, discordCharacterMode: boolean, discordMultiCharacterMode: boolean, discordMultiConstructMode: boolean) => {
        saveDiscordData(newToken, newAppId, discordCharacterMode, discordMultiCharacterMode, discordMultiConstructMode);
        event.sender.send('discord-save-data-reply', token, applicationID);
    });
    
    ipcMain.on('discord-get-application-id', async (event) => {
        event.sender.send('discord-get-application-id-reply', applicationID);
    });

    ipcMain.on('discord-get-guilds', async (event) => {
        event.sender.send('discord-get-guilds-reply', await getDiscordGuilds());
    });

    ipcMain.handle('discord-login', async (event, rawToken: string, appId: string) => {
        try {
            if (rawToken === '') {
                const storedToken = store.get('discordToken');
                
                if (storedToken !== undefined && typeof storedToken === 'string') {
                    token = storedToken;
                } else {
                    return false; // or return an error message
                }
            } else {
                token = rawToken;
                store.set('discordToken', rawToken);
            }
            
            if (appId === '') {
                const storedAppId = store.get('discordAppId');
                
                if (storedAppId !== undefined && typeof storedAppId === 'string') {
                    applicationID = storedAppId;
                } else {
                    return false; // or return an error message
                }
            } else {
                applicationID = appId;
                store.set('discordAppId', appId);
            }
            
            await disClient.login(token);
            createClient();
            if (!disClient.user) {
                console.error("Discord client user is not initialized.");
                return false;
            } else {
                return true;
            }
            
        } catch (error) {
            console.error('Failed to login to Discord:', error);
            return false;
        }
    });    

    ipcMain.handle('discord-logout', async (event) => {
        await disClient.destroy();
        disClient.removeAllListeners();
        isReady = false;
        disClient = new Client(intents);
        console.log('Logged out!');
        win?.webContents.send('discord-disconnected');
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

    ipcMain.handle('discord-send-message-as-character', async (event, char: ConstructInterface, channelID: Snowflake, message: string) => {
        if(!isReady) return false;
        await sendMessageAsCharacter(char, channelID, message);
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