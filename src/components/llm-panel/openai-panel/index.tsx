import { OAI_Model, getLLMOAIModel, setLLMOAIModel } from "../../../api/llmapi";
import { useEffect, useState } from "react";
interface OpenAIPanelProps {
    selectedModel: string;
    setSelectedModel: (model: OAI_Model) => void;
}
const OpenAIPanel = (props: OpenAIPanelProps) => {
    const { selectedModel, setSelectedModel } = props;
    const models = ['gpt-3.5-turbo-16k', 'gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k-0613', 'gpt-3.5-turbo-0613', 'gpt-3.5-turbo-0301', 'gpt-4-0314', 'gpt-4-0613']

    useEffect(() => {
        getLLMOAIModel().then((model) => {
            setSelectedModel(model as OAI_Model);
        });
    }, []);
    
    useEffect(() => {
        if (selectedModel === '') return;
        if (selectedModel === undefined) return;
        if (selectedModel === null) return;
        console.log('Setting LLM OpenAI model:', selectedModel);
        setLLMOAIModel(selectedModel);
    }, [selectedModel]);
    
    return (
        <div>
            <label className="text-theme-text text-shadow-xl font-semibold">OpenAI Model</label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as OAI_Model)} className="themed-input w-full">
                {models.map((model: string) => (
                    <option key={model} value={model} className='themed-input'>
                        {model}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default OpenAIPanel;