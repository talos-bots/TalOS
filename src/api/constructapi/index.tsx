import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import { IpcRendererEvent, ipcRenderer } from "electron";

export async function constructIsActive(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        ipcRenderer.send("is-construct-active", id);

        ipcRenderer.once("is-construct-active-reply", (event: IpcRendererEvent, data: boolean) => {
            resolve(data);
        });
    });
}

export async function getActiveConstructList(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        ipcRenderer.send("get-construct-active-list");

        ipcRenderer.once("get-construct-active-list-reply", (event: IpcRendererEvent, data: string[]) => {
            if (data.length === 0) {
                resolve([]);
            } else {
                resolve(data);
            }
        });
    });
}

export async function addConstructToActive(id: string): Promise<void> {
    ipcRenderer.send("add-construct-to-active", id);
}

export async function removeConstructFromActive(id: string): Promise<void> {
    ipcRenderer.send("remove-construct-active", id);
}

export async function removeAllActiveConstructs(): Promise<void> {
    ipcRenderer.send("remove-all-constructs-active");
}

export async function setConstructAsPrimary(id: string): Promise<void> {
    ipcRenderer.send("set-construct-primary", id);
}

export const setDoMultiLine = (arg: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('set-do-multi-line', arg);
        ipcRenderer.once('set-do-multi-line-reply', (event, response) => {
            resolve(response);
        });
    });
}

export const getDoMultiLine = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-do-multi-line');
        ipcRenderer.once('get-do-multi-line-reply', (event, response) => {
            resolve(response);
        });
    });
}

export const getCharacterPromptFromConstruct = (construct: Construct): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-character-prompt-from-construct', construct);
        ipcRenderer.once('get-character-prompt-from-construct-reply', (event, prompt) => {
            resolve(prompt);
        });
    });
}

export const assemblePrompt = (construct: Construct, chatLog: Chat, currentUser?: any, messagesToInclude?: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('assemble-prompt', construct, chatLog, currentUser, messagesToInclude);
        ipcRenderer.once('assemble-prompt-reply', (event, prompt) => {
            resolve(prompt);
        });
    });
}

export const assembleInstructPrompt = (construct: Construct, chatLog: Chat, currentUser?: any, messagesToInclude?: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('assemble-instruct-prompt', construct, chatLog, currentUser, messagesToInclude);
        ipcRenderer.once('assemble-instruct-prompt-reply', (event, prompt) => {
            resolve(prompt);
        });
    });
}

export const generateContinueChatLog = (construct: Construct, chatLog: Chat, currentUser?: any, messagesToInclude?: any, stopList?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-continue-chat-log', construct, chatLog, currentUser, messagesToInclude, stopList);
        ipcRenderer.once('generate-continue-chat-log-reply', (event, response) => {
            resolve(response);
        });
    });
}

export const removeMessagesFromChatLog = (chatLog: Chat, messageContent: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('remove-messages-from-chat-log', chatLog, messageContent);
        ipcRenderer.once('remove-messages-from-chat-log-reply', (event, response) => {
            resolve(response);
        });
    });
}

export const regenerateMessageFromChatLog = (chatLog: any, messageContent: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('regenerate-message-from-chat-log', chatLog, messageContent);
        ipcRenderer.once('regenerate-message-from-chat-log-reply', (event, response) => {
            resolve(response);
        });
    });
}

export const breakUpCommands = (charName: string, commandString: string, user: any, stopList: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('break-up-commands', charName, commandString, user, stopList);
        ipcRenderer.once('break-up-commands-reply', (event, response) => {
            resolve(response);
        });
    });
}
