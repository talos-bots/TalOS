import { url } from "@/App";
import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import axios from "axios";
import { uploadImage } from "../baseapi";
import { sendTxt2Img } from "../sdapi";

export async function constructIsActive(id: string): Promise<boolean> {
    try {
        const response = await axios.post(`${url}/api/constructs/is-active`, { construct: id });
        return response.data.isActive;
    } catch (error) {
        console.error("Error checking if construct is active:", error);
        return false;
    }
}

export async function getActiveConstructList(): Promise<string[]> {
    try {
        const response = await axios.get(`${url}/api/constructs/active-list`);
        return response.data.activeConstructs;
    } catch (error) {
        console.error("Error retrieving active construct list:", error);
        return [];
    }
}

export async function addConstructToActive(id: string): Promise<void> {
    try {
        await axios.post(`${url}/api/constructs/add-to-active`, { construct: id });
    } catch (error) {
        console.error("Error adding construct to active list:", error);
    }
}

export async function removeConstructFromActive(id: string): Promise<void> {
    try {
        await axios.post(`${url}/api/constructs/remove-active`, { construct: id });
    } catch (error) {
        console.error("Error removing construct from active list:", error);
    }
}

export async function removeAllActiveConstructs(): Promise<void> {
    try {
        await axios.post(`${url}/api/constructs/remove-all-active`);
    } catch (error) {
        console.error("Error removing all active constructs:", error);
    }
}

export async function setConstructAsPrimary(constructId: string): Promise<{ activeConstructs: any }> {
    const response = await axios.post(`${url}/api/constructs/set-construct-primary`, { constructId });
    return response.data;
}

export async function setDoMultiLine(value: boolean): Promise<{ doMultiLine: boolean }> {
    const response = await axios.post(`${url}/api/constructs/multi-line`, { value });
    return response.data;
}

export async function getDoMultiLine(): Promise<{ doMultiLine: boolean }> {
    const response = await axios.get(`${url}/api/constructs/multi-line`);
    return response.data;
}

export const getCharacterPromptFromConstruct = async (construct: Construct): Promise<string> => {
    try {
        const response = await axios.post(`${url}/api/constructs/character-prompt`, { construct });
        return response.data.prompt;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const assemblePrompt = async (construct: Construct, chatLog: Chat, currentUser?: string, messagesToInclude?: number): Promise<string> => {
    try {
        const response = await axios.post(`${url}/api/constructs/assemble-prompt`, {
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
        const response = await axios.post(`${url}/api/constructs/assemble-instruct-prompt`, {
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
        const response = await axios.post(`${url}/api/chat/continue`, {
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
        const response = await axios.post(`${url}/api/chat/remove-messages`, {
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
        const response = await axios.post(`${url}/api/chat/regenerate-message`, {
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
        const response = await axios.post(`${url}/api/chat/regenerate-user-message`, {
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
        const response = await axios.post(`${url}/api/chat/parse-reply`, {
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
        const response = await axios.post(`${url}/api/construct/thoughts`, {
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
        const response = await axios.post(`${url}/api/chat/intent`, {
            message
        });
        return response.data.response;
    } catch (error: any) {
        throw new Error(error.response.data.error);
    }
}

export const getYesNo = async (message: string): Promise<any> => {
    try {
        const response = await axios.post(`${url}/api/classify/yesno`, {
            message
        });
        return response.data.result;
    } catch (error: any) {
        throw new Error(error.response.data.error);
    }
}

export async function takeSelfie(construct: Construct, intent: string, subject: string): Promise<any> {
    let visualPrompt = construct.visualDescription;
    let returnURL = '';
    visualPrompt += ', ' + intent + ', ' + subject;
    const imageData = await sendTxt2Img(visualPrompt);
    if (imageData !== null) {
        console.log(imageData);
        // Convert base64 to blob
        const byteCharacters = atob(imageData.base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: "image/png" });

        // Create a File object
        const newName = Date.now().toString() + '.png'; 
        const file = new File([blob], newName, { type: "image/png" });

        // Add to FormData and upload
        const formData = new FormData();
        formData.append('image', file, newName);
        uploadImage(formData);
        returnURL = `/api/images/${newName}`;
    }
    return returnURL;
}