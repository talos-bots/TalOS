import { PaLMFilters } from '@/components/llm-panel/palm-panel';
import { Emotion, EndpointType, LLMConnectionInformation, Settings } from '@/types';
// @ts-ignore
import llamaTokenizer from 'llama-tokenizer-js'
import { encode } from 'gpt-tokenizer'
import axios from 'axios';
import { url } from '@/App';

export interface ConnectionPreset {
    _id: string;
    name: string;
    endpoint: string;
    endpointType: EndpointType;
    password: string;
    palmFilters: PaLMFilters;
    openaiModel: OAI_Model;
    palmModel: string;
    hordeModel: string;
}
export interface SettingsPreset {
    _id: string;
    name: string;
    rep_pen: number;
    rep_pen_range: number;
    temperature: number;
    sampler_order: number[];
    top_k: number;
    top_p: number;
    top_a: number;
    tfs: number;
    typical: number;
    singleline: boolean;
    sampler_full_determinism: boolean;
    max_length: number;
    min_length: number;
    max_context_length: number;
    max_tokens: number;
}

export type OAI_Model = 'gpt-3.5-turbo-16k' | 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k-0613' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-0301' | 'gpt-4-0314' | 'gpt-4-0613';
// Generate Text
export const generateText = async (
    prompt: string,
    configuredName?: string,
    stopList?: string[]
): Promise<any> => {
    return axios.post(`${url}/api/generate-text`, { prompt, configuredName, stopList })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to generate text'));
}

export const doInstructions = async (
    instruction: string,
    guidance?: string,
    context?: string,
    examples?: string | string[]
): Promise<any> => {
    return axios.post(`${url}/api/do-instruct`, { instruction, guidance, context, examples })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to process instruction'));
}

export const getInstructPrompt = async (
    instruction: string,
    guidance?: string,
    context?: string,
    examples?: string | string[]
): Promise<any> => {
    return axios.post(`${url}/api/get-instruct-prompt`, { instruction, guidance, context, examples })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get instruct prompt'));
}

// Get Status
export const getStatus = async (
    endpoint?: string,
    endpointType?: string 
): Promise<any> => { 
    return axios.post(`${url}/api/get-status`, { endpoint, endpointType })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get status'));
}

export const getLLMConnectionInformation = async (): Promise<LLMConnectionInformation> => {
    return axios.get(`${url}/api/llm/connection-information`)
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get LLM connection information'));
}

export const setLLMConnectionInformation = async (endpoint: string, endpointType: EndpointType, password?: string, hordeModel?: string): Promise<any> => {
    return axios.post(`${url}/api/llm/connection-information`, { endpoint, endpointType, password, hordeModel })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to set LLM connection information'));
}

export const setLLMSettings = async (settings: Settings, stopBrackets: boolean): Promise<any> => {
    return axios.post(`${url}/api/llm/settings`, { settings, stopBrackets })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to set LLM settings'));
}

export const getLLMSettings = async (): Promise<{settings: Settings, stopBrackets: boolean}> => {
    return axios.get(`${url}/api/llm/settings`)
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get LLM settings'));
}

export const setLLMModel = async (model: string): Promise<any> => {
    return axios.post(`${url}/api/llm/model`, { model })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to set LLM model'));
}

export const getLLMModel = async (): Promise<string> => {
    return axios.get(`${url}/api/llm/model`)
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get LLM model'));
}

export const setLLMOAIModel = async (model: string): Promise<any> => {
    return axios.post(`${url}/api/llm/openai-model`, { model })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to set LLM OpenAI model'));
}

export const getLLMOAIModel = async (): Promise<string> => {
    return axios.get(`${url}/api/llm/openai-model`)
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get LLM OpenAI model'));
}

export async function setPaLMFilters(filters: PaLMFilters): Promise<any> {
    return axios.post(`${url}/api/palm/filters`, { filters })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to set PaLM filters'));
}

export async function getPaLMFilters(): Promise<PaLMFilters> {
    return axios.get(`${url}/api/palm/filters`)
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get PaLM filters'));
}

export function getLlamaTokens(text: string): number{
	const tokens: number = llamaTokenizer.encode(text).length;
	return tokens;
}

export function getGPTTokens(text: string): number{
	const tokens: number = encode(text).length;
	return tokens;
}

