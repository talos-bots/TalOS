import { Construct } from "@/classes/Construct";
import { Attachment } from "@/classes/Attachment";
import { Chat } from "@/classes/Chat";
import { Instruct } from "@/classes/Instruct";
import { removeConstructFromActive } from "../constructapi";
import { CompletionLog } from "@/classes/CompletionLog";
import { User } from "@/classes/User";
import { Lorebook } from "@/classes/Lorebook";
import axios from 'axios';
import { url } from '@/App';

export async function getConstructs(): Promise<Construct[]> {
    try {
        const response = await axios.get(`${url}/api/constructs`);
        const data = response.data;
        console.log("Constructs:", data);
        return data.map((doc: any) => {
            return new Construct(
                doc.doc._id,
                doc.doc.name,
                doc.doc.nickname,
                doc.doc.avatar,
                doc.doc.commands,
                doc.doc.visualDescription,
                doc.doc.personality,
                doc.doc.background,
                doc.doc.relationships,
                doc.doc.interests,
                doc.doc.greetings,
                doc.doc.farewells,
                doc.doc.authorsNote,
                doc.doc.defaultConfig,
                doc.doc.thoughtPattern,
                doc.doc.sprites
            );
        });
    } catch (error: any) {
        throw new Error(`Failed to fetch constructs: ${error.message}`);
    }
}

export async function getConstruct(id: string): Promise<Construct> {
    try {
        const response = await axios.get(`${url}/api/construct/${id}`).then(response => response.data);
        console.log("Construct:", response);
        return new Construct(
            response._id,
            response.name,
            response.nickname,
            response.avatar,
            response.commands,
            response.visualDescription,
            response.personality,
            response.background,
            response.relationships,
            response.interests,
            response.greetings,
            response.farewells,
            response.authorsNote,
            response.defaultConfig,
            response.thoughtPattern,
            response.sprites
        );
    } catch (error: any) {
        throw new Error(`Failed to fetch construct with ID ${id}: ${error.message}`);
    }
}

export async function saveNewConstruct(construct: Construct) {
    await axios.post(`${url}/api/constructs/add/${construct._id}`, construct);
}

export async function updateConstruct(construct: Construct) {
    await axios.put(`${url}/api/update-construct/${construct._id}`, construct);
}

export async function deleteConstruct(id: string) {
    await axios.delete(`${url}/api/delete-construct/${id}`);
    await removeConstructFromActive(id);
}

