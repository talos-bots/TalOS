import Store from 'electron-store';
import { generateContinueChatLog, generateThoughts, getDoMultiLine, regenerateMessageFromChatLog, removeMessagesFromChatLog, retrieveConstructs } from './ChatController';
import { addChat, getAllConstructs, getChat, getConstruct, updateChat } from '../api/pouchdb';
import { addUserFromDiscordMessage, assembleChatFromData, assembleConstructFromData, convertDiscordMessageToMessage } from '../helpers/helpers';
import { AttachmentBuilder, CommandInteraction, EmbedBuilder, GuildMember, Message, MessageComponentInteraction } from 'discord.js';
import { cancel, deleteMessage, disClient, editMessage, getStopList, isAutoReplyMode, isMultiCharacterMode, isMultiConstructMode, registerCommands, sendAttachment, sendAttachmentAsCharacter, sendEmbedAsCharacter, sendMessage, sendMessageAsCharacter, sendMessageEmbed, sendReply, sendTyping, waitFor } from '../api/discord';
import { Alias, AttachmentInferface, ChannelConfigInterface, ChatInterface, ConstructInterface, MessageInterface } from '../types/types';
import { addVectorFromMessage } from '../api/vector';
import { getDefaultCfg, getDefaultHeight, getDefaultHighresSteps, getDefaultNegativePrompt, getDefaultPrompt, getDefaultSteps, getDefaultWidth, makeImage } from '../api/sd';
import { expressApp, expressAppIO, win } from '..';
import { detectIntent } from '../helpers/actions-helpers';
import { createSelfieForConstruct } from '../helpers/discord-helpers';
import { cancelGeneration } from '../api/llm';
import { getShowDiscordUserInfo } from './ActiveConstructController';

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
let lastIntentData: any = null;
let delay = 0;
let doDelay = false;

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

