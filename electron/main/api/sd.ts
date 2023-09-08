import { ipcMain } from 'electron';
import axios from 'axios';
import { StableDiffusionProcessingTxt2Img } from '@/types';
import Store from 'electron-store';
const store = new Store({
    name: 'stableDiffusionData',
});
import path from 'path';
import fs from 'fs-extra';
import { imagesPath } from '..';

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
    negativePrompt: string = "bad face, ugly, bad quality, low res, low quality, bad lighting, bad angle, bad composition, bad colors, bad contrast, bad saturation, bad exposure, bad focus, bad framing, bad crop, bad resolution, bad texture, bad rendering, bad shading, bad shadow, ((nude, loli, child))", 
    steps: number = 25, 
    cfg: number = 7, 
    width: number = 512, 
    height: number = 512, 
    highresSteps: number = 10){
    const data = {
        "enable_hr": true,
        "denoising_strength": .25,
        "firstphase_width": 512,
        "firstphase_height": 512,
        "hr_scale": 1.5,
        "hr_upscaler": "R-ESRGAN 4x+",
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