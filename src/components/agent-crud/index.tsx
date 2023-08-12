import { getAgent, saveNewAgent, updateAgent } from "@/api/dbapi";
import { Agent } from "@/classes/Agent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RiQuestionMark } from "react-icons/ri";

const AgentManagement = () => {
    const { id } = useParams<{ id: string }>();
    const [agent, setAgent] = useState<Agent>(new Agent());
    const [agentState, setAgentState] = useState<Agent | null>(null);
    const [agentName, setAgentName] = useState<string>('');
    const [agentImage, setAgentImage] = useState<string>('');

    useEffect(() => {
        const getPassedCharacter = async () => {
            if(id !== undefined && id !== null && id !== 'create') {
                let character = await getAgent(id)
                setAgentState(character);
            }
        }
        getPassedCharacter();
    }, [id !== undefined && id !== null && id !== 'create']);

    const returnToMenu = () => {
        history.back();
    }

    useEffect(() => {
        const closeOnEscapeKey = (e: { key: string; }) => e.key === "Escape" ? returnToMenu() : null;
        document.body.addEventListener("keydown", closeOnEscapeKey);
        return () => {
            document.body.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, []);

    const saveAgent = async () => {
        if(agentState !== null) {
            agentState.name = agentName;
            agentState.avatar = agentImage;
            await updateAgent(agentState);
        }
        else {
            if(agent !== null) {
                const newAgent = new Agent();
                newAgent.name = agentName;
                newAgent.avatar = agentImage;
                await saveNewAgent(newAgent);
            }
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAgentImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-90vh w-65vw grid grid-rows-[auto,1fr] themed-root gap-4">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Agent Editor</h2>
            <div className="w-full flex flex-col items-center gap-4">
                <div className="flex flex-col">
                    <label htmlFor="image-upload">
                        {agentImage === '' ? <RiQuestionMark id="character-image-default"/> : <img src={agentImage} alt={agentName} id="character-image"/>}
                    </label>
                    <input 
                        type="file" 
                        required={true}
                        id="image-upload" 
                        className="hidden" 
                        accept=".png, .jpg, .jpeg"
                        onChange={handleImageUpload}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="agent-name">Name</label>
                    <input 
                        type="text" 
                        required={true}
                        id="agent-name" 
                        className="themed-input"
                        value={agentName}
                        onChange={(event) => setAgentName(event.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-row justify-center gap-4">
                <button type="submit" className="themed-button-neg" onClick={returnToMenu}>Cancel</button>
                <button className="themed-button-pos" onClick={() => saveAgent()}>Save</button>
            </div>
        </div>
    );
};

export default AgentManagement;