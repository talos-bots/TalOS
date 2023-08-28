import Accordian from "@/components/accordian";
import LLMPanel from "@/components/llm-panel";

const SettingsPage = () => {

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
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;