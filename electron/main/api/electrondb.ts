import ElectronStore from 'electron-store';
import Store from 'electron-store';

let constructDB: ElectronStore<any>;
let chatsDB: ElectronStore<any>;
let commandDB: ElectronStore<any>;
let attachmentDB: ElectronStore<any>;
let instructDB: ElectronStore<any>;
let completionDB: ElectronStore<any>;
let userDB: ElectronStore<any>;

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
    completionDB = new Store({
        name: 'completionData',
    });
    userDB = new Store({
        name: 'userData',
    });
}

export const getConstructFromEDB = (id: string): any => {
    return constructDB.get(id);
}

export const getConstructsFromEDB = (): any[] => {
    const storeData = constructDB.store;
    const result = [];

    for (let id in storeData) {
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
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
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
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
    for(let chat of chats) {
        if(chat.agents.includes(id)) {
            constructChats.push({
                doc: {
                    ...chat
                },
                id: chat._id,
                key: chat._id,
                value: {
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
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
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
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
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
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
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

export const getCompletionFromEDB = (id: string): any => {
    return completionDB.get(id);
}

export const getCompletionsFromEDB = (): any[] => {
    const storeData = completionDB.store;

    const result = [];

    for (let id in storeData) {
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
                    rev: 'unknown'
                }
            });
        }
    }

    return result;
}

export const addCompletionFromEDB = (id: string, data: any): void => {
    completionDB.set(id, data);
}

export const removeCompletionFromEDB = (id: string): void => {
    completionDB.delete(id);
}

export const getUserFromEDB = (id: string): any => {
    return userDB.get(id);
}

export const getUsersFromEDB = (): any[] => {
    const storeData = userDB.store;

    const result = [];

    for (let id in storeData) {
        if (id !== 'ids') {
            const construct = storeData[id];
            result.push({
                doc: construct,
                id: id,
                key: id,
                value: {
                    rev: 'unknown'
                }
            });
        }
    }

    return result;
}

export const addUserFromEDB = (id: string, data: any): void => {
    userDB.set(id, data);
}

export const removeUserFromEDB = (id: string): void => {
    userDB.delete(id);
}

const clearUsersFromEDB = (): void => {
    userDB.clear();
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

const clearCompletionsFromEDB = (): void => {
    completionDB.clear();
}

export const clearEDB = (): void => {
    clearConstructsFromEDB();
    clearChatsFromEDB();
    clearCommandsFromEDB();
    clearAttachmentsFromEDB();
    clearInstructsFromEDB();
    clearCompletionsFromEDB();
    clearUsersFromEDB();
}

export async function ElectronDBRoutes(){
    initEDB();
};