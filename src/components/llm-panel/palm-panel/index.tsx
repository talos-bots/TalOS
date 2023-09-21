import { getPaLMFilters, getPalmModel, setPaLMFilters, setPalmModel } from "@/api/llmapi";
import axios from "axios";
import { Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export const defaultPaLMFilters: PaLMFilters = {
    HARM_CATEGORY_UNSPECIFIED: "BLOCK_NONE",
    HARM_CATEGORY_DEROGATORY: "BLOCK_NONE",
    HARM_CATEGORY_TOXICITY: "BLOCK_NONE",
    HARM_CATEGORY_VIOLENCE: "BLOCK_NONE",
    HARM_CATEGORY_SEXUAL: "BLOCK_NONE",
    HARM_CATEGORY_MEDICAL: "BLOCK_NONE",
    HARM_CATEGORY_DANGEROUS: "BLOCK_NONE"
}

export type PaLMFilterType = 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE' | 'HARM_BLOCK_THRESHOLD_UNSPECIFIED';

export interface PaLMFilters {
    HARM_CATEGORY_UNSPECIFIED: PaLMFilterType;
    HARM_CATEGORY_DEROGATORY: PaLMFilterType;
    HARM_CATEGORY_TOXICITY: PaLMFilterType;
    HARM_CATEGORY_VIOLENCE: PaLMFilterType;
    HARM_CATEGORY_SEXUAL: PaLMFilterType;
    HARM_CATEGORY_MEDICAL: PaLMFilterType;
    HARM_CATEGORY_DANGEROUS: PaLMFilterType;
}
interface PaLMPanelProps {
    endpoint: string;
    filters: PaLMFilters;
    setFilters: (filters: PaLMFilters) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    models: PaLMModel[];
    setModels: (models: PaLMModel[]) => void;
    selectedModelObject: PaLMModel | null;
    setSelectedModelObject: (model: PaLMModel | null) => void;
    selectedFilter: keyof PaLMFilters;
    setSelectedFilter: (filter: keyof PaLMFilters) => void;
    selectedFilterValue: PaLMFilterType;
    setSelectedFilterValue: (filter: PaLMFilterType) => void;
}

export type PaLMModel = {
    name: string;
    displayName: string;
    inputTokenLimit: number;
    outputTokenLimit: number;
    supportedGenerationMethods: string[];
    temperature: number;
    topK: number;
    topP: number;
    version: string;
    description: string;
}

const PaLMPanel = (props: PaLMPanelProps) => {
    const { endpoint, filters, setFilters, selectedModel, setSelectedModel, models, setModels, selectedModelObject, setSelectedModelObject, selectedFilter, setSelectedFilter, selectedFilterValue, setSelectedFilterValue } = props;

    useEffect(() => {
        getPaLMFilters().then((filters) => {
            setFilters(filters);
        });
        getPalmModel().then((model) => {
            setSelectedModel(model);
        });
    }, []);
    
    useEffect(() => {
        if (selectedFilter === undefined) return;
        if (selectedFilter === null) return;
        setFilters({...filters, [selectedFilter]: selectedFilterValue});
        getModels();
    }, [selectedFilter, selectedFilterValue]);

    useEffect(() => {
        if (endpoint === '') return;
        getModels();
    }, [endpoint]);

    const saveFilters = () => {
        setPaLMFilters(filters);
    }

    const getModels = async () => {
        const models = await axios.get(`https://generativelanguage.googleapis.com/v1beta2/models?key=${endpoint}`).then((response) => {
            return response;
        }).catch((error) => {
            console.log(error);
        });
        const modelList: PaLMModel[] = [];
        models?.data.models.forEach((model: PaLMModel) => {
            if(model?.supportedGenerationMethods.includes('generateText')){
                modelList.push(model);
            }
        });
        if(modelList.length === 1){
            setSelectedModel(modelList[0].name);
            setPalmModel(modelList[0].name);
        }
        setModels(modelList);
        let foundModel = modelList.find((model) => model?.name === selectedModel);
        if(foundModel === undefined){
            foundModel = modelList[0];
            setSelectedModelObject(foundModel);
        }
    }
    
    useEffect(() => {
        if(selectedModel === '') return;
        let foundModel = models.find((model) => model?.name === selectedModel);
        if(foundModel === undefined){
            foundModel = models[0];
            setSelectedModelObject(foundModel);
        }
        setSelectedModelObject(foundModel);
    }, [selectedModel, models]);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-theme-text text-shadow-xl font-semibold">PaLM Filters</label>
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value as keyof PaLMFilters)} className="themed-input w-full">
                {Object.keys(filters).map((filter: string) => (
                    <option key={filter} value={filter} className='themed-input'>
                        {filter.replaceAll('_', ' ')}
                    </option>
                ))}
            </select>
            <select value={selectedFilterValue} onChange={(e) => setSelectedFilterValue(e.target.value as PaLMFilterType)} className="themed-input w-full">
                <option value="BLOCK_NONE" className='themed-input'>Block none</option>
                <option value="BLOCK_ONLY_HIGH" className='themed-input'>Block only high</option>
                <option value="BLOCK_MEDIUM_AND_ABOVE" className='themed-input'>Block medium and above</option>
                <option value="BLOCK_LOW_AND_ABOVE" className='themed-input'>Block low and above</option>
                <option value="HARM_BLOCK_THRESHOLD_UNSPECIFIED" className='themed-input'>Not specified</option>
            </select>
            <div className="flex flex-row gap-2 w-full">
                <button className="themed-button-neg w-1/2 justify-center items-center flex"
                    onClick={() => {
                        setFilters(defaultPaLMFilters);
                    }}
                >
                    <Trash/>
                </button>
                <button className="themed-button-pos w-1/2 justify-center items-center flex"
                    onClick={() => {
                        saveFilters();
                    }}
                >
                    <Save/>
                </button>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-theme-text text-shadow-xl font-semibold">PaLM Models</label>
                {/* <select className="themed-input w-full" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    {models.map((model) => (
                        <option key={model.name} value={model.name} className='themed-input'>
                            {model.displayName}
                        </option>
                    ))}
                </select> */}
                <input className="themed-input w-full" value={selectedModel} disabled/>
                {selectedModelObject !== null ? (
                    <div className="flex flex-col gap-1 themed-box">
                        <label className="text-theme-text text-shadow-xl font-semibold">Name</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.name}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Display Name</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.displayName}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Input Token Limit</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.inputTokenLimit}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Output Token Limit</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.outputTokenLimit}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Supported Generation Methods</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.supportedGenerationMethods.join(', ')}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Temperature</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.temperature}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Top K</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.topK}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Top P</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.topP}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Version</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.version}</label>
                        <label className="text-theme-text text-shadow-xl font-semibold">Description</label>
                        <label className="text-theme-text text-shadow-xl">{selectedModelObject?.description}</label>
                    </div>
                ) : null}
                {/* <button className="themed-button-pos w-full" onClick={() => {setPalmModel(selectedModel);}}>Save</button> */}
            </div>
        </div>
    );
};
export default PaLMPanel;