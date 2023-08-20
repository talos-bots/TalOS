import { ipcMain } from 'electron';
import ElectronStore from 'electron-store';
import Store from 'electron-store';

let constructDB: ElectronStore<any>;
let chatsDB: ElectronStore<any>;
let commandDB: ElectronStore<any>;
let attachmentDB: ElectronStore<any>;
let instructDB: ElectronStore<any>;

export const initEDB = () => {
    constructDB = new Store({
        name: 'constructData',
    });
    chatsDB = new Store({
        name: 'chatsData',
    });
    commandDB = new Store({
        name: 'commandsData',
    });
    attachmentDB = new Store({
        name: 'attachmentsData',
    });
    instructDB = new Store({
        name: 'instructData',
    });
}

export const getConstructFromEDB = (id: string): any => {
    return constructDB.get(id);
}

export const getConstructsFromEDB = (): any[] => {
    const storeData = constructDB.store;
    const result = [];

    for (let id in storeData) {
        // Exclude non-construct data (like 'ids')
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
                    // We don't have 'rev' in ElectronDb, so we can either omit it or add a dummy value
                    rev: 'unknown'
                }
            });
        }
    }

    return result;
}


export const addConstructFromEDB = (id: string, data: any): void => {
    constructDB.set(id, data);
}

export const removeConstructFromEDB = (id: string): void => {
    constructDB.delete(id);
}

export const getChatFromEDB = (id: string): any => {
    return chatsDB.get(id);
}

export const getChatsFromEDB = (): any[] => {
    const storeData = chatsDB.store;

    const result = [];

    for (let id in storeData) {
        // Exclude non-construct data (like 'ids')
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
                    // We don't have 'rev' in ElectronDb, so we can either omit it or add a dummy value
                    rev: 'unknown'
                }
            });
        }
    }

    return result;
}

export const getChatsByConstructFromEDB = (id: string): any[] => {
    const chats = chatsDB.store;
    let constructChats: any[] = [];

    // Assuming chatsDB.store is an array
    for(let chat of chats) {
        if(chat.agents.includes(id)) {
            constructChats.push({
                doc: {
                    // This is a simple structure assuming all fields from chat should be in 'doc'. Adjust as needed.
                    ...chat
                },
                id: chat._id,  // Assuming each chat has a unique _id field
                key: chat._id,
                value: {
                    // Again, we don't have 'rev' in ElectronDb, so use a placeholder or omit
                    rev: 'unknown'
                }
            });
        }
    }

    return constructChats;
}

export const addChatFromEDB = (id: string, data: any): void => {
    chatsDB.set(id, data);
}

export const removeChatFromEDB = (id: string): void => {
    chatsDB.delete(id);
}

export const getCommandFromEDB = (id: string): any => {
    return commandDB.get(id);
}

export const getCommandsFromEDB = (): any[] => {
    const storeData = commandDB.store;

    const result = [];

    for (let id in storeData) {
        // Exclude non-construct data (like 'ids')
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
                    // We don't have 'rev' in ElectronDb, so we can either omit it or add a dummy value
                    rev: 'unknown'
                }
            });
        }
    }

    return result;
}

export const addCommandFromEDB = (id: string, data: any): void => {
    commandDB.set(id, data);
}

export const removeCommandFromEDB = (id: string): void => {
    commandDB.delete(id);
}

export const getAttachmentFromEDB = (id: string): any => {
    return attachmentDB.get(id);
}

export const getAttachmentsFromEDB = (): any[] => {
    const storeData = attachmentDB.store;

    const result = [];

    for (let id in storeData) {
        // Exclude non-construct data (like 'ids')
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
                    // We don't have 'rev' in ElectronDb, so we can either omit it or add a dummy value
                    rev: 'unknown'
                }
            });
        }
    }

    return result;
}

export const addAttachmentFromEDB = (id: string, data: any): void => {
    attachmentDB.set(id, data);
}

export const removeAttachmentFromEDB = (id: string): void => {
    attachmentDB.delete(id);
}

export const getInstructFromEDB = (id: string): any => {
    return instructDB.get(id);
}

export const getInstructsFromEDB = (): any[] => {
    const storeData = instructDB.store;

    const result = [];

    for (let id in storeData) {
        // Exclude non-construct data (like 'ids')
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
                    // We don't have 'rev' in ElectronDb, so we can either omit it or add a dummy value
                    rev: 'unknown'
                }
            });
        }
    }

    return result;
}

export const addInstructFromEDB = (id: string, data: any): void => {
    instructDB.set(id, data);
}

export const removeInstructFromEDB = (id: string): void => {
    instructDB.delete(id);
}

const clearConstructsFromEDB = (): void => {
    constructDB.clear();
}

const clearChatsFromEDB = (): void => {
    chatsDB.clear();
}

const clearCommandsFromEDB = (): void => {
    commandDB.clear();
}

const clearAttachmentsFromEDB = (): void => {
    attachmentDB.clear();
}

const clearInstructsFromEDB = (): void => {
    instructDB.clear();
}

export const clearEDB = (): void => {
    clearConstructsFromEDB();
    clearChatsFromEDB();
    clearCommandsFromEDB();
    clearAttachmentsFromEDB();
    clearInstructsFromEDB();
}

export async function ElectronDBRoutes(){
    initEDB();
};