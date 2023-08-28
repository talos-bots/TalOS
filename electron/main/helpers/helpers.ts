import { Message } from "discord.js";
import { AttachmentInferface } from "../types/types";
import FormData from 'form-data';
import axios from "axios";
import { getUsername } from "../controllers/DiscordController";

export function assembleConstructFromData(data: any){
	if(data === null) return null;
	if(data?._id === undefined) return null;
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
	if(data === null) return null;
	if(data?._id === undefined) return null;
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
	if(data === null) return null;
	if(data?._id === undefined) return null;
    const chat = {
        _id: data._id,
        name: data.name,
        type: data.type,
        messages: data.messages,
        lastMessage: data.lastMessage,
        lastMessageDate: data.lastMessageDate,
        firstMessageDate: data.firstMessageDate,
        constructs: data.constructs,
        humans: data.humans,
    }
    return chat;
}

export function assembleAttachmentFromData(data: any){
  	if(data === null) return null;
	  if(data?._id === undefined) return null;
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
        prompt += `${messages[i].user}: ${messages[i].text.trim()}` + '\n';
    }
    return prompt;
}

export function convertDiscordMessageToMessage(message: Message, activeConstructs: string[]){
    let attachments: AttachmentInferface[] = [];
    let username = getUsername(message.author.id, message.channelId)
    if(username === null){
        username = message.author.displayName;
    }
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
        user: username,
        avatar: message.author.avatarURL() ? message.author.avatarURL() : '',
        text: message.content.trim(),
        userID: message.author.id,
        timestamp: message.createdTimestamp,
        origin: message.channel.id,
        isHuman: true,
        isCommand: false,
        isPrivate: false,
        participants: [message.author.id, ...activeConstructs],
        attachments: attachments,
    }
    return convertedMessage;
}

export async function base642Buffer(base64: string): Promise<string| Buffer> {
  let buffer: Buffer;

  // Check if the input is in data URL format
  const match = base64.match(/^data:image\/[^;]+;base64,(.+)/);

  if (match) {
    // Extract the actual base64 string
    const actualBase64 = match[1];
    // Convert the base64 string into a Buffer
    buffer = Buffer.from(actualBase64, 'base64');
  } else {
    // If the input is not in data URL format, assume it is already a plain base64 string
    try {
      buffer = Buffer.from(base64, 'base64');
    } catch (error) {
      // Handle errors (e.g., invalid base64 string)
      console.error('Invalid base64 string:', error);
      return base64;
    }
  }

  // Create form data
  const form = new FormData();
  form.append('file', buffer, {
    filename: 'file.png', // You can name the file whatever you like
    contentType: 'image/png', // Be sure this matches the actual file type
  });

  try {
    // Upload file to file.io
    const response = await axios.post('https://file.io', form, {
      headers: {
        ...form.getHeaders()
      }
    });
    if (response.status !== 200) {
      // Handle non-200 responses
      console.error('Failed to upload file:', response.statusText);
      return buffer;
    }
    return response.data.link;
  } catch (error) {
    // Handle errors (e.g., upload failed)
    console.error('Failed to upload file:', error);
    return buffer;
  }
}