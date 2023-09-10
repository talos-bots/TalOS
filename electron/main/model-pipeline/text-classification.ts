import { modelsPath, wasmPath } from '..';

const task: string = 'text-classification';
const model: string = 'distilbert-base-uncased-go-emotions-onnx';

// We can't use `require` syntax since @xenova/transformers is an ES module. So, we use
// dynamic imports to load the Transformers.js package asynchronously. Then, we create a
// pipeline with the specified task and model, and return a promise that resolves to the
// pipeline. Later on, we will await this pipeline and use it to run predictions.

const modelPromise: Promise<any> = new Promise(async (resolve, reject) => {
    try {
        const { pipeline, env } = await import('@xenova/transformers');

        // Only use local models
        // @ts-ignore
        env.allowRemoteModels = false;
        env.localModelPath = modelsPath;
        env.backends.onnx.wasm.wasmPaths = wasmPath;
        resolve(await pipeline(task, model));
    } catch (err) {
        reject(err);
    }
});

// The run function is used by the `transformers:run` event handler.
async function getClassification(text: string): Promise<any> {
    const model = await modelPromise;
    return await model(text);
}

export {
    getClassification
}
