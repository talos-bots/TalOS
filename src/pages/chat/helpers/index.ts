import { generateContinueChatLog, generateThoughts, regenerateMessageFromChatLog, regenerateUserMessageFromChatLog } from "@/api/constructapi";
import { getConstruct } from "@/api/dbapi";
import { Attachment } from "@/classes/Attachment";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { User } from "@/classes/User";
import { Dispatch, SetStateAction } from "react";

export async function getLoadingMessage(constructID: string){
    let activeConstruct = await getConstruct(constructID);
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = 'Loading...';
    newMessage.user = activeConstruct.name;
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = false;
    newMessage.participants = [constructID];
    newMessage.userID = constructID;
    return newMessage;
}

export function addUserMessage(messageText: string, user: User | null, attachments?: Attachment[]) {
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = messageText.replace(/^\s+|\s+$/g, '');
    newMessage.user = user ? (user?.nickname || user.name) : 'DefaultUser';
    newMessage.avatar = user?.avatar || '';
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = true;
    newMessage.participants = [user?._id || 'DefaultUser'];
    newMessage.userID = user?._id || 'DefaultUser';
    newMessage.emotion = 'neutral';
    newMessage.isThought = false;
    newMessage.attachments = attachments || [];
    return newMessage;
}

export async function sendMessage(chatlog: Chat, constructID: string, user: User | null, multiline?: boolean, numberOfMessagesToSend: number = 25) {
    let activeConstruct = await getConstruct(constructID);
    if (!chatlog.constructs || chatlog.constructs.length === 0) return null;
    let response = await generateContinueChatLog(activeConstruct, chatlog, user ? (user.nickname || user.name) : 'DefaultUser', numberOfMessagesToSend, undefined, undefined, undefined, multiline);
    if (!response) return null;
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = response;
    newMessage.user = activeConstruct.name;
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = false;
    newMessage.avatar = activeConstruct.avatar;
    newMessage.participants = [user?._id || 'DefaultUser', constructID];
    newMessage.userID = constructID;
    newMessage.emotion = 'neutral';
    newMessage.isThought = false;
    return newMessage;
}

export async function sendThoughts(chatlog: Chat, constructID: string, user: User | null, multiline?: boolean, numberOfMessagesToSend: number = 25) {
    let activeConstruct = await getConstruct(constructID);
    if (!chatlog.constructs || chatlog.constructs.length === 0) return null;
    let response = await generateThoughts(activeConstruct, chatlog, user ? (user.nickname || user.name) : 'DefaultUser', numberOfMessagesToSend);
    if (!response) return null;
    response = response.replace(/\*/g, '');
    response = `*${response.trim()}*`
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = response;
    newMessage.user = activeConstruct.name;
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = false;
    newMessage.avatar = activeConstruct.avatar;
    newMessage.participants = [user?._id || 'DefaultUser', constructID];
    newMessage.userID = constructID;
    newMessage.emotion = 'neutral';
    newMessage.isThought = true;
    return newMessage;
}

export async function regenerateMessage(chatlog: Chat, messageText: string, messageID?: string){
    if(!messageID) return null;
    let newReply = await regenerateMessageFromChatLog(chatlog, messageText, messageID);
    if(!newReply) return null;
    return newReply;
}

export async function regenerateUserMessage(chatlog: Chat, messageText: string, messageID?: string){
    if(!messageID) return null;
    let newReply = await regenerateUserMessageFromChatLog(chatlog, messageText, messageID);
    if(!newReply) return null;
    return newReply;
}

export function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export const truncateText = (text: string, length: number) => {
    return text?.length > length ? text?.substring(0, length) + "..." : text;
};

export async function doSlashCommand(message: string, chatLog: Chat | null, currentUser: User | null, setChatLog?: Dispatch<SetStateAction<Chat | null>>, setMessages?: Dispatch<SetStateAction<Message[]>>, updateChat?: (chat: Chat) => void, setError?: Dispatch<SetStateAction<string | null>>, handBotResponse?: (chat: Chat, constructID: string, currentUser: User | null) => void){
    if(!message.startsWith('/')) return false;
    let command = message.split(' ')[0].replace('/', '');
    let args = message.split(' ').slice(1);
    switch(command){
        case 'sys':
        case 'system':
            if(!chatLog || !currentUser) return false;
            let newMessage = createSystemMessage(args.join(' '));
            if(!newMessage) return false;
            setMessages && setMessages((messages) => [...messages, newMessage]);
            chatLog.messages.push(newMessage);
            setChatLog && setChatLog(chatLog);
            updateChat && updateChat(chatLog);
            handBotResponse && handBotResponse(chatLog, chatLog.constructs[0], currentUser);
            return true;
    }
    return false;
}

export function createSystemMessage(action: string){
    const newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = action;
    newMessage.user = 'System';
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = true;
    newMessage.isPrivate = true;
    newMessage.isHuman = false;
    newMessage.participants = ['System'];
    newMessage.userID = 'System';
    newMessage.emotion = 'neutral';
    newMessage.isThought = false;
    return newMessage;
}