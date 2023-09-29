import Store from 'electron-store';
import { assembleConstructFromData, assembleLorebookFromData, assemblePromptFromLog, assembleUserFromData } from '../helpers/helpers';
import { generateText } from '../api/llm';
import { isReady, setDiscordBotInfo } from '../api/discord';
import { getConstruct, getLorebooks, getUser, updateChat } from '../api/pouchdb';
import { ChatInterface, ConstructInterface, LoreEntryInterface, MessageInterface, UserInterface } from '../types/types';
import { getRelaventMemories } from '../api/vector';
import { detectIntent } from '../helpers/actions-helpers';
import { expressApp } from '..';
import { getYesNoMaybe } from '../model-pipeline/transformers';
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

export function getCharacterPromptFromConstruct(construct: ConstructInterface, replaceUser: boolean = true) {
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
    if(replaceUser === true){
        return prompt.replaceAll('{{char}}', `${construct.name}`);
    }else{
        return prompt;
    }
}

export function getUserPromptFromUser(user: UserInterface, replaceUser: boolean = true) {
    let prompt = '';
    if(user.background.length > 1){
        prompt += user.background + '\n';
    }
    if(user.interests.length > 1){
        prompt += 'Interests:\n';
        for(let i = 0; i < user.interests.length; i++){
            prompt += '- ' + user.interests[i] + '\n';
        }
    }
    if(user.relationships.length > 1){
        prompt += 'Relationships:\n';
        for(let i = 0; i < user.relationships.length; i++){
            prompt += '- ' + user.relationships[i] + '\n';
        }
    }
    if(user.personality.length > 1){
        prompt += user.personality + '\n';
    }
    if(replaceUser === true){
        return prompt.replaceAll('{{char}}', `${user ? (user?.nickname || user.name) : 'DefaultUser'}`);
    }else{
        return prompt;
    }
}

export function assemblePrompt(construct: ConstructInterface, chatLog: ChatInterface, currentUser: string = 'you', messagesToInclude?: any, replaceUser: boolean = true){
    let prompt = '';
    prompt += getCharacterPromptFromConstruct(construct);
    prompt += assemblePromptFromLog(chatLog, messagesToInclude);
    prompt += `${construct.name}:`;
    if(replaceUser === true){
        return prompt.replaceAll('{{user}}', `${currentUser}`).replaceAll('{{char}}', `${construct.name}`);
    }else{
        return prompt;
    }
}

export function assembleUserPrompt(user: UserInterface, chatLog: ChatInterface, currentUser: string = 'you', messagesToInclude?: any, replaceUser: boolean = true){
    let prompt = '';
    prompt += getUserPromptFromUser(user);
    prompt += assemblePromptFromLog(chatLog, messagesToInclude);
    prompt += `${user ? (user?.nickname || user.name) : 'DefaultUser'}:`; 
    if(replaceUser === true){
        return prompt.replaceAll('{{user}}', `${currentUser}`).replaceAll('{{char}}', `${user ? (user?.nickname || user.name) : 'DefaultUser'}`);
    }else{
        return prompt;
    }
}

