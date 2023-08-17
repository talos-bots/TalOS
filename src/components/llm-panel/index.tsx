import { useState } from "react";
import ConnectionBox from "./connection-box";
import GenerationSettings from "./generation-settings";

interface LLMPanelProps {
};
const LLMPanel = (props: LLMPanelProps) => {
    const [endpoint, setEndpoint] = useState<string>("");
    const {} = props;
    
    return(
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
                <h3 className="text-xl font-bold text-theme-text text-shadow-xl text-left">Connection Details</h3>
                <ConnectionBox />
            </div>
            <div className="col-span-1">
                <h3 className="text-xl font-bold text-theme-text text-shadow-xl text-left">Generation Settings</h3>
                <GenerationSettings />
            </div>
        </div>
    );
};

export default LLMPanel;