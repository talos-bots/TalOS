import { ipcMain } from 'electron';
import Store from 'electron-store';
import { generateContinueChatLog, generateThoughts, getDoMultiLine, regenerateMessageFromChatLog, removeMessagesFromChatLog, retrieveConstructs } from './ConstructController';
import { addChat, getChat, getConstruct, updateChat } from '../api/pouchdb';
import { addUserFromDiscordMessage, assembleChatFromData, assembleConstructFromData, convertDiscordMessageToMessage } from '../helpers/helpers';
import { AttachmentBuilder, CommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { deleteMessage, disClient, editMessage, isAutoReplyMode, isMultiCharacterMode, registerCommands, sendEmbedAsCharacter, sendMessage, sendMessageAsCharacter, sendMessageEmbed, sendTyping } from '../api/discord';
import { Alias, ChannelConfigInterface, ChatInterface, ConstructInterface } from '../types/types';
import { addVectorFromMessage } from '../api/vector';
import { getDefaultCfg, getDefaultHeight, getDefaultHighresSteps, getDefaultNegativePrompt, getDefaultPrompt, getDefaultSteps, getDefaultWidth, makeImage } from '../api/sd';
import { win } from '..';
import { detectIntent } from '../helpers/actions-helpers';

const store = new Store({
    name: 'discordData',
});

type DiscordMode = 'Character' | 'Construct';
let maxMessages = 25;
let doMultiLine = false;
let doAutoReply = false;
let doStableDiffusion = false;
let doStableReactions = false;
let showDiffusionDetails = false;
let doGeneralPurpose = false;
let diffusionWhitelist: string[] = [];
let replaceUser = true;

function getDiscordSettings(){
    maxMessages = getMaxMessages();
    doMultiLine = getDoMultiLine();
    doAutoReply = getDoAutoReply();
    doStableDiffusion = getDoStableDiffusion();
    doStableReactions = getDoStableReactions();
    doGeneralPurpose = getDoGeneralPurpose();
    diffusionWhitelist = getDiffusionWhitelist();
    showDiffusionDetails = getShowDiffusionDetails();
    replaceUser = getReplaceUser();
}

export const setDiscordMode = (mode: DiscordMode) => {
    store.set('mode', mode);
    console.log(store.get('mode'));
};

export const getDiscordMode = (): DiscordMode => {
    console.log(store.get('mode'));
    return store.get('mode') as DiscordMode;
};

export const clearDiscordMode = () => {
    store.set('mode', null);
};

export const setDoAutoReply = (doAutoReply: boolean): void => {
    store.set('doAutoReply', doAutoReply);
}

export const getDoAutoReply =  (): boolean => {
    return store.get('doAutoReply', false) as boolean;
}

export const setDoStableDiffusion = (doStableDiffusion: boolean): void => {
    store.set('doStableDiffusion', doStableDiffusion);
    doStableDiffusion = doStableDiffusion;
    registerCommands();
}

export const getDoStableDiffusion =  (): boolean => {
    return store.get('doStableDiffusion', false) as boolean;
}

export const setDoStableReactions = (doStableReactions: boolean): void => {
    store.set('doStableReactions', doStableReactions);
    doStableReactions = doStableReactions;
}

export const getDoStableReactions =  (): boolean => {
    return store.get('doStableReactions', false) as boolean;
}

export const setDoGeneralPurpose = (doGeneralPurpose: boolean): void => {
    store.set('doGeneralPurpose', doGeneralPurpose);
    doGeneralPurpose = doGeneralPurpose;
}

export const getDoGeneralPurpose =  (): boolean => {
    return store.get('doGeneralPurpose', false) as boolean;
}

export const setDiffusionWhitelist = (whitelist: string[]): void => {
    store.set('diffusionWhitelist', whitelist);
    diffusionWhitelist = whitelist;
}

export const getDiffusionWhitelist = (): string[] => {
    return store.get('diffusionWhitelist', []) as string[];
}

export const addDiffusionWhitelist = (channelID: string): void => {
    let whitelist = getDiffusionWhitelist();
    if(!whitelist.includes(channelID)){
        whitelist.push(channelID);
    }
    store.set('diffusionWhitelist', whitelist);
    diffusionWhitelist = whitelist;
}

export const removeDiffusionWhitelist = (channelID: string): void => {
    let whitelist = getDiffusionWhitelist();
    if(whitelist.includes(channelID)){
        whitelist.splice(whitelist.indexOf(channelID), 1);
    }
    store.set('diffusionWhitelist', whitelist);
    diffusionWhitelist = whitelist;
}

export const setShowDiffusionDetails = (show: boolean): void => {
    store.set('showDiffusionDetails', show);
    showDiffusionDetails = show;
}

export const getShowDiffusionDetails = (): boolean => {
    return store.get('showDiffusionDetails', false) as boolean;
}

export const setReplaceUser = (replace: boolean): void => {
    store.set('replaceUser', replace);
    replaceUser = replace;
}

export const getReplaceUser = (): boolean => {
    return store.get('replaceUser', false) as boolean;
}

export async function getUsername(userID: string, channelID: string){
    const channels = getRegisteredChannels();
    for(let i = 0; i < channels?.length; i++){
        if(channels[i]?._id === channelID){
            if(channels[i]?.aliases === undefined) continue;
            for(let j = 0; j < channels[i].aliases.length; j++){
                if(channels[i].aliases[j]._id === userID){
                    return channels[i].aliases[j].name;
                }
            }
        }
    }

    try {
        let user = await disClient.users.fetch(userID);
        let name = user.displayName !== undefined ? user.displayName : user.username;
        console.log(name);
        return name;
    } catch (error) {
        console.error('Error fetching user:', error);
        // handle error appropriately here, perhaps returning a default or error value
        return 'Unknown user';
    }
}

export const addAlias = (newAlias: Alias, channelID: string) => {
    const channels = getRegisteredChannels();
    for(let i = 0; i < channels.length; i++){
        if(channels[i]._id === channelID){
            if(channels[i]?.aliases === undefined){
                channels[i].aliases = [];
            }
            
            let replaced = false;
            for(let j = 0; j < channels[i].aliases.length; j++){
                if(channels[i].aliases[j]._id === newAlias._id){
                    channels[i].aliases[j] = newAlias; // Directly replace the alias
                    replaced = true;
                    break;  // Exit the loop once replaced
                }
            }
            
            if (!replaced) {
                channels[i]?.aliases.push(newAlias);
            }
        }
    }
    store.set('channels', channels);
}

export const removeAlias = (aliasID: string, channelID: string) => {
    const channels = getRegisteredChannels();
    for(let i = 0; i < channels.length; i++){
        if(channels[i]?._id === channelID){
            for(let j = 0; j < channels[i].aliases.length; j++){
                if(channels[i].aliases[j]._id === aliasID){
                    channels[i].aliases.splice(j, 1);
                }
            }
        }
    }
    store.set('channels', channels);
}

const getAliases = (channelID: string) => {
    const channels = getRegisteredChannels();
    for(let i = 0; i < channels.length; i++){
        if(channels[i]._id === channelID){
            return channels[i].aliases;
        }
    }
    return [];
}

export const setMaxMessages = (max: number) => {
    store.set('maxMessages', max);
}

export const getMaxMessages = (): number => {
    return store.get('maxMessages', 25) as number;
}

export const getRegisteredChannels = (): ChannelConfigInterface[] => {
    return store.get('channels', []) as ChannelConfigInterface[];
}

export const addRegisteredChannel = (newChannel: ChannelConfigInterface): void => {
    const existingChannels = getRegisteredChannels();
    let registered = false;
    for(let i = 0; i < existingChannels.length; i++){
        if(existingChannels[i]._id === newChannel._id){
            registered = true;
            break;
        }
    }
    if(registered) return;
    if (!existingChannels.includes(newChannel)) {
        existingChannels.push(newChannel);
        store.set('channels', existingChannels);
    }
}

export const removeRegisteredChannel = (channelToRemove: string): void => {
    const existingChannels = getRegisteredChannels();
    const updatedChannels = existingChannels.filter(channel => channel._id !== channelToRemove);
    store.set('channels', updatedChannels);
}

export const isChannelRegistered = (channel: string): boolean => {
    const existingChannels = getRegisteredChannels();
    for(let i = 0; i < existingChannels.length; i++){
        if(existingChannels[i]._id === channel){
            return true;
        }
    }
    return false;
}

export async function handleDiscordMessage(message: Message) {
    if(message.author.bot) return;
    if(message.content.startsWith('.')) return;
    let registeredChannels = getRegisteredChannels();
    let registered = false;
    for(let i = 0; i < registeredChannels.length; i++){
        if(registeredChannels[i]._id === message.channel.id){
            registered = true;
            break;
        }
    }
    if(!registered && !message.channel.isDMBased()) return;
    const activeConstructs = retrieveConstructs();
    if(activeConstructs.length < 1) return;
    const newMessage = await convertDiscordMessageToMessage(message, activeConstructs);
    addUserFromDiscordMessage(message);
    let constructArray = [];
    for (let i = 0; i < activeConstructs.length; i++) {
        let constructDoc = await getConstruct(activeConstructs[i]);
        let construct = assembleConstructFromData(constructDoc);
        if(construct === null) continue;
        constructArray.push(construct);
    }
    let chatLogData = await getChat(message.channel.id);
    let chatLog;
    if (chatLogData) {
        chatLog = assembleChatFromData(chatLogData);
        if(chatLog === null) return;
        chatLog.messages.push(newMessage);
        chatLog.lastMessage = newMessage;
        chatLog.lastMessageDate = newMessage.timestamp;
        if(!chatLog.constructs.includes(newMessage.userID)){
            chatLog.constructs.push(newMessage.userID);
        }
        if(!chatLog.humans.includes(message.author.id)){
            chatLog.humans.push(message.author.id);
        }
    }else{
        chatLog = {
            _id: message.channel.id,
            name: 'Discord "' + (message?.channel?.isDMBased()? `DM ${message.author.displayName}` : `${message?.channel?.id}`) + `" Chat`,
            type: 'Discord',
            messages: [newMessage],
            lastMessage: newMessage,
            lastMessageDate: newMessage.timestamp,
            firstMessageDate: newMessage.timestamp,
            constructs: activeConstructs,
            humans: [message.author.id],
            chatConfigs: [],
            doVector: (message?.channel?.isDMBased()? true : false),
            global: (message?.channel?.isDMBased()? true : false),
        }
        if(chatLog.messages.length > 0){
            await addChat(chatLog);
        }else{
            return;
        }
    }
    if(message.content.startsWith('-')){
        await updateChat(chatLog);
        return;
    }
    win?.webContents.send(`chat-message-${message.channel.id}`);
    if(chatLog.doVector){
        if(chatLog.global){
            for(let i = 0; i < constructArray.length; i++){
                addVectorFromMessage(constructArray[i]._id, newMessage);
            }
        }else{
            addVectorFromMessage(chatLog._id, newMessage);
        }
    }
    win?.webContents.send(`chat-message-${message.channel.id}`);
    const mode = getDiscordMode();
    if(mode === 'Character'){
        if(isMultiCharacterMode() && !message.channel.isDMBased()){
            chatLog = await doRoundRobin(constructArray, chatLog, message);
            if(chatLog !== undefined)
            if(doAutoReply){
                if(0.25 > Math.random()){
                    chatLog = await doRoundRobin(constructArray, chatLog, message);
                }
            }
        }else{
            sendTyping(message);
            chatLog = await doCharacterReply(constructArray[0], chatLog, message);
        }
    }else if (mode === 'Construct'){
        await sendMessage(message.channel.id, 'Construct Mode is not yet implemented.');
    }
    await updateChat(chatLog);
}

async function doCharacterReply(construct: ConstructInterface, chatLog: ChatInterface, message: Message | CommandInteraction){
    let username: string = 'You';
    let authorID: string = 'You';
    if(message instanceof Message){
        username = message.author.displayName;
        authorID = message.author.id;
    }
    if(message instanceof CommandInteraction){
        username = message.user.displayName;
        authorID = message.user.id;
    }
    let alias = await getUsername(authorID, chatLog._id);
    if(alias !== null && alias !== undefined){
        username = alias;
    }
    if(construct.defaultConfig.haveThoughts && construct.defaultConfig.thinkBeforeChat){
        let thoughtChatLog = await doCharacterThoughts(construct, chatLog, message);
        if(thoughtChatLog !== undefined){
            chatLog = thoughtChatLog;
        }
    }
    if(message.channel === null) return;
    const result = await generateContinueChatLog(construct, chatLog, username, maxMessages, undefined, undefined, undefined, getDoMultiLine(), replaceUser);
    let reply: string;
    if (result !== null) {
        reply = result;
    } else {
        sendMessage(message.channel.id, '**No response from LLM. Check your endpoint or settings and try again.**');
        return;
    }
    const replyMessage = {
        _id: Date.now().toString(),
        user: construct.name,
        avatar: construct.avatar,
        text: reply,
        userID: construct._id,
        timestamp: Date.now(),
        origin: 'Discord - ' + message.channelId,
        isHuman: false,
        isCommand: false,
        isPrivate: false,
        participants: [authorID, construct._id],
        attachments: [],
        isThought: false,
    }
    chatLog.messages.push(replyMessage);
    chatLog.lastMessage = replyMessage;
    chatLog.lastMessageDate = replyMessage.timestamp;
    await sendMessage(message.channel.id, reply);
    await updateChat(chatLog);
    if(construct.defaultConfig.haveThoughts && !construct.defaultConfig.thinkBeforeChat){
        let thoughtChatLog = await doCharacterThoughts(construct, chatLog, message);
        if(thoughtChatLog !== undefined){
            chatLog = thoughtChatLog;
        }
    }
    return chatLog;
}

async function doCharacterThoughts(construct: ConstructInterface, chatLog: ChatInterface, message: Message | CommandInteraction){
    let username: string = 'You';
    let authorID: string = 'You';
    let primaryConstruct = retrieveConstructs()[0];
    if(message instanceof Message){
        username = message.author.displayName;
        authorID = message.author.id;
    }
    if(message instanceof CommandInteraction){
        username = message.user.displayName;
        authorID = message.user.id;
    }
    let alias = await getUsername(authorID, chatLog._id);
    if(alias !== null && alias !== undefined){
        username = alias;
    }
    if(message.channel === null) return;
    const result = await generateThoughts(construct, chatLog, username, maxMessages, getDoMultiLine(), replaceUser);
    let reply: string;
    if (result !== null) {
        reply = result;
    } else {
        sendMessage(message.channel.id, '**No response from LLM. Check your endpoint or settings and try again.**');
        return;
    }
    reply = reply.replace(/\*/g, '');
    reply = `*${reply.trim()}*`
    const replyMessage = {
        _id: Date.now().toString(),
        user: construct.name,
        avatar: construct.avatar,
        text: reply,
        userID: construct._id,
        timestamp: Date.now(),
        origin: 'Discord - ' + message.channelId,
        isHuman: false,
        isCommand: false,
        isPrivate: false,
        participants: [authorID, construct._id],
        attachments: [],
        isThought: true,
    }
    chatLog.messages.push(replyMessage);
    chatLog.lastMessage = replyMessage;
    chatLog.lastMessageDate = replyMessage.timestamp;
    const newEmbed = new EmbedBuilder()
    .setTitle('Thoughts')
    .setDescription(reply)
    .setFooter({text: 'Powered by ConstructOS'})
    .setTimestamp();
    if(primaryConstruct === construct._id){
        await sendMessageEmbed(message.channel.id, newEmbed);
    }else{
        await sendEmbedAsCharacter(construct, message.channel.id, newEmbed);
    }
    await updateChat(chatLog);
    return chatLog;
}

async function doRoundRobin(constructArray: ConstructInterface[], chatLog: ChatInterface, message: Message | CommandInteraction){
    let primaryConstruct = retrieveConstructs()[0];
    let username: string = 'You';
    let authorID: string = 'You';
    if(message instanceof Message){
        username = message.author.displayName;
        authorID = message.author.id;
    }
    if(message instanceof CommandInteraction){
        username = message.user.displayName;
        authorID = message.user.id;
    }
    let alias = await getUsername(authorID, chatLog._id);
    if(alias !== null && alias !== undefined && alias){
        username = alias;
    }
    if(message.channel === null) return;
    let lastMessageContent = chatLog.lastMessage.text;
    let mentionedConstruct = containsName(lastMessageContent, constructArray);
    if (mentionedConstruct) {
        // Find the index of the mentioned construct
        let mentionedIndex = -1;
        for (let i = 0; i < constructArray.length; i++) {
            if (constructArray[i].name === mentionedConstruct) {
                mentionedIndex = i;
                break;
            }
        }

        // If the mentioned construct was found in the array,
        // rearrange the array to make it the first element
        if (mentionedIndex !== -1) {
            const [mentioned] = constructArray.splice(mentionedIndex, 1);
            constructArray.unshift(mentioned);
        }
    }
    for(let i = 0; i < constructArray.length; i++){
        if (i !== 0) {
            if (0.10 > Math.random()) {
                continue;
            }
        }
        let tries = 0;
        let result;
        sendTyping(message);
        if(constructArray[i].defaultConfig.haveThoughts && constructArray[i].defaultConfig.thinkBeforeChat){
            let thoughtChatLog = await doCharacterThoughts(constructArray[i], chatLog, message);
            if(thoughtChatLog !== undefined){
                chatLog = thoughtChatLog;
            }
        }
        do {
            result = await generateContinueChatLog(constructArray[i], chatLog, username, maxMessages, undefined, undefined, undefined, getDoMultiLine(), replaceUser);
            tries++;
            if (tries > 10) {
                sendMessage(message.channel.id, '**No response from LLM. Check your endpoint or settings and try again.**');
                return;
                break;
            }
        } while (result === null);
        
        let reply: string = result;
        if(reply.trim() === '') continue;
        const replyMessage = {
            _id: Date.now().toString(),
            user: constructArray[i].name,
            avatar: constructArray[i].avatar,
            text: reply,
            userID: constructArray[i]._id,
            timestamp: Date.now(),
            origin: 'Discord - ' + message.channelId,
            isHuman: false,
            isCommand: false,
            isPrivate: false,
            participants: [authorID, constructArray[i]._id],
            attachments: [],
            isThought: false,
        }
        chatLog.messages.push(replyMessage);
        chatLog.lastMessage = replyMessage;
        chatLog.lastMessageDate = replyMessage.timestamp;
        await updateChat(chatLog);
        if(primaryConstruct === constructArray[i]._id){
            await sendMessage(message.channel.id, reply);
        }else{
            await sendMessageAsCharacter(constructArray[i], message.channel.id, reply);
        }
        win?.webContents.send(`chat-message-${message.channel.id}`);
        if(chatLog.doVector){
            if(chatLog.global){
                for(let i = 0; i < constructArray.length; i++){
                    addVectorFromMessage(constructArray[i]._id, replyMessage);
                }
            }else{
                addVectorFromMessage(chatLog._id, replyMessage);
            }
        }
        if(constructArray[i].defaultConfig.haveThoughts && !constructArray[i].defaultConfig.thinkBeforeChat){
            let thoughtChatLog = await doCharacterThoughts(constructArray[i], chatLog, message);
            if(thoughtChatLog !== undefined){
                chatLog = thoughtChatLog;
            }
        }
    }
    return chatLog;
}

export async function continueChatLog(interaction: CommandInteraction) {
    let registeredChannels = getRegisteredChannels();
    let registered = false;
    if(interaction.channel === null) return;
    for(let i = 0; i < registeredChannels.length; i++){
        if(registeredChannels[i]._id === interaction.channel.id){
            registered = true;
            break;
        }
    }
    if(!registered) return;
    const activeConstructs = retrieveConstructs();
    if(activeConstructs.length < 1) return;
    let constructArray = [];
    for (let i = 0; i < activeConstructs.length; i++) {
        let constructDoc = await getConstruct(activeConstructs[i]);
        let construct = assembleConstructFromData(constructDoc);
        if(construct === null) continue;
        constructArray.push(construct);
    }
    let chatLogData = await getChat(interaction.channel.id);
    let chatLog;
    if (chatLogData) {
        chatLog = assembleChatFromData(chatLogData);
    }
    if(chatLog === null || chatLog === undefined){
        return;
    }
    if(chatLog.messages.length < 1){
        return;
    }
    const mode = getDiscordMode();
    if(mode === 'Character'){
        sendTyping(interaction);
        if(isMultiCharacterMode()){
            chatLog = await doRoundRobin(constructArray, chatLog, interaction);
            if(chatLog !== undefined)
            if(doAutoReply){
                if(0.25 > Math.random()){
                    chatLog = await doRoundRobin(constructArray, chatLog, interaction);
                }
            }
        }else{
            chatLog = await doCharacterReply(constructArray[0], chatLog, interaction);
        }
    }else if (mode === 'Construct'){
        await sendMessage(interaction.channel.id, 'Construct Mode is not yet implemented.');
    }
    if(chatLog !== undefined)
    await updateChat(chatLog);
}

export async function handleRengenerateMessage(message: Message){
    let registeredChannels = getRegisteredChannels();
    let registered = false;
    if(message.channel === null){
        console.log('Channel is null');
        return;
    }
    for(let i = 0; i < registeredChannels.length; i++){
        if(registeredChannels[i]._id === message.channel.id){
            registered = true;
            break;
        }
    }
    if(!registered){
        console.log('Channel is not registered');
        return;
    }
    let chatLogData = await getChat(message.channel.id);
    let chatLog;
    if (chatLogData) {
        chatLog = assembleChatFromData(chatLogData);
    }
    if(chatLog === undefined || chatLog === null){
        console.log('Chat log is undefined');
        return;
    }
    if(chatLog.messages.length <= 1){
        console.log('Chat log has no messages');
        return;
    }
    let edittedMessage = await regenerateMessageFromChatLog(chatLog, message.content);
    if(edittedMessage === undefined){
        console.log('Editted message is undefined');
        return;
    }
    await editMessage(message, edittedMessage);
}

export async function handleRemoveMessage(message: Message){
    let registeredChannels = getRegisteredChannels();
    let registered = false;
    if(message.channel === null) return;
    for(let i = 0; i < registeredChannels.length; i++){
        if(registeredChannels[i]._id === message.channel.id){
            registered = true;
            break;
        }
    }
    if(!registered) return;
    let chatLogData = await getChat(message.channel.id);
    let chatLog;
    if (chatLogData) {
        chatLog = assembleChatFromData(chatLogData);
    }
    if(chatLog === undefined || chatLog === null){
        return;
    }
    if(chatLog.messages.length < 1){
        return;
    }
    await removeMessagesFromChatLog(chatLog, message.content);
    await deleteMessage(message);
}

function containsName(message: string, chars: ConstructInterface[]){
    for(let i = 0; i < chars.length; i++){
        if(message.toLowerCase().trim().includes(chars[i].name.toLowerCase().trim())){
            return chars[i].name;
        }
    }
    return false;
}

export async function doImageReaction(message: Message){
    if(!doStableReactions){
        console.log('Stable Reactions is disabled');
        return;
    }
    if(!diffusionWhitelist.includes(message.channel.id)){
        console.log('Channel is not whitelisted');
        return;
    }
    if(message.attachments.size > 0){
        message.react('❎');
        console.log('Message has an attachment');
        return;
    }
    if(message.embeds.length > 0){
        message.react('❎');
        console.log('Message has an embed');
        return;
    }
    if(message.content.includes('http')){
        message.react('❎');
        console.log('Message has a link');
        return;
    }
    if(message.content.includes('www')){
        console.log('Message has a link');
        message.react('❎');
        return;
    }
    if(message.content.includes('.com')){
        message.react('❎');
        console.log('Message has a link');
        return;
    }
    if(message.content.includes('.net')){
        message.react('❎');
        console.log('Message has a link');
        return;
    }
    if(message.cleanContent.length < 1){
        message.react('❎');
        console.log('Message has no content');
        return;
    }

    message.react('✅');
    let prompt = message.cleanContent;
    let imageData = await makeImage(prompt).then((data) => {
        return data;
    }).catch((err) => {
        console.log(err);
        return null;
    });
    if(imageData === null){
        if(message?.reactions?.cache?.get('✅') !== undefined){
            // @ts-ignore
            message.reactions.cache.get('✅').remove();
        }
        message.react('❌');
        console.log('Image data is null');
        return;
    }
    const buffer = Buffer.from(imageData.base64, 'base64');
    let attachment = new AttachmentBuilder(buffer, {name: `${imageData.name}`});
    const embed = new EmbedBuilder()
    .setTitle('Imagine')
    .setFields([
        {
            name: 'Prompt',
            value: getDefaultPrompt() + prompt,
            inline: false,
        },
        {
            name: 'Negative Prompt',
            value: `${getDefaultNegativePrompt()}`,
            inline: false,
        },
        {
            name: 'Steps',
            value: getDefaultSteps().toString(),
            inline: true,
        },
        {
            name: 'CFG',
            value: getDefaultCfg().toString(),
            inline: false,
        },
        {
            name: 'Width',
            value: getDefaultWidth().toString(),
            inline: true,
        },
        {
            name: 'Height',
            value: getDefaultHeight().toString(),
            inline: true,
        },
        {
            name: 'Highres Steps',
            value: getDefaultHighresSteps().toString(),
            inline: false,
        },
        {
            name: 'Model',
            value: `${imageData.model}`,
            inline: false,
        }
    ])
    .setImage(`attachment://${imageData.name}`)
    .setFooter({text: 'Powered by Stable Diffusion'});
    if(!showDiffusionDetails){
        message.reply({files: [attachment], embeds: [embed]});
    }else{
        message.reply({files: [attachment]});
    }
}

export async function getMessageIntent(message: Message){
    const text = message.cleanContent;
    if(text.length < 1) return;
    const intent = await detectIntent(text);
    if(intent === null) return;
    if(intent === undefined) return;
    if(intent.intent === 'none'){
        message.reply('<@' + message.author.id + '> is not asking for anything.\n' + `Scores are the following:\n**Search:** ${intent.searchScore}\n**Selfie:** ${intent.nudeScore}\n**Extracted Subject:** ${intent.subject}\n**Yes:** ${intent.compliance}`);
    }else if(intent.intent === 'search'){
        message.reply('<@' + message.author.id + '> is asking to ' + intent.intent + `.\nScores are the following:\n**Search:** ${intent.searchScore}\n**Selfie:** ${intent.nudeScore}\n**Extracted Subject:** ${intent.subject}\n**Yes:** ${intent.compliance}`);
    }else{
        message.reply('<@' + message.author.id + '> is asking for an image of ' + intent.intent + `.\nScores are the following:\n**Search:** ${intent.searchScore}\n**Selfie:** ${intent.nudeScore}\n**Extracted Subject:** ${intent.subject}\n**Yes:** ${intent.compliance}`);
    }
}

function DiscordController(){
    getDiscordSettings();
    ipcMain.on('discordMode', (event, arg) => {
        setDiscordMode(arg);
    });

    ipcMain.handle('getDiscordMode', () => {
        return getDiscordMode();
    });

    ipcMain.on('clearDiscordMode', () => {
        clearDiscordMode();
    });

    ipcMain.handle('getRegisteredChannels', () => {
        return getRegisteredChannels();
    });

    ipcMain.handle('addRegisteredChannel', (event, arg) => {
        addRegisteredChannel(arg);
    });

    ipcMain.handle('removeRegisteredChannel', (event, arg) => {
        removeRegisteredChannel(arg);
    });

    ipcMain.handle('isChannelRegistered', (event, arg) => {
        return isChannelRegistered(arg);
    });

    ipcMain.on('get-do-stable-diffusion', (event, arg) => {
        event.reply('get-do-stable-diffusion-reply', getDoStableDiffusion());
    });

    ipcMain.on('set-do-stable-diffusion', (event, arg) => {
        setDoStableDiffusion(arg);
    });

    ipcMain.on('get-do-stable-reactions', (event, arg) => {
        event.reply('get-do-stable-reactions-reply', getDoStableReactions());
    });

    ipcMain.on('set-do-stable-reactions', (event, arg) => {
        setDoStableReactions(arg);
    });

    ipcMain.on('get-do-general-purpose', (event, arg) => {
        event.reply('get-do-general-purpose-reply', getDoGeneralPurpose());
    });

    ipcMain.on('set-do-general-purpose', (event, arg) => {
        setDoGeneralPurpose(arg);
    });

    ipcMain.on('get-do-auto-reply', (event, arg) => {
        event.reply('get-do-auto-reply-reply', getDoAutoReply());
    });

    ipcMain.on('set-do-auto-reply', (event, arg) => {
        setDoAutoReply(arg);
    });

    ipcMain.handle('get-diffusion-whitelist', (event, arg) => {
        return getDiffusionWhitelist();
    });

    ipcMain.handle('add-diffusion-whitelist', (event, arg) => {
        addDiffusionWhitelist(arg);
    });

    ipcMain.handle('remove-diffusion-whitelist', (event, arg) => {
        removeDiffusionWhitelist(arg);
    });

    ipcMain.on('get-show-diffusion-details', (event, arg) => {
        event.sender.send('get-show-diffusion-details-reply', getShowDiffusionDetails());
    });

    ipcMain.on('set-show-diffusion-details', (event, arg) => {
        setShowDiffusionDetails(arg);
    });
}

export default DiscordController;