export const setDoStableReactions = (newStatus: boolean): void => {
    store.set('doStableReactions', newStatus);
    doStableReactions = newStatus;
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

export const setDelay = (delay: number): void => {
    store.set('delay', delay);
    delay = delay;
}

export const getDelay = (): number => {
    return store.get('delay', 0) as number;
}

export const setDoDelay = (doDelay: boolean): void => {
    store.set('doDelay', doDelay);
    doDelay = doDelay;
}

export const getDoDelay = (): boolean => {
    return store.get('doDelay', false) as boolean;
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
        let name = user?.displayName !== undefined ? user.displayName : user.username;
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

export function setInterrupted(channelID: string){
    cancelGeneration();
    isInterrupted = true;
    interruptedChannel = channelID;
}

let isInterrupted = false;
let interruptedChannel = '';
let generationFailure = false;

export async function handleDiscordMessage(message: Message) {
    const activeConstructs = retrieveConstructs();
    const newMessage = await convertDiscordMessageToMessage(message, activeConstructs);
    addUserFromDiscordMessage(message);
    let constructArray = [];
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
            constructs: [activeConstructs[0]],
            humans: [message.author.id],
            chatConfigs: [],
            doVector: (message?.channel?.isDMBased()? true : false),
            global: (message?.channel?.isDMBased()? true : false),
        }
        if(chatLog.messages.length > 0){
            await addChat(chatLog);
        }
    }
    for (let i = 0; i < chatLog.constructs.length; i++) {
        let constructDoc = await getConstruct(chatLog.constructs[i]);
        let construct = assembleConstructFromData(constructDoc);
        if(construct === null) continue;
        constructArray.push(construct);
    }
    if(chatLog.messages.length === 1){
        isInterrupted = false;
        interruptedChannel = '';
    }
    if(!chatLog.messages.includes(newMessage)){
        chatLog.messages.push(newMessage);
    }
    const intentData = await detectIntent(newMessage.text);
    if(intentData !== null){
        if(intentData?.intent !== 'none'){
            lastIntentData = intentData;
        }
    }
    if(message.content.startsWith('-')){
        await updateChat(chatLog);
        return;
    }
    if(chatLog.doVector){
        if(chatLog.global){
            for(let i = 0; i < constructArray.length; i++){
                addVectorFromMessage(constructArray[i]._id, newMessage);
            }
        }else{
            addVectorFromMessage(chatLog._id, newMessage);
        }
    }
    await updateChat(chatLog);
    expressAppIO.emit(`chat-message-${message.channel.id}`);
    if(isMultiConstructMode() && !message.channel.isDMBased()){
        let lastMessageContent = chatLog.lastMessage.text;
        let shuffledConstructs = constructArray;
        for (let i = shuffledConstructs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledConstructs[i], shuffledConstructs[j]] = [shuffledConstructs[j], shuffledConstructs[i]];
        }
        // Logic to move the mentioned construct to the start
        let mentionedConstruct = containsName(lastMessageContent, constructArray);
        if (mentionedConstruct) {
            let mentionedIndex = shuffledConstructs.findIndex(construct => construct.name === mentionedConstruct);
            
            if (mentionedIndex !== -1) {
                const [mentioned] = shuffledConstructs.splice(mentionedIndex, 1);
                shuffledConstructs.unshift(mentioned);
            }
        }

        chatLog = await doRoundRobin(shuffledConstructs, chatLog, message);
        if (chatLog === undefined) return;

        let hasBeenMention = true;
        let lastMessageText = chatLog?.lastMessage?.text;
        let iterations = 0;

        do {
            if(isInterrupted && interruptedChannel === message.channel.id){
                break;
            }
            if (chatLog?.lastMessage?.text === undefined) break;
            
            if (iterations > 0 && lastMessageText === chatLog.lastMessage.text) break;
            
            iterations++;
            hasBeenMention = false;
            
            for (let i = 0; i < shuffledConstructs.length; i++) {
                if(isInterrupted && interruptedChannel === message.channel.id){
                    break;
                }
                if (isMentioned(lastMessageText, shuffledConstructs[i]) && chatLog.lastMessage.isHuman && !chatLog.lastMessage.isThought && (chatLog.lastMessage.userID !== shuffledConstructs[i]._id)) {
                    hasBeenMention = true;
                    break;
                }
            }
            
            if (hasBeenMention) {
                chatLog = await doRoundRobin(shuffledConstructs, chatLog, message);
            }
        } while (hasBeenMention);

        while (true && !generationFailure) {
            let shouldContinue = false; // By default, we assume we won't need another iteration
            if(chatLog?.lastMessage.text === undefined) break;
            if(isInterrupted && interruptedChannel === message.channel.id){
                break;
            }
            for(let i = 0; i < shuffledConstructs.length; i++) {
                if(isInterrupted && interruptedChannel === message.channel.id){
                    break;
                }
                let config = shuffledConstructs[i].defaultConfig;
                
                if (chatLog?.lastMessage?.isHuman) { // Last message is from a human
                    if (config.replyToUser >= Math.random()) {
                        let replyLog = await doCharacterReply(shuffledConstructs[i], chatLog, message);
                        if (replyLog !== undefined) {
                            chatLog = replyLog;
                        }
                        shouldContinue = true;
                    }
                } else { // Last message is from a construct
                    if (config.replyToConstruct >= Math.random() && chatLog.lastMessage.userID !== shuffledConstructs[i]._id) {
                        let replyLog = await doCharacterReply(shuffledConstructs[i], chatLog, message);
                        if (replyLog !== undefined) {
                            chatLog = replyLog;
                        }
                        shouldContinue = true;
                    }
                }
            }
            if (!shouldContinue) {
                // No construct felt the need to reply, so we can break out of the loop
                break;
            }
        }
    }else{
        console.log('single character mode')
        let config = constructArray[0].defaultConfig;
        if(chatLog.chatConfigs !== undefined && chatLog.chatConfigs.length > 0){
            for(let j = 0; j < chatLog.chatConfigs.length; j++){
                if(chatLog.chatConfigs[j]._id === constructArray[0]._id){
                    config = chatLog.chatConfigs[j];
                    break;
                }
            }
        }
        if(!config.doLurk){
            console.log('not lurking')
            let wasMentioned = isMentioned(chatLog.lastMessage.text, constructArray[0]) && chatLog.lastMessage.isHuman;
            if(wasMentioned){
                if(config.replyToUserMention >= Math.random()){
                    sendTyping(message);
                    console.log('replying to user mention')
                    let replyLog = await doCharacterReply(constructArray[0], chatLog, message);
                    if(replyLog !== undefined){
                        chatLog = replyLog;
                    }
                }
            }else{
                if(config.replyToUser >= Math.random()){
                    console.log('replying to user')
                    sendTyping(message);
                    let replyLog = await doCharacterReply(constructArray[0], chatLog, message);
                    if(replyLog !== undefined){
                        chatLog = replyLog;
                    }
                }
            }
        }else{
            console.log('lurking')
        }
    }
    if(isInterrupted && interruptedChannel === message.channel.id){
        isInterrupted = false;
        interruptedChannel = '';
    }
    if(generationFailure){
        generationFailure = false;
    }
}

