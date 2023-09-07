import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import { IpcRendererEvent, ipcRenderer } from "electron";

export async function constructIsActive(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "is-construct-active-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("is-construct-active", id, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: boolean) => {
            resolve(data);
        });
    });
}

export async function getActiveConstructList(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-construct-active-list-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-construct-active-list", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: string[]) => {
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
        const uniqueEventName = "set-do-multi-line-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('set-do-multi-line', arg, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}

export const getDoMultiLine = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-do-multi-line-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('get-do-multi-line', uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}

export const getCharacterPromptFromConstruct = (construct: Construct): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-character-prompt-from-construct-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('get-character-prompt-from-construct', construct, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, prompt) => {
            resolve(prompt);
        });
    });
}

export const assemblePrompt = (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "assemble-prompt-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('assemble-prompt', construct, chatLog, currentUser, messagesToInclude, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, prompt) => {
            resolve(prompt);
        });
    });
}

export const assembleInstructPrompt = (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "assemble-instruct-prompt-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('assemble-instruct-prompt', construct, chatLog, currentUser, messagesToInclude, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, prompt) => {
            resolve(prompt);
        });
    });
}

export const generateContinueChatLog = (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number, stopList?: any, authorsNote?: string | string[], authorsNoteDepth?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "generate-continue-chat-log-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('generate-continue-chat-log', construct, chatLog, currentUser, messagesToInclude, stopList, authorsNote, authorsNoteDepth, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}

export const removeMessagesFromChatLog = (chatLog: Chat, messageContent: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "remove-messages-from-chat-log-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('remove-messages-from-chat-log', chatLog, messageContent, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}

export const regenerateMessageFromChatLog = (chatLog: Chat, messageContent: string, messageID: string, authorsNote?: string | string[], authorsNoteDepth?: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "regenerate-message-from-chat-log-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('regenerate-message-from-chat-log', chatLog, messageContent, messageID, authorsNote, authorsNoteDepth, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}

export const breakUpCommands = (charName: string, commandString: string, user: any, stopList: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "break-up-commands-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('break-up-commands', charName, commandString, user, stopList, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}

export const generateThoughts = (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "generate-thoughts-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('generate-thoughts', construct, chatLog, currentUser, messagesToInclude, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}