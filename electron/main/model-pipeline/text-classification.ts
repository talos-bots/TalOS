import { cat } from '@xenova/transformers';
import { modelsPath, wasmPath } from '..';

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
    }catch(err){
        console.log(err);
    }
}

const modelPromise: Promise<any> = new Promise(async (resolve, reject) => {
    try {
        const { pipeline, env } = await import('@xenova/transformers');

        // Only use local models
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.numThreads = 1;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        resolve(await pipeline(task, model, { cache_dir: modelsPath, quantized: true}));
    } catch (err) {
        reject(err);
    }
});

// We export a function that takes a string and returns a promise that resolves to the model's prediction.
async function getClassification(text: string): Promise<any> {
    const model = await modelPromise;
    const results = await model(text);
    return results[0].label;
}

export {
    getClassification
};