export async function handleLorebookPrompt(construct: ConstructInterface, prompt: string, chatLog: ChatInterface){
    const lorebooksData = await getLorebooks();
    if(lorebooksData === null || lorebooksData === undefined){
        console.log('Could not get lorebooks');
        return prompt;
    }
    const assembledLorebooks = [];
    for(let i = 0; i < lorebooksData.length; i++){
        let lorebook = assembleLorebookFromData(lorebooksData[i].doc);
        if(lorebook === null || lorebook === undefined){
            console.log('Could not assemble lorebook from data');
            continue;
        }
        if(lorebook.constructs.includes(construct._id)){
            assembledLorebooks.push(lorebook);
        }else{
            if(lorebook.global === true){
                assembledLorebooks.push(lorebook);
            }else{
                continue;
            }
        }
    }
    const availableEntries = [];
    for(let i = 0; i < assembledLorebooks.length; i++){
        for(let j = 0; j < assembledLorebooks[i].entries.length; j++){
            if(assembledLorebooks[i].entries[j].enabled === false){
                continue;
            }else{
                availableEntries.push(assembledLorebooks[i].entries[j]);
            }
        }
    }
    const lastTwoMessages = chatLog.messages.slice(-2);
    if(assembledLorebooks.length === 0){
        return prompt;
    }
    const appliedEntries: LoreEntryInterface[] = [];
    for(let i = 0; i < availableEntries.length; i++){
        if(availableEntries[i].constant === true){
            appliedEntries.push(availableEntries[i]);
        }else{
            if(availableEntries[i].case_sensitive === true){
                for(let j = 0; j < lastTwoMessages.length; j++){
                    for(let k = 0; k < availableEntries[i].keys.length; k++){
                        if(lastTwoMessages[j].text.includes(availableEntries[i].keys[k].trim())){
                            if(appliedEntries.includes(availableEntries[i])){
                                continue;
                            }else{
                                if(availableEntries[i].selective === true){
                                    for(let k = 0; k < availableEntries[i].secondary_keys.length; k++){
                                        if(lastTwoMessages[j].text.includes(availableEntries[i].secondary_keys[k].trim())){
                                            if(appliedEntries.includes(availableEntries[i])){
                                                continue;
                                            }else{
                                                appliedEntries.push(availableEntries[i]);
                                            }
                                        }else{
                                            continue;
                                        }
                                    }
                                }else{
                                    appliedEntries.push(availableEntries[i]);
                                }
                            }
                        }else{
                            continue;
                        }
                    }
                }
            }else{
                for(let j = 0; j < lastTwoMessages.length; j++){
                    for(let k = 0; k < availableEntries[i].keys.length; k++){
                        if(lastTwoMessages[j].text.toLocaleLowerCase().includes(availableEntries[i].keys[k].trim().toLocaleLowerCase())){
                            if(appliedEntries.includes(availableEntries[i])){
                                continue;
                            }else{
                                if(availableEntries[i].selective === true){
                                    for(let k = 0; k < availableEntries[i].secondary_keys.length; k++){
                                        if(lastTwoMessages[j].text.toLocaleLowerCase().includes(availableEntries[i].secondary_keys[k].trim().toLocaleLowerCase())){
                                            if(appliedEntries.includes(availableEntries[i])){
                                                continue;
                                            }else{
                                                appliedEntries.push(availableEntries[i]);
                                            }
                                        }else{
                                            continue;
                                        }
                                    }
                                }else{
                                    appliedEntries.push(availableEntries[i]);
                                }
                            }
                        }else{
                            continue;
                        }
                    }
                }
            }
        }
    }
    let splitPrompt = prompt.split('\n');
    let newPrompt = '';
    
    for(let k = 0; k < appliedEntries.length; k++){
        let depth = appliedEntries[k].priority;
        let insertHere = (depth === 0 || depth > splitPrompt.length) ? splitPrompt.length : splitPrompt.length - depth;
        if(appliedEntries[k].position === 'after_char'){
            splitPrompt.splice(insertHere, 0, appliedEntries[k].content);
        }else{
            splitPrompt.splice(0, 0, appliedEntries[k].content);
        }
    }    
    for(let i = 0; i < splitPrompt.length; i++){
        if(i !== splitPrompt.length - 1){
            newPrompt += splitPrompt[i] + '\n';
        }else{
            newPrompt += splitPrompt[i];
        }
    }
    return newPrompt;    
}

export function assembleInstructPrompt(construct: any, chatLog: ChatInterface, currentUser: string = 'you', messagesToInclude?: any){
    let prompt = '';
    
    return prompt.replaceAll('{{user}}', `${currentUser}`);
}

