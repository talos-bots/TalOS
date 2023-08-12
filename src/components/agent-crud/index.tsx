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
    const [agentNickname, setAgentNick] = useState<string>('');
    const [agentCommands, setAgentCommands] = useState<string[]>([]);
    const [agentVisualDescription, setAgentVisualDescription] = useState<string>('');
    const [agentPersonality, setAgentPersonality] = useState<string>('');
    const [agentBackground, setAgentBackground] = useState<string>('');
    const [agentRelationships, setAgentRelationships] = useState<string[]>([]);
    const [agentInterests, setAgentInterests] = useState<string[]>([]);
    const [agentGreetings, setAgentGreetings] = useState<string[]>([]);
    const [agentFarewells, setAgentFarewells] = useState<string[]>([]);


    useEffect(() => {
        const getPassedCharacter = async () => {
            if(id !== undefined && id !== null && id !== 'create') {
                let character = await getAgent(id)
                setAgentState(character);
                setAgentName(character.name);
                setAgentImage(character.avatar);
                setAgentNick(character.nickname);
                setAgentCommands(character.commands);
                setAgentVisualDescription(character.visualDescription);
                setAgentPersonality(character.personality);
                setAgentBackground(character.background);
                setAgentRelationships(character.relationships);
                setAgentInterests(character.interests);
                setAgentGreetings(character.greetings);
                setAgentFarewells(character.farewells);
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
            agentState.nickname = agentNickname;
            agentState.commands = agentCommands;
            agentState.visualDescription = agentVisualDescription;
            agentState.personality = agentPersonality;
            agentState.background = agentBackground;
            agentState.relationships = agentRelationships;
            agentState.interests = agentInterests;
            agentState.greetings = agentGreetings;
            agentState.farewells = agentFarewells;
            await updateAgent(agentState);
        } else {
            if(agent !== null) {
                const newAgent = new Agent();
                newAgent.name = agentName;
                newAgent.avatar = agentImage;
                newAgent.nickname = agentNickname;
                newAgent.commands = agentCommands;
                newAgent.visualDescription = agentVisualDescription;
                newAgent.personality = agentPersonality;
                newAgent.background = agentBackground;
                newAgent.relationships = agentRelationships;
                newAgent.interests = agentInterests;
                newAgent.greetings = agentGreetings;
                newAgent.farewells = agentFarewells;
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
                <div className="flex flex-col">
                    <label htmlFor="agent-role">Nickname</label>
                    <input
                        type="text"
                        required={true}
                        id="agent-role"
                        className="themed-input"
                        value={agentNickname}
                        onChange={(event) => setAgentNick(event.target.value)}
                    />
                </div>
            </div>
            <div className="col-span-4 flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="agent-personality">Personality</label>
                        <textarea
                            id="agent-personality"
                            className="themed-input h-10vh"
                            value={agentPersonality}
                            onChange={(event) => setAgentPersonality(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="agent-appearance">Visual Description</label>
                        <textarea
                            id="agent-appearance"
                            className="themed-input h-10vh"
                            value={agentVisualDescription}
                            onChange={(event) => setAgentVisualDescription(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="agent-background">Background</label>
                        <textarea
                            id="agent-background"
                            className="themed-input h-10vh"
                            value={agentBackground}
                            onChange={(event) => setAgentBackground(event.target.value)}
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