import { getLLMConnectionInformation, getStatus, setLLMConnectionInformation } from "@/api/llmapi";
import { EndpointType } from "@/types";
import { useEffect, useState } from "react";

interface ConnectionBoxProps {
};
const ConnectionBox = (props: ConnectionBoxProps) => {
    const [endpoint, setEndpoint] = useState<string>("");
    const [endpointType, setEndpointType] = useState<EndpointType>("Ooba");
    const [password, setPassword] = useState<string>("");
    const [status, setStatus] = useState<string>("Disconnected");
    const endpointTypes = ["Kobold", "Ooba", "OAI", "P-OAI", "P-Claude", "PaLM"]

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

    const connect = async () => {
        await setLLMConnectionInformation(endpoint, endpointType);
        let status = await getStatus(endpoint, endpointType);
        setStatus(status);
    }

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
                    connect();
                }}
            >
                Connect
            </button>
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