export async function generateThoughts(construct: ConstructInterface, chat: ChatInterface, currentUser: string = 'you', messagesToInclude: number = 25, doMultiLine?: boolean, replaceUser: boolean = true){
    let messagesExceptLastTwo = chat.messages.slice(-messagesToInclude);
    let prompt = '';
    for(let i = 0; i < messagesExceptLastTwo.length; i++){
        if(messagesExceptLastTwo[i].isCommand === true){
            prompt += messagesExceptLastTwo[i].text.trim() + '\n';
        }else{
            if(messagesExceptLastTwo[i].isThought === true){
                prompt += `${messagesExceptLastTwo[i]?.user?.trim()}'s Thoughts: ${messagesExceptLastTwo[i]?.text?.trim()}\n`;
            }else{
                prompt += `${messagesExceptLastTwo[i]?.user?.trim()}: ${messagesExceptLastTwo[i]?.text?.trim()}\n`;
            }
        }
    }
    let lorebookPrompt = await handleLorebookPrompt(construct, prompt, chat);
    if(lorebookPrompt !== null && lorebookPrompt !== undefined){
        prompt = lorebookPrompt;
    }
    prompt += `\n`;
    prompt += `### Instruction:\n`;
    prompt += `Using the context above, determine how you are thinking. Thoughts should be unqiue, and related to the last thing said. You are ${construct.name}.\n`;
    prompt += `${construct.thoughtPattern.trim()}\n\n`;
    prompt += `### Response:\n`;
    prompt += `${construct.name.trim()}'s Thoughts:`;
    if(replaceUser === true){
        prompt = prompt.replaceAll('{{user}}', `${currentUser}`).replaceAll('{{char}}', `${construct.name}`);
    }
    console.log(prompt);
    const response = await generateText(prompt, currentUser);
    if (response && response.results && response.results[0]) {
        return breakUpCommands(construct.name, response.results[0].replaceAll(`${construct.name.trim()}'s Thoughts:`, ''), currentUser, undefined, doMultiLine);
    } else {
        console.log('No valid response from GenerateText:', response?.error?.toString());
        return null;
    }
}

export async function generateContinueChatLog(construct: any, chatLog: ChatInterface, currentUser?: string, messagesToInclude?: any, stopList?: string[], authorsNote?: string | string[], authorsNoteDepth?: number, doMultiLine?: boolean, replaceUser: boolean = true) {
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

        let insertHere = (splitPrompt.length < depth) ? 0 : splitPrompt.length - depth;

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
        if(replaceUser === true){
            prompt = newPrompt.replaceAll('{{user}}', `${currentUser}`).replaceAll('{{char}}', `${construct.name}`);
        }else{
            prompt = newPrompt;
        }
    }
    let promptWithWorldInfo = await handleLorebookPrompt(construct, prompt, chatLog);
    if(promptWithWorldInfo !== null && promptWithWorldInfo !== undefined){
        prompt = promptWithWorldInfo;
    }
    if(replaceUser === true){
        prompt = prompt.replaceAll('{{user}}', `${currentUser}`).replaceAll('{{char}}', `${construct.name}`);
    }
    if(chatLog.doVector === true){
        let memoryText = ''
        const memories = await getRelaventMemories(chatLog._id, chatLog.lastMessage.text)
        for(let i = 0; i < memories.length; i++){
            if(memories[i] !== undefined){
                if(memories[i].item.metadata.text !== undefined && memories[i].item.metadata.text !== null && memories[i].item.metadata.text !== '' && memories[i].item.metadata.text !== chatLog.lastMessage.text){
                    memoryText += `${memories[i].item.metadata.user}: ${memories[i].item.metadata.text}\n`;
                }
            }
        }
        prompt = memoryText + prompt;
    }
    const response = await generateText(prompt, currentUser, stopList).then((response) => {
        return response;
    }).catch((error) => {
        console.log('Error from GenerateText:', error);
        return null;
    });
    if (response && response.results && response.results[0]) {
        return breakUpCommands(construct.name, response.results[0], currentUser, stopList, doMultiLine);
    } else {
        console.log('No valid response from GenerateText:', response?.error?.toString());
        return null;
    }
}

export async function generateContinueChatLogAsUser(user: UserInterface, chatLog: ChatInterface, currentUser?: string, messagesToInclude?: any, stopList?: string[], authorsNote?: string | string[], authorsNoteDepth?: number, doMultiLine?: boolean, replaceUser: boolean = true) {
    let prompt = assembleUserPrompt(user, chatLog, currentUser, messagesToInclude);
    prompt = prompt.replaceAll('{{char}}', `${user ? (user?.nickname || user.name) : 'DefaultUser'}`);
    const response = await generateText(prompt, currentUser, stopList);
    if (response && response.results && response.results[0]) {
        return breakUpCommands(`${user ? (user?.nickname || user.name) : 'DefaultUser'}`, response.results[0], currentUser, stopList, doMultiLine);
    } else {
        console.log('No valid response from GenerateText:', response?.error?.toString());
        return null;
    }
}

