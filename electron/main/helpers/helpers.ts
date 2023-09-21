import { Message } from "discord.js";
import { AttachmentInferface, ChatInterface, ConstructInterface, LorebookInterface, MessageInterface, UserInterface } from "../types/types";
import FormData from 'form-data';
import axios from "axios";
import { getUsername } from "../controllers/DiscordController";
import { addAttachment, addUser, getUser, updateUser } from "../api/pouchdb";
// @ts-ignore
import { encode } from 'gpt-tokenizer'
import { getCaption } from "../model-pipeline/transformers";
import { cleanEmotes } from "../api/discord";

export function assembleConstructFromData(data: any){
	if(data === null) return null;
	if(data?._id === undefined) return null;
	const construct: ConstructInterface = {
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
		authorsNote: data.authorsNote,
		defaultConfig: data.defaultConfig,
		thoughtPattern: data.thoughtPattern,
		sprites: data.sprites,
	}
	return construct;
}

export function assembleMessageFromData(data: any){
	if(data === null) return null;
	if(data?._id === undefined) return null;
	const message: MessageInterface = {
		_id: data._id,
		user: data.user,
		text: data.text,
		userID: data.userID,
		avatar: data.avatar,
		timestamp: data.timestamp,
		origin: data.origin,
		isCommand: data.isCommand,
		isPrivate: data.isPrivate,
		isHuman: data.isHuman,
		participants: data.participants,
		attachments: data.attachments,
		isThought: false,
	}
	return message;
}

export function assembleChatFromData(data: any){
	if(data === null) return null;
	if(data?._id === undefined) return null;
	const chat: ChatInterface = {
		_id: data._id,
		name: data.name,
		type: data.type,
		messages: data.messages,
		lastMessage: data.lastMessage,
		lastMessageDate: data.lastMessageDate,
		firstMessageDate: data.firstMessageDate,
		constructs: data.constructs,
		humans: data.humans,
		chatConfigs: data.chatConfigs,
		doVector: data.doVector,
		global: data.global,
	}
	return chat;
}

export function assembleAttachmentFromData(data: any){
	if(data === null) return null;
	if(data?._id === undefined) return null;
	const attachment: AttachmentInferface = {
		_id: data._id,
		type: data.type,
		name: data.filename,
		data: data.data,
		fileext : data.fileext,
		metadata: data.metadata,
	}
	return attachment;
}

export function assembleUserFromData(data: any){
	if(data === null) return null;
	if(data?._id === undefined) return null;
	const user: UserInterface = {
		_id: data._id,
		name: data.name,
		nickname: data.nickname,
		avatar: data.avatar,
		personality: data.personality,
		background: data.background,
		relationships: data.relationships,
		interests: data.interests,
	}
	return user;
}

export function assemblePromptFromLog(data: any, messagesToInclude: number = 25){
	let prompt = '';
	let messages = data.messages;
	messages = messages.slice(-messagesToInclude);
	for(let i = 0; i < messages.length; i++){
		if(messages[i].isCommand === true){
			prompt += `${messages[i].text.trim()}\n`;
			continue;
		}else{
			if(messages[i].isThought === true){
                prompt += `${messages[i].user}'s Thoughts: ${messages[i].text.trim()}\n`;
            }else{
				let captionText = '';
				if(messages[i].attachments.length > 0){
					for(let j = 0; j < messages[i].attachments.length; j++) {
						let attachmentCaption = messages[i].attachments[j]?.metadata?.caption;
						if(attachmentCaption){
							captionText += `[${messages[i].user} sent an image of ${attachmentCaption}] `;
						}else{
							captionText += `[${messages[i].user} sent a file called ${messages[i].attachments[j]?.name}] `;
						}
					}
				}
                prompt += `${messages[i].user}: ${messages[i].text.trim()}${captionText.trim()}\n`;
            }
		}
	}
	return prompt;
}

export async function convertDiscordMessageToMessage(message: Message, activeConstructs: string[]){
	let attachments: AttachmentInferface[] = [];
	let username = await getUsername(message.author.id, message.channelId)
	if(username === null){
		username = message.author.displayName;
	}
	if(message.attachments.size > 0){
		for (const attachment of message.attachments.values()) {
			try {
				let response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
				let base64Data = Buffer.from(response.data, 'binary').toString('base64');
				
				let newAttachment: AttachmentInferface = {
					_id: attachment.id,
					type: attachment.contentType ? attachment.contentType : 'unknown',
					name: attachment.name,
					data: base64Data.split(';base64,').pop() || '',
					metadata: attachment.size,
					fileext: attachment.name.split('.').pop() || 'unknown',
				}
				
				if (attachment.contentType?.includes('image')) {
					let caption = await getCaption(newAttachment.data);
					newAttachment.metadata = {
						caption: caption,
						size: attachment.size,
					}
				}
				addAttachment(newAttachment);
				attachments.push(newAttachment);
			} catch (error) {
				console.error('Error fetching attachment:', error);
			}
		}
	}
	const convertedMessage: MessageInterface = {
		_id: message.id,
		user: username,
		avatar: message.author.avatarURL() ? message.author.avatarURL() : '',
		text: cleanEmotes(message.content.trim()),
		userID: message.author.id,
		timestamp: message.createdTimestamp,
		origin: 'Discord - ' + message.channelId,
		isHuman: true,
		isCommand: false,
		isPrivate: false,
		participants: [message.author.id, ...activeConstructs],
		attachments: attachments,
		isThought: false,
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

export function assembleUserFromDiscordAuthor(message: Message){
	let avatar = message.author.avatarURL() ? message.author.avatarURL()?.toString() : '';
	if(avatar === null) avatar = '';
	if(avatar === undefined) avatar = '';
	const user: UserInterface = {
		_id: message.author.id,
		name: message.author.username,
		nickname: message.author.displayName,
		avatar: avatar,
		personality: '',
		background: '',
		relationships: [],
		interests: [],
	}
	return user;
}

export async function addUserFromDiscordMessage(message: Message){
	const user = assembleUserFromDiscordAuthor(message);
	console.log('New User:', user);
	if(user._id === undefined) return;
	let existingUserData = await getUser(user._id);
	console.log('Existing Data:', existingUserData);
	existingUserData = assembleUserFromData(existingUserData);
	console.log('Existing Data Assembled:', existingUserData);
	if(existingUserData !== null){
		return;
	}
	await addUser(user);
}

export function assembleLorebookFromData(data: any) {
    if(data === null){
		return null;
	}
    if(data?._id === undefined){
		return null;
	}
    const lorebook: LorebookInterface = {
        _id: data._id,
        name: data.name || '',
        avatar: data.avatar || '',
        description: data.description || '',
        scan_depth: data.scan_depth || 0,
        token_budget: data.token_budget || 0,
        recursive_scanning: data.recursive_scanning || false,
        global: data.global || false,
        constructs: data.constructs || [],
        extensions: data.extensions || {},
        entries: data.entries || [],
    }
    return lorebook;
}

export function getGPTTokens(text: string): number{
	const tokens: number = encode(text).length;
	return tokens;
}