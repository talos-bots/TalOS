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