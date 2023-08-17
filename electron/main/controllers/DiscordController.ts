import { ipcMain } from 'electron';
import Store from 'electron-store';
import { generateContinueChatLog, retrieveConstructs } from './ConstructController';
import { addChat, getChat, getConstruct, updateChat } from '../api/pouchdb';
import { assembleChatFromData, assembleConstructFromData, convertDiscordMessageToMessage } from '../helpers/helpers';
import { Message } from 'discord.js';
import { sendMessage, sendTyping } from '../api/discord';

const store = new Store({
    name: 'discordData',
});

type DiscordMode = 'Character' | 'Construct';

const setDiscordMode = (mode: DiscordMode) => {
    store.set('mode', mode);
};

const getDiscordMode = (): DiscordMode => {
    return store.get('mode') as DiscordMode;
};

const clearDiscordMode = () => {
    store.set('mode', null);
};

export async function handleDiscordMessage(message: Message) {
    if(message.author.bot) return;
    if(message.channel.isDMBased()) return;
    if(message.channel.id !== '1119404483600994414') return;
    const activeConstructs = retrieveConstructs();
    if(activeConstructs.length < 1) return;
    sendTyping(message);
    const newMessage = convertDiscordMessageToMessage(message, activeConstructs);
    let constructArray = [];
    for (let i = 0; i < activeConstructs.length; i++) {
        let constructDoc = await getConstruct(activeConstructs[i]);
        let construct = assembleConstructFromData(constructDoc);
        constructArray.push(construct);
    }
    const mode = getDiscordMode();
    let chatLogData = await getChat(message.channel.id);
    console.log(chatLogData);
    let chatLog;
    if (chatLogData) {
        chatLog = assembleChatFromData(chatLogData);
        chatLog.messages.push(newMessage);
    }else{
        chatLog = {
            _id: message.channel.id,
            name: message.channel.id + ' Chat ' + constructArray[0].name,
            type: 'Discord',
            messages: [newMessage],
            lastMessage: newMessage,
            lastMessageDate: newMessage.timestamp,
            firstMessageDate: newMessage.timestamp,
            agents: activeConstructs,
        }
        if(chatLog.messages.length > 0){
            await addChat(chatLog);
        }else{
            return;
        }
    }
    // if (mode === 'Character') {
    const result = await generateContinueChatLog(constructArray[0], chatLog, message.author.username);
    let reply: string;
    if (result !== null) {
        reply = result;
    } else {
        reply = 'Default reply or error message';
    }
        
    await sendMessage(message.channel.id, reply);
    const replyMessage = {
        _id: Date.now().toString(),
        user: constructArray[0].name,
        text: reply,
        timestamp: Date.now(),
        origin: 'Discord',
        isCommand: false,
        isPrivate: false,
        participants: [message.author.username, constructArray[0].name],
        attachments: [],
    }
    chatLog.messages.push(replyMessage);
    chatLog.lastMessage = replyMessage;
    chatLog.lastMessageDate = replyMessage.timestamp;
    await updateChat(chatLog);
    // } else if (mode === 'Construct') {
    //     reply = await generateContinueChatLog(constructArray[0], chatLog, message.author.username);
    //     await sendMessage(message.channel.id, reply);
    // }
}

function DiscordController(){
    ipcMain.on('discordMode', (event, arg) => {
        setDiscordMode(arg);
    });

    ipcMain.handle('getDiscordMode', () => {
        return getDiscordMode();
    });

    ipcMain.on('clearDiscordMode', () => {
        clearDiscordMode();
    });
}

export default DiscordController;