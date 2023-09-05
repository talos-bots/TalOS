import { getPaLMFilters, setPaLMFilters } from "@/api/llmapi";
import { useEffect, useState } from "react";

const defaultPaLMFilters: PaLMFilters = {
    HARM_CATEGORY_UNSPECIFIED: "BLOCK_NONE",
    HARM_CATEGORY_DEROGATORY: "BLOCK_NONE",
    HARM_CATEGORY_TOXICITY: "BLOCK_NONE",
    HARM_CATEGORY_VIOLENCE: "BLOCK_NONE",
    HARM_CATEGORY_SEXUAL: "BLOCK_NONE",
    HARM_CATEGORY_MEDICAL: "BLOCK_NONE",
    HARM_CATEGORY_DANGEROUS: "BLOCK_NONE"
}

type PaLMFilterType = 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE' | 'HARM_BLOCK_THRESHOLD_UNSPECIFIED';

export interface PaLMFilters {
    HARM_CATEGORY_UNSPECIFIED: PaLMFilterType;
    HARM_CATEGORY_DEROGATORY: PaLMFilterType;
    HARM_CATEGORY_TOXICITY: PaLMFilterType;
    HARM_CATEGORY_VIOLENCE: PaLMFilterType;
    HARM_CATEGORY_SEXUAL: PaLMFilterType;
    HARM_CATEGORY_MEDICAL: PaLMFilterType;
    HARM_CATEGORY_DANGEROUS: PaLMFilterType;
}

const PaLMPanel = () => {
    const [filters, setFilters] = useState<PaLMFilters>(defaultPaLMFilters);
    const [selectedFilter, setSelectedFilter] = useState<keyof PaLMFilters>('HARM_CATEGORY_UNSPECIFIED');
    const [selectedFilterValue, setSelectedFilterValue] = useState<PaLMFilterType>('BLOCK_NONE');

    useEffect(() => {
        getPaLMFilters().then((filters) => {
            setFilters(filters);
        });
    }, []);
    
    useEffect(() => {
        if (selectedFilter === undefined) return;
        if (selectedFilter === null) return;
        setFilters({...filters, [selectedFilter]: selectedFilterValue});
    }, [selectedFilter, selectedFilterValue]);

    const saveFilters = () => {
        setPaLMFilters(filters);
    }

    return (
        <div className="flex flex-col gap-1">
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
            <div className="flex flex-row gap-1 w-full">
                <button className="themed-button-neg w-1/2"
                    onClick={() => {
                        setFilters(defaultPaLMFilters);
                    }}
                >
                    Reset
                </button>
                <button className="themed-button-pos w-1/2"
                    onClick={() => {
                        saveFilters();
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
export default PaLMPanel;