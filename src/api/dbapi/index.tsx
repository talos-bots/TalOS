import { Construct } from "@/classes/Construct";
import { Attachment } from "@/classes/Attachment";
import { Chat } from "@/classes/Chat";
import { IpcRendererEvent, ipcRenderer } from "electron";
import { Instruct } from "@/classes/Instruct";
import { removeConstructFromActive } from "../constructapi";

export async function getConstructs(): Promise<Construct[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-constructs-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-constructs", uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                console.log(data);
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