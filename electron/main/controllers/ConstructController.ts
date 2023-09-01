import { ipcMain } from 'electron';
import Store from 'electron-store';
import { assembleConstructFromData, assemblePromptFromLog } from '../helpers/helpers';
import { generateText } from '../api/llm';
import { isReady, setDiscordBotInfo } from '../api/discord';
import { getConstruct, updateChat } from '../api/pouchdb';
import { ChatInterface, MessageInterface } from '../types/types';
const store = new Store({
    name: 'constructData',
});
type ConstructID = string;

export let ActiveConstructs: ConstructID[] = [];

export const retrieveConstructs = (): ConstructID[] => {
    return store.get('ids', []) as ConstructID[];
}

export const setDoMultiLine = (doMultiLine: boolean): void => {
    store.set('doMultiLine', doMultiLine);
}

export const getDoMultiLine = (): boolean => {
    return store.get('doMultiLine', false) as boolean;
}

const addConstruct = (newId: ConstructID): void => {
    const existingIds = retrieveConstructs();
    if (!existingIds.includes(newId)) {
        existingIds.push(newId);
        store.set('ids', existingIds);
    }
}

const removeConstruct = (idToRemove: ConstructID): void => {
    const existingIds = retrieveConstructs();
    const updatedIds = existingIds.filter(id => id !== idToRemove);
    store.set('ids', updatedIds);
}

const isConstructActive = (id: ConstructID): boolean => {
    const existingIds = retrieveConstructs();
    return existingIds.includes(id);
}

const clearActiveConstructs = (): void => {
    store.set('ids', []);
}

const setAsPrimary = async (id: ConstructID): Promise<void> => {
    const existingIds = retrieveConstructs();  // Assuming retrieveConstructs returns an array of ConstructID
    const index = existingIds.indexOf(id);
    
    if (index > -1) {
        existingIds.splice(index, 1);
    }

    existingIds.unshift(id);

    store.set('ids', existingIds); 
    if(isReady){
        let constructRaw = await getConstruct(id);
        let construct = assembleConstructFromData(constructRaw);
        if(construct === null){
            console.log('Could not assemble construct from data');
            return;
        }
        setDiscordBotInfo(construct.name, construct.avatar);
    }
}

export function getCharacterPromptFromConstruct(construct: any) {
    let prompt = '';
    if(construct.background.length > 1){
        prompt += construct.background + '\n';
    }
    if(construct.interests.length > 1){
        prompt += 'Interests:\n';
        for(let i = 0; i < construct.interests.length; i++){
            prompt += '- ' + construct.interests[i] + '\n';
        }
    }
    if(construct.relationships.length > 1){
        prompt += 'Relationships:\n';
        for(let i = 0; i < construct.relationships.length; i++){
            prompt += '- ' + construct.relationships[i] + '\n';
        }
    }
    if(construct.personality.length > 1){
        prompt += construct.personality + '\n';
    }
    return prompt.replaceAll('{{char}}', `${construct.name}`);
}

export function assemblePrompt(construct: any, chatLog: any, currentUser: string = 'you', messagesToInclude?: any){
    let prompt = '';
    prompt += getCharacterPromptFromConstruct(construct);
    prompt += assemblePromptFromLog(chatLog, messagesToInclude);
    prompt += `${construct.name}:`;
    return prompt.replaceAll('{{user}}', `${currentUser}`);
}

export function assembleInstructPrompt(construct: any, chatLog: any, currentUser: string = 'you', messagesToInclude?: any){
    let prompt = '';
    
    return prompt.replaceAll('{{user}}', `${currentUser}`);
}