async function doCharacterReply(construct: ConstructInterface, chatLog: ChatInterface, message: Message | CommandInteraction){
    if(isInterrupted && interruptedChannel === message.channelId){
        console.log('interrupted')
        return chatLog;
    }
    let stopList = undefined;
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
    if(message.guildId !== null){
        stopList = await getStopList(message.guildId, message.channelId);
    }
    let alias = await getUsername(authorID, chatLog._id);
    if(alias !== null && alias !== undefined){
        username = alias;
    }
    if(construct.defaultConfig.haveThoughts && construct.defaultConfig.thinkBeforeChat){
        if(construct.defaultConfig.thoughtChance >= Math.random()){
            sendTyping(message);
            let thoughtChatLog = await doCharacterThoughts(construct, chatLog, message);
            if(thoughtChatLog !== undefined){
                chatLog = thoughtChatLog;
            }
        }
    }
    if(message.channel === null){
        console.log('channel is null')
        return chatLog;
    }
    let dataString = '';
    sendTyping(message);
    if(getShowDiscordUserInfo() && !message.channel.isDMBased() && message instanceof Message && message.guildId !== null){
        const userData = await assembleUserProfile(message.guildId, message.author.id);
        if(userData !== null && userData !== undefined){
            dataString = userData;
        }
    }
    const result = await generateContinueChatLog(construct, chatLog, username, maxMessages, stopList, undefined, undefined, getDoMultiLine(), replaceUser, dataString);
    if(result === null){
        generationFailure = true;
        return chatLog;
    }
    let reply: string;
    if (result !== null) {
        reply = result;
    } else {
        if(isInterrupted && interruptedChannel === message.channelId){
            console.log('interrupted')
            return chatLog;
        }
        console.log('no response from LLM')
        return chatLog;
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
    if(lastIntentData !== null && construct.defaultConfig.doActions === true){
        const currentIntentData = await detectIntent(reply);
        if(currentIntentData !== null){
            if(lastIntentData?.intent !== 'search'){
                if(currentIntentData?.compliance === true){
                    const imageData = await createSelfieForConstruct(construct, lastIntentData?.intent, currentIntentData?.subject);
                    if(imageData !== null){
                        const buffer = Buffer.from(imageData.base64, 'base64');
                        let attachment = new AttachmentBuilder(buffer, {name: `${imageData.name}`});
                        if(primaryConstruct === construct._id){
                            await sendAttachment(message.channel.id, attachment);
                        }else{
                            await sendAttachmentAsCharacter(construct, message.channel.id, attachment);
                        }
                        lastIntentData = null;
                        const selfieMessage = createSelfieMessage(imageData.name, construct);
                        chatLog.messages.push(selfieMessage);
                    }
                }
            }
        }
    }
    if(primaryConstruct === construct._id){
        console.log('sending message as primary')
        if(0.5 >= Math.random() && !message.channel.isDMBased() && message instanceof Message){
            await sendReply(message, reply);
        }else{
            await sendMessage(message.channel.id, reply);
        }
    }else{
        console.log('sending message as character')
        await sendMessageAsCharacter(construct, message.channel.id, reply);
    }
    if(construct.defaultConfig.haveThoughts && !construct.defaultConfig.thinkBeforeChat){
        if(construct.defaultConfig.thoughtChance >= Math.random()){
            sendTyping(message);
            console.log('thinking after chat')
            let thoughtChatLog = await doCharacterThoughts(construct, chatLog, message);
            if(thoughtChatLog !== undefined){
                chatLog = thoughtChatLog;
            }
        }
    }
    await updateChat(chatLog);
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
    if(isInterrupted && interruptedChannel === message.channelId){
        console.log('interrupted')
        return chatLog;
    }
    const result = await generateThoughts(construct, chatLog, username, maxMessages, getDoMultiLine(), replaceUser);
    if(result === null){
        generationFailure = true;
        return chatLog;
    }
    if(isInterrupted && interruptedChannel === message.channelId){
        console.log('interrupted')
        return chatLog;
    }
    let reply: string;
    if (result !== null) {
        reply = result;
    } else {
        if(isInterrupted && interruptedChannel === message.channelId){
            console.log('interrupted')
            return chatLog;
        }
        return chatLog;
    }
    reply = reply.replace(/\*/g, '');
    reply = `*${reply.trim()}*`
    if(reply.trim().length <= 2) return chatLog;
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
    .setFooter({text: 'Powered by TalOS'})
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
    if(message.channel === null){
        console.log('channel is null')
        return chatLog;
    }
    for(let i = 0; i < constructArray.length; i++){
        if(isInterrupted && interruptedChannel === message.channelId){
            break;
        }
        let config = constructArray[i].defaultConfig;
        if(chatLog.chatConfigs !== undefined && chatLog.chatConfigs.length > 0){
            for(let j = 0; j < chatLog.chatConfigs.length; j++){
                if(chatLog.chatConfigs[j]._id === constructArray[i]._id){
                    config = chatLog.chatConfigs[j];
                    break;
                }
            }
        }
        if(config === undefined) continue;
        if(config.doLurk === true) continue;
        let wasMentioned = isMentioned(chatLog.lastMessage.text, constructArray[i]);
        const wasMentionedByHuman = chatLog.lastMessage.isHuman && wasMentioned;
        const wasHuman = chatLog.lastMessage.isHuman;
        if(wasMentionedByHuman){
            if(config.replyToUserMention >= Math.random()){
                if(isInterrupted && interruptedChannel === message.channelId){
                    console.log('interrupted')
                    return chatLog;
                }
                let replyLog = await doCharacterReply(constructArray[i], chatLog, message);
                if(replyLog !== undefined){
                    chatLog = replyLog;
                }
            }
        }else if(wasMentioned && chatLog.lastMessage.userID !== constructArray[i]._id){
            if(config.replyToConstructMention >= Math.random()){
                if(isInterrupted && interruptedChannel === message.channelId){
                    console.log('interrupted')
                    return chatLog;
                }
                let replyLog = await doCharacterReply(constructArray[i], chatLog, message);
                if(replyLog !== undefined){
                    chatLog = replyLog;
                }
            }
        }else{
            if(wasHuman){
                if(config.replyToUser >= Math.random()){
                    if(isInterrupted && interruptedChannel === message.channelId){
                        console.log('interrupted')
                        return chatLog;
                    }
                    let replyLog = await doCharacterReply(constructArray[i], chatLog, message);
                    if(replyLog !== undefined){
                        chatLog = replyLog;
                    }
                }
            }else{
                if(config.replyToConstruct >= Math.random()){
                    if(isInterrupted && interruptedChannel === message.channelId){
                        console.log('interrupted')
                        return chatLog;
                    }
                    let replyLog = await doCharacterReply(constructArray[i], chatLog, message);
                    if(replyLog !== undefined){
                        chatLog = replyLog;
                    }
                }
            }
        }
    }
    return chatLog;
}

export function createSelfieMessage(attachmentURL: string, construct: ConstructInterface){
    const attachment: AttachmentInferface = {
        _id: new Date().getTime().toString(),
        name: 'Selfie taken by ' + construct.name,
        type: 'image/png',
        data: `/api/images/${attachmentURL}`,
        fileext: 'png',
        metadata: ''
    }
    const newMessage: MessageInterface = {
        _id: new Date().getTime().toString(),
        user: construct.name,
        avatar: construct.avatar,
        text: '',
        userID: construct._id,
        timestamp: new Date().getTime(),
        origin: 'Selfie',
        isHuman: false,
        isCommand: false,
        isPrivate: false,
        participants: [construct._id],
        attachments: [attachment],
        isThought: false,
    }
    return newMessage;
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
    let constructArray = [];
    let chatLogData = await getChat(interaction.channelId).then((doc) => {
        return doc;
    }).catch((err) => {
        console.log(err);
        console.log('Error getting chat log');
    });
    let chatLog;
    if (chatLogData) {
        chatLog = assembleChatFromData(chatLogData);
    }
    if(chatLog === null || chatLog === undefined){
        return console.log('Chat log is null or undefined');
    }
    for (let i = 0; i < chatLog.constructs.length; i++) {
        let constructDoc;
        try{
            constructDoc = await getConstruct(chatLog.constructs[i]);
        }catch(e){
            console.log(e);
            console.log('Error getting construct');
        }
        if(constructDoc === null){
            continue;
        }
        let construct = assembleConstructFromData(constructDoc);
        if(construct === null) continue;
        constructArray.push(construct);
    }
    if(isMultiConstructMode() && !interaction.channel.isDMBased()){
        let lastMessageContent = chatLog.lastMessage.text;
        let shuffledConstructs = constructArray;
        for (let i = shuffledConstructs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledConstructs[i], shuffledConstructs[j]] = [shuffledConstructs[j], shuffledConstructs[i]];
        }
        // Logic to move the mentioned construct to the start
        let mentionedConstruct = containsName(lastMessageContent, constructArray);
        if (mentionedConstruct) {
            let mentionedIndex = shuffledConstructs.findIndex(construct => construct.name === mentionedConstruct);
            
            if (mentionedIndex !== -1) {
                const [mentioned] = shuffledConstructs.splice(mentionedIndex, 1);
                shuffledConstructs.unshift(mentioned);
            }
        }

        chatLog = await doRoundRobin(shuffledConstructs, chatLog, interaction);
        if (chatLog === undefined) return;

        let hasBeenMention = true;
        let lastMessageText = chatLog?.lastMessage?.text;
        let iterations = 0;

        do {
            if(isInterrupted && interruptedChannel === interaction.channelId){
                break;
            }
            if (chatLog?.lastMessage?.text === undefined) break;
            
            if (iterations > 0 && lastMessageText === chatLog.lastMessage.text) break;
            
            iterations++;
            hasBeenMention = false;
            
            for (let i = 0; i < shuffledConstructs.length; i++) {
                if(isInterrupted && interruptedChannel === interaction.channelId){
                    break;
                }
                if (isMentioned(lastMessageText, shuffledConstructs[i]) && chatLog.lastMessage.isHuman && !chatLog.lastMessage.isThought && (chatLog.lastMessage.userID !== shuffledConstructs[i]._id)) {
                    hasBeenMention = true;
                    break;
                }
            }
            
            if (hasBeenMention) {
                chatLog = await doRoundRobin(shuffledConstructs, chatLog, interaction);
            }
        } while (hasBeenMention);

        while (true) { // The loop to make replies continuously until no construct feels the need to reply
            let shouldContinue = false; // By default, we assume we won't need another iteration
            if(chatLog?.lastMessage.text === undefined) break;
            if(isInterrupted && interruptedChannel === interaction.channelId){
                break;
            }
            for(let i = 0; i < shuffledConstructs.length; i++) {
                if(isInterrupted && interruptedChannel === interaction.channelId){
                    break;
                }
                let config = shuffledConstructs[i].defaultConfig;
                
                if (chatLog?.lastMessage?.isHuman) { // Last message is from a human
                    if (config.replyToUser >= Math.random()) {
                        let replyLog = await doCharacterReply(shuffledConstructs[i], chatLog, interaction);
                        if (replyLog !== undefined) {
                            chatLog = replyLog;
                        }
                        shouldContinue = true;
                    }
                } else { // Last message is from a construct
                    if (config.replyToConstruct >= Math.random() && chatLog.lastMessage.userID !== shuffledConstructs[i]._id) {
                        let replyLog = await doCharacterReply(shuffledConstructs[i], chatLog, interaction);
                        if (replyLog !== undefined) {
                            chatLog = replyLog;
                        }
                        shouldContinue = true;
                    }
                }
            }
            if (!shouldContinue) {
                // No construct felt the need to reply, so we can break out of the loop
                break;
            }
        }
    }else{
        let config = constructArray[0].defaultConfig;
        if(chatLog.chatConfigs !== undefined && chatLog.chatConfigs.length > 0){
            for(let j = 0; j < chatLog.chatConfigs.length; j++){
                if(chatLog.chatConfigs[j]._id === constructArray[0]._id){
                    config = chatLog.chatConfigs[j];
                    break;
                }
            }
        }
        if(!config.doLurk === true){
            let wasMentioned = isMentioned(chatLog.lastMessage.text, constructArray[0]) && chatLog.lastMessage.isHuman;
            if(wasMentioned){
                if(config.replyToUserMention >= Math.random()){
                    sendTyping(interaction);
                    let replyLog = await doCharacterReply(constructArray[0], chatLog, interaction);
                    if(replyLog !== undefined){
                        chatLog = replyLog;
                    }
                }
            }else{
                if(config.replyToUser >= Math.random()){
                    sendTyping(interaction);
                    let replyLog = await doCharacterReply(constructArray[0], chatLog, interaction);
                    if(replyLog !== undefined){
                        chatLog = replyLog;
                    }
                }
            }
        }
    }
    if(isInterrupted && interaction.channelId === interruptedChannel){
        isInterrupted = false;
        interruptedChannel = '';
    }
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
        if(isMentioned(message, chars[i])){
            return chars[i].name;
        }
    }
    return false;
}