export async function getTextEmotion(text: string): Promise<Emotion> {
    return axios.post(`${url}/api/text/classification`, { text })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get text emotion'));
}

export async function getImageCaption(image: string): Promise<string> {
    return axios.post(`${url}/api/image/caption`, { base64: image })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get image caption'));
}

export async function setDoEmotions(value: boolean): Promise<boolean> {
    return axios.post(`${url}/api/settings/do-emotions`, { value })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to set Do Emotions value');
            }
            return response.data.value;
        });
}

export async function getDoEmotions(): Promise<boolean> {
    return axios.get(`${url}/api/settings/do-emotions`)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to get Do Emotions value');
            }
            return response.data.value;
        });
}

export async function setDoCaptioning(value: boolean): Promise<boolean> {
    return axios.post(`${url}/api/settings/do-caption`, { value })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to set Do Caption value');
            }
            return response.data.value;
        });
}

export async function getDoCaptioning(): Promise<boolean> {
    return axios.get(`${url}/api/settings/do-caption`)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to get Do Caption value');
            }
            return response.data.value;
        });
}

export async function setPalmModel(model: string): Promise<void> {
    return axios.post(`${url}/api/palm/model`, { model })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to set model');
            }
        });
}

export async function getPalmModel(): Promise<string> {
    return axios.get(`${url}/api/palm/model`)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.data.error || 'Failed to get model');
            }
            return response.data.model;
        });
}

export async function getTextEmbedding(text: string): Promise<any> {
    return axios.post(`${url}/api/text/embedding`, { text })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get text embedding'));
}

export async function compareStrings(string1: string, string2: string): Promise<any> {
    return axios.post(`${url}/api/text/similarity`, { text1: string1, text2: string2 })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get text similarity'));
}

export async function getZeroShotClassifcation(message: string, labels: string[]): Promise<any> {
    return axios.post(`${url}/api/text/zero-shot-classification`, { text: message, labels })
        .then(response => response.data)
        .catch(error => Promise.reject(error.response.data.error || 'Failed to get zero-shot classification'));
}

export const getLLMConnectionPresets = async (): Promise<ConnectionPreset[]> => {
    const response = await axios.get(`${url}/api/connections/presets`);
    return response.data;
}

export const addLLMConnectionPreset = async (preset: ConnectionPreset): Promise<ConnectionPreset[]> => {
    const response = await axios.post(`${url}/api/connections/presets`, { preset });
    return response.data;
}

export const removeLLMConnectionPreset = async (preset: ConnectionPreset): Promise<ConnectionPreset[]> => {
    const response = await axios.delete(`${url}/api/connections/presets`, { data: { preset } });
    return response.data;
}

export const getCurrentLLMConnectionPreset = async (): Promise<string> => {
    const response = await axios.get(`${url}/api/connections/current-preset`);
    return response.data;
}

export const setCurrentLLMConnectionPreset = async (preset: string): Promise<string> => {
    const response = await axios.post(`${url}/api/connections/current-preset`, { preset });
    return response.data;
}

export const getLLMSettingsPresets = async (): Promise<SettingsPreset[]> => {
    const response = await axios.get(`${url}/api/settings/presets`);
    return response.data;
}

export const addLLMSettingsPreset = async (preset: SettingsPreset): Promise<SettingsPreset[]> => {
    const response = await axios.post(`${url}/api/settings/presets`, { preset });
    return response.data;
}

export const removeLLMSettingsPreset = async (preset: SettingsPreset): Promise<SettingsPreset[]> => {
    const response = await axios.delete(`${url}/api/settings/presets`, { data: { preset } });
    return response.data;
}

export const getCurrentLLMSettingsPreset = async (): Promise<string> => {
    const response = await axios.get(`${url}/api/settings/current-preset`);
    return response.data;
}

export const setCurrentLLMSettingsPreset = async (preset: string): Promise<string> => {
    const response = await axios.post(`${url}/api/settings/current-preset`, { preset });
    return response.data;
}

export async function detectChatIntent(text: string): Promise<any> {
    try {
        const response = await axios.post('/api/chat/intent', { text });
        return response.data;
    } catch (error: any) {
        console.error("Failed to detect intent:", error.response?.data || error.message);
        throw error;
    }
}