export function breakUpCommands(charName: string, commandString: string, user = 'You', stopList: string[] = [], doMultiLine: boolean = false): string {
    let lines = commandString.split('\n');
    let formattedCommands = [];
    let currentCommand = '';
    let isFirstLine = true;
    
    if (doMultiLine === false){
        lines = lines.slice(0, 1);
        let command = lines[0];
        return command;
    }
    
    for (let i = 0; i < lines.length; i++) {
        // If the line starts with a colon, it's the start of a new command
        let lineToTest = lines[i].toLocaleLowerCase();
        
        if (lineToTest.startsWith(`${user.toLocaleLowerCase()}:`) || lineToTest.startsWith('you:') || lineToTest.startsWith('<start>') || lineToTest.startsWith('<end>') || lineToTest.startsWith('<user>') || lineToTest.toLocaleLowerCase().startsWith('user:')) {
          break;
        }
        
        if (stopList !== null) {
            for(let j = 0; j < stopList.length; j++){
                if(lineToTest.startsWith(`${stopList[j].toLocaleLowerCase()}`)){
                    break;
                }
            }
        }
        
        if (lineToTest.startsWith(`${charName}:`)) {
            isFirstLine = false;
            if (currentCommand !== '') {
                // Push the current command to the formattedCommands array
                currentCommand = currentCommand.replaceAll(`${charName}:`, '')
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
        formattedCommands.push(currentCommand.replaceAll(`${charName}:`, ''));
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

export async function regenerateMessageFromChatLog(chatLog: ChatInterface, messageContent: string, messageID?: string, authorsNote?: string, authorsNoteDepth?: number, doMultiLine?: boolean){
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
    let newReply = await generateContinueChatLog(construct, chatLog, foundMessage.participants[0], undefined, undefined, authorsNote, authorsNoteDepth, doMultiLine);
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
        isThought: false,
    }
    messages = beforeMessages.concat(newMessage, afterMessages);    
    chatLog.messages = messages;
    await updateChat(chatLog);
    return newReply;
}

export async function regenerateUserMessageFromChatLog(chatLog: ChatInterface, messageContent: string, messageID?: string, authorsNote?: string, authorsNoteDepth?: number, doMultiLine?: boolean){
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
    let userData = await getUser(foundMessage.userID);
    if(userData === null){
        console.log('Could not find construct to regenerate message');
        return;
    }
    let construct = assembleUserFromData(userData);
    if(construct === null){
        console.log('Could not assemble construct from data');
        return;
    }
    let newReply = await generateContinueChatLogAsUser(construct, chatLog, foundMessage.participants[0], undefined, undefined, authorsNote, authorsNoteDepth, doMultiLine);
    if(newReply === null){
        console.log('Could not generate new reply');
        return;
    }
    let newMessage = {
        _id: Date.now().toString(),
        user: construct ? (construct?.nickname || construct.name) : 'DefaultUser',
        avatar: construct.avatar,
        text: newReply,
        userID: construct._id,
        timestamp: Date.now(),
        origin: 'Discord',
        isHuman: true,
        isCommand: false,
        isPrivate: false,
        participants: foundMessage.participants,
        attachments: [],
        isThought: false,
    }
    messages = beforeMessages.concat(newMessage, afterMessages);    
    chatLog.messages = messages;
    await updateChat(chatLog);
    return newReply;
}

function constructController() {
    ActiveConstructs = retrieveConstructs();
    
    expressApp.post('/api/constructs/add-to-active', (req, res) => {
        addConstruct(req.body.construct); // Assuming 'construct' is the property sent in the body.
        ActiveConstructs = retrieveConstructs();
        res.json({ activeConstructs: ActiveConstructs });
    });
    
    expressApp.post('/api/constructs/remove-active', (req, res) => {
        removeConstruct(req.body.construct);
        ActiveConstructs = retrieveConstructs();
        res.json({ activeConstructs: ActiveConstructs });
    });
    
    expressApp.get('/api/constructs/active-list', (req, res) => {
        ActiveConstructs = retrieveConstructs();
        res.json({ activeConstructs: ActiveConstructs });
    });
    
    expressApp.post('/api/constructs/is-active', (req, res) => {
        const isActive = isConstructActive(req.body.construct);
        res.json({ isActive });
    });
    
    expressApp.post('/api/constructs/remove-all-active', (req, res) => {
        clearActiveConstructs();
        ActiveConstructs = retrieveConstructs();
        res.json({ activeConstructs: ActiveConstructs });
    })

    expressApp.post('/api/constructs/set-construct-primary', (req, res) => {
        const constructId = req.body.constructId;
        setAsPrimary(constructId);
        const activeConstructs = retrieveConstructs();
        res.json({ activeConstructs });
    });
    
    expressApp.post('/api/constructs/multi-line', (req, res) => {
        const value = req.body.value;
        setDoMultiLine(value);
        const currentDoMultiLine = getDoMultiLine();
        res.json({ doMultiLine: currentDoMultiLine });
    });
    
    expressApp.get('/api/constructs/multi-line', (req, res) => {
        const currentDoMultiLine = getDoMultiLine();
        res.json({ doMultiLine: currentDoMultiLine });
    });

    expressApp.post('/api/constructs/character-prompt', (req, res) => {
        const construct = req.body.construct;
        const prompt = getCharacterPromptFromConstruct(construct);
        res.json({ prompt });
    });
    
    expressApp.post('/api/constructs/assemble-prompt', (req, res) => {
        const { construct, chatLog, currentUser, messagesToInclude } = req.body;
        const prompt = assemblePrompt(construct, chatLog, currentUser, messagesToInclude);
        res.json({ prompt });
    });
    
    expressApp.post('/api/constructs/assemble-instruct-prompt', (req, res) => {
        const { construct, chatLog, currentUser, messagesToInclude } = req.body;
        const prompt = assembleInstructPrompt(construct, chatLog, currentUser, messagesToInclude);
        res.json({ prompt });
    });    

    expressApp.post('/api/chat/continue', (req, res) => {
        const { construct, chatLog, currentUser, messagesToInclude, stopList, authorsNote, authorsNoteDepth, doMultiline, replaceUser } = req.body;
        generateContinueChatLog(construct, chatLog, currentUser, messagesToInclude, stopList, authorsNote, authorsNoteDepth, doMultiline, replaceUser).then(response => {
            res.json({ response });
        }).catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    expressApp.post('/api/chat/remove-messages', (req, res) => {
        const { chatLog, messageContent } = req.body;
        removeMessagesFromChatLog(chatLog, messageContent).then(response => {
            res.json({ response });
        }).catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    expressApp.post('/api/chat/regenerate-message', (req, res) => {
        const { chatLog, messageContent, messageID, authorsNote, authorsNoteDepth, doMultiline, replaceUser } = req.body;
    
        regenerateMessageFromChatLog(chatLog, messageContent, messageID, authorsNote, authorsNoteDepth, doMultiline).then(response => {
            res.json({ response });
        }).catch(error => {
            res.status(500).json({ error: error.message });
        });
    });    

    expressApp.post('/api/chat/regenerate-user-message', (req, res) => {
        const { chatLog, messageContent, messageID, authorsNote, authorsNoteDepth, doMultiline, replaceUser } = req.body;
    
        regenerateUserMessageFromChatLog(chatLog, messageContent, messageID, authorsNote, authorsNoteDepth, doMultiline).then(response => {
            res.json({ response });
        }).catch(error => {
            res.status(500).json({ error: error.message });
        });
    });    

    expressApp.post('/api/chat/parse-reply', (req, res) => {
        const { charName, commandString, user, stopList } = req.body;
    
        let response = breakUpCommands(charName, commandString, user, stopList);
        res.json({ response });
    });
    

    expressApp.post('/api/construct/thoughts', (req, res) => {
        const { construct, chatLog, currentUser, messagesToInclude } = req.body;
    
        generateThoughts(construct, chatLog, currentUser, messagesToInclude).then((response) => {
            res.json({ response });
        }).catch(error => {
            res.status(500).send({ error: error.message });
        });
    });


    expressApp.post('/api/chat/intent', (req, res) => {
        const { message } = req.body;
    
        detectIntent(message).then((response) => {
            res.json({ response });
        }).catch(error => {
            res.status(500).send({ error: error.message });
        });
    });
    
    expressApp.post('/api/classify/yesno', (req, res) => {
        const { message } = req.body;
    
        getYesNoMaybe(message).then((result) => {
            res.json({ result });
        }).catch(error => {
            res.status(500).send({ error: error.message });
        });
    });    
}
export default constructController;