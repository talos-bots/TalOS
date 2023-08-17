import { Message } from "discord.js";
import { AttachmentInferface } from "../types/types";

export function assembleConstructFromData(data: any){
    const construct = {
        _id: data._id,
        name: data.name,
        nickname: data.nickname,
        avatar: data.avatar,
        commands: data.commands,
        visualDescription: data.visualDescription,
        personality: data.personality,
        background: data.background,
        relationships: data.relationships,
        interests: data.interests,
        greetings: data.greetings,
        farewells: data.farewells,
    }
    return construct;
}

export function assembleMessageFromData(data: any){
    const message = {
        _id: data._id,
        user: data.user,
        text: data.text,
        timestamp: data.timestamp,
        origin: data.origin,
        isCommand: data.isCommand,
        isPrivate: data.isPrivate,
        participants: data.participants,
        attachments: data.attachments,
    }
    return message;
}

export function assembleChatFromData(data: any){
    const chat = {
        _id: data._id,
        name: data.name,
        type: data.type,
        messages: data.messages,
        lastMessage: data.lastMessage,
        lastMessageDate: data.lastMessageDate,
        firstMessageDate: data.firstMessageDate,
        agents: data.agents,
    }
    return chat;
}

export function assembleAttachmentFromData(data: any){
    const attachment = {
        _id: data._id,
        type: data.type,
        filename: data.filename,
        data: data.data,
        size: data.size,
    }
    return attachment;
}

export function assemblePromptFromLog(data: any, messagesToInclude: number = 25){
    let prompt = '';
    let messages = data.messages;
    messages = messages.slice(-messagesToInclude);
    for(let i = 0; i < messages.length; i++){
        prompt += `${messages[i].user}: ${messages[i].text}` + '\n';
    }
    return prompt;
}
export function convertDiscordMessageToMessage(message: Message, activeConstructs: string[]){
    let attachments: AttachmentInferface[] = [];
    if(message.attachments.size > 0){
        message.attachments.forEach(attachment => {
            attachments.push({
                _id: attachment.id,
                type: attachment.contentType? attachment.contentType : 'unknown',
                filename: attachment.name,
                data: attachment.url,
                size: attachment.size,
            });
        });
    }
    const convertedMessage = {
        _id: message.id,
        user: message.author.username,
        text: message.content,
        timestamp: message.createdTimestamp,
        origin: message.channel.id,
        isCommand: false,
        isPrivate: false,
        participants: [message.author.username, ...activeConstructs],
        attachments: attachments,
    }
    return convertedMessage;
}