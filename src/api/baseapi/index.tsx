import { ipcRenderer } from "electron";

export function getBackgrounds(): Promise<any[]>{
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-backgrounds');
        ipcRenderer.once('get-backgrounds-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export function deleteBackground(filename: string): Promise<{success: boolean}>{
    return new Promise((resolve, reject) => {
        ipcRenderer.send('delete-background', filename);
        ipcRenderer.once('delete-background-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export function saveBackground(file: File): Promise<string> {
    const name = file.name;
    const fileType = file.name.split('.').pop();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            const base64String = reader.result as string;
            const imageData = base64String.split(',')[1];
            
            ipcRenderer.send('save-background', imageData, name, fileType);
            ipcRenderer.once('save-background-reply', (event, data) => {
                if (data.error) reject(data.error);
                resolve(data);
            });
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}
