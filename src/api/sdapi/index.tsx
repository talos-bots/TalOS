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