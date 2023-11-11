import { SettingsPreset, addLLMSettingsPreset, getCurrentLLMSettingsPreset, getLLMSettings, getLLMSettingsPresets, removeLLMSettingsPreset, setLLMSettings } from "../../../api/llmapi";
import { EndpointType, Settings } from "../../../types";
import { Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";

const GenerationSettings = () => {
    const [maxContextLength, setMaxContextLength] = useState<number>(2048);
    const [maxLength, setMaxLength] = useState<number>(180);
    const [repPen, setRepPen] = useState<number>(1.1);
    const [repPenRange, setRepPenRange] = useState<number>(2048);
    const [repPenSlope, setRepPenSlope] = useState<number>(0.9);
    const [temperature, setTemperature] = useState<number>(0.71);
    const [tfs, setTfs] = useState<number>(1);
    const [topA, setTopA] = useState<number>(0.00);
    const [topK, setTopK] = useState<number>(40);
    const [topP, setTopP] = useState<number>(0.9);
    const [typical, setTypical] = useState<number>(1);
    const [minLength, setMinLength] = useState<number>(0);
    const [maxTokens, setMaxTokens] = useState<number>(250);
    const [samplerOrder, setSamplerOrder] = useState<number[]>([6,3,2,5,0,1,4]);
    const [stopBrackets, setStopBrackets] = useState<boolean>(false);
    const [presencePenalty, setPresencePenalty] = useState<number>(0.0);
    const [frequencyPenalty, setFrequencyPenalty] = useState<number>(0.0);
    const [mirostatMode, setMirostatMode] = useState<number>(0);
    const [mirostatTau, setMirostatTau] = useState<number>(0.0);
    const [mirostatEta, setMirostatEta] = useState<number>(0.0);
    const [connectionPresetName, setConnectionPresetName] = useState<string>("");
    const [connectionPreset, setConnectionPreset] = useState<SettingsPreset | undefined>(undefined);
    const [currentConnectionPreset, setCurrentConnectionPreset] = useState<string>("");
    const [currentLLMConnectionPreset, setCurrentLLMConnectionPreset] = useState<string>("");
    const [connectionPresets, setConnectionPresets] = useState<SettingsPreset[]>([]);

    useEffect(() => {
        const fetchGenerationSettings = async () => {
            let {settings, stopBrackets} = await getLLMSettings()
            setMaxContextLength(settings.max_context_length);
            setMaxLength(settings.max_length);
            setRepPen(settings.rep_pen);
            setRepPenRange(settings.rep_pen_range);
            setTemperature(settings.temperature);
            setTfs(settings.tfs);
            setTopA(settings.top_a);
            setTopK(settings.top_k);
            setTopP(settings.top_p);
            setTypical(settings.typical);
            setMinLength(settings.min_length);
            setMaxTokens(settings.max_tokens);
            setSamplerOrder(settings.sampler_order);
            setStopBrackets(stopBrackets);
            setPresencePenalty(settings.presence_penalty);
            setFrequencyPenalty(settings.frequency_penalty);
            setMirostatEta(settings.mirostat_eta);
            setMirostatMode(settings.mirostat_mode);
            setMirostatTau(settings.mirostat_tau);
        }
        getLLMSettingsPresets().then((presets) => {
            setConnectionPresets(presets);
        });
        getCurrentLLMSettingsPreset().then((currentPreset) => {
            connectionPresets.find((preset) => preset._id === currentPreset) as SettingsPreset
            setCurrentConnectionPreset(currentPreset);
        });
        fetchGenerationSettings();
    }, []);
    
    const saveSettings = async () => {
        const settings: Settings = {
            max_context_length: maxContextLength,
            max_length: maxLength,
            rep_pen: repPen,
            rep_pen_range: repPenRange,
            temperature: temperature,
            tfs: tfs,
            top_a: topA,
            top_k: topK,
            top_p: topP,
            typical: typical,
            sampler_order: samplerOrder,
            singleline: false,
            sampler_full_determinism: false,
            min_length: minLength,
            max_tokens: maxTokens,
            presence_penalty: presencePenalty,
            frequency_penalty: frequencyPenalty,
            mirostat_mode: mirostatMode,
            mirostat_tau: mirostatTau,
            mirostat_eta: mirostatEta,
        };
        setLLMSettings(settings, stopBrackets);
    }
    
    useEffect(() => {
        if(connectionPreset){
            setConnectionPresetName(connectionPreset.name);
            setMaxContextLength(connectionPreset.max_context_length);
            setMaxLength(connectionPreset.max_length);
            setRepPen(connectionPreset.rep_pen);
            setRepPenRange(connectionPreset.rep_pen_range);
            setTemperature(connectionPreset.temperature);
            setTfs(connectionPreset.tfs);
            setTopA(connectionPreset.top_a);
            setTopK(connectionPreset.top_k);
            setTopP(connectionPreset.top_p);
            setTypical(connectionPreset.typical);
            setMinLength(connectionPreset.min_length);
            setMaxTokens(connectionPreset.max_tokens);
            setSamplerOrder(connectionPreset.sampler_order);
            setPresencePenalty(connectionPreset.presence_penalty);
            setFrequencyPenalty(connectionPreset.frequency_penalty);
            setMirostatEta(connectionPreset.mirostat_eta);
            setMirostatMode(connectionPreset.mirostat_mode);
            setMirostatTau(connectionPreset.mirostat_tau);
            setCurrentLLMConnectionPreset(connectionPreset._id);
        }else{
            setConnectionPresetName("");
            setMaxContextLength(2048);
            setMaxLength(180);
            setRepPen(1.1);
            setRepPenRange(2048);
            setTemperature(0.71);
            setTfs(1);
            setTopA(0.00);
            setTopK(40);
            setTopP(0.9);
            setTypical(1);
            setMinLength(0);
            setMaxTokens(250);
            setSamplerOrder([6,3,2,5,0,1,4]);
            setCurrentLLMConnectionPreset("");
        }
    }, [connectionPreset]);

    const saveConnectionPreset = async () => {
        if(connectionPreset){
            connectionPreset.name = connectionPresetName;
            connectionPreset.max_context_length = maxContextLength;
            connectionPreset.max_length = maxLength;
            connectionPreset.rep_pen = repPen;
            connectionPreset.rep_pen_range = repPenRange;
            connectionPreset.temperature = temperature;
            connectionPreset.tfs = tfs;
            connectionPreset.top_a = topA;
            connectionPreset.top_k = topK;
            connectionPreset.top_p = topP;
            connectionPreset.typical = typical;
            connectionPreset.min_length = minLength;
            connectionPreset.max_tokens = maxTokens;
            connectionPreset.sampler_order = samplerOrder;
            connectionPreset.presence_penalty = presencePenalty;
            connectionPreset.frequency_penalty = frequencyPenalty;
            connectionPreset.mirostat_eta = mirostatEta;
            connectionPreset.mirostat_mode = mirostatMode;
            connectionPreset.mirostat_tau = mirostatTau;
            const newPresets = await addLLMSettingsPreset(connectionPreset);
            if(newPresets){
                setConnectionPresets(newPresets);
            }
        }else{
            let newPreset: SettingsPreset = {
                _id: Date.now().toString(),
                name: connectionPresetName,
                max_context_length: maxContextLength,
                max_length: maxLength,
                rep_pen: repPen,
                rep_pen_range: repPenRange,
                temperature: temperature,
                tfs: tfs,
                top_a: topA,
                top_k: topK,
                top_p: topP,
                typical: typical,
                min_length: minLength,
                max_tokens: maxTokens,
                sampler_order: samplerOrder,
                singleline: false,
                sampler_full_determinism: false,
                presence_penalty: presencePenalty,
                frequency_penalty: frequencyPenalty,
                mirostat_eta: mirostatEta,
                mirostat_mode: mirostatMode,
                mirostat_tau: mirostatTau,
            }
            const newPresets = await addLLMSettingsPreset(newPreset);
            if(newPresets){
                setConnectionPresets(newPresets);
            }
        }
    }

    const selectConnectionPreset = async (preset: SettingsPreset) => {
        setCurrentConnectionPreset(preset._id);
        setConnectionPresetName(preset.name);
        setConnectionPreset(preset);
        setMaxContextLength(preset.max_context_length);
        setMaxLength(preset.max_length);
        setRepPen(preset.rep_pen);
        setRepPenRange(preset.rep_pen_range);
        setTemperature(preset.temperature);
        setTfs(preset.tfs);
        setTopA(preset.top_a);
        setTopK(preset.top_k);
        setTopP(preset.top_p);
        setTypical(preset.typical);
        setMinLength(preset.min_length);
        setMaxTokens(preset.max_tokens);
        setSamplerOrder(preset.sampler_order);
        setCurrentLLMConnectionPreset(preset._id);
        setPresencePenalty(preset.presence_penalty);
        setFrequencyPenalty(preset.frequency_penalty);
        saveSettings();
    }

    return (
        <div className="flex flex-col w-full text-left gap-4 flex-grow">
            <div className="flex flex-col w-full text-left gap-2">
                <label className="text-theme-text text-shadow-xl font-semibold">Settings Preset Name</label>
                <div className="flex flex-row w-full gap-2">
                    <input className="themed-input w-full flex-grow"
                        value={connectionPresetName}
                        onChange={(e) => setConnectionPresetName(e.target.value)}
                    />
                    <button className="themed-button-pos justify-center items-center flex"
                        onClick={() => {
                            saveConnectionPreset();
                        }}
                    >
                        <Save/>
                    </button>
                    <button className="themed-button-neg justify-center items-center flex"
                        onClick={() => {
                            setConnectionPresetName("");
                            setConnectionPreset(undefined);
                            setCurrentConnectionPreset("");
                            setCurrentLLMConnectionPreset("");
                            removeLLMSettingsPreset(connectionPresets.find((preset) => preset._id === connectionPreset?._id) as SettingsPreset);
                            setConnectionPresets(connectionPresets.filter((preset) => preset._id !== connectionPreset?._id));
                        }}
                    >
                        <Trash/>
                    </button>
                </div>
                <label className="text-theme-text text-shadow-xl font-semibold">Select Preset</label>
                <select className="themed-input w-full"
                    value={currentConnectionPreset}
                    onChange={(e) => {
                        if(e.target.value === ''){
                            setConnectionPresetName("");
                            setConnectionPreset(undefined);
                            setCurrentConnectionPreset("");
                            setCurrentLLMConnectionPreset("");
                            return;
                        }
                        selectConnectionPreset(connectionPresets.find((preset) => preset._id === e.target.value) as SettingsPreset);
                    }}
                >   
                    <option className='themed-input' key={''} value={''}>None</option>
                    {connectionPresets.map((preset) => {
                        return <option className='themed-input' key={preset._id} value={preset._id}>{preset.name}</option>
                    })}
                </select>
            </div>
            <div className="flex flex-col w-full overflow-y-auto text-left themed-box max-h-[600px]">
                <div className="flex flex-col ">
                    <span className=" font-semibold">Max Context Length</span>
                    <i className="text-sm">Controls how many 'tokens' are sent to the LLM. This will affect the speed of generation, the cohherrence of conversation flow, and the amount of memory used.
                (All endpoints, will not override model's max context length)</i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='512' max="8192" step="16" value={maxContextLength} onChange={async (e) => {setMaxContextLength(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='512' max="8192" step="16" value={maxContextLength} onChange={async (e) => {setMaxContextLength(parseInt(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Max Generation Length</span>
                    <i className="text-sm">            Controls the maximum amount of return 'tokens' the LLM can send in reply to your prompt. This is <b>not</b> a gaurantor of length, but rather a limit.
                    (All endpoints, will not override model's max generation length)</i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='16' max='512' step="2" value={maxLength} onChange={async (e) => {setMaxLength(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='themed-input' type="number" min='16' max='512' step="2" value={maxLength} onChange={async (e) => {setMaxLength(parseInt(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className=" font-semibold">Min Length</span>
                    <i className="text-sm">This controls how many tokens the LLM will always generate. (Ooba, OpenAI, Claude, PaLM)</i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' max='512' step='2' value={minLength} onChange={async (e) => {setMinLength(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' max='512' step='2' value={minLength} onChange={async (e) => {setMinLength(parseInt(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Temperature</span>
                    <i className="text-sm">Controls the randomness of the LLM. Lower values will make the LLM more predictable, higher values will make the LLM more random. (All endpoints)</i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min="0.10" max="2.00" step="0.01" value={temperature} onChange={async (e) => {setTemperature(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min="0.10" max="2.00" step="0.01" value={temperature} onChange={async (e) => {setTemperature(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Repetition Penalty</span>
                    <i className="text-sm">
                        Higher values make the output less repetitive. Lower values make the output more repetitive.
                        (Ooba, Kobold, Horde)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" step="0.01" min='1' max="1.50" value={repPen} onChange={async (e) => {setRepPen(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" step="0.01" min='1' max="1.50" id='input-container' type="number" value={repPen} onChange={async (e) => {setRepPen(parseFloat(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Repetition Pen Range</span>
                    <i className="text-sm">                
                        Defines the number of tokens that will be checked for repetitions, starting from the last token generated. The larger the range, the more tokens are checked.
                        (Ooba, Kobold, Horde)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' step="16" max="8192" value={repPenRange} onChange={async (e) => {setRepPenRange(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' step="16" max="8192" value={repPenRange} onChange={async (e) => {setRepPenRange(parseInt(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Repetition Pen Slope</span>
                    <i className="text-sm">                
                        The penalty to repeated tokens is applied differently based on distance from the final token. The distribution of that penalty follows a S-shaped curve. 
                        If the sloping is set to 0, that curve will be completely flat. All tokens will be penalized equally. 
                        If it is set to a very high value, it'll act more like two steps: Early tokens will receive little to no penalty, but later ones will be considerably penalized.
                        (Ooba, Kobold, Horde)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.0' max="10" step="0.1" value={repPenSlope} onChange={async (e) => {setRepPenSlope(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.0' max="10" step="0.1" value={repPenSlope} onChange={async (e) => {setRepPenSlope(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Frequency Penalty</span>
                    <i className="text-sm">                
                        (Ooba, OpenAI)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max="10.00" step="0.05" value={frequencyPenalty} onChange={async (e) => {setFrequencyPenalty(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max="10.00" step="0.05" value={frequencyPenalty} onChange={async (e) => {setFrequencyPenalty(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Presence Penalty</span>
                    <i className="text-sm">                
                        (Ooba, OpenAI)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max="10.00" step="0.05" value={presencePenalty} onChange={async (e) => {setPresencePenalty(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max="10.00" step="0.05" value={presencePenalty} onChange={async (e) => {setPresencePenalty(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span>Mirostat Mode</span>
                    <i className="text-sm">
                        1 is for llama.cpp only, 0 is off, 2 is vague and idk.        
                        (Ooba)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="number" min='0' max="2" step="1" value={mirostatMode} onChange={async (e) => {setMirostatMode(parseInt(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span>Mirostat Tau</span>
                    <i className="text-sm">
                        (Ooba)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' max="10" step="0.05" value={mirostatTau} onChange={async (e) => {setMirostatTau(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' max="10" step="0.05" value={mirostatTau} onChange={async (e) => {setMirostatTau(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span>Mirostat Eta</span>
                    <i className="text-sm">
                        (Ooba)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' max="1" step="0.01" value={mirostatEta} onChange={async (e) => {setMirostatEta(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" type="number" min='0' max="1" step="0.01" value={mirostatEta} onChange={async (e) => {setMirostatEta(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Top A</span>
                    <i className="text-sm">                
                        Increasing A sets a stricter limit on output, narrowing down the choices, while decreasing A makes the limit more lenient, allowing for a wider range of outputs. 
                        This ensures that if there's a token with a very high likelihood, the choices will be limited, ensuring structured outputs, while also allowing creativity where possible.
                        (Ooba, Kobold, Horde)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max="1.00" step="0.01" value={topA} onChange={async (e) => {setTopA(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max="1.00" step="0.01" value={topA} onChange={async (e) => {setTopA(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Top K</span>
                    <i className="text-sm">                
                        Top K sampling is like picking from a list of most likely next words in a sentence. 
                        If you set the number higher, you consider more words as options, leading to diverse but possibly odd outputs. 
                        If you set it lower, you focus on just a few top choices, making outputs more predictable but potentially less creative.
                        (Ooba, Kobold, Horde)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' max="120" step="1" value={topK} onChange={async (e) => {setTopK(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' max="120" step="1" value={topK} onChange={async (e) => {setTopK(parseInt(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Top P</span>
                    <i className="text-sm">                
                        Top P is like setting a budget for unpredictability in word choices. If you set Top P higher (closer to 1), you allow more diverse word choices, including less common ones. Set it lower (closer to 0), and you're sticking to the very most likely words, making outputs more focused but potentially less creative.
                        (OpenAI, Kobold, Horde, Ooba, Claude)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max='1' step='0.01' value={topP} onChange={async (e) => {setTopP(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max='1' step='0.01' value={topP} onChange={async (e) => {setTopP(parseFloat(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Typical</span>
                    <i className="text-sm">                
                        Typical Sampling removes words based on how much they deviate from an expected "average randomness" measure.
                        Higher settings: Allow more words, loosening the filter.
                        Lower settings: Filter out more words, making the selection stricter.
                        (Kobold, Horde, Ooba)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max='1' step='0.01' value={typical} onChange={async (e) => {setTypical(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max='1' step='0.01' value={typical} onChange={async (e) => {setTypical(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Tail Free Sampling</span>
                    <i className="text-sm">                
                        Tail Free Sampling trims the least likely words from being chosen. It aims to balance creativity with consistency.
                        Higher settings: Keep more word options (larger token pools).
                        Lower settings: Trim more unlikely words.
                        (Kobold, Horde, Ooba)
                    </i>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max='1' step='0.01' value={tfs} onChange={async (e) => {setTfs(parseFloat(e.target.value))}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max='1' step='0.01' value={tfs} onChange={async (e) => {setTfs(parseFloat(e.target.value))}} />
                    </div>
                </div>
                <div>
                    <span><i>The order by which all 7 samplers are applied, separated by commas. 0=top_k, 1=top_a, 2=top_p, 3=tfs, 4=typ, 5=temp, 6=rep_pen (Kobold, Horde)</i></span>
                </div>
                <div className="flex flex-col">
                    <span className=" font-semibold">Sampler Order</span>
                    <input className="themed-input" type="text" value={samplerOrder.toString()} onChange={async (e) => {setSamplerOrder(e.target.value.split(',').map(Number))}} />
                </div>
            </div>
            <button className="themed-button-pos w-full justify-center items-center flex"
                onClick={() => {
                    saveSettings();
                }}
            >
                <Save/>
            </button>
        </div>
    );
}

export default GenerationSettings;