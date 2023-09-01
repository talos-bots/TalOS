import { getStorageValue, setStorageValue } from "@/api/dbapi";
import Accordian from "@/components/accordian";
import LLMPanel from "@/components/llm-panel";
import { defaultThemes } from "@/constants";
import { useEffect, useState } from "react";

const SettingsPage = () => {
    const [currentTheme, setCurrentTheme] = useState("");
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
        <div className="w-full h-[calc(100vh-70px)] flex flex-col gap-4 themed-root overflow-y-auto overflow-x-hidden">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Settings</h2>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <Accordian title="LLM">
                            <LLMPanel />
                        </Accordian>
                    </div>
                    <div className="col-span-1">
                        <Accordian title="Theme">
                        <div className="flex flex-col">
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
                        </div>
                        </Accordian>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;