import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import axios from "axios";
import { IpcRendererEvent, ipcRenderer } from "electron";

export async function constructIsActive(id: string): Promise<boolean> {
    try {
        const response = await axios.post(`/api/construct/is-active`, { construct: id });
        return response.data.isActive;
    } catch (error) {
        console.error("Error checking if construct is active:", error);
        return false;
    }
}

export async function getActiveConstructList(): Promise<string[]> {
    try {
        const response = await axios.get(`/api/construct/active-list`);
        return response.data.activeConstructs;
    } catch (error) {
        console.error("Error retrieving active construct list:", error);
        return [];
    }
}

export async function addConstructToActive(id: string): Promise<void> {
    try {
        await axios.post(`/api/construct/add-to-active`, { construct: id });
    } catch (error) {
        console.error("Error adding construct to active list:", error);
    }
}

export async function removeConstructFromActive(id: string): Promise<void> {
    try {
        await axios.post(`/api/construct/remove-active`, { construct: id });
    } catch (error) {
        console.error("Error removing construct from active list:", error);
    }
}

export async function removeAllActiveConstructs(): Promise<void> {
    try {
        await axios.post(`/api/construct/remove-all-active`);
    } catch (error) {
        console.error("Error removing all active constructs:", error);
    }
}

export async function setConstructAsPrimary(constructId: string): Promise<{ activeConstructs: any }> {
    const response = await axios.post('/api/construct/set-construct-primary', { constructId });
    return response.data;
}

export async function setDoMultiLine(value: boolean): Promise<{ doMultiLine: boolean }> {
    const response = await axios.post('/api/construct/multi-line', { value });
    return response.data;
}

export async function getDoMultiLine(): Promise<{ doMultiLine: boolean }> {
    const response = await axios.get('/api/construct/multi-line');
    return response.data;
}

export const getCharacterPromptFromConstruct = async (construct: Construct): Promise<string> => {
    try {
        const response = await axios.post('/api/construct/character-prompt', { construct });
        return response.data.prompt;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const assemblePrompt = async (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number): Promise<string> => {
    try {
        const response = await axios.post('/api/construct/assemble-prompt', {
            construct,
            chatLog,
            currentUser,
            messagesToInclude
        });
        return response.data.prompt;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const assembleInstructPrompt = async (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number): Promise<string> => {
    try {
        const response = await axios.post('/api/construct/assemble-instruct-prompt', {
            construct,
            chatLog,
            currentUser,
            messagesToInclude
        });
        return response.data.prompt;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const generateContinueChatLog = async (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number, stopList?: any, authorsNote?: string | string[], authorsNoteDepth?: number, doMultiline?: boolean, replaceUser?: boolean): Promise<string> => {
    try {
        const response = await axios.post('/api/chat/continue', {
            construct,
            chatLog,
            currentUser,
            messagesToInclude,
            stopList,
            authorsNote,
            authorsNoteDepth,
            doMultiline,
            replaceUser
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const removeMessagesFromChatLog = async (chatLog: Chat, messageContent: string): Promise<any> => {
    try {
        const response = await axios.post('/api/chat/remove-messages', {
            chatLog,
            messageContent
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const regenerateMessageFromChatLog = async (chatLog: Chat, messageContent: string, messageID: string, authorsNote?: string | string[], authorsNoteDepth?: number, doMultiline?: boolean, replaceUser?: boolean): Promise<any> => {
    try {
        const response = await axios.post('/api/chat/regenerate-message', {
            chatLog,
            messageContent,
            messageID,
            authorsNote,
            authorsNoteDepth,
            doMultiline,
            replaceUser
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const regenerateUserMessageFromChatLog = async (chatLog: Chat, messageContent: string, messageID: string, authorsNote?: string | string[], authorsNoteDepth?: number, doMultiline?: boolean, replaceUser?: boolean): Promise<any> => {
    try {
        const response = await axios.post('/api/chat/regenerate-user-message', {
            chatLog,
            messageContent,
            messageID,
            authorsNote,
            authorsNoteDepth,
            doMultiline,
            replaceUser
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const breakUpCommands = async (charName: string, commandString: string, user: any, stopList: any): Promise<any> => {
    try {
        const response = await axios.post('/api/chat/parse-reply', {
            charName,
            commandString,
            user,
            stopList
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const generateThoughts = async (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number): Promise<string> => {
    try {
        const response = await axios.post('/api/construct/thoughts', {
            construct,
            chatLog,
            currentUser,
            messagesToInclude
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error.response.data.error);
    }
}

export const getIntent = async (message: string): Promise<any> => {
    try {
        const response = await axios.post('/api/chat/intent', {
            message
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error.response.data.error);
    }
}

export const getYesNo = (message: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-yes-no-classification-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('get-yes-no-classification', uniqueEventName, message);
        ipcRenderer.once(uniqueEventName, (event, response) => {
            resolve(response);
        });
    });
}