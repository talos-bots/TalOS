import { getLLMSettings, setLLMSettings } from "@/api/llmapi";
import { EndpointType, Settings } from "@/types";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const GenerationSettings = () => {
    const [maxContextLength, setMaxContextLength] = useState<number>(2048);
    const [maxLength, setMaxLength] = useState<number>(180);
    const [repPen, setRepPen] = useState<number>(1.1);
    const [repPenRange, setRepPenRange] = useState<number>(1024);
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
    
    return (
        <div className="flex flex-col w-full text-left gap-4">
            <div className="flex flex-col w-full h-30vh overflow-y-auto text-left themed-root">
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
                        <input className="w-2/3 themed-input" type="range" min='0' step="16" max="2048" value={repPenRange} onChange={async (e) => {setRepPenRange(parseInt(e.target.value));}} />
                        <input className="w-1/3 themed-input" id='input-container' type="number" min='0' step="16" max="2048" value={repPenRange} onChange={async (e) => {setRepPenRange(parseInt(e.target.value))}} />
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
            <button className="themed-button-pos w-full"
                onClick={() => {
                    saveSettings();
                }}
            >
                Save Settings
            </button>
        </div>
    );
}

export default GenerationSettings;