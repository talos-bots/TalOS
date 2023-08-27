import { setLLMModel } from "@/api/llmapi";
import { useState, useEffect } from "react";

const HordePanel = () => {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const response = await fetch('https://aihorde.net/api/v2/status/models?type=text');
            const data = await response.json();
            const formattedData = data.map((model: any) => ({
                value: model.name,
                label: model.name,
            }));
            setModels(formattedData);
            if (formattedData.length > 0) {
                setSelectedModel(formattedData[0].value);
            }
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    };

    useEffect(() => {
        if (selectedModel === '') return;
        if (selectedModel === undefined) return;
        if (selectedModel === null) return;
        console.log('Setting LLM model:', selectedModel);
        setLLMModel(selectedModel);
    }, [selectedModel]);

    return (
        <div>
            <label className="text-theme-text text-shadow-xl font-semibold">Horde Model</label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="themed-input w-full">
                {models.map((model: any) => (
                    <option key={model.value} value={model.value} className='themed-input'>
                        {model.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default HordePanel;