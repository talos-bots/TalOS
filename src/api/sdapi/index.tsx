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