export async function generateContinueChatLog(construct: any, chatLog: any, currentUser?: string, messagesToInclude?: any, stopList?: string[], authorsNote?: string | string[], authorsNoteDepth?: number) {
    let prompt = assemblePrompt(construct, chatLog, currentUser, messagesToInclude);

    if ((construct.authorsNote !== undefined && construct.authorsNote !== '' && construct.authorsNote !== null) ||
    (authorsNote !== undefined && authorsNote !== '' && authorsNote !== null)) {

    if (!authorsNote) {
        authorsNote = [construct.authorsNote]; // Ensuring authorsNote is always an array
    } else if (!Array.isArray(authorsNote)) {
        authorsNote = [authorsNote];
    }
    
    if (construct.authorsNote && authorsNote.indexOf(construct.authorsNote) === -1) {
        authorsNote.push(construct.authorsNote);
    }

    let splitPrompt = prompt.split('\n');
    let newPrompt = '';
    let depth = 4;

    if (authorsNoteDepth !== undefined) {
        depth = authorsNoteDepth;
    }

    let insertHere = (splitPrompt.length < 4) ? 0 : splitPrompt.length - depth;

    for (let i = 0; i < splitPrompt.length; i++) {
        if (i === insertHere) {
            for (let note of authorsNote) {
                newPrompt += note + '\n';
            }
        }

        if (i !== splitPrompt.length - 1) {
            newPrompt += splitPrompt[i] + '\n';
        } else {
            newPrompt += splitPrompt[i];
        }
    }

    prompt = newPrompt.replaceAll('{{user}}', `${currentUser}`).replaceAll('{{char}}', `${construct.name}`);
    }

    const response = await generateText(prompt, currentUser, stopList);
    if (response && response.results && response.results[0]) {
        return breakUpCommands(construct.name, response.results[0], currentUser, stopList);
    } else {
        console.log('No valid response from GenerateText');
        return null;
    }
}

export function breakUpCommands(charName: string, commandString: string, user = 'You', stopList: string[] = []): string {
    let lines = commandString.split('\n');
    let formattedCommands = [];
    let currentCommand = '';
    let isFirstLine = true;
    
    if (getDoMultiLine() === false){
        lines = lines.slice(0, 1);
        let command = lines[0];
        return command;
    }
    
    for (let i = 0; i < lines.length; i++) {
        // If the line starts with a colon, it's the start of a new command
        let lineToTest = lines[i].toLowerCase();
        
        if (lineToTest.startsWith(`${user.toLowerCase()}:`) || lineToTest.startsWith('you:') || lineToTest.startsWith('<start>') || lineToTest.startsWith('<end>') || lineToTest.startsWith('<user>') || lineToTest.toLowerCase().startsWith('user:')) {
          break;
        }
        
        if (stopList !== null) {
            for(let j = 0; j < stopList.length; j++){
                if(lineToTest.startsWith(`${stopList[j].toLowerCase()}`)){
                    break;
                }
            }
        }
        
        if (lineToTest.startsWith(`${charName}:`)) {
            isFirstLine = false;
            if (currentCommand !== '') {
                // Push the current command to the formattedCommands array
                currentCommand = currentCommand.replace(new RegExp(`${charName}:`, 'g'), '')
                formattedCommands.push(currentCommand.trim());
            }
            currentCommand = lines[i];
        } else {
            if (currentCommand !== '' || isFirstLine){
                currentCommand += (isFirstLine ? '' : '\n') + lines[i];
            }
            if (isFirstLine) isFirstLine = false;
        }
    }
    
    // Don't forget to add the last command
    if (currentCommand !== '') {
        formattedCommands.push(currentCommand);
    }
    
    let final = formattedCommands.join('\n');
    return final;
}

export async function removeMessagesFromChatLog(chatLog: ChatInterface, messageContent: string){
    let newChatLog = chatLog;
    let messages = newChatLog.messages;
    for(let i = 0; i < messages.length; i++){
        if(messages[i].text === messageContent){
            messages.splice(i, 1);
            break;
        }
    }
    newChatLog.messages = messages;
    await updateChat(newChatLog);
    return newChatLog;
}

export async function regenerateMessageFromChatLog(chatLog: ChatInterface, messageContent: string, messageID?: string, authorsNote?: string, authorsNoteDepth?: number){
    let messages = chatLog.messages;
    let beforeMessages: MessageInterface[] = [];
    let afterMessages: MessageInterface[] = [];
    let foundMessage: MessageInterface | undefined;
    let messageIndex = -1;
    for(let i = 0; i < messages.length; i++){
        if(messageID !== undefined){
            if(messages[i]._id === messageID){
                messageIndex = i;
                foundMessage = messages[i];
                break;
            }
        }else{
            if(messages[i].text.trim().includes(messageContent.trim())){
                messageIndex = i;
                foundMessage = messages[i];
                break;
            }
        }
    }
    if(foundMessage === undefined){
        console.log('Could not find message to regenerate');
        return;
    }
    if (messageIndex !== -1) {
        beforeMessages = messages.slice(0, messageIndex);
        afterMessages = messages.slice(messageIndex + 1);
        messages.splice(messageIndex, 1);
    }
    
    // If you want to update the chat without the target message
    chatLog.messages = messages;
    let constructData = await getConstruct(foundMessage.userID);
    if(constructData === null){
        console.log('Could not find construct to regenerate message');
        return;
    }
    let construct = assembleConstructFromData(constructData);
    if(construct === null){
        console.log('Could not assemble construct from data');
        return;
    }
    let newReply = await generateContinueChatLog(construct, chatLog, foundMessage.participants[0], undefined, undefined, authorsNote, authorsNoteDepth);
    if(newReply === null){
        console.log('Could not generate new reply');
        return;
    }
    let newMessage = {
        _id: Date.now().toString(),
        user: construct.name,
        avatar: construct.avatar,
        text: newReply,
        userID: construct._id,
        timestamp: Date.now(),
        origin: 'Discord',
        isHuman: false,
        isCommand: false,
        isPrivate: false,
        participants: foundMessage.participants,
        attachments: [],
    }
    messages = beforeMessages.concat(newMessage, afterMessages);    
    chatLog.messages = messages;
    await updateChat(chatLog);
    return newReply;
}

