import { SettingsPreset, addLLMSettingsPreset, getCurrentLLMSettingsPreset, getLLMSettings, getLLMSettingsPresets, removeLLMSettingsPreset, setLLMSettings } from "@/api/llmapi";
import { EndpointType, Settings } from "@/types";
import { Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

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
            max_tokens: maxTokens
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
            <div className="flex flex-col w-full overflow-y-auto text-left themed-box flex-grow">
                <div className="flex flex-col ">
                    <span className=" font-semibold">Max Context Length</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='512' max="8192" step="16" value={maxContextLength} onChange={async (e) => {setMaxContextLength(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='512' max="8192" step="16" value={maxContextLength} onChange={async (e) => {setMaxContextLength(parseInt(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Max Generation Length</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='16' max='512' step="2" value={maxLength} onChange={async (e) => {setMaxLength(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='themed-input' type="number" min='16' max='512' step="2" value={maxLength} onChange={async (e) => {setMaxLength(parseInt(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Repetition Penalty</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" step="0.01" min='1' max="1.50" value={repPen} onChange={async (e) => {setRepPen(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" step="0.01" min='1' max="1.50" id='input-container' type="number" value={repPen} onChange={async (e) => {setRepPen(parseFloat(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Repetition Pen Range</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' step="16" max="8192" value={repPenRange} onChange={async (e) => {setRepPenRange(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' step="16" max="8192" value={repPenRange} onChange={async (e) => {setRepPenRange(parseInt(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Repetition Pen Slope</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.0' max="10" step="0.1" value={repPenSlope} onChange={async (e) => {setRepPenSlope(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.0' max="10" step="0.1" value={repPenSlope} onChange={async (e) => {setRepPenSlope(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Temperature</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min="0.10" max="2.00" step="0.01" value={temperature} onChange={async (e) => {setTemperature(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min="0.10" max="2.00" step="0.01" value={temperature} onChange={async (e) => {setTemperature(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Top A</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max="1.00" step="0.01" value={topA} onChange={async (e) => {setTopA(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max="1.00" step="0.01" value={topA} onChange={async (e) => {setTopA(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Top K</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' max="120" step="1" value={topK} onChange={async (e) => {setTopK(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' max="120" step="1" value={topK} onChange={async (e) => {setTopK(parseInt(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Top P</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max='1' step='0.01' value={topP} onChange={async (e) => {setTopP(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max='1' step='0.01' value={topP} onChange={async (e) => {setTopP(parseFloat(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">Typical</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max='1' step='0.01' value={typical} onChange={async (e) => {setTypical(parseFloat(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max='1' step='0.01' value={typical} onChange={async (e) => {setTypical(parseFloat(e.target.value));}} />
                    </div>
                </div>
                <div className="flex flex-col ">
                    <span className=" font-semibold">TFS</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0.00' max='1' step='0.01' value={tfs} onChange={async (e) => {setTfs(parseFloat(e.target.value))}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0.00' max='1' step='0.01' value={tfs} onChange={async (e) => {setTfs(parseFloat(e.target.value))}} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className=" font-semibold">Min Length</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' max='512' step='2' value={minLength} onChange={async (e) => {setMinLength(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' max='512' step='2' value={minLength} onChange={async (e) => {setMinLength(parseInt(e.target.value));}} />
                    </div>
                </div>
                {/* <div className="flex flex-col">
                    <span className=" font-semibold">Max Token Output</span>
                    <div className="w-full flex flex-row">
                        <input className="w-2/3 themed-input" type="range" min='0' max='2048' step='16' value={maxTokens} onChange={async (e) => {setMaxTokens(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' max='2048' step='16' value={maxTokens} onChange={async (e) => {setMaxTokens(parseInt(e.target.value));}} />
                    </div>
                </div> */}
                <div>
                    <span><i>The order by which all 7 samplers are applied, separated by commas. 0=top_k, 1=top_a, 2=top_p, 3=tfs, 4=typ, 5=temp, 6=rep_pen</i></span>
                </div>
                <div className="flex flex-col">
                    <span className=" font-semibold">Sampler Order</span>
                    <input className="themed-input" type="text" value={samplerOrder.toString()} onChange={async (e) => {setSamplerOrder(e.target.value.split(',').map(Number))}} />
                </div>
                <div className="flex flex-col w-full text-left">
                    <label className="text-theme-text text-shadow-xl font-semibold">Stop Brackets</label>
                    <div className="flex flex-col w-full text-left">
                        <i>Adds brackets to the stop list.</i>
                        <ReactSwitch
                            checked={stopBrackets}
                            onChange={() => setStopBrackets(!stopBrackets)}
                            handleDiameter={30}
                            width={60}
                            uncheckedIcon={false}
                            checkedIcon={true}
                            id="stopBrackets"
                        />
                    </div>
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