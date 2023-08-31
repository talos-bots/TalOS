import { generateContinueChatLog, regenerateMessageFromChatLog } from "@/api/constructapi";
import { getConstruct, getUser, updateChat } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";

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

export async function addUserMessage(messageText: string, userID?: string | null) {
    let user = null;
    if (userID) {
        user = await getUser(userID).catch((err) => {
            console.log(err);
            return null;
        });
    }
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = messageText.replace(/^\s+|\s+$/g, '');
    newMessage.user = user ? (user?.nickname || user.name) : 'DefaultUser';
    newMessage.avatar = user?.avatar || '';
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = true;
    newMessage.participants = [userID || 'DefaultUser'];
    newMessage.userID = userID || 'DefaultUser';
    return newMessage;
}

export async function sendMessage(chatlog: Chat, constructID: string, userID?: string | null) {
    let user;
    if (userID) {
        user = await getUser(userID).catch((err) => {
            console.log(err);
            return null;
        });
        console.log(user);
    }
    let activeConstruct = await getConstruct(constructID);
    if (!chatlog.constructs || chatlog.constructs.length === 0) return null;
    let response = await generateContinueChatLog(activeConstruct, chatlog, user ? (user.nickname || user.name) : 'DefaultUser');
    if (!response) return null;
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = response;
    newMessage.user = activeConstruct.name;
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = false;
    newMessage.participants = [userID || 'DefaultUser', constructID];
    newMessage.userID = constructID;
    return newMessage;
}

export async function regenerateMessage(chatlog: Chat, messageText: string, messageID?: string){
    if(!messageID) return null;
    let newReply = await regenerateMessageFromChatLog(chatlog, messageText, messageID);
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