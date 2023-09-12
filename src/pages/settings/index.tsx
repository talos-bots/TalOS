import { getStorageValue, setStorageValue } from "@/api/dbapi";
import LLMPanel from "@/components/llm-panel";
import { defaultThemes } from "@/constants";
import { useEffect, useState } from "react";
import Accordian from "@/components/accordion";
import StableDiffusionPanel from "./stable-diffuson";
import ConstructSettingsPanel from "./constructs";
import BackgroundSelector from "./background-selector";

const SettingsPage = () => {
    const [currentTheme, setCurrentTheme] = useState<string>("");
    const setTheme = async (themeID: string) => {
        await setStorageValue("uiTheme", themeID);
        window.location.reload();
    };

    useEffect(() => {
        const getTheme = async () => {
            const theme = await getStorageValue("uiTheme");
            setCurrentTheme(theme);
        };
        getTheme();
    }, []);

    return (
        <div className="w-full h-[calc(100vh-70px)] flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-4">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl themed-root">Settings</h2>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-1 flex flex-col gap-2">
                        <Accordian title="LLM">
                            <LLMPanel />
                        </Accordian>
                        <Accordian title="Stable Diffusion API">
                            <StableDiffusionPanel />
                        </Accordian>
                    </div>
                    <div className="col-span-1 flex flex-col gap-2">
                        <Accordian title="Theme">
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {Array.isArray(defaultThemes) && defaultThemes.map((theme, index) => {
                                        return (
                                            <button key={index} onClick={() => setTheme(theme._id)} className="themed-button-pos">
                                                {theme.name}
                                                {currentTheme === theme._id && <span className="text-theme-text"> (Current)</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                                <BackgroundSelector />
                            </div>
                        </Accordian>
                        <Accordian title="Construct Settings">
                            <ConstructSettingsPanel />
                        </Accordian>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;