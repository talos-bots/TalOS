import path from 'path';
import { imagesPath, modelsPath, wasmPath } from '..';

const task: string = 'text-classification';
const model: string = 'Cohee/distilbert-base-uncased-go-emotions-onnx';

// We can't use `require` syntax since @xenova/transformers is an ES module. So, we use
// dynamic imports to load the Transformers.js package asynchronously. Then, we create a
// pipeline with the specified task and model, and return a promise that resolves to the
// pipeline. Later on, we will await this pipeline and use it to run predictions.

export const getModels = async () => {
    try{
        const { pipeline, env } = await import('@xenova/transformers');
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.numThreads = 1;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        await pipeline(task, model, { cache_dir: modelsPath, quantized: true}).then((model) => {
            console.log("Text Classification model loaded");
        });
        await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', { cache_dir: modelsPath, quantized: true}).then((model) => {
            console.log("Image Captioning model loaded");
        });
    }catch(err){
        console.log(err);
    }
}

const modelPromise: Promise<any> = new Promise(async (resolve, reject) => {
    try {
        const { pipeline, env } = await import('@xenova/transformers');

        // Only use local models
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.wasmPaths = wasmPath;

        resolve(await pipeline(task, model, { cache_dir: modelsPath, quantized: true}));
    } catch (err) {
        reject(err);
    }
});

const captionPromise: Promise<any> = new Promise(async (resolve, reject) => {
    try{
        const { pipeline, env } = await import('@xenova/transformers');

        // Only use local models
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        console.log('Loading caption model');
        resolve(await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', { cache_dir: modelsPath, quantized: true}));
    }catch(err){
        console.log(err);
        reject(err);
    }
});

// We export a function that takes a string and returns a promise that resolves to the model's 
async function getClassification(text: string): Promise<any> {
    const model = await modelPromise;
    const results = await model(text);
    return results[0].label;
}

import { unlink, writeFile } from 'fs/promises';

async function getCaption(image: string): Promise<any> {
    console.log('Getting caption for image');
    const buffer = Buffer.from(image, 'base64');
    const randomName = Math.random().toString(36).substring(7);
    await writeFile(path.join(imagesPath, `temp-image-${randomName}.png`), buffer);

    const model = await captionPromise;
    const results = await model(path.join(imagesPath, `temp-image-${randomName}.png`)).catch((err: any) => {
        console.log('Caption error', err);
    });
    
    // Optionally, delete the temporary file here
    await unlink(path.join(imagesPath, `temp-image-${randomName}.png`));
    console.log('Caption results', results);
    return results[0]?.generated_text;
}

export {
    getClassification,
    getCaption
};