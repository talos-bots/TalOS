import path from 'path';
import { imagesPath, modelsPath, wasmPath } from '..';

export const getModels = async () => {
    try{
        const { pipeline, env } = await import('@xenova/transformers');
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.numThreads = 1;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        await pipeline('text-classification', 'Cohee/distilbert-base-uncased-go-emotions-onnx', { cache_dir: modelsPath, quantized: true}).then((model) => {
            console.log("Text Classification model loaded");
        });
        await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', { cache_dir: modelsPath, quantized: true}).then((model) => {
            console.log("Image Captioning model loaded");
        });
        await pipeline('feature-extraction',  'Xenova/all-MiniLM-L6-v2', { cache_dir: modelsPath, quantized: true}).then((model) => {
            console.log("Feature Extraction model loaded");
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

        resolve(await pipeline('text-classification', 'Cohee/distilbert-base-uncased-go-emotions-onnx', { cache_dir: modelsPath, quantized: true}));
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

const embeddingPromise: Promise<any> = new Promise(async (resolve, reject) => {
    try{
        const { pipeline, env } = await import('@xenova/transformers');

        // Only use local models
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        console.log('Loading embedding model');
        resolve(await pipeline('feature-extraction',  'Xenova/all-MiniLM-L6-v2', { cache_dir: modelsPath, quantized: true}));
    }catch(err){
        console.log(err);
        reject(err);
    }
});

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

async function getEmbedding(text: string): Promise<any> {
    const model = await embeddingPromise;
    const results = await model(text, { pooling: 'mean', normalize: true });
    return results.data;
}

export {
    getClassification,
    getCaption,
    getEmbedding
};