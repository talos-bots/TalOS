import { generateContinueChatLog } from "@/api/constructapi";
import { getConstruct, updateChat } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import { Message } from "@/classes/Message";

export async function sendMessage(chatlog: Chat, constructID: string, userID?: string){
    let activeConstruct = await getConstruct(constructID);
    if(chatlog.constructs.length === 0) return null;
    let response = await generateContinueChatLog(activeConstruct, chatlog);
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = response;
    newMessage.user = activeConstruct.name;
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = false;
    newMessage.participants = [userID? userID : 'DefaultUser', constructID];
    newMessage.userID = constructID;
    return newMessage;
}

export function addUserMessage(messageText: string, userID?: string){
    let newMessage = new Message();
    newMessage.origin = 'ConstructOS';
    newMessage.text = messageText;
    newMessage.user = 'User';
    newMessage.timestamp = new Date().getTime();
    newMessage.isCommand = false;
    newMessage.isPrivate = true;
    newMessage.isHuman = true;
    newMessage.participants = [userID? userID : 'DefaultUser'];
    newMessage.userID = userID? userID : 'DefaultUser';
    return newMessage;
}