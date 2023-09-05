import { PaLMFilters } from '@/components/llm-panel/palm-panel';
import { EndpointType, LLMConnectionInformation, Settings } from '@/types';
import { ipcRenderer } from 'electron';

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