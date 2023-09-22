import { Construct } from "@/classes/Construct";
import { Attachment } from "@/classes/Attachment";
import { Chat } from "@/classes/Chat";
import { IpcRendererEvent, ipcRenderer } from "electron";
import { Instruct } from "@/classes/Instruct";
import { removeConstructFromActive } from "../constructapi";
import { CompletionLog } from "@/classes/CompletionLog";
import { User } from "@/classes/User";
import { Lorebook } from "@/classes/Lorebook";
import axios from 'axios';

export async function getConstructs(): Promise<Construct[]> {
    try {
        const response = await axios.get(`/api/constructs`);
        const data = response.data;

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
        const response = await axios.get(`/api/construct/${id}`);
        const data = response.data;

        return new Construct(
            data._id,
            data.name,
            data.nickname,
            data.avatar,
            data.commands,
            data.visualDescription,
            data.personality,
            data.background,
            data.relationships,
            data.interests,
            data.greetings,
            data.farewells,
            data.authorsNote,
            data.defaultConfig,
            data.thoughtPattern,
            data.sprites
        );
    } catch (error: any) {
        throw new Error(`Failed to fetch construct with ID ${id}: ${error.message}`);
    }
}

export async function saveNewConstruct(construct: Construct) {
    await axios.post('/api/add-construct', construct);
}

export async function updateConstruct(construct: Construct) {
    await axios.put('/api/update-construct', construct);
}

export async function deleteConstruct(id: string) {
    await axios.delete(`/api/delete-construct/${id}`);
    await removeConstructFromActive(id);
}

export async function getCommands(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-commands-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-commands", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'commands' event."));
            }
        });
    });
}

export async function getCommand(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-command-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-command", id, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'command' event."));
            }
        });
    });
}

export async function saveNewCommand(command: string) {
    ipcRenderer.send('add-command', command);
}

export async function updateCommand(command: string) {
    ipcRenderer.send('update-command', command);
}

export async function deleteCommand(id: string) {
    ipcRenderer.send('delete-command', id);
}

export async function getAttachments(): Promise<Attachment[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-attachments-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-attachments", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const attachments = data.map((doc: any) => {
                    return new Attachment(
                        doc.doc._id,
                        doc.doc.name,
                        doc.doc.type,
                        doc.doc.fileext,
                        doc.doc.data,
                        doc.doc.metadata
                    );
                });
                resolve(attachments);
            } else {
                reject(new Error("No data received from 'attachments' event."));
            }
        });
    });
}

export async function getAttachment(id: string): Promise<Attachment> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-attachment-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-attachment", id, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const attachment = new Attachment(
                    data._id,
                    data.name,
                    data.type,
                    data.fileext,
                    data.data,
                    data.metadata
                );
                resolve(attachment);
            } else {
                reject(new Error("No data received from 'attachment' event."));
            }
        });
    });
}

export async function saveNewAttachment(attachment: Attachment) {
    ipcRenderer.send('add-attachment', attachment);
}

export async function updateAttachment(attachment: Attachment) {
    ipcRenderer.send('update-attachment', attachment);
}

export async function deleteAttachment(id: string) {
    ipcRenderer.send('delete-attachment', id);
}

export async function getChats(): Promise<Chat[]> {
    try {
        const response = await axios.get('/api/chats');
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
        const response = await axios.get(`/api/chats/construct/${constructId}`);
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
        const response = await axios.get(`/api/chat/${id}`);
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
        await axios.post('/api/chat', chat);
    } catch (error) {
        throw new Error("Failed to save new chat to server.");
    }
}

export async function updateChat(chat: Chat) {
    try {
        await axios.put('/api/chat', chat);
    } catch (error) {
        throw new Error("Failed to update chat on server.");
    }
}

export async function deleteChat(id: string) {
    try {
        await axios.delete(`/api/chat/${id}`);
    } catch (error) {
        throw new Error("Failed to delete chat from server.");
    }
}

export async function getInstructs(): Promise<Instruct[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-instructs-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-instructs", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const instructs = data.map((doc: any) => {
                    return new Instruct(
                        doc.doc._id,
                        doc.doc.name,
                        doc.doc.randomEvents
                    );
                });
                resolve(instructs);
            } else {
                reject(new Error("No data received from 'instructs' event."));
            }
        });
    });
}

export async function getInstruct(id: string): Promise<Instruct> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-instruct-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-instruct", id);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const instruct = new Instruct(
                    data._id,
                    data.name,
                    data.randomEvents
                );
                resolve(instruct);
            } else {
                reject(new Error("No data received from 'instruct' event."));
            }
        });
    });
}

export async function saveNewInstruct(instruct: Instruct) {
    ipcRenderer.send('add-instruct', instruct);
}

