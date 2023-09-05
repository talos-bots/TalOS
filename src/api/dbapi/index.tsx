import { Construct } from "@/classes/Construct";
import { Attachment } from "@/classes/Attachment";
import { Chat } from "@/classes/Chat";
import { IpcRendererEvent, ipcRenderer } from "electron";
import { Instruct } from "@/classes/Instruct";
import { removeConstructFromActive } from "../constructapi";
import { CompletionLog } from "@/classes/CompletionLog";
import { User } from "@/classes/User";
import { Lorebook } from "@/classes/Lorebook";

export async function getConstructs(): Promise<Construct[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-constructs-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-constructs", uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const constructs = data.map((doc: any) => {
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
                    );
                });
                resolve(constructs);
            } else {
                reject(new Error("No data received from 'constructs' event."));
            }
        });
    });
}

export async function getConstruct(id: string): Promise<Construct> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-construct-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-construct", id, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const construct = new Construct(
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
                );
                resolve(construct);
            } else {
                reject(new Error("No data received from 'construct' event."));
            }
        });
    });
}

export async function saveNewConstruct(construct: Construct) {
    ipcRenderer.send('add-construct', construct);
}

export async function updateConstruct(construct: Construct) {
    ipcRenderer.send('update-construct', construct);
}

export async function deleteConstruct(id: string) {
    ipcRenderer.send('delete-construct', id);
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
                        doc.doc.data,
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
                    data.data,
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
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-chats-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-chats", uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const chats = data.map((doc: any) => {
                    return new Chat(
                        doc.doc._id,
                        doc.doc.name,
                        doc.doc.type,
                        doc.doc.messages,
                        doc.doc.lastMessage,
                        doc.doc.lastMessageDate,
                        doc.doc.firstMessageDate,
                        doc.doc.constructs,
                        doc.doc.humans
                    );
                });
                resolve(chats);
            } else {
                reject(new Error("No data received from 'chats' event."));
            }
        });
    });
}

export async function getChatsByConstruct(constructId: string): Promise<Chat> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-chats-by-construct-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-chats-by-construct", constructId, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const chat = new Chat(
                    data.doc._id,
                    data.doc.name,
                    data.doc.type,
                    data.doc.messages,
                    data.doc.lastMessage,
                    data.doc.lastMessageDate,
                    data.doc.firstMessageDate,
                    data.doc.constructs,
                    data.doc.humans
                );
                resolve(chat);
            } else {
                reject(new Error("No data received from 'chats-by-construct' event."));
            }
        });
    });
}

export async function getChat(id: string): Promise<Chat> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-chat-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-chat", id, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                const chat = new Chat(
                    data._id,
                    data.name,
                    data.type,
                    data.messages,
                    data.lastMessage,
                    data.lastMessageDate,
                    data.firstMessageDate,
                    data.constructs,
                    data.humans
                );
                resolve(chat);
            } else {
                reject(new Error("No data received from 'chat' event."));
            }
        });
    });
}

export async function saveNewChat(chat: Chat) {
    ipcRenderer.send('add-chat', chat);
}

export async function updateChat(chat: Chat) {
    ipcRenderer.send('update-chat', chat);
}

export async function deleteChat(id: string) {
    ipcRenderer.send('delete-chat', id);
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

export async function getStorageValue(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-data-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-data", key, uniqueEventName);

        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'data' event."));
            }
        });
    });
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

export async function setStorageValue(key: string, value: string) {
    const data = {
        key,
        value,
    };
    ipcRenderer.send('set-data', data);
}

export async function clearDBs(){
    ipcRenderer.send('clear-data');
}