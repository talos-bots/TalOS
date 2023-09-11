import { getLLMConnectionInformation, getStatus, setLLMConnectionInformation } from "@/api/llmapi";
import { EndpointType } from "@/types";
import { useEffect, useState } from "react";
import HordePanel from "../horde-panel";
import OpenAIPanel from "../openai-panel";
import PaLMPanel from "../palm-panel";

interface ConnectionBoxProps {
};
const ConnectionBox = (props: ConnectionBoxProps) => {
    const [endpoint, setEndpoint] = useState<string>("");
    const [endpointType, setEndpointType] = useState<EndpointType>("Ooba");
    const [password, setPassword] = useState<string>("");
    const [status, setStatus] = useState<string>("Disconnected");
    const endpointTypes = ["Kobold", "Ooba", "OAI", "P-OAI", "P-Claude", "PaLM", "Horde"]

    useEffect(() => {
        const getConnectionSettings = async () => {
            const connectionSettings = await getLLMConnectionInformation();
            setEndpoint(connectionSettings.endpoint);
            setEndpointType(connectionSettings.endpointType);
            setPassword(connectionSettings.password);
            let status = await getStatus(connectionSettings.endpoint, connectionSettings.endpointType);
            if(status?.error){
                setStatus(status.error);
            }else{
                setStatus(status.data);
            }
        }
        getConnectionSettings();
    }, []);

    const saveEndpoint = async () => {
        await setLLMConnectionInformation(endpoint, endpointType, password);
    }

    const connect = async () => {
        let status = await getStatus(endpoint, endpointType);
        setStatus(status);
    }

    useEffect(() => {
        try{
            if(endpoint !== ""){
                connect();
            }
        }catch(e){
            setStatus("Disconnected");
        }
    }, [endpoint, endpointType, password]);

    return (
        <div className="flex flex-col w-full text-left gap-4">
            <div className="flex flex-col w-full text-left">
                <label className="text-theme-text text-shadow-xl font-semibold">Endpoint Type</label>
                <select className="themed-input w-full"
                    value={endpointType}
                    onChange={(e) => setEndpointType(e.target.value as EndpointType)}
                >
                    {endpointTypes.map((key) => {
                        return <option className='themed-input' key={key} value={key}>{key}</option>
                    })}
                </select>
            </div>
            <div className="flex flex-col w-full text-left">
                <label className="text-theme-text text-shadow-xl font-semibold">Endpoint</label>
                <input className="themed-input w-full"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                />
            </div>
            {endpointType === "P-OAI" || endpointType === "P-Claude" ? (
                <div className="flex flex-col w-full text-left">
                    <label className="text-theme-text text-shadow-xl font-semibold">Password</label>
                    <input className="themed-input w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            ) : null}
            <button className="themed-button-pos w-full"
                onClick={() => {
                    saveEndpoint();
                    connect();
                }}
            >
                Connect
            </button>
            {(endpointType === "OAI" || endpointType === "P-OAI") && (
                <OpenAIPanel />
            )}
            {endpointType === "Horde" && (
                <HordePanel />
            )}
            {endpointType === "PaLM" && (
                <PaLMPanel endpoint={endpoint}/>
            )}
            <div className="flex flex-col w-full text-left">
                <label className="text-theme-text text-shadow-xl font-semibold">Status</label>
                <input className="themed-input w-full"
                    value={status}
                    readOnly
                />
            </div>
        </div>
    );
};
export default ConnectionBox;