export async function updateInstruct(instruct: Instruct) {
    ipcRenderer.send('update-instruct', instruct);
}

export async function deleteInstruct(id: string) {
    ipcRenderer.send('delete-instruct', id);
}

export async function getCompletions(): Promise<CompletionLog[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-completions-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-completions", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const completions = data.map((doc: any) => {
                    return new CompletionLog(
                        doc.doc._id,
                        doc.doc.name,
                        doc.doc.type,
                        doc.doc.completions,
                        doc.doc.lastCompletion,
                        doc.doc.lastCompletionDate
                    );
                });
                resolve(completions);
            } else {
                reject(new Error("No data received from 'completions' event."));
            }
        });
    });
}

export async function getCompletion(id: string): Promise<CompletionLog> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-completion-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-completion", id, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const completion = new CompletionLog(
                    data._id,
                    data.name,
                    data.type,
                    data.completions,
                    data.lastCompletion,
                    data.lastCompletionDate
                );
                resolve(completion);
            } else {
                reject(new Error("No data received from 'completion' event."));
            }
        });
    });
}

export async function saveNewCompletion(completion: CompletionLog) {
    ipcRenderer.send('add-completion', completion);
}

export async function updateCompletion(completion: CompletionLog) {
    ipcRenderer.send('update-completion', completion);
}

export async function deleteCompletion(id: string) {
    ipcRenderer.send('delete-completion', id);
}

export async function getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-users-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-users", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const users = data.map((doc: any) => {
                    return new User(
                        doc.doc._id,
                        doc.doc.name,
                        doc.doc.nickname,
                        doc.doc.avatar,
                        doc.doc.personality,
                        doc.doc.background,
                        doc.doc.relationships,
                        doc.doc.interests
                    );
                });
                resolve(users);
            } else {
                reject(new Error("No data received from 'users' event."));
            }
        });
    });
}

export async function getUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-user-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-user", id, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const user = new User(
                    data._id,
                    data.name,
                    data.nickname,
                    data.avatar,
                    data.personality,
                    data.background,
                    data.relationships,
                    data.interests
                );
                resolve(user);
            } else {
                reject(new Error("No data received from 'user' event."));
            }
        });
    });
}

export async function saveNewUser(user: User) {
    ipcRenderer.send('add-user', user);
}

export async function updateUser(user: User) {
    ipcRenderer.send('update-user', user);
}

export async function deleteUser(id: string) {
    ipcRenderer.send('delete-user', id);
}

export async function getLorebooks(): Promise<Lorebook[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-lorebooks-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-lorebooks", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const lorebooks = data.map((doc: any) => {
                    return new Lorebook(
                        doc.doc._id,
                        doc.doc.name,
                        doc.doc.avatar,
                        doc.doc.description,
                        doc.doc.scan_depth,
                        doc.doc.token_budget,
                        doc.doc.recursive_scanning,
                        doc.doc.global,
                        doc.doc.constructs,
                        doc.doc.extensions,
                        doc.doc.entries
                    );
                });
                resolve(lorebooks);
            } else {
                reject(new Error("No data received from 'lorebooks' event."));
            }
        });
    });
}

export async function getLorebook(id: string): Promise<Lorebook> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-lorebook-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-lorebook", id, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const lorebook = new Lorebook(
                    data._id,
                    data.name,
                    data.avatar,
                    data.description,
                    data.scan_depth,
                    data.token_budget,
                    data.recursive_scanning,
                    data.global,
                    data.constructs,
                    data.extensions,
                    data.entries
                );
                resolve(lorebook);
            } else {
                reject(new Error("No data received from 'lorebook' event."));
            }
        });
    });
}

export async function saveNewLorebook(lorebook: Lorebook) {
    ipcRenderer.send('add-lorebook', lorebook);
}

export async function updateLorebook(lorebook: Lorebook) {
    ipcRenderer.send('update-lorebook', lorebook);
}

export async function deleteLorebook(id: string) {
    ipcRenderer.send('delete-lorebook', id);
}

export async function setStorageValue(key: string, value: string): Promise<void> {
    const data = {
        key,
        value,
    };

    try {
        await axios.post(`/api/set-data`, data);
    } catch (error: any) {
        // Handle the error, maybe by re-throwing it or logging it
        throw new Error(`Failed to set data: ${error.message}`);
    }
}

export async function getStorageValue(key: string): Promise<string> {
    try {
        const response = await axios.get(`/api/get-data/${key}`);
        return response.data.value;
    } catch (error: any) {
        // Handle the error, maybe by re-throwing it or logging it
        throw new Error(`Failed to get data for key ${key}: ${error.message}`);
    }
}

export async function clearDBs(){
    ipcRenderer.send('clear-data');
}