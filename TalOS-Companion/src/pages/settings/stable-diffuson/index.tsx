import { 
    getDefaultUpscaler, getEmbeddings, 
    getLoras, getModels, 
    getSDAPIUrl, getUpscalers, 
    setDefaultUpscaler, setSDAPIUrl, 
    getDefaultSteps, setDefaultSteps, 
    getDefaultCfg, setDefaultCfg,
    getDefaultWidth, setDefaultWidth,
    getDefaultHeight, setDefaultHeight,
    getDefaultHighresSteps, setDefaultHighresSteps,
    getDefaultDenoisingStrength, setDefaultDenoisingStrength, getDefaultNegativePrompt, setDefaultNegativePrompt, getDefaultUpscale, setDefaultUpscale, getDefaultPrompt, setSDDefaultPrompt } from "../../../api/sdapi";
import axios from "axios";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

const StableDiffusionPanel = () => {
    const [sdURL, setSDURL] = useState<string>("");
    const [defaultUpscaler, setUpscaler] = useState<string>("");
    const [loras, setLoras] = useState<any[]>([]);
    const [embeddings, setEmbeddings] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [upscalers, setUpscalers] = useState<any[]>([]);
    const [defaultSteps, setDefaultStepsState] = useState<number>(0);
    const [defaultCfg, setDefaultCfgState] = useState<string>("");
    const [defaultWidth, setDefaultWidthState] = useState<number>(0);
    const [defaultHeight, setDefaultHeightState] = useState<number>(0);
    const [defaultHighresSteps, setDefaultHighresStepsState] = useState<number>(0);
    const [defaultDenoisingStrength, setDefaultDenoisingStrengthState] = useState<number>(0);
    const [negativePrompt, setNegativePrompt] = useState<string>("");
    const [defaultPrompt, setDefaultPrompt] = useState<string>("");
    const [upsaleFactor, setUpscaleFactor] = useState<number>(0);
    const [status, setStatus] = useState<string>("Disconnected");

    const setSDAPI = async (url: string) => {
        setSDAPIUrl(url);
    };

    useEffect(() => {
        const getURL = async () => {
            const url = await getSDAPIUrl();
            setSDURL(url);
        }
        getURL();
        fetchStableDiffusionOptions();
    }, []);

    const fetchStableDiffusionOptions = async () => {
        getDefaultUpscaler().then((result) => {
            if(!result === null)
            setUpscaler(result);
        }).catch((err) => {
            console.error(err);
        });

        getLoras().then((result) => {
            if(!result === null)
            setLoras(result);
        }).catch((err) => {
            console.error(err);
        });

        getEmbeddings().then((result) => {
            if(!result === null)
            setEmbeddings(result);
        }).catch((err) => {
            console.error(err);
        });

        getModels().then((result) => {
            if(!result === null)
            setModels(result);
        }).catch((err) => {
            console.error(err);
        });

        getUpscalers().then((result) => {
            if(!result === null)
            setUpscalers(result);
        }).catch((err) => {
            console.error(err);
        });
        getDefaultSteps().then(setDefaultStepsState).catch(console.error);
        getDefaultCfg().then(setDefaultCfgState).catch(console.error);
        getDefaultWidth().then(setDefaultWidthState).catch(console.error);
        getDefaultHeight().then(setDefaultHeightState).catch(console.error);
        getDefaultHighresSteps().then(setDefaultHighresStepsState).catch(console.error);
        getDefaultDenoisingStrength().then(setDefaultDenoisingStrengthState).catch(console.error);
        getDefaultNegativePrompt().then(setNegativePrompt).catch(console.error);
        getDefaultUpscale().then(setUpscaleFactor).catch(console.error);
        getDefaultPrompt().then(setDefaultPrompt).catch(console.error);
    };

    useEffect(() => {
        try{
            let connectURL = new URL(sdURL)
            if(connectURL){
                connectToURL();
            }
        }catch(err){
            setStatus("Disconnected.");
        }
    }, [sdURL]);

    const connectToURL = async () => {
        let connectURL = new URL(sdURL);
        connectURL.pathname = "/sdapi/v1/options";
        axios.get(connectURL.toString()).then((result) => {
            setStatus(result.data.sd_model_checkpoint)
        }).catch((err) => {
            setStatus("Error: " + err);
        });
    }

    return (
        <div className="grid grid-cols-2 w-full gap-2">
        <div className="col-span-2 flex flex-col text-left gap-1">
            <label htmlFor="sdapi-url" className="text-theme-text font-semibold">URL</label>
            <i>Note: Enable the API flag inside of Automatic1111 and enter your URL here.</i>
            <input type="text" id="sdapi-url" value={sdURL} className="themed-input" onChange={(e) => setSDURL(e.target.value)}/>
            <button className="themed-button-pos" onClick={() => {setSDAPI(sdURL); connectToURL()}}>Connect</button>
            <div className="flex flex-col w-full text-left">
                <label className="text-theme-text text-shadow-xl font-semibold">Loaded Model</label>
                <input className="themed-input w-full"
                    value={status}
                    readOnly
                />
            </div>
        </div>
        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-upscaler" className="text-theme-text font-semibold">Default Upscaler</label>
            <select id="default-upscaler" value={defaultUpscaler} className="themed-input flex-grow" onChange={(e) => setUpscaler(e.target.value)}>
                {upscalers.map((upscaler, index) => {
                    return (
                        <option key={index} value={upscaler.name}>{upscaler.name}</option>
                    );
                })}
            </select>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultUpscaler(defaultUpscaler)}><Save/></button>
        </div>
        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-steps" className="text-theme-text font-semibold">Default Steps</label>
            <input type="number" id="default-steps" value={defaultSteps} className="themed-input flex-grow" onChange={(e) => setDefaultStepsState(Number(e.target.value))}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultSteps(defaultSteps)}><Save/></button>
        </div>

        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-cfg" className="text-theme-text font-semibold">Default Cfg Scale</label>
            <input type="text" id="default-cfg" value={defaultCfg} className="themed-input flex-grow" onChange={(e) => setDefaultCfgState(e.target.value)}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultCfg(defaultCfg)}><Save/></button>
        </div>

        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-width" className="text-theme-text font-semibold">Default Width</label>
            <input type="number" id="default-width" value={defaultWidth} className="themed-input flex-grow" onChange={(e) => setDefaultWidthState(Number(e.target.value))}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultWidth(defaultWidth)}><Save/></button>
        </div>

        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-height" className="text-theme-text font-semibold">Default Height</label>
            <input type="number" id="default-height" value={defaultHeight} className="themed-input flex-grow" onChange={(e) => setDefaultHeightState(Number(e.target.value))}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultHeight(defaultHeight)}><Save/></button>
        </div>

        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-highres-steps" className="text-theme-text font-semibold">Default High-Res Steps</label>
            <input type="number" id="default-highres-steps" value={defaultHighresSteps} className="themed-input flex-grow" onChange={(e) => setDefaultHighresStepsState(Number(e.target.value))}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultHighresSteps(defaultHighresSteps)}><Save/></button>
        </div>

        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-denoising-strength" className="text-theme-text font-semibold">Default Denoising Strength</label>
            <input type="number" id="default-denoising-strength" value={defaultDenoisingStrength} className="themed-input flex-grow" onChange={(e) => setDefaultDenoisingStrengthState(Number(e.target.value))}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultDenoisingStrength(defaultDenoisingStrength)}><Save/></button>
        </div>
        
        <div className="col-span-1 flex flex-col text-left gap-1">
            <label htmlFor="default-upscaled-factor" className="text-theme-text font-semibold">Default Upscale Factor</label>
            <input type="number" id="default-upscaled-factor" value={upsaleFactor} className="themed-input flex-grow" onChange={(e) => setUpscaleFactor(Number(e.target.value))}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultUpscale(upsaleFactor)}><Save/></button>
        </div>

        <div className="col-span-2 flex flex-col text-left gap-1">
            <label htmlFor="default-negative-prompt" className="text-theme-text font-semibold">Default Negative Prompt</label>
            <textarea id="default-negative-prompt" value={negativePrompt} className="themed-input flex-grow" onChange={(e) => setNegativePrompt(e.target.value)}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setDefaultNegativePrompt(negativePrompt)}><Save/></button>
        </div>
        
        <div className="col-span-2 flex flex-col text-left gap-1">
            <label htmlFor="default-prompt" className="text-theme-text font-semibold">Postive Prompt Prefix</label>
            <i>Adds the following to the beginning of every prompt sent to SD. Use this to add tags like "masterpiece, best quality".</i>
            <textarea id="default-prompt" value={defaultPrompt} className="themed-input flex-grow" onChange={(e) => setDefaultPrompt(e.target.value)}/>
            <button className="themed-button-pos justify-center items-center flex" onClick={() => setSDDefaultPrompt(defaultPrompt)}><Save/></button>
        </div>

    </div>
    );
};
export default StableDiffusionPanel;