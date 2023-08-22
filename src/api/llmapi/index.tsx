import { EndpointType, LLMConnectionInformation, Settings } from '@/types';
import { ipcRenderer } from 'electron';

// Generate Text
export const generateText = (
    prompt: string,
    configuredName?: string,
    stopList?: string[]
): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-text', prompt, configuredName, stopList);
        ipcRenderer.once('generate-text-reply', (event, results) => {
            resolve(results);
        });

    });
}

// Get Status
export const getStatus = (
    endpoint?: string,
    endpointType?: string 
): Promise<any> => { 
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-status', endpoint, endpointType);
        ipcRenderer.once('get-status-reply', (event, status) => {
            resolve(status);
        });
    });
}

export const getLLMConnectionInformation = (): Promise<LLMConnectionInformation> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-llm-connection-information');
        ipcRenderer.once('get-llm-connection-information-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export const setLLMConnectionInformation = (endpoint: string, endpointType: EndpointType, password?: string, hordeModel?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('set-llm-connection-information', endpoint, endpointType, password, hordeModel);
        ipcRenderer.once('set-llm-connection-information-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export const setLLMSettings = (settings: Settings, stopBrackets: boolean): void => {
    ipcRenderer.send('set-llm-settings', settings, stopBrackets);
}

export const getLLMSettings = (): Promise<{settings: Settings, stopBrackets: boolean}> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-llm-settings');
        ipcRenderer.once('get-llm-settings-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}