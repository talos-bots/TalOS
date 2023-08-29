import { ipcMain } from 'electron';
import axios from 'axios';
import { StableDiffusionProcessingTxt2Img } from '@/types';
import Store from 'electron-store';
const store = new Store({
    name: 'stableDiffusionData',
});

const getSDApiUrl = (): string => {
    return store.get('apiUrl', '') as string;
}

const setSDApiUrl = (apiUrl: string): void => {
    store.set('apiUrl', apiUrl);
}

const setDefaultPrompt = (prompt: string): void => {
    store.set('defaultPrompt', prompt);
}

const getDefaultPrompt = (): string => {
    return store.get('defaultPrompt', '') as string;
}


export function SDRoutes(){
    ipcMain.on('setDefaultPrompt', (event, prompt) => {
        setDefaultPrompt(prompt);
    });

    ipcMain.on('getDefaultPrompt', (event) => {
        event.sender.send('getDefaultPrompt-reply', getDefaultPrompt());
    });

    ipcMain.on('setSDApiUrl', (event, apiUrl) => {
        setSDApiUrl(apiUrl);
    });

    ipcMain.on('getSDApiUrl', (event) => {
        event.sender.send('getSDApiUrl-reply', getSDApiUrl());
    });

    ipcMain.on('txt2img', (event, data, endpoint) => {
        txt2img(data, endpoint).then((result) => {
            event.sender.send('txt2img-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });
}

const txt2img = async (data: StableDiffusionProcessingTxt2Img, apiUrl?: string): Promise<any> => {
    if (apiUrl === '') {
        apiUrl = getSDApiUrl();
    }
    try {
        const response = await axios.post(apiUrl + `/sdapi/v1/txt2img`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to send data: ${error.message}`);
    }
}