function isMentioned(message: string, char: ConstructInterface){
    if((message.toLowerCase().trim().includes(char.name.toLowerCase().trim()) && char.name !== '') || (message.toLowerCase().trim().includes(char.nickname.toLowerCase().trim()) && char.nickname !== '')){
        return true;
    }
    return false;
}

export async function assembleUserProfile(ServerID: string, userID: string, isDM = false){
    if(!isDM){
        let userData;
        let userRoles: string[] = [];
        let serverData;
        serverData = await disClient.guilds.fetch(ServerID);
        if(!serverData){
            console.log('Server not found');
            return;
        }
        userData = await serverData.members.fetch(userID) as GuildMember;
        if(!userData){
            console.log('User not found');
            return;
        }
        userData.roles.cache.forEach(role => {
            userRoles.push(role.name);
        });
        let status = '';
        if(userData?.presence === undefined || userData?.presence === null) return;
        if(userData?.presence.activities === undefined){
            status = 'No status';
        }else if(userData?.presence.activities.length > 0){
            switch (userData?.presence.activities[0].type) {
                case 0:
                    status = `Playing ${userData.presence.activities[0].name}`;
                break;
                case 2:
                    status = `Listening to ${userData.presence.activities[0].details} by ${userData.presence.activities[0].state} on ${userData.presence.activities[0].name}`;
                break;
                default:
                    status = `${userData?.presence.activities[0].name}`;
                break;
            }
        }else{
            status = 'No status';
        }
        const userObject = {
            username: userData.user.username ? userData.user.username : 'No username',
            nickname: userData.nickname ? userData.nickname : 'No nickname',
            roles: userRoles,
            joined: userData.joinedAt ? userData.joinedAt : 'Not inside a server.',
            created: userData.user.createdAt ? userData.user.createdAt : 'Not inside a server.',
            status : status,
        }
        let userString = `[{{char}} is speaking to ${userObject.username} ${userObject.nickname !== 'No nickname' ? `(${userObject.nickname})` : ''} in ${serverData.name}. ${userObject.username} is ${userObject.status}. ${userObject.username} joined the server on ${userObject.joined}. ${userObject.username} created their account on ${userObject.created}. ${userObject.username} has the following roles: ${userObject.roles.join(', ')}.]`;
        return userString;
    }else{
        return null;
    }
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

export async function removeConstructFromChatLog(constructID: string, chatLogID: string){
    const currentLogData = await getChat(chatLogID);
    if(currentLogData === null){
        return;
    }
    let currentLog = assembleChatFromData(currentLogData);
    if(currentLog === null){
        return;
    }
    if(!currentLog.constructs.includes(constructID)){
        return;
    }
    currentLog.constructs = currentLog.constructs.filter(item => item !== constructID);
    await updateChat(currentLog);
}

export async function addConstructToChatLog(constructID: string, chatLogID: string){
    const currentLogData = await getChat(chatLogID);
    if(currentLogData === null){
        return;
    }
    let currentLog = assembleChatFromData(currentLogData);
    if(currentLog === null){
        return;
    }
    if(currentLog.constructs.includes(constructID)){
        return;
    }
    currentLog.constructs.push(constructID);
    await updateChat(currentLog);
}

export function makeDelay() {
    let timeoutId: NodeJS.Timeout | null = null;
  
    const waitFor = (seconds: number): Promise<void> => {
        isDelaying = true;
        return new Promise((resolve, reject) => {
            timeoutId = setTimeout(resolve, seconds * 1000);
        });
    };
    
    let isDelaying = false;
    const cancel = () => {
        isDelaying = false;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
    };
  
    return { waitFor, cancel, isDelaying };
}

function DiscordController(){
    getDiscordSettings();

    expressApp.get('/api/discord/channels', (req, res) => {
        try {
            const channels = getRegisteredChannels();
            res.json({ channels });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });
    
    expressApp.post('/api/discord/channels/register', (req, res) => {
        try {
            const { channel } = req.body;
            addRegisteredChannel(channel);
            res.status(200).send({ message: "Channel registered successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });
    
    expressApp.delete('/api/discord/channels/unregister', (req, res) => {
        try {
            const { channel } = req.body;
            removeRegisteredChannel(channel);
            res.status(200).send({ message: "Channel unregistered successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });
    
    expressApp.get('/api/discord/channels/check', (req, res) => {
        try {
            const { channel } = req.query;
            const isRegistered = isChannelRegistered(channel as string);
            res.json({ isRegistered });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // Routes for get and set do-stable-diffusion
    expressApp.get('/api/discord/diffusion', (req, res) => {
        try {
            res.json({ value: getDoStableDiffusion() });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    expressApp.post('/api/discord/diffusion', (req, res) => {
        try {
            setDoStableDiffusion(req.body.value);
            res.send({ message: "Updated successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // Routes for get and set do-stable-reactions
    expressApp.get('/api/discord/diffusion-reactions', (req, res) => {
        try {
            res.json({ value: getDoStableReactions() });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    expressApp.post('/api/discord/diffusion-reactions', (req, res) => {
        try {
            setDoStableReactions(req.body.value);
            console.log('Set Diffusion Reacts', req.body.value);
            res.send({ message: "Updated successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // Routes for diffusion whitelist
    expressApp.get('/api/discord/diffusion-whitelist', (req, res) => {
        try {
            res.json({ channels: getDiffusionWhitelist() });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    expressApp.post('/api/discord/diffusion-whitelist', (req, res) => {
        try {
            addDiffusionWhitelist(req.body.channel);
            res.send({ message: "Channel added to whitelist successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    expressApp.delete('/api/discord/diffusion-whitelist', (req, res) => {
        try {
            removeDiffusionWhitelist(req.body.channel);
            res.send({ message: "Channel removed from whitelist successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // Route for get-show-diffusion-details and set-show-diffusion-details
    expressApp.get('/api/discord/diffusion-details', (req, res) => {
        try {
            res.json({ value: getShowDiffusionDetails() });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    expressApp.post('/api/discord/diffusion-details', (req, res) => {
        try {
            setShowDiffusionDetails(req.body.value);
            res.send({ message: "Detail setting updated successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // Route for get-registered-channels-for-diffusion
    expressApp.get('/api/discord/diffusion-channels', (req, res) => {
        try {
            res.json({ channels: getDiffusionWhitelist() });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    //route for getting delay value
    expressApp.get('/api/discord/delay', (req, res) => {
        try {
            res.json({ value: getDelay() });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    //route for setting delay value
    expressApp.post('/api/discord/delay', (req, res) => {
        try {
            setDelay(req.body.value);
            res.send({ message: "Delay updated successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    //route for setting doDelay value
    expressApp.get('/api/discord/delay-enabled', (req, res) => {
        try {
            res.json({ value: getDoDelay() });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    //route for setting doDelay value
    expressApp.post('/api/discord/delay-enabled', (req, res) => {
        try {
            setDoDelay(req.body.value);
            res.send({ message: "Delay setting updated successfully." });
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });
}

export default DiscordController;