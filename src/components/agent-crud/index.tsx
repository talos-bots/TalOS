import { deleteAgent, getAgent, saveNewAgent, updateAgent } from "@/api/dbapi";
import { Agent } from "@/classes/Agent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RiQuestionMark } from "react-icons/ri";
import './AgentCrud.scss'
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

    const deleteAgentAndReturn = async () => {
        if(agentState !== null) {
            await deleteAgent(agentState._id);
            returnToMenu();
        }else {
            setAgentNick('');
            setAgentName('');
            setAgentImage('');
            setAgentCommands([]);
            setAgentVisualDescription('');
            setAgentPersonality('');
            setAgentBackground('');
            setAgentRelationships([]);
            setAgentInterests([]);
            setAgentGreetings([]);
            setAgentFarewells([]);
        }
    }

    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] themed-root gap-4">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Agent Editor</h2>
            <div className="grid grid-cols-5 grid-rows-[calc, 1fr] gap-4 text-left">
                <div className="col-span-1 items-center gap-4 h-3/4">
                    <div className="w-full grid grid-rows-2 items-center justify-center gap-4">
                        <div className="row-span-1 flex flex-col">
                            <label htmlFor="image-upload">
                                {agentImage === '' ? <RiQuestionMark className="agent-image-default"/> : <img src={agentImage} alt={agentName} className="agent-image"/>}
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
                        <div className="row-span-1 flex flex-col">
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
                        <div className="row-span-1 flex flex-col">
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
                </div>
                <div className="col-span-2 gap-4 grid grid-rows-2">
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-personality">Personality</label>
                            <textarea
                                id="agent-personality h-1/2"
                                className="themed-input h-full"
                                value={agentPersonality}
                                onChange={(event) => setAgentPersonality(event.target.value)}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-appearance">Visual Description</label>
                            <textarea
                                id="agent-appearance"
                                className="themed-input h-full"
                                value={agentVisualDescription}
                                onChange={(event) => setAgentVisualDescription(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-background">Background</label>
                            <textarea
                                id="agent-background"
                                className="themed-input h-full"
                                value={agentBackground}
                                onChange={(event) => setAgentBackground(event.target.value)}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-relationships">Relationships</label>
                            <textarea
                                id="agent-relationships"
                                className="themed-input h-full"
                                value={agentRelationships}
                                onChange={(event) => setAgentRelationships(event.target.value.split('\n'))}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-2 gap-4 grid grid-rows-2">
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-interests">Interests</label>
                            <textarea
                                id="agent-interests"
                                className="themed-input h-full"
                                value={agentInterests}
                                onChange={(event) => setAgentInterests(event.target.value.split('\n'))}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-greetings">Greetings</label>
                            <textarea
                                id="agent-greetings"
                                className="themed-input h-full"
                                value={agentGreetings}
                                onChange={(event) => setAgentGreetings(event.target.value.split('\n'))}
                            />
                        </div>
                    </div>
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-farewells">Farewells</label>
                            <textarea
                                id="agent-farewells"
                                className="themed-input h-full"
                                value={agentFarewells}
                                onChange={(event) => setAgentFarewells(event.target.value.split('\n'))}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="agent-questions">User Actions</label>
                            <div className="grid grid-rows-2 h-full">
                                <div className="row-span-1 flex flex-row">
                                    <button className="themed-button-pos w-1/4" onClick={() => console.log('Primary')}>Set as Primary Agent</button>
                                    <button className="themed-button-pos w-1/4" onClick={() => console.log('Secondary')}>Add as Secondary Agent</button>
                                    <button className="themed-button-neg w-1/4" onClick={() => console.log('Remove')}>Remove Active Agent</button>
                                    <button className="themed-button-neg w-1/4" onClick={() => deleteAgentAndReturn()}>{agentState ? 'Delete Agent' : 'Clear Values'}</button>
                                </div>
                                <div className="row-span-1 flex flex-row">
                                    <button type="submit" className="themed-button-neg w-1/2" onClick={returnToMenu}>Return to Menu</button>
                                    <button className="themed-button-pos w-1/2" onClick={() => saveAgent()}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentManagement;