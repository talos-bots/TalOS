import { ipcMain } from 'electron';
import Store from 'electron-store';
import { assemblePromptFromLog } from '../helpers/helpers';
import { generateText } from '../api/llm';
const store = new Store({
    name: 'constructData',
});
type ConstructID = string;

export let ActiveConstructs: ConstructID[] = [];

export const retrieveConstructs = (): ConstructID[] => {
    return store.get('ids', []) as ConstructID[];
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

const setAsPrimary = (id: ConstructID): void => {
    const existingIds = retrieveConstructs();  // Assuming retrieveConstructs returns an array of ConstructID
    const index = existingIds.indexOf(id);
    
    if (index > -1) {
        existingIds.splice(index, 1);
    }

    existingIds.unshift(id);

    store.set('ids', existingIds); 
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
    prompt += 'Current Conversation:\n';
    prompt += assemblePromptFromLog(chatLog, messagesToInclude);
    prompt += `${construct.name}:`;
    return prompt.replaceAll('{{user}}', `${currentUser}`);
}

export async function generateContinueChatLog(construct: any, chatLog: any, currentUser?: string, messagesToInclude?: any, stopList?: string[]){
    let prompt = assemblePrompt(construct, chatLog, currentUser, messagesToInclude);
    const response = await generateText(prompt, currentUser, stopList);
    console.log(response);
    let reply = ''
    if(response){
        reply = response.results[0];
        return breakUpCommands(construct.name, reply, currentUser, stopList)
    }else{
        console.log('No valid response from GenerateText');
        return null;
    }
}

export function breakUpCommands(charName: string, commandString: string, user = 'You', stopList: string[] = [], botSettings: any = {doMultiLine: false}): string {
    let lines = commandString.split('\n');
    let formattedCommands = [];
    let currentCommand = '';
    let isFirstLine = true;
    
    if (botSettings.doMultiLine === false){
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
        event.reply('get-construct-active-list-reply', ActiveConstructs);
    });

    ipcMain.on('is-construct-active', (event, arg) => {
        const isActive = isConstructActive(arg);
        event.reply('is-construct-active-reply', isActive);
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
}
export default constructController;