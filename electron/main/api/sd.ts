import axios from 'axios';
import Store from 'electron-store';
import { AttachmentInferface } from '../types/types';
import { addAttachment } from './pouchdb';
import { expressApp, uploadsPath } from '..';
import path from 'node:path';
import fs from 'node:fs';
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

export const getDefaultPrompt = (): string => {
    return store.get('defaultPrompt', '') as string;
}

const setDefaultNegativePrompt = (prompt: string): void => {
    store.set('defaultNegativePrompt', prompt);
}

export const getDefaultNegativePrompt = (): string => {
    return store.get('defaultNegativePrompt', 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry') as string;
}

const setDefaultUpscaler = (upscaler: string): void => {
    store.set('defaultUpscaler', upscaler);
}

export const getDefaultUpscaler = (): string => {
    return store.get('defaultUpscaler', '') as string;
}

const setDefaultSteps = (steps: number): void => {
    store.set('defaultSteps', steps);
}

export const getDefaultSteps = (): number => {
    return store.get('defaultSteps', 25) as number;
}

const setDefaultCfg = (cfg: number): void => {
    store.set('defaultCfg', cfg);
}

export const getDefaultCfg = (): number => {
    return store.get('defaultCfg', 7) as number;
}

const setDefaultWidth = (width: number): void => {
    store.set('defaultWidth', width);
}

export const getDefaultWidth = (): number => {
    return store.get('defaultWidth', 512) as number;
}

const setDefaultHeight = (height: number): void => {
    store.set('defaultHeight', height);
}

export const getDefaultHeight = (): number => {
    return store.get('defaultHeight', 512) as number;
}

const setDefaultHighresSteps = (highresSteps: number): void => {
    store.set('defaultHighresSteps', highresSteps);
}

export const getDefaultHighresSteps = (): number => {
    return store.get('defaultHighresSteps', 10) as number;
}

const setDefaultDenoisingStrength = (denoisingStrength: number): void => {
    store.set('defaultDenoisingStrength', denoisingStrength);
}

export const getDefaultDenoisingStrength = (): number => {
    return store.get('defaultDenoisingStrength', .25) as number;
}

const setDefaultUpscale = (upscale: number): void => {
    store.set('defaultUpscale', upscale);
}

export const getDefaultUpscale = (): number => {
    return store.get('defaultUpscale', 1.5) as number;
}

export function SDRoutes(){
    // Corresponding to the 'set-sdapi-url' event
    expressApp.post('/api/diffusion/url', (req, res) => {
        const apiUrl = req.body.apiUrl;
        console.log(apiUrl);
        setSDApiUrl(apiUrl);
        res.sendStatus(200);
    });

    // Corresponding to the 'get-sdapi-url' event
    expressApp.get('/api/diffusion/url', (req, res) => {
        const apiUrl = getSDApiUrl();
        res.json({ apiUrl });
    });

    // Corresponding to the 'txt2img' event
    expressApp.post('/api/diffusion/txt2img', async (req, res) => {
        const {             prompt,
            negativePrompt,
            steps,
            cfg,
            width,
            height,
            highresSteps,
            denoisingStrength } = req.body;

        try {
            const result = await txt2img(prompt, negativePrompt, steps, cfg, width, height, highresSteps, denoisingStrength);
            res.json({ result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to process txt2img' });
        }
    });

    // Corresponding to the 'set-default-prompt' event
    expressApp.post('/api/diffusion/default-prompt', (req, res) => {
        const prompt = req.body.prompt;
        setDefaultPrompt(prompt);
        res.sendStatus(200);
    });

    // Corresponding to the 'get-default-prompt' event
    expressApp.get('/api/diffusion/default-prompt', (req, res) => {
        const prompt = getDefaultPrompt();
        res.json({ prompt });
    });

    // Corresponding to the 'set-default-negative-prompt' event
    expressApp.post('/api/diffusion/default-negative-prompt', (req, res) => {
        const prompt = req.body.prompt;
        setDefaultNegativePrompt(prompt);
        res.sendStatus(200);
    });

    // Corresponding to the 'get-default-negative-prompt' event
    expressApp.get('/api/diffusion/default-negative-prompt', (req, res) => {
        const prompt = getDefaultNegativePrompt();
        res.json({ prompt });
    });

    // Corresponding to the 'set-default-upscaler' event
    expressApp.post('/api/diffusion/default-upscaler', (req, res) => {
        const upscaler = req.body.upscaler;
        setDefaultUpscaler(upscaler);
        res.sendStatus(200);
    });

    // Corresponding to the 'get-default-upscaler' event
    expressApp.get('/api/diffusion/default-upscaler', (req, res) => {
        const upscaler = getDefaultUpscaler();
        res.json({ upscaler });
    });

    // Corresponding to the 'get-loras' event
    expressApp.get('/api/diffusion/loras', async (req, res) => {
        try {
            const result = await getAllLoras();
            res.json({ result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to get loras' });
        }
    });

    // Corresponding to the 'get-embeddings' event
    expressApp.get('/api/diffusion/embeddings', async (req, res) => {
        try {
            const result = await getEmbeddings();
            res.json({ result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to get embeddings' });
        }
    });

    // Corresponding to the 'get-models' event
    expressApp.get('/api/diffusion/models', async (req, res) => {
        try {
            const result = await getModels();
            res.json({ result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to get models' });
        }
    });

    // Corresponding to the 'get-vae-models' event
    expressApp.get('/api/diffusion/vae-models', async (req, res) => {
        try {
            const result = await getVaeModels();
            res.json({ result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to get VAE models' });
        }
    });

    // Corresponding to the 'get-upscalers' event
    expressApp.get('/api/diffusion/upscalers', async (req, res) => {
        try {
            const result = await getUpscalers();
            res.json({ result });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to get upscalers' });
        }
    });

    // Corresponding to the 'set-default-steps' event
    expressApp.post('/api/diffusion/default-steps', (req, res) => {
        const { steps } = req.body;
        setDefaultSteps(steps);
        res.sendStatus(200);
    });

    // Corresponding to the 'get-default-steps' event
    expressApp.get('/api/diffusion/default-steps', (req, res) => {
        res.json({ steps: getDefaultSteps() });
    });

    // ... The pattern continues ...

    expressApp.post('/api/diffusion/default-cfg', (req, res) => {
        const { cfg } = req.body;
        setDefaultCfg(cfg);
        res.sendStatus(200);
    });

    expressApp.get('/api/diffusion/default-cfg', (req, res) => {
        res.json({ cfg: getDefaultCfg() });
    });

    expressApp.post('/api/diffusion/default-width', (req, res) => {
        const { width } = req.body;
        setDefaultWidth(width);
        res.sendStatus(200);
    });

    expressApp.get('/api/diffusion/default-width', (req, res) => {
        res.json({ width: getDefaultWidth() });
    });

    expressApp.post('/api/diffusion/default-height', (req, res) => {
        const { height } = req.body;
        setDefaultHeight(height);
        res.sendStatus(200);
    });

    expressApp.get('/api/diffusion/default-height', (req, res) => {
        res.json({ height: getDefaultHeight() });
    });

    expressApp.post('/api/diffusion/default-highres-steps', (req, res) => {
        const { highresSteps } = req.body;
        setDefaultHighresSteps(highresSteps);
        res.sendStatus(200);
    });

    expressApp.get('/api/diffusion/default-highres-steps', (req, res) => {
        res.json({ highresSteps: getDefaultHighresSteps() });
    });

    expressApp.post('/api/diffusion/default-denoising-strength', (req, res) => {
        const { denoisingStrength } = req.body;
        setDefaultDenoisingStrength(denoisingStrength);
        res.sendStatus(200);
    });

    expressApp.get('/api/diffusion/default-denoising-strength', (req, res) => {
        res.json({ denoisingStrength: getDefaultDenoisingStrength() });
    });

    expressApp.post('/api/diffusion/default-upscale', (req, res) => {
        const { upscale } = req.body;
        setDefaultUpscale(upscale);
        res.sendStatus(200);
    });

    expressApp.get('/api/diffusion/default-upscale', (req, res) => {
        res.json({ upscale: getDefaultUpscale() });
    });
}

export const txt2img = async (prompt: string, negativePrompt?: string, steps?: number, cfg?: number, width?: number, height?: number, highresSteps?: number, denoisingStrength?: number): Promise<any> => {
    try {
        const response = await makeImage(prompt, negativePrompt, steps, cfg, width, height, highresSteps, denoisingStrength)
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
    highresSteps: number = getDefaultHighresSteps(),
    denoisingStrength: number = getDefaultDenoisingStrength()){
    let data = {
        "denoising_strength": denoisingStrength,
        "firstphase_width": width,
        "firstphase_height": height,
        "hr_scale": getDefaultUpscale(),
        "hr_second_pass_steps": highresSteps,
        "hr_sampler_name": "Euler a",
        "prompt": getDefaultPrompt() + prompt,
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

export async function img2img(img: string, steps: number = getDefaultSteps(), cfg: number = getDefaultCfg(), width: number = getDefaultWidth(), height: number = getDefaultHeight(), highresSteps: number = getDefaultHighresSteps()){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/img2img';

}

export async function makeImage(prompt: string, negativePrompt?: string, steps?: number, cfg?: number, width?: number, height?: number, highresSteps?: number, denoisingStrength?: number){
    let url = new URL(getSDApiUrl());
    url.pathname = '/sdapi/v1/txt2img';
    let data = await makePromptData(prompt, negativePrompt, steps, cfg, width, height, highresSteps, denoisingStrength);
    const res = await axios({
        method: 'post',
        url: url.toString(),
        data: data,
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
        return res;
    }).catch((err) => {
        console.log(err);
    });
    url.pathname = '/sdapi/v1/options';
    let model = await axios.get(url.toString()).then((res) => {
        return res.data.sd_model_checkpoint;
    }).catch((err) => {
        console.log(err);
    });
    if(!res){
        return null;
    }
    let fileName = `image_${getTimestamp()}.png`;

    const assemblePayload = JSON.parse(data);
    const attachment: AttachmentInferface = {
        _id: (new Date().getTime()).toString(),
        name: fileName,
        type: 'image/png',
        fileext: 'png',
        data: res.data.images[0].split(';base64,').pop(),
        metadata: {
            model: model,
            assemblePayload
        }
    }
    // Save image to uploads folder
    const newPath = path.join(uploadsPath, fileName);
    const buffer = Buffer.from(res.data.images[0].split(';base64,').pop(), 'base64');
    await fs.promises.writeFile(newPath, buffer);
    addAttachment(attachment);
    return {name: fileName, base64: res.data.images[0].split(';base64,').pop(), model: model};
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