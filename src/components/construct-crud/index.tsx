import { deleteConstruct, getConstruct, saveNewConstruct, updateConstruct } from "@/api/dbapi";
import { Construct } from "@/classes/Construct";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RiQuestionMark } from "react-icons/ri";
import './ConstructCrud.scss'
const ConstructManagement = () => {
    const { id } = useParams<{ id: string }>();
    const [construct, setConstruct] = useState<Construct>(new Construct());
    const [constructState, setConstructState] = useState<Construct | null>(null);
    const [constructName, setConstructName] = useState<string>('');
    const [constructImage, setConstructImage] = useState<string>('');
    const [constructNickname, setConstructNick] = useState<string>('');
    const [constructCommands, setConstructCommands] = useState<string[]>([]);
    const [constructVisualDescription, setConstructVisualDescription] = useState<string>('');
    const [constructPersonality, setConstructPersonality] = useState<string>('');
    const [constructBackground, setConstructBackground] = useState<string>('');
    const [constructRelationships, setConstructRelationships] = useState<string[]>([]);
    const [constructInterests, setConstructInterests] = useState<string[]>([]);
    const [constructGreetings, setConstructGreetings] = useState<string[]>([]);
    const [constructFarewells, setConstructFarewells] = useState<string[]>([]);


    useEffect(() => {
        const getPassedCharacter = async () => {
            if(id !== undefined && id !== null && id !== 'create') {
                let character = await getConstruct(id)
                setConstructState(character);
                setConstructName(character.name);
                setConstructImage(character.avatar);
                setConstructNick(character.nickname);
                setConstructCommands(character.commands);
                setConstructVisualDescription(character.visualDescription);
                setConstructPersonality(character.personality);
                setConstructBackground(character.background);
                setConstructRelationships(character.relationships);
                setConstructInterests(character.interests);
                setConstructGreetings(character.greetings);
                setConstructFarewells(character.farewells);
            }
        }
        getPassedCharacter();
    }, [id !== undefined && id !== null && id !== 'create']);
    const returnToMenu = () => {
        history.back();
    }

    const saveConstruct = async () => {
        if(constructState !== null) {
            constructState.name = constructName;
            constructState.avatar = constructImage;
            constructState.nickname = constructNickname;
            constructState.commands = constructCommands;
            constructState.visualDescription = constructVisualDescription;
            constructState.personality = constructPersonality;
            constructState.background = constructBackground;
            constructState.relationships = constructRelationships;
            constructState.interests = constructInterests;
            constructState.greetings = constructGreetings;
            constructState.farewells = constructFarewells;
            await updateConstruct(constructState);
        } else {
            if(construct !== null) {
                const newConstruct = new Construct();
                newConstruct.name = constructName;
                newConstruct.avatar = constructImage;
                newConstruct.nickname = constructNickname;
                newConstruct.commands = constructCommands;
                newConstruct.visualDescription = constructVisualDescription;
                newConstruct.personality = constructPersonality;
                newConstruct.background = constructBackground;
                newConstruct.relationships = constructRelationships;
                newConstruct.interests = constructInterests;
                newConstruct.greetings = constructGreetings;
                newConstruct.farewells = constructFarewells;
                await saveNewConstruct(newConstruct);
            }
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setConstructImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteConstructAndReturn = async () => {
        if(constructState !== null) {
            await deleteConstruct(constructState._id);
            returnToMenu();
        }else {
            setConstructNick('');
            setConstructName('');
            setConstructImage('');
            setConstructCommands([]);
            setConstructVisualDescription('');
            setConstructPersonality('');
            setConstructBackground('');
            setConstructRelationships([]);
            setConstructInterests([]);
            setConstructGreetings([]);
            setConstructFarewells([]);
        }
    }

    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] themed-root gap-4">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Construct Editor</h2>
            <div className="grid grid-cols-5 grid-rows-[calc, 1fr] gap-4 text-left">
                <div className="col-span-1 items-center gap-4 h-3/4">
                    <div className="w-full grid grid-rows-2 items-center justify-center gap-4">
                        <div className="row-span-1 flex flex-col">
                            <label htmlFor="image-upload">
                                {constructImage === '' ? <RiQuestionMark className="construct-image-default"/> : <img src={constructImage} alt={constructName} className="construct-image"/>}
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
                            <label htmlFor="construct-name">Name</label>
                            <input 
                                type="text" 
                                required={true}
                                id="construct-name" 
                                className="themed-input"
                                value={constructName}
                                onChange={(event) => setConstructName(event.target.value)}
                            />
                        </div>
                        <div className="row-span-1 flex flex-col">
                            <label htmlFor="construct-role">Nickname</label>
                            <input
                                type="text"
                                required={true}
                                id="construct-role"
                                className="themed-input"
                                value={constructNickname}
                                onChange={(event) => setConstructNick(event.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-2 gap-4 grid grid-rows-2">
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-personality">Personality</label>
                            <textarea
                                id="construct-personality h-1/2"
                                className="themed-input h-full"
                                value={constructPersonality}
                                onChange={(event) => setConstructPersonality(event.target.value)}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-appearance">Visual Description</label>
                            <textarea
                                id="construct-appearance"
                                className="themed-input h-full"
                                value={constructVisualDescription}
                                onChange={(event) => setConstructVisualDescription(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-background">Background</label>
                            <textarea
                                id="construct-background"
                                className="themed-input h-full"
                                value={constructBackground}
                                onChange={(event) => setConstructBackground(event.target.value)}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-relationships">Relationships</label>
                            <textarea
                                id="construct-relationships"
                                className="themed-input h-full"
                                value={constructRelationships}
                                onChange={(event) => setConstructRelationships(event.target.value.split('\n'))}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-2 gap-4 grid grid-rows-2">
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-interests">Interests</label>
                            <textarea
                                id="construct-interests"
                                className="themed-input h-full"
                                value={constructInterests}
                                onChange={(event) => setConstructInterests(event.target.value.split('\n'))}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-greetings">Greetings</label>
                            <textarea
                                id="construct-greetings"
                                className="themed-input h-full"
                                value={constructGreetings}
                                onChange={(event) => setConstructGreetings(event.target.value.split('\n'))}
                            />
                        </div>
                    </div>
                    <div className="row-span-1 flex flex-col gap-4">
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-farewells">Farewells</label>
                            <textarea
                                id="construct-farewells"
                                className="themed-input h-full"
                                value={constructFarewells}
                                onChange={(event) => setConstructFarewells(event.target.value.split('\n'))}
                            />
                        </div>
                        <div className="flex flex-col h-1/2">
                            <label htmlFor="construct-questions">User Actions</label>
                            <div className="grid grid-rows-2 h-full">
                                <div className="row-span-1 flex flex-row">
                                    <button className="themed-button-pos w-1/4" onClick={() => console.log('Primary')}>Set as Primary Construct</button>
                                    <button className="themed-button-pos w-1/4" onClick={() => console.log('Secondary')}>Add as Secondary Construct</button>
                                    <button className="themed-button-neg w-1/4" onClick={() => console.log('Remove')}>Remove Active Construct</button>
                                    <button className="themed-button-neg w-1/4" onClick={() => deleteConstructAndReturn()}>{constructState ? 'Delete Construct' : 'Clear Values'}</button>
                                </div>
                                <div className="row-span-1 flex flex-row">
                                    <button type="submit" className="themed-button-neg w-1/2" onClick={returnToMenu}>Return to Menu</button>
                                    <button className="themed-button-pos w-1/2" onClick={() => saveConstruct()}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConstructManagement;