import { BotSettingsType } from '@/types';
import { ipcRenderer } from 'electron';

// Generate Text
export const generateText = (
    prompt: string,
    configuredName: string,
    stopList: string[],
    botSettings: BotSettingsType 
): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-text', prompt, configuredName, stopList, botSettings);
        ipcRenderer.once('generate-text-reply', (event, results) => {
            resolve(results);
        });

    });
}

// Get Status
export const getStatus = (
    endpoint: string,
    endpointType: string 
): Promise<any> => { 
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-status', endpoint, endpointType);
        ipcRenderer.once('get-status-reply', (event, status) => {
            resolve(status);
        });
    });
}
