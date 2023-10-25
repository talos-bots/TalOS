import { ActivityType, Client, GatewayIntentBits, Collection, REST, Routes, Partials, TextChannel, DMChannel, NewsChannel, Snowflake, Webhook, Message, CommandInteraction, Events, PartialGroupDMChannel } from 'discord.js';
import Store from 'electron-store';
import { expressApp, uploadsPath } from '..';
import { doImageReaction, getDoStableDiffusion, getMessageIntent, getRegisteredChannels, getUsername, handleDiscordMessage, handleRemoveMessage, handleRengenerateMessage, setInterrupted } from '../controllers/DiscordController';
import { ConstructInterface, SlashCommand } from '../types/types';
import { assembleConstructFromData, base642Buffer } from '../helpers/helpers';
import { DefaultCommands, stableDiffusionCommands } from '../controllers/commands';
import { retrieveConstructs } from '../controllers/ChatController';
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

export let disClient = new Client(intents);
const commands: SlashCommand[] = [...DefaultCommands];
export let isReady = false;
let token = '';
let applicationID = '';
let multiCharacterMode = false;
let multiConstructMode = false;

getDiscordData();

function createClient(){
    disClient.on('messageCreate', async (message) => {
        if (message.author.id === disClient.user?.id) return;
        if (message.webhookId) return;
        const registeredChannels = getRegisteredChannels();
        let isRegistered = false;
        for(let i = 0; i < registeredChannels.length; i++){
            if(message.channel.id === registeredChannels[i]._id){
                isRegistered = true;
                break;
            }
        }
        if(message.content.startsWith('.') && !message.content.startsWith('...')) return;
        if(isRegistered || message.channel.isDMBased()){
            console.log("Message received...");
            console.log("Message ID:", message.id);
            if(message.channelId === processingMessage?.channelId && message.id !== processingMessage?.id){
                console.log("Message is not the same as the one being processed, ignoring...");
                setInterrupted();
            }
            messageQueue.push(message);
            await processQueue();
        }
    });

    disClient.on('error', (error) => {
        console.error('Discord client error:', error);
    });

    disClient.on('warn', (warning) => {
        console.warn('Discord client warning:', warning);
    });

    disClient.on('shardError', (error) => {
        console.error('Discord client shard error:', error);
    });

    disClient.on('shardWarn', (warning) => {
        console.warn('Discord client shard warning:', warning);
    });

    disClient.on('invalidated', () => {
        console.warn('Discord client invalidated.');
    });

    disClient.on('rateLimit', (rateLimitInfo) => {
        console.warn('Discord client rate limit:', rateLimitInfo);
    });

    disClient.on('debug', (debugInfo) => {
        console.log('Discord client debug:', debugInfo);
    });

    disClient.on('guildCreate', (guild) => {
        console.log(`Joined guild: ${guild.name}`);
    });

    disClient.on('guildDelete', (guild) => {
        console.log(`Left guild: ${guild.name}`);
    });

    disClient.on('guildUnavailable', (guild) => {
        console.log(`Guild unavailable: ${guild.name}`);
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
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
        }
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
    });

    disClient.on('ready', async () => {
        if(!disClient.user) return;
        isReady = true;
        console.log(`Logged in as ${disClient.user.tag}!`);
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

export async function setDiscordBotInfo(botName: string, base64Avatar: any): Promise<void> {
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
        console.log('Setting new avatar...');
        console.log(base64Avatar);
        if(!base64Avatar.includes('/api/images/')){
            base64Avatar = await base642Buffer(base64Avatar);
        }else {
            base64Avatar = uploadsPath + base64Avatar.replaceAll('/api/images/', '');
        }
        await disClient.user.setAvatar(base64Avatar);
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

export async function getStopList(guildId: string, channelID: string){
    if(!disClient.user || disClient.user === null) return;
    if(!isReady) return;
    let guild = disClient.guilds.cache.get(guildId);
    let memberList = [];
    if(!guild) return;
    guild.members.cache.forEach(member => {
        if(!disClient.user) return;
        if(member.user.id !== disClient.user.id){
            memberList.push(member.user.id);
        }
    });
    for(let i = 0; i < memberList.length; i++){
        let alias = await getUsername(memberList[i], channelID);
        memberList[i] = `${alias}:`
    }
    console.log("Stop list fetched...");
    console.log(memberList);
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
    if(message.trim().length < 1) return;
    // Check if the channel is one of the types that can send messages
    if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel) {
        // if the message is longer than 1900 characters, split it into multiple messages
        if (message.length > 1900) {
            const messageParts = message.match(/[\s\S]{1,1900}/g);
            if (messageParts) {
                for (const part of messageParts) {
                    await channel.send(part);
                }
            }
        } else {
            await channel.send(message);
        }
    }
}


export async function sendAttachment(channelID: Snowflake, attachment: any){
    if(!isReady) return;
    if (!disClient.user) {
        console.error("Discord client user is not initialized.");
        return;
    }
    const channel = await disClient.channels.fetch(channelID);
    if(!channel) return;
    if(!attachment) return;
    // Check if the channel is one of the types that can send messages
    if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel) {
        return channel.send({files: [attachment]});
    }
}

export async function sendReply(message: Message | CommandInteraction, reply: string){
    if(!isReady) return;
    if (!disClient.user) {
        console.error("Discord client user is not initialized.");
        return;
    }
    try{
        if(reply.length < 1) return;
        // if the message is longer than 1900 characters, split it into multiple messages
        if (reply.length > 1900) {
            const messageParts = reply.match(/[\s\S]{1,1900}/g);
            if (messageParts) {
                for (const part of messageParts) {
                    await message.reply(part);
                }
            }
        } else {
            await message.reply(reply);
        }
    } catch (error) {
        console.log(error);
        sendMessage(message.channelId, reply);
    }
}

export async function sendMessageEmbed(channelID: Snowflake, embed: any){
    if(!isReady) return;
    if (!disClient.user) {
        console.error("Discord client user is not initialized.");
        return;
    }
    const channel = await disClient.channels.fetch(channelID);
    if(!channel) return;
    if(!embed) return;
    // Check if the channel is one of the types that can send messages
    if (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel) {
        return channel.send({embeds: [embed]});
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
    if(message.trim().length < 1) return;
    // if the message is longer than 1900 characters send multiple

    if(message.length > 1900){
        const messageParts = message.match(/[\s\S]{1,1900}/g);
        if(messageParts){
            for(let part in messageParts){
                await webhook.send(part)
            }
        }
    }else{
        await webhook.send(message)
    }
}

export async function sendEmbedAsCharacter(char: ConstructInterface, channelID: Snowflake, embed: any): Promise<void> {
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
    if(!embed) return;
    await webhook.send({embeds: [embed]});
}

export async function sendAttachmentAsCharacter(char: ConstructInterface, channelID: Snowflake, embed: any){
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
    if(!embed) return;
    await webhook.send({files: [embed]})
}

export async function clearWebhooksFromChannel(channelID: Snowflake): Promise<void> {
    if(!isReady) return;
    const channel = disClient.channels.cache.get(channelID);

    if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
        return;
    }

    const webhooks = await channel.fetchWebhooks();
    try{
        await Promise.all(webhooks.map(webhook => {try{webhook.delete()}catch{}}));
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
        console.log("Creating webhook...");
        console.log(char.name);
        console.log(charImage);
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

export async function getDiscordData(): Promise<{savedToken: string, appId: string, discordMultiConstructMode: boolean}> {
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

    let discordMultiConstructMode;
    const storedDiscordMultiConstructMode = store.get('discordMultiConstructMode');
    if (storedDiscordMultiConstructMode !== undefined && typeof storedDiscordMultiConstructMode === 'boolean') {
        discordMultiConstructMode = storedDiscordMultiConstructMode;
    } else {
        discordMultiConstructMode = false;
    }

    token = savedToken;
    applicationID = appId;
    multiConstructMode = discordMultiConstructMode;
    return {savedToken, appId, discordMultiConstructMode};
}

export function saveDiscordData(newToken: string, newAppId: string, discordMultiConstructMode: boolean){
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
    
    multiConstructMode = discordMultiConstructMode;
    store.set('discordMultiConstructMode', discordMultiConstructMode);
}

let messageQueue: Message[] = [];
let isProcessing = false;
let processingMessage: Message | undefined;
async function processQueue() {
    // If the bot is already processing a message, do not start processing this one
    if (isProcessing) return;

    while (messageQueue.length > 0) {
        isProcessing = true;
        const currentMessage = messageQueue.shift();
        processingMessage = currentMessage;
        await handleDiscordMessage(currentMessage!);
        processingMessage = undefined;
        isProcessing = false;
    }
}
export function cleanEmotes(text: string): string {
    // Find Discord custom and animated emotes and replace them with :<emote_name>:
    return text.replace(/<(a?):([a-zA-Z0-9_]+):[0-9]+>/g, (_match, _animated, emoteName) => {
      return `:${emoteName}:`;
    });
}
  

  
export function clearMessageQueue() {
    messageQueue = [];
}
export function DiscordJSRoutes(){
    // Equivalent to 'discord-get-token' handler
    expressApp.get('/api/discord/token', (req, res) => {
        res.json({ token });
    });

    // Equivalent to 'discord-get-data' handler
    expressApp.get('/api/discord/data', async (req, res) => {
        let data = await getDiscordData();
        res.json(data);
    });

    // Equivalent to 'discord-save-data' handler
    expressApp.post('/api/discord/data', async (req, res) => {
        const { newToken, newAppId, discordMultiConstructMode } = req.body;
        saveDiscordData(newToken, newAppId, discordMultiConstructMode);
        res.json({ token, applicationID });
    });

    // Equivalent to 'discord-get-application-id' handler
    expressApp.get('/api/discord/application-id', (req, res) => {
        res.json({ applicationID });
    });

    // Equivalent to 'discord-get-guilds' handler
    expressApp.get('/api/discord/guilds', async (req, res) => {
        const guilds = await getDiscordGuilds();
        res.json(guilds);
    });

    expressApp.post('/api/discord/login', async (req, res) => {
        try {
            let rawToken = req.body.rawToken;
            let appId = req.body.appId;
    
            if (rawToken === '') {
                const storedToken = store.get('discordToken');
                
                if (storedToken !== undefined && typeof storedToken === 'string') {
                    token = storedToken;
                } else {
                    res.status(400).json({ success: false, message: 'Invalid token.' });
                    return;
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
                    res.status(400).json({ success: false, message: 'Invalid application ID.' });
                    return;
                }
            } else {
                applicationID = appId;
                store.set('discordAppId', appId);
            }
    
            await disClient.login(token);
            createClient();
            if (!disClient.user) {
                console.error("Discord client user is not initialized.");
                res.status(500).json({ success: false, message: 'Discord client user is not initialized.' });
            } else {
                res.json({ success: true });
            }
            
        } catch (error) {
            console.error('Failed to login to Discord:', error);
            res.status(500).json({ success: false, message: 'Failed to login to Discord.' });
        }
    });

    expressApp.post('/api/discord/logout', async (req, res) => {
        try {
            await disClient.destroy();
            disClient.removeAllListeners();
            isReady = false;
            messageQueue = [];
            disClient = new Client(intents);
            console.log('Logged out!');
            res.json({ success: true });
        } catch (error) {
            console.error('Failed to logout from Discord:', error);
            res.status(500).json({ success: false, error: 'Failed to logout from Discord.' });
        }
    });
    
    expressApp.post('/api/discord/set-bot-info', async (req, res) => {
        const { botName, base64Avatar } = req.body;
        if(!isReady) return res.status(503).json({ success: false, message: "Bot not ready." });
        await setDiscordBotInfo(botName, base64Avatar);
        res.json({ success: true });
    });    

    expressApp.post('/api/discord/set-status', async (req, res) => {
        const { message, type } = req.body;
        if(!isReady) return res.status(503).json({ success: false, message: "Bot not ready." });
        await setStatus(message, type);
        res.json({ success: true });
    });
    

    expressApp.post('/api/discord/set-online-mode', async (req, res) => {
        const { type } = req.body;
        if(!isReady) return res.status(503).json({ success: false, message: "Bot not ready." });
        await setOnlineMode(type);
        res.json({ success: true });
    });
    

    expressApp.post('/api/discord/send-message', async (req, res) => {
        const { channelID, message } = req.body;
        if(!isReady) return res.status(503).json({ success: false, message: "Bot not ready." });
        await sendMessage(channelID, message);
        res.json({ success: true });
    });    

    expressApp.post('/api/discord/send-message-as-character', async (req, res) => {
        const { char, channelID, message } = req.body;
        if(!isReady) return res.status(503).json({ success: false, message: "Bot not ready." });
        await sendMessageAsCharacter(char, channelID, message);
        res.json({ success: true });
    });
    

    expressApp.get('/api/discord/get-webhooks-for-channel/:channelID', async (req, res) => {
        const { channelID } = req.params;
        if(!isReady) return res.status(503).json({ success: false, message: "Bot not ready." });
        const webhooks = await getWebhooksForChannel(channelID);
        res.json({ success: true, webhooks });
    });
    

    expressApp.get('/api/discord/get-webhook-for-character', async (req, res) => {
        const { charName, channelID } = req.query;
        if(!isReady) return res.status(503).json({ success: false, message: "Bot not ready." });
        const webhook = await getWebhookForCharacter(charName as string, channelID as string);
        res.json({ success: true, webhook });
    });
    

    expressApp.get('/api/discord/user', (req, res) => {
        if(!isReady || !disClient.user) {
            console.error("Discord client user is not initialized.");
            return res.status(500).send({ error: 'Discord client user is not initialized.' });
        }
        res.send(disClient.user);
    });
    
    expressApp.get('/api/discord/user/id', (req, res) => {
        if(!isReady || !disClient.user) {
            console.error("Discord client user is not initialized.");
            return res.status(500).send({ error: 'Discord client user is not initialized.' });
        }
        res.send({ id: disClient.user.id });
    });
    
    expressApp.get('/api/discord/user/username', (req, res) => {
        if(!isReady || !disClient.user) {
            console.error("Discord client user is not initialized.");
            return res.status(500).send({ error: 'Discord client user is not initialized.' });
        }
        res.send({ username: disClient.user.username });
    });
    
    expressApp.get('/api/discord/user/avatar', (req, res) => {
        if(!isReady || !disClient.user) {
            console.error("Discord client user is not initialized.");
            return res.status(500).send({ error: 'Discord client user is not initialized.' });
        }
        res.send({ avatarURL: disClient.user.avatarURL() });
    });
    
    expressApp.get('/api/discord/user/discriminator', (req, res) => {
        if(!isReady || !disClient.user) {
            console.error("Discord client user is not initialized.");
            return res.status(500).send({ error: 'Discord client user is not initialized.' });
        }
        res.send({ discriminator: disClient.user.discriminator });
    });
    
    expressApp.get('/api/discord/user/tag', (req, res) => {
        if(!isReady || !disClient.user) {
            console.error("Discord client user is not initialized.");
            return res.status(500).send({ error: 'Discord client user is not initialized.' });
        }
        res.send({ tag: disClient.user.tag });
    });
    
    expressApp.get('/api/discord/user/createdAt', (req, res) => {
        if(!isReady || !disClient.user) {
            console.error("Discord client user is not initialized.");
            return res.status(500).send({ error: 'Discord client user is not initialized.' });
        }
        res.send({ createdAt: disClient.user.createdAt });
    });

    expressApp.get('/api/discord/bot/status', (req, res) => {
        res.send({ status: isReady });
    });
};