export async function getCommands(): Promise<string[]> {
    try {
        const response = await axios.get(`${url}/api/commands`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to get commands from server.");
    }
}

export async function getCommand(id: string): Promise<string> {
    try {
        const response = await axios.get(`${url}/api/command/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to get command from server.");
    }
}

export async function saveNewCommand(command: string) {
    try {
        await axios.post(`${url}/api/command`, { command });
    } catch (error) {
        throw new Error("Failed to save new command to server.");
    }
}

export async function updateCommand(command: string) {
    try {
        await axios.put(`${url}/api/command`, { command });
    } catch (error) {
        throw new Error("Failed to update command on server.");
    }
}

export async function deleteCommand(id: string) {
    try {
        await axios.delete(`${url}/api/command/${id}`);
    } catch (error) {
        throw new Error("Failed to delete command from server.");
    }
}

export async function getAttachments(): Promise<Attachment[]> {
    try {
        const response = await axios.get(`${url}/api/attachments`);
        const data = response.data;

        return data.map((doc: any) => {
            return new Attachment(
                doc.doc._id,
                doc.doc.name,
                doc.doc.type,
                doc.doc.fileext,
                doc.doc.data,
                doc.doc.metadata
            );
        });
    } catch (error) {
        throw new Error("Failed to fetch attachments from the server.");
    }
}

export async function getAttachment(id: string): Promise<Attachment> {
    try {
        const response = await axios.get(`${url}/api/attachment/${id}`);
        const data = response.data;

        return new Attachment(
            data._id,
            data.name,
            data.type,
            data.fileext,
            data.data,
            data.metadata
        );
    } catch (error) {
        throw new Error("Failed to fetch the attachment from the server.");
    }
}

export async function saveNewAttachment(attachment: Attachment) {
    try {
        await axios.post(`${url}/api/attachment`, attachment);
    } catch (error) {
        throw new Error("Failed to save the new attachment to the server.");
    }
}

export async function updateAttachment(attachment: Attachment) {
    try {
        await axios.put(`${url}/api/attachment/${attachment._id}`, attachment);
    } catch (error) {
        throw new Error("Failed to update the attachment on the server.");
    }
}

export async function deleteAttachment(id: string) {
    try {
        await axios.delete(`${url}/api/attachment/${id}`);
    } catch (error) {
        throw new Error("Failed to delete the attachment from the server.");
    }
}

export async function getChats(): Promise<Chat[]> {
    try {
        const response = await axios.get(`${url}/api/chats`);
        return response.data.map((doc: any) => new Chat(
            doc.doc._id,
            doc.doc.name,
            doc.doc.type,
            doc.doc.messages,
            doc.doc.lastMessage,
            doc.doc.lastMessageDate,
            doc.doc.firstMessageDate,
            doc.doc.constructs,
            doc.doc.humans,
            doc.doc.chatConfigs,
            doc.doc.doVector,
            doc.doc.global
        ));
    } catch (error) {
        throw new Error("Failed to get chats from server.");
    }
}

export async function getChatsByConstruct(constructId: string): Promise<Chat> {
    try {
        const response = await axios.get(`${url}/api/chats/construct/${constructId}`);
        const data = response.data;
        return new Chat(
            data.doc._id,
            data.doc.name,
            data.doc.type,
            data.doc.messages,
            data.doc.lastMessage,
            data.doc.lastMessageDate,
            data.doc.firstMessageDate,
            data.doc.constructs,
            data.doc.humans,
            data.doc.chatConfigs,
            data.doc.doVector,
            data.doc.global
        );
    } catch (error) {
        throw new Error("Failed to get chat by construct from server.");
    }
}

export async function getChat(id: string): Promise<Chat> {
    try {
        const response = await axios.get(`${url}/api/chat/${id}`);
        const data = response.data;
        return new Chat(
            data._id,
            data.name,
            data.type,
            data.messages,
            data.lastMessage,
            data.lastMessageDate,
            data.firstMessageDate,
            data.constructs,
            data.humans,
            data.chatConfigs,
            data.doVector,
            data.global
        );
    } catch (error) {
        throw new Error("Failed to get chat from server.");
    }
}

export async function saveNewChat(chat: Chat) {
    try {
        await axios.post(`${url}/api/chat`, chat);
    } catch (error) {
        throw new Error("Failed to save new chat to server.");
    }
}

export async function updateChat(chat: Chat) {
    try {
        await axios.put(`${url}/api/chat`, chat);
    } catch (error) {
        throw new Error("Failed to update chat on server.");
    }
}

export async function deleteChat(id: string) {
    try {
        await axios.delete(`${url}/api/chat/${id}`);
    } catch (error) {
        throw new Error("Failed to delete chat from server.");
    }
}

export async function getInstructs(): Promise<Instruct[]> {
    try {
        const response = await axios.get(`${url}/api/instructs`);
        return response.data.map((doc: any) => new Instruct(doc.doc._id, doc.doc.name, doc.doc.randomEvents));
    } catch (error) {
        throw new Error("Failed to get all instructs.");
    }
}

export async function getInstruct(id: string): Promise<Instruct> {
    try {
        const response = await axios.get(`${url}/api/instruct/${id}`);
        const data = response.data;
        return new Instruct(data._id, data.name, data.randomEvents);
    } catch (error) {
        throw new Error("Failed to get instruct.");
    }
}

export async function saveNewInstruct(instruct: Instruct) {
    try {
        const response = await axios.post(`${url}/api/instruct`, instruct);
        return response.data; // Assuming the server returns the saved instruct data.
    } catch (error) {
        throw new Error("Failed to add instruct.");
    }
}

export async function updateInstruct(instruct: Instruct) {
    try {
        const response = await axios.put(`${url}/api/instruct/${instruct._id}`, instruct);
        return response.data; // Assuming the server returns the updated instruct data.
    } catch (error) {
        throw new Error("Failed to update instruct.");
    }
}

export async function deleteInstruct(id: string) {
    try {
        const response = await axios.delete(`${url}/api/instruct/${id}`);
        return response.data; // Assuming the server returns some status or confirmation data.
    } catch (error) {
        throw new Error("Failed to delete instruct.");
    }
}


export async function getCompletions(): Promise<CompletionLog[]> {
    try {
        const response = await axios.get(`${url}/api/completions`);
        return response.data.map((doc: any) => new CompletionLog(
            doc.doc._id,
            doc.doc.name,
            doc.doc.type,
            doc.doc.completions,
            doc.doc.lastCompletion,
            doc.doc.lastCompletionDate
        ));
    } catch (error) {
        throw new Error("Failed to fetch completions from server.");
    }
}

export async function getCompletion(id: string): Promise<CompletionLog> {
    try {
        const response = await axios.get(`${url}/api/completion/${id}`);
        const data = response.data;
        return new CompletionLog(
            data._id,
            data.name,
            data.type,
            data.completions,
            data.lastCompletion,
            data.lastCompletionDate
        );
    } catch (error) {
        throw new Error("Failed to fetch completion from server.");
    }
}

export async function saveNewCompletion(completion: CompletionLog): Promise<void> {
    try {
        await axios.post(`${url}/api/completion`, completion);
    } catch (error) {
        throw new Error("Failed to save new completion to server.");
    }
}

export async function updateCompletion(completion: CompletionLog): Promise<void> {
    try {
        await axios.put(`${url}/api/completion/${completion._id}`, completion);
    } catch (error) {
        throw new Error("Failed to update completion on server.");
    }
}

export async function deleteCompletion(id: string): Promise<void> {
    try {
        await axios.delete(`${url}/api/completion/${id}`);
    } catch (error) {
        throw new Error("Failed to delete completion from server.");
    }
}

export async function getUsers(): Promise<User[]> {
    try {
        const response = await axios.get(`${url}/api/users`);
        const users = response.data.map((doc: any) => {
            return new User(
                doc.doc._id,
                doc.doc.name,
                doc.doc.nickname,
                doc.doc.pronouns,
                doc.doc.avatar,
                doc.doc.personality,
                doc.doc.background,
                doc.doc.relationships,
                doc.doc.interests
            );
        });
        return users;
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

export async function getUser(id: string): Promise<User> {
    try {
        const response = await axios.get(`${url}/api/user/${id}`);
        const data = response.data;
        const user = new User(
            data._id,
            data.name,
            data.nickname,
            data.pronouns,
            data.avatar,
            data.personality,
            data.background,
            data.relationships,
            data.interests
        );
        return user;
    } catch (error: any) {
        throw new Error(`Error fetching user with ID ${id}: ${error.message}`);
    }
}

export async function saveNewUser(user: User): Promise<void> {
    try {
        await axios.post(`${url}/api/user`, user);
    } catch (error: any) {
        throw new Error(`Error adding user: ${error.message}`);
    }
}

export async function updateUser(user: User): Promise<void> {
    try {
        await axios.put(`${url}/api/user/${user._id}`, user);
    } catch (error: any) {
        throw new Error(`Error updating user with ID ${user._id}: ${error.message}`);
    }
}

export async function deleteUser(id: string): Promise<void> {
    try {
        await axios.delete(`${url}/api/user/${id}`);
    } catch (error: any) {
        throw new Error(`Error deleting user with ID ${id}: ${error.message}`);
    }
}

export async function getLorebooks(): Promise<Lorebook[]> {
    try {
        const response = await axios.get(`${url}/api/lorebooks`);
        return response.data.map((lorebookData: any) => {
            return new Lorebook(
                lorebookData.doc._id,
                lorebookData.doc.name,
                lorebookData.doc.avatar,
                lorebookData.doc.description,
                lorebookData.doc.scan_depth,
                lorebookData.doc.token_budget,
                lorebookData.doc.recursive_scanning,
                lorebookData.doc.global,
                lorebookData.doc.constructs,
                lorebookData.doc.extensions,
                lorebookData.doc.entries
            );
        });
    } catch (error: any) {
        throw new Error("Failed to fetch lorebooks: " + error.message);
    }
}

export async function getLorebook(id: string): Promise<Lorebook> {
    try {
        const response = await axios.get(`${url}/api/lorebook/${id}`);
        const lorebookData = response.data;
        return new Lorebook(
            lorebookData._id,
            lorebookData.name,
            lorebookData.avatar,
            lorebookData.description,
            lorebookData.scan_depth,
            lorebookData.token_budget,
            lorebookData.recursive_scanning,
            lorebookData.global,
            lorebookData.constructs,
            lorebookData.extensions,
            lorebookData.entries
        );
    } catch (error: any) {
        throw new Error("Failed to fetch lorebook: " + error.message);
    }
}

export async function saveNewLorebook(lorebook: Lorebook) {
    try {
        await axios.post(`${url}/api/lorebook`, lorebook);
    } catch (error: any) {
        throw new Error("Failed to save new lorebook: " + error.message);
    }
}

export async function updateLorebook(lorebook: Lorebook) {
    try {
        await axios.put(`${url}/api/lorebook/${lorebook._id}`, lorebook);
    } catch (error: any) {
        throw new Error("Failed to update lorebook: " + error.message);
    }
}

export async function deleteLorebook(id: string) {
    try {
        await axios.delete(`${url}/api/lorebook/${id}`);
    } catch (error: any) {
        throw new Error("Failed to delete lorebook: " + error.message);
    }
}

export async function setStorageValue(key: string, value: string): Promise<void> {
    const data = {
        key,
        value,
    };

    try {
        await axios.post(`${url}/api/set-data`, data);
    } catch (error: any) {
        // Handle the error, maybe by re-throwing it or logging it
        throw new Error(`Failed to set data: ${error.message}`);
    }
}

export async function getStorageValue(key: string): Promise<string> {
    try {
        const response = await axios.get(`${url}/api/get-data/${key}`);
        return response.data.value;
    } catch (error: any) {
        // Handle the error, maybe by re-throwing it or logging it
        throw new Error(`Failed to get data for key ${key}: ${error.message}`);
    }
}

export async function clearDBs() {
    try {
        const response = await axios.delete(`${url}/api/clear-data`);
        
        if (response.status === 200) {
            console.log("Data cleared successfully.");
        } else {
            console.error("Failed to clear data:", response.data);
        }
    } catch (error) {
        console.error("Error clearing data:", error);
    }
}