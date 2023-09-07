import { Message } from "@/classes/Message";
import { IpcRendererEvent, ipcRenderer } from "electron";

export async function getVector(text: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-vector-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-vector", text, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'vector' event."));
            }
        });
    });
}

export async function getAllVectors(schemaName: string){
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-all-vectors-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-all-vectors", schemaName, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'get-all-vectors' event."));
            }
        });
    });
}

export async function getRelaventMemories(schemaName: string, text: string){
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-relavent-memories-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("get-relavent-memories", schemaName, text, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'get-relavent-memories' event."));
            }
        });
    });
}

export async function addVectorFromMessage(schemaName: string, message: Message){
    return new Promise((resolve, reject) => {
        const uniqueEventName = "add-vector-from-message-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("add-vector-from-message", schemaName, message, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'add-vector-from-message' event."));
            }
        });
    });
}

export function removeAllMemories(schemaName: string){
    return new Promise((resolve, reject) => {
        const uniqueEventName = "delete-index-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send("delete-index", schemaName, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event: IpcRendererEvent, data: any[]) => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error("No data received from 'delete-index' event."));
            }
        });
    });
}