function constructController() {
    ActiveConstructs = retrieveConstructs();
    
    ipcMain.on('add-construct-to-active', (event, arg) => {
        addConstruct(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('add-construct-to-active-reply', ActiveConstructs);
    });
    
    ipcMain.on('remove-construct-active', (event, arg) => {
        removeConstruct(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('remove-construct-active-reply', ActiveConstructs);
    });
    
    ipcMain.on('get-construct-active-list', (event, arg) => {
        ActiveConstructs = retrieveConstructs();
        event.reply(arg, ActiveConstructs);
    });

    ipcMain.on('is-construct-active', (event, arg, replyName) => {
        const isActive = isConstructActive(arg);
        event.reply(replyName, isActive);
    });

    ipcMain.on('remove-all-constructs-active', (event, arg) => {
        clearActiveConstructs();
        ActiveConstructs = retrieveConstructs();
        event.reply('remove-all-constructs-active-reply', ActiveConstructs);
    });

    ipcMain.on('set-construct-primary', (event, arg) => {
        setAsPrimary(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('set-construct-primary-reply', ActiveConstructs);
    });

    ipcMain.on('set-do-multi-line', (event, arg, uniqueEventName) => {
        setDoMultiLine(arg);
        event.reply(uniqueEventName, getDoMultiLine());
    });

    ipcMain.on('get-do-multi-line', (event, uniqueEventName) => {
        event.reply(uniqueEventName, getDoMultiLine());
    });

    ipcMain.on('get-character-prompt-from-construct', (event, arg, uniqueEventName) => {
        let prompt = getCharacterPromptFromConstruct(arg);
        event.reply(uniqueEventName, prompt);
    });

    ipcMain.on('assemble-prompt', (event, construct, chatLog, currentUser, messagesToInclude, uniqueEventName) => {
        let prompt = assemblePrompt(construct, chatLog, currentUser, messagesToInclude);
        event.reply(uniqueEventName, prompt);
    });

    ipcMain.on('assemble-instruct-prompt', (event, construct, chatLog, currentUser, messagesToInclude, uniqueEventName) => {
        let prompt = assembleInstructPrompt(construct, chatLog, currentUser, messagesToInclude);
        event.reply(uniqueEventName, prompt);
    });

    ipcMain.on('generate-continue-chat-log', (event, construct, chatLog, currentUser, messagesToInclude, stopList, authorsNote, authorsNoteDepth, uniqueEventName) => {
        generateContinueChatLog(construct, chatLog, currentUser, messagesToInclude, stopList, authorsNote, authorsNoteDepth).then((response) => {
            event.reply(uniqueEventName, response);
        });
    });

    ipcMain.on('remove-messages-from-chat-log', (event, chatLog, messageContent, uniqueEventName) => {
        removeMessagesFromChatLog(chatLog, messageContent).then((response) => {
            event.reply(uniqueEventName, response);
        });
    });

    ipcMain.on('regenerate-message-from-chat-log', (event, chatLog, messageContent, messageID, authorsNote, authorsNoteDepth, uniqueEventName) => {
        regenerateMessageFromChatLog(chatLog, messageContent, messageID, authorsNote, authorsNoteDepth).then((response) => {
            event.reply(uniqueEventName, response);
        });
    });

    ipcMain.on('break-up-commands', (event, charName, commandString, user, stopList, uniqueEventName) => {
        let response = breakUpCommands(charName, commandString, user, stopList);
        event.reply(uniqueEventName, response);
    });

}
export default constructController;