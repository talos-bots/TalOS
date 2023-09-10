import { generateContinueChatLog, regenerateMessageFromChatLog, regenerateUserMessageFromChatLog } from "@/api/constructapi";
import { getConstruct, getUser, updateChat } from "@/api/dbapi";
import { getTextEmotion } from "@/api/llmapi";
import { getRelaventMemories } from "@/api/vectorapi";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { User } from "@/classes/User";
import { Emotion } from "@/types";

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

export function addUserMessage(messageText: string, user: User | null) {
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
    return newMessage;
}

export async function sendMessage(chatlog: Chat, constructID: string, user: User | null) {
    let activeConstruct = await getConstruct(constructID);
    if (!chatlog.constructs || chatlog.constructs.length === 0) return null;
    let response = await generateContinueChatLog(activeConstruct, chatlog, user ? (user.nickname || user.name) : 'DefaultUser');
    let emotion = await getTextEmotion(response);
    console.log(emotion);
    if (!response) return null;
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = response;
    newMessage.user = activeConstruct.name;
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = false;
    newMessage.participants = [user?._id || 'DefaultUser', constructID];
    newMessage.userID = constructID;
    newMessage.emotion = emotion;
    newMessage.isThought = false;
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