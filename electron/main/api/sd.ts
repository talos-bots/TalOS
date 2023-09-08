import { ipcMain } from 'electron';
import axios from 'axios';
import { StableDiffusionProcessingTxt2Img } from '@/types';
import Store from 'electron-store';
import path from 'path';
import fs from 'fs-extra';
import { imagesPath } from '..';
import { get } from 'http';
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

const setDefaultNegativePrompt = (prompt: string): void => {
    store.set('defaultNegativePrompt', prompt);
}

const getDefaultNegativePrompt = (): string => {
    return store.get('defaultNegativePrompt', '') as string;
}

const setDefaultUpscaler = (upscaler: string): void => {
    store.set('defaultUpscaler', upscaler);
}

const getDefaultUpscaler = (): string => {
    return store.get('defaultUpscaler', '') as string;
}

const setDefaultSteps = (steps: number): void => {
    store.set('defaultSteps', steps);
}

const getDefaultSteps = (): number => {
    return store.get('defaultSteps', 25) as number;
}

const setDefaultCfg = (cfg: number): void => {
    store.set('defaultCfg', cfg);
}

const getDefaultCfg = (): number => {
    return store.get('defaultCfg', 7) as number;
}

const setDefaultWidth = (width: number): void => {
    store.set('defaultWidth', width);
}

const getDefaultWidth = (): number => {
    return store.get('defaultWidth', 512) as number;
}

const setDefaultHeight = (height: number): void => {
    store.set('defaultHeight', height);
}

const getDefaultHeight = (): number => {
    return store.get('defaultHeight', 512) as number;
}

const setDefaultHighresSteps = (highresSteps: number): void => {
    store.set('defaultHighresSteps', highresSteps);
}

const getDefaultHighresSteps = (): number => {
    return store.get('defaultHighresSteps', 10) as number;
}

const setDefaultDenoisingStrength = (denoisingStrength: number): void => {
    store.set('defaultDenoisingStrength', denoisingStrength);
}

const getDefaultDenoisingStrength = (): number => {
    return store.get('defaultDenoisingStrength', .25) as number;
}

