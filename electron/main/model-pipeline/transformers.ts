import path from 'path';
import { imagesPath, modelsPath, wasmPath } from '../server';
import { unlink, writeFile } from 'fs/promises';
import { Pipeline, Tensor } from '@xenova/transformers';

export async function getModels(){
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
        await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad', { cache_dir: modelsPath, quantized: true}).then((model) => {
            console.log("Question Answering model loaded");
        });
        await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli', { cache_dir: modelsPath, quantized: true}).then((model) => {
            console.log("Zero Shot Classification model loaded");
        });
    }catch(err){
        console.log(err);
    }
}

const modelPromise: Promise<Pipeline> = new Promise(async (resolve, reject) => {
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

const captionPromise: Promise<Pipeline> = new Promise(async (resolve, reject) => {
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

const embeddingPromise: Promise<Pipeline> = new Promise(async (resolve, reject) => {
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

const questionPromise: Promise<Pipeline> = new Promise(async (resolve, reject) => {
    try{
        const { pipeline, env } = await import('@xenova/transformers');

        // Only use local models
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        console.log('Loading question model');
        resolve(await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad', { cache_dir: modelsPath, quantized: true}));
    }catch(err){
        console.log(err);
        reject(err);
    }
});

const zeroShotPromise: Promise<Pipeline> = new Promise(async (resolve, reject) => {
    try{
        const { pipeline, env } = await import('@xenova/transformers');

        // Only use local models
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        console.log('Loading zero shot model');
        resolve(await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli', { cache_dir: modelsPath, quantized: true}));
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

async function getEmbeddingTensor(text: string): Promise<any> {
    const model = await embeddingPromise;
    const results = await model(text, { pooling: 'mean', normalize: true });
    return results;
}

async function getEmbeddingSimilarity(text1: string, text2: string): Promise<any> {
    const model = await embeddingPromise;
    const { cos_sim } = await import('@xenova/transformers');
    const results1 = await model(text1, { pooling: 'mean', normalize: true });
    const results2 = await model(text2, { pooling: 'mean', normalize: true });
    const similarity = cos_sim(results1.data, results2.data);
    return similarity;
}

async function getQuestionAnswering(context: string, question: string): Promise<any> {
    const model = await questionPromise;
    const results = await model(question, context);
    return results.answer;
}

async function getZeroShotClassification(text: string, labels: string[]): Promise<any> {
    const model = await zeroShotPromise;
    const results = await model(text, labels);
    return results;
}

async function getYesNoMaybe(text: string): Promise<any> {
    const labels = ['yes', 'no', 'maybe'];
    const model = await zeroShotPromise;
    const results = await model(text, labels);
    return results;
}

export {
    getClassification,
    getCaption,
    getEmbedding,
    getEmbeddingTensor,
    getEmbeddingSimilarity,
    getQuestionAnswering,
    getZeroShotClassification,
    getYesNoMaybe
};