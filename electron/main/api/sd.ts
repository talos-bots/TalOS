import { ipcMain } from 'electron';
import axios from 'axios';
import { StableDiffusionProcessingTxt2Img } from '@/types';

export function SDRoutes(){

    ipcMain.on('txt2img', (event, data, endpoint) => {
        txt2img(data, endpoint).then((result) => {
            event.sender.send('txt2img-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });
}

const txt2img = async (data: StableDiffusionProcessingTxt2Img, apiUrl: string): Promise<any> => {
    try {
        const response = await axios.post(apiUrl + `/sdapi/v1/txt2img`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to send data: ${error.message}`);
    }
}