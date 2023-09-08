import { StableDiffusionProcessingTxt2Img } from "@/types";
import { ipcRenderer } from "electron";

export const sendTxt2Img = (
    data: StableDiffusionProcessingTxt2Img, 
    endpoint: string
): Promise<any> => { 
    return new Promise((resolve, reject) => {
        ipcRenderer.send('txt2img', data, endpoint);
        
        ipcRenderer.once('txt2img-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const setSDAPIUrl = (url: string): void => {
    ipcRenderer.send('set-sdapi-url', url);
}

export const getSDAPIUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-sdapi-url');
        
        ipcRenderer.once('get-sdapi-url-reply', (event, result) => {
            console.log(result);
            resolve(result);
        });
    });
}

export const getDefaultUpscaler = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-upscaler');
        
        ipcRenderer.once('get-default-upscaler-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const setDefaultUpscaler = (upscaler: string): void => {
    ipcRenderer.send('set-default-upscaler', upscaler);
}

export const getLoras = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-loras');
        
        ipcRenderer.once('get-loras-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getEmbeddings = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-embeddings');
        
        ipcRenderer.once('get-embeddings-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getModels = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-models');
        
        ipcRenderer.once('get-models-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getVaeModels = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-vae-models');
        
        ipcRenderer.once('get-vae-models-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getUpscalers = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-upscalers');
        
        ipcRenderer.once('get-upscalers-reply', (event, result) => {
            resolve(result);
        });
    });
}