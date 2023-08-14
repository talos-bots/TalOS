import { Construct } from "@/classes/Construct";
import { Attachment } from "@/classes/Attachment";
import { Chat } from "@/classes/Chat";
import { IpcRendererEvent, ipcRenderer } from "electron";
import { Instruct } from "@/classes/Instruct";

export async function getConstructs(): Promise<Construct[]> {
    return new Promise((resolve, reject) => {
        ipcRenderer.send("get-constructs");

        ipcRenderer.once("get-constructs-reply", (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const constructs = data.map((doc: any) => {
                    return new Construct(
                        doc._id,
                        doc.name,
                        doc.nickname,
                        doc.avatar,
                        doc.commands,
                        doc.visualDescription,
                        doc.personality,
                        doc.background,
                        doc.relationships,
                        doc.interests,
                        doc.greetings,
                        doc.farewells,
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
        ipcRenderer.send("get-construct", id);
        ipcRenderer.once("get-construct-reply", (event: IpcRendererEvent, data: any) => {
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
}

export async function getCommands(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        ipcRenderer.send("get-commands");

        ipcRenderer.once("get-commands-reply", (event: IpcRendererEvent, data: any[]) => {
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
        ipcRenderer.send("get-command", id);

        ipcRenderer.once("get-command-reply", (event: IpcRendererEvent, data: any) => {
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
        ipcRenderer.send("get-attachments");

        ipcRenderer.once("get-attachments-reply", (event: IpcRendererEvent, data: any[]) => {
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
        ipcRenderer.send("get-attachment", id);

        ipcRenderer.once("get-attachment-reply", (event: IpcRendererEvent, data: any) => {
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
        ipcRenderer.send("get-chats");

        ipcRenderer.once("get-chats-reply", (event: IpcRendererEvent, data: any[]) => {
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
        ipcRenderer.send("get-chats-by-construct", constructId);

        ipcRenderer.once("get-chats-by-construct-reply", (event: IpcRendererEvent, data: any) => {
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
        ipcRenderer.send("get-chat", id);

        ipcRenderer.once("get-chat-reply", (event: IpcRendererEvent, data: any) => {
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
        ipcRenderer.send("get-instructs");

        ipcRenderer.once("get-instructs-reply", (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                const instructs = data.map((doc: any) => {
                    return new Instruct(
                        doc.doc._id,
                        doc.doc.name,
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
        ipcRenderer.send("get-instruct", id);

        ipcRenderer.once("get-instruct-reply", (event: IpcRendererEvent, data: any) => {
            if (data) {
                const instruct = new Instruct(
                    data._id,
                    data.name,
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
        ipcRenderer.send("get-data", key);

        ipcRenderer.once("get-data-reply", (event: IpcRendererEvent, data: any) => {
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