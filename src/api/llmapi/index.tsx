import { PaLMFilters } from '@/components/llm-panel/palm-panel';
import { Emotion, EndpointType, LLMConnectionInformation, Settings } from '@/types';
import { ipcRenderer } from 'electron';
// @ts-ignore
import llamaTokenizer from 'llama-tokenizer-js'
import { encode } from 'gpt-tokenizer'

// Generate Text
export const generateText = (
    prompt: string,
    configuredName?: string,
    stopList?: string[]
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "generate-text-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('generate-text', prompt, configuredName, stopList, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, results) => {
            resolve(results);
        });

    });
}

export const doInstructions = (
    instruction: string,
    guidance?: string,
    context?: string,
    examples?: string | string[],
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "do-instruct-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('do-instruct', instruction, guidance, context, examples, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, results) => {
            resolve(results);
        });

    });
}

export const getInstructPrompt = (
    instruction: string,
    guidance?: string,
    context?: string,
    examples?: string | string[],
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-instruct-prompt-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('get-instruct-prompt', instruction, guidance, context, examples, uniqueEventName);
        ipcRenderer.once(uniqueEventName, (event, results) => {
            resolve(results);
        });

    });
}

// Get Status
export const getStatus = (
    endpoint?: string,
    endpointType?: string 
): Promise<any> => { 
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-status', endpoint, endpointType);
        ipcRenderer.once('get-status-reply', (event, status) => {
            resolve(status);
        });
    });
}

export const getLLMConnectionInformation = (): Promise<LLMConnectionInformation> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-llm-connection-information');
        ipcRenderer.once('get-llm-connection-information-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export const setLLMConnectionInformation = (endpoint: string, endpointType: EndpointType, password?: string, hordeModel?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('set-llm-connection-information', endpoint, endpointType, password, hordeModel);
        ipcRenderer.once('set-llm-connection-information-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export const setLLMSettings = (settings: Settings, stopBrackets: boolean): void => {
    ipcRenderer.send('set-llm-settings', settings, stopBrackets);
}

export const getLLMSettings = (): Promise<{settings: Settings, stopBrackets: boolean}> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-llm-settings');
        ipcRenderer.once('get-llm-settings-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export const getLLMModel = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-llm-model');
        ipcRenderer.once('get-llm-model-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export const setLLMModel = (model: string) => {
    ipcRenderer.send('set-llm-model', model);
}

export const getLLMOAIModel = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-llm-openai-model');
        ipcRenderer.once('get-llm-openai-model-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export const setLLMOAIModel = (model: string) => {
    ipcRenderer.send('set-llm-openai-model', model);
}

export const setPaLMFilters = (filters: PaLMFilters) => {
    ipcRenderer.send('set-palm-filters', filters);
}

export const getPaLMFilters = (): Promise<PaLMFilters> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-palm-filters');
        ipcRenderer.once('get-palm-filters-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export function getLlamaTokens(text: string): number{
	const tokens: number = llamaTokenizer.encode(text).length;
	return tokens;
}

export function getGPTTokens(text: string): number{
	const tokens: number = encode(text).length;
	return tokens;
}

export function getTextEmotion(text: string): Promise<Emotion>{
    return new Promise((resolve, reject) => {
        const uniqueEventName = "get-text-classification-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('get-text-classification', uniqueEventName, text);
        ipcRenderer.once(uniqueEventName, (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export function getImageCaption(image: string): Promise<string>{
    return new Promise((resolve, reject) => {
        console.log("getting image caption");
        const uniqueEventName = "get-image-to-text-reply-" + Date.now() + "-" + Math.random();
        ipcRenderer.send('get-image-to-text', uniqueEventName, image);
        ipcRenderer.once(uniqueEventName, (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export function setDoEmotions(value: boolean){
    ipcRenderer.send('set-do-emotions', value);
}

export function getDoEmotions(): Promise<boolean>{
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-do-emotions');
        ipcRenderer.once('get-do-emotions-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export function setDoCaptioning(value: boolean){
    ipcRenderer.send('set-do-caption', value);
}

export function getDoCaptioning(): Promise<boolean>{
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-do-caption');
        ipcRenderer.once('get-do-caption-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}

export function setPalmModel(model: string){
    ipcRenderer.send('set-palm-model', model);
}

export function getPalmModel(): Promise<string>{
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-palm-model');
        ipcRenderer.once('get-palm-model-reply', (event, data) => {
            if(data.error) reject(data.error);
            resolve(data);
        });
    });
}