export function SDRoutes(){
    ipcMain.on('setdefaultPrompt', (event, prompt) => {
        setDefaultPrompt(prompt);
    });

    ipcMain.on('getDefaultPrompt', (event) => {
        event.sender.send('getDefaultPrompt-reply', getDefaultPrompt());
    });

    ipcMain.on('set-sdapi-url', (event, apiUrl) => {
        console.log(apiUrl);
        setSDApiUrl(apiUrl);
    });

    ipcMain.on('get-sdapi-url', (event) => {
        event.sender.send('get-sdapi-url-reply', getSDApiUrl());
    });

    ipcMain.on('txt2img', (event, data, endpoint) => {
        txt2img(data, endpoint).then((result) => {
            event.sender.send('txt2img-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('set-negative-prompt', (event, prompt) => {
        setDefaultNegativePrompt(prompt);
    });

    ipcMain.on('get-negative-prompt', (event) => {
        event.sender.send('get-negative-prompt-reply', getDefaultNegativePrompt());
    });

    ipcMain.on('set-default-upscaler', (event, upscaler) => {
        setDefaultUpscaler(upscaler);
    });

    ipcMain.on('get-default-upscaler', (event) => {
        event.sender.send('get-default-upscaler-reply', getDefaultUpscaler());
    });

    ipcMain.on('get-loras', (event) => {
        getAllLoras().then((result) => {
            event.sender.send('get-loras-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-embeddings', (event) => {
        getEmbeddings().then((result) => {
            event.sender.send('get-embeddings-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-models', (event) => {
        getModels().then((result) => {
            event.sender.send('get-models-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-vae-models', (event) => {
        getVaeModels().then((result) => {
            event.sender.send('get-vae-models-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-upscalers', (event) => {
        getUpscalers().then((result) => {
            event.sender.send('get-upscalers-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('set-default-steps', (event, steps) => {
        setDefaultSteps(steps);
    });

    ipcMain.on('get-default-steps', (event) => {
        event.sender.send('get-default-steps-reply', getDefaultSteps());
    });

    ipcMain.on('set-default-cfg', (event, cfg) => {
        setDefaultCfg(cfg);
    });

    ipcMain.on('get-default-cfg', (event) => {
        event.sender.send('get-default-cfg-reply', getDefaultCfg());
    });

    ipcMain.on('set-default-width', (event, width) => {
        setDefaultWidth(width);
    });

    ipcMain.on('get-default-width', (event) => {
        event.sender.send('get-default-width-reply', getDefaultWidth());
    });

    ipcMain.on('set-default-height', (event, height) => {
        setDefaultHeight(height);
    });

    ipcMain.on('get-default-height', (event) => {
        event.sender.send('get-default-height-reply', getDefaultHeight());
    });

    ipcMain.on('set-default-highres-steps', (event, highresSteps) => {
        setDefaultHighresSteps(highresSteps);
    });

    ipcMain.on('get-default-highres-steps', (event) => {
        event.sender.send('get-default-highres-steps-reply', getDefaultHighresSteps());
    });

    ipcMain.on('set-default-denoising-strength', (event, denoisingStrength) => {
        setDefaultDenoisingStrength(denoisingStrength);
    });

    ipcMain.on('get-default-denoising-strength', (event) => {
        event.sender.send('get-default-denoising-strength-reply', getDefaultDenoisingStrength());
    });
}

export const txt2img = async (prompt: string, negativePrompt?: string, steps?: number, cfg?: number, width?: number, height?: number, highresSteps?: number): Promise<any> => {
    try {
        const response = await makeImage(prompt, negativePrompt, steps, cfg, width, height, highresSteps)
        return response;
    } catch (error: any) {
        throw new Error(`Failed to send data: ${error.message}`);
    }
}

export async function makePromptData(
    prompt: string, 
    negativePrompt: string = getDefaultNegativePrompt(), 
    steps: number = getDefaultSteps(), 
    cfg: number = getDefaultCfg(), 
    width: number = getDefaultWidth(), 
    height: number = getDefaultHeight(), 
    highresSteps: number = getDefaultHighresSteps()){
    let data = {
        "denoising_strength": getDefaultDenoisingStrength(),
        "firstphase_width": 512,
        "firstphase_height": 512,
        "hr_scale": 1.5,
        "hr_second_pass_steps": highresSteps,
        "hr_sampler_name": "Euler a",
        "prompt": prompt,
        "seed": -1,
        "sampler_name": "Euler a",
        "batch_size": 1,
        "steps": steps,
        "cfg_scale": cfg,
        "width": width,
        "height": height,
        "do_not_save_samples": true,
        "do_not_save_grid": true,
        "negative_prompt": negativePrompt,
        "sampler_index": "Euler a",
        "send_images": true,
        "save_images": false,
    };
    if(getDefaultUpscaler() !== ''){
        // @ts-ignore
        data.hr_upscaler = getDefaultUpscaler();
        // @ts-ignore
        data.enable_hr = true;
    }
    return JSON.stringify(data);
}

export async function makeImage(prompt: string, negativePrompt?: string, steps?: number, cfg?: number, width?: number, height?: number, highresSteps?: number){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/txt2img';
    let data = await makePromptData(prompt, negativePrompt, steps, cfg, width, height, highresSteps);
    const res = await axios({
        method: 'post',
        url: url.toString(),
        data: data,
        headers: { 'Content-Type': 'application/json' },
    });
    let fileName = `image_${getTimestamp()}.jpeg`;
    let fullPath = path.join(imagesPath, fileName);
    let base64Image = res.data.images[0].split(';base64,').pop();
    await fs.writeFile(fullPath, base64Image, {encoding: 'base64'}, function(err) {
        if (err) {
            console.error('Error writing file: ', err);
        } else {
            console.log('File written successfully: ', fileName);
        }
    });
    return {path: fullPath, name: fileName, base64: res.data.images[0].split(';base64,').pop()};
}

export async function getAllLoras(){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/loras';
    const res = await axios({
        method: 'get',
        url: url.toString(),
    });
    return res.data;
}

export async function getEmbeddings(){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/embeddings';
    const res = await axios({
        method: 'get',
        url: url.toString(),
    });
    return res.data;
}

export async function getModels(){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/sd-models';
    const res = await axios({
        method: 'get',
        url: url.toString(),
    });
    return res.data;
}

export async function getVaeModels(){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/sd-vae';
    const res = await axios({
        method: 'get',
        url: url.toString(),
    });
    return res.data;
}

export async function getUpscalers(){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/upscalers';
    const res = await axios({
        method: 'get',
        url: url.toString(),
    });
    return res.data;
}

function getTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}