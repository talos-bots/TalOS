import { deleteConstruct, getConstruct, saveNewConstruct, updateConstruct } from "@/api/dbapi";
import { saveTavernCardAsImage } from "@/api/extrasapi";
import { Construct, ConstructChatConfig, DefaultChatConfig, Sprite } from "@/classes/Construct";
import { confirmModal } from "../confirm-modal";
import { getImageURL, uploadImage } from "@/api/baseapi";
import { constructIsActive, getActiveConstructList } from "@/api/constructapi";
import { useEffect, useState } from "react";
import { sendTxt2Img } from "@/api/sdapi";
import { getGPTTokens, getLlamaTokens, getTokenizer } from "@/api/llmapi";
import { fieldTypes } from "../construct-crud/auto-fill-generator";
import { useParams } from "react-router-dom";
import { Emotion, emotions } from "@/types";
import { RefreshCw } from "lucide-react";
import { RiQuestionMark } from "react-icons/ri";
import TokenTextarea from "../token-textarea";
import StringArrayEditorCards from "../string-array-editor-cards";
import SpriteCrud from "../construct-crud/sprite-crud";
import ConstructChatConfigPanel from "../construct-chat-config";

const commandTypes = [
    {
        value: "selfie",
        label: "Selfie Sending",
        explanation: "This allows the Construct to send selfies to the chat, this can be requested, or it can be random."
    },
    {
        value: "search",
        label: "Web Search",
        explanation: "This allows the Construct to search the web for information, and send it to the chat. Will randomly send stuff."
    },
    {
        value: "gif",
        label: "GIF Sending",
        explanation: "This allows the Construct to send GIFs to the chat, this can be requested, or it can be random."
    },
    {
        value: "youtube",
        label: "YouTube Search",
        explanation: "This allows the Construct to search for videos on YouTube and send them to you. Will randomly send videos sometimes ToT is active."
    },
    {
        value: "spotify",
        label: "Spotify Search",
        explanation: "This allows the Construct to search for songs on Spotify and send them to you."
    },
    {
        value: "voice-clips",
        label: "Voice Clip Sending",
        explanation: "This allows the Construct to send voice clips to the chat, this can be requested, or it can be random."
    },
]

interface ConstructManagementProps {
    passedConstruct: Construct;
}
const ConstructQuickCrud = (props: ConstructManagementProps) => {
    const { passedConstruct } = props;
    const [construct, setConstruct] = useState<Construct>(passedConstruct);
    const [constructName, setConstructName] = useState<string>(passedConstruct.name);
    const [constructImage, setConstructImage] = useState<string>(passedConstruct.avatar);
    const [constructNickname, setConstructNick] = useState<string>(passedConstruct.nickname);
    const [constructCommands, setConstructCommands] = useState<string[]>(passedConstruct.commands);
    const [constructVisualDescription, setConstructVisualDescription] = useState<string>(passedConstruct.visualDescription);
    const [constructPersonality, setConstructPersonality] = useState<string>(passedConstruct.personality);
    const [constructBackground, setConstructBackground] = useState<string>(passedConstruct.background);
    const [constructRelationships, setConstructRelationships] = useState<string[]>(passedConstruct.relationships);
    const [constructInterests, setConstructInterests] = useState<string[]>(passedConstruct.interests);
    const [constructGreetings, setConstructGreetings] = useState<string[]>(passedConstruct.greetings);
    const [constructFarewells, setConstructFarewells] = useState<string[]>(passedConstruct.farewells);
    const [constructAuthorsNote, setConstructAuthorsNote] = useState<string>(passedConstruct.authorsNote);
    const [constructSprites, setConstructSprites] = useState<Sprite[]>(passedConstruct.sprites);
    const [constructDefaultChatConfig, setConstructDefaultChatConfig] = useState<DefaultChatConfig>(passedConstruct.defaultConfig);
    const [constructThoughtPattern, setConstructThoughtPattern] = useState<string>(passedConstruct.thoughtPattern);
    const [waitingForImage, setWaitingForImage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
    const [selectedField, setSelectedField] = useState<fieldTypes | null>(null);
    const [currentState, setCurrentState] = useState<Construct | null>(null);
    const [totalTokens, setTotalTokens] = useState<number>(0);

    async function getTokenCount() {
        let totalText = '';
        totalText += constructBackground;
        totalText += constructPersonality;
        totalText += constructThoughtPattern;
        totalText += constructVisualDescription;
        totalText += constructAuthorsNote;
        totalText += constructCommands.join(' ');
        totalText += constructFarewells.join(' ');
        totalText += constructGreetings.join(' ');
        totalText += constructInterests.join(' ');
        let tokenizer = await getTokenizer();
        let tokens: number;
        switch (tokenizer) {
            case "LLaMA":
                tokens = getLlamaTokens(totalText);
                break;
            case "GPT":
                tokens = getGPTTokens(totalText);
                break;
            default:
                tokens = getLlamaTokens(totalText);
                break;
        }
        setTotalTokens(tokens);
    }

    useEffect(() => {
        getTokenCount();
    }, [constructBackground, constructPersonality, constructThoughtPattern, constructVisualDescription, constructAuthorsNote, constructCommands, constructFarewells, constructGreetings, constructInterests]);

    const generateConstructImage = async () => {
        setWaitingForImage(true);
        if (constructVisualDescription !== '') {
            const imageData = await sendTxt2Img(constructVisualDescription);
            if (imageData !== null) {
                console.log(imageData);
    
                // Convert base64 to blob
                const byteCharacters = atob(imageData.base64);
                const byteArrays = [];
                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                const blob = new Blob(byteArrays, { type: "image/png" });
    
                // Create a File object
                const newName = Date.now().toString() + '.png'; 
                const file = new File([blob], newName, { type: "image/png" });
    
                // Add to FormData and upload
                const formData = new FormData();
                formData.append('image', file, newName);
                uploadImage(formData);
                setConstructImage(`/api/images/${newName}`);
                saveConstruct();
            } else {
                setError('Error generating image. Check your Stable Diffusion connection settings.');
            }
        }
        setWaitingForImage(false);
    };

    const saveConstruct = async () => {
        if(passedConstruct !== null) {
            passedConstruct.name = constructName;
            passedConstruct.avatar = constructImage;
            passedConstruct.nickname = constructNickname;
            passedConstruct.commands = constructCommands;
            passedConstruct.visualDescription = constructVisualDescription;
            passedConstruct.personality = constructPersonality;
            passedConstruct.background = constructBackground;
            passedConstruct.relationships = constructRelationships;
            passedConstruct.interests = constructInterests;
            passedConstruct.greetings = constructGreetings;
            passedConstruct.farewells = constructFarewells;
            passedConstruct.authorsNote = constructAuthorsNote;
            passedConstruct.sprites = constructSprites;
            passedConstruct.defaultConfig = constructDefaultChatConfig;
            passedConstruct.thoughtPattern = constructThoughtPattern;
            await updateConstruct(passedConstruct);
        } else {
        }
    }

    useEffect(() => {
        if(passedConstruct !== null) {
            saveConstruct();
        }
    }, [constructName, constructImage, constructNickname, constructCommands, constructVisualDescription, constructPersonality, constructBackground, constructRelationships, constructInterests, constructGreetings, constructFarewells, constructAuthorsNote, constructSprites, constructDefaultChatConfig, constructThoughtPattern]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newName = Date.now().toString() + '.' + file.name.split('.').pop();
            const formData = new FormData();
            formData.append('image', file, newName);
            uploadImage(formData);
            setConstructImage(`/api/images/${newName}`);
        }
    };

    const handleConstructExport = async () => {
        if(passedConstruct === null) return;
        const url = await saveTavernCardAsImage(passedConstruct);
        const element = document.createElement("a");
        element.href = url;
        element.download = `${passedConstruct.name}.ConstructOS.png`;
        document.body.appendChild(element);
        element.click();
    }

    const addSprite = (sprite: Sprite, emotion: Emotion) => {
        let newSprites = constructSprites;
        const index = newSprites.findIndex((sprite) => sprite.emotion === emotion);
        if(index === -1) {
            newSprites.push(sprite);
        } else {
            newSprites[index] = sprite;
        }
        setConstructSprites(newSprites);
    }

    const handleConfigEdit = (config: DefaultChatConfig | ConstructChatConfig) => {
        config = config as DefaultChatConfig;
        console.log(config);
        setConstructDefaultChatConfig(config);
    }

    const handleFill = (string: string, field: fieldTypes) => {
        switch(field) {
            case "name":
                setConstructName(string);
                break;
            case "visualDescription":
                setConstructVisualDescription(string);
                break;
            case "background":
                setConstructBackground(string);
                break;
            case "greeting":
                setConstructGreetings([...constructGreetings, string]);
                break;
            case "farewell":
                setConstructFarewells([...constructFarewells, string]);
                break;
            case "interests":
                setConstructInterests([...constructInterests, string]);
                break;
            case "nickname":
                setConstructNick(string);
                break;
            case "authorsnote":
                setConstructAuthorsNote(string);
                break;
            case "persona":
                setConstructPersonality(string);
                break;
        }
    }

    const assembleState = async () => {
        const newConstruct = new Construct();
        if(passedConstruct?._id !== undefined) {
            newConstruct._id = passedConstruct._id;
        }
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
        newConstruct.authorsNote = constructAuthorsNote;
        newConstruct.sprites = constructSprites;
        newConstruct.defaultConfig = constructDefaultChatConfig;
        newConstruct.thoughtPattern = constructThoughtPattern;
        setCurrentState(newConstruct);
    }
    
    return (
        <>
        <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex flex-col justify-center w-full">
                <label htmlFor="construct-role" className="font-semibold gap-2 flex pb-1">Name
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('name'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <input
                    type="text"
                    required={true}
                    id="construct-name"
                    className="themed-input w-full"
                    value={constructName}
                    onChange={(event) => setConstructName(event.target.value)}
                />
                <div className="text-left w-full">
                    <p className="font-semibold gap-2 flex pb-1">Total Tokens</p>
                    <input disabled={true} className="themed-input w-full" value={totalTokens}/>
                </div>
            </div>
            <div className="flex flex-col w-full items-center justify-center">
                <label htmlFor="image-upload" className="relative">
                    <div className={"absolute rounded-theme-border-radius inset-0 bg-black bg-opacity-50 flex items-center justify-center" + (!waitingForImage ? " hidden" : "")}>
                        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-theme-text"></div>
                    </div>
                    {constructImage === '' ? <RiQuestionMark className="construct-image-default"/> : <img src={getImageURL(constructImage)} alt={constructName} className="construct-image"/>}
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
            <button className="themed-button-pos flex flex-col justify-center items-center w-1/3" onClick={() => generateConstructImage()} title="Generate Image using Visual Description"><RefreshCw/></button>
            <div className="flex flex-col flex-grow w-full">
                <label htmlFor="construct-appearance" className="font-semibold gap-2 flex pb-1">Visual Description
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('visualDescription'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <TokenTextarea
                    className="themed-input h-full"
                    value={constructVisualDescription}
                    onChange={(event) => setConstructVisualDescription(event)}
                />
            </div>
            <div className="flex flex-col flex-grow w-full">
                <label htmlFor="construct-role" className="font-semibold gap-2 flex pb-1">Nickname 
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('nickname'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <input
                    type="text"
                    required={false}
                    id="construct-role"
                    className="themed-input w-full h-1/2"
                    value={constructNickname}
                    onChange={(event) => setConstructNick(event.target.value)}
                />
            </div>
            <div className="flex flex-col flex-grow w-full">
                <label htmlFor="construct-note" className="font-semibold gap-2 flex pb-1">Author's Note
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('authorsnote'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <TokenTextarea
                    className="themed-input w-full h-full"
                    value={constructAuthorsNote}
                    onChange={(event) => setConstructAuthorsNote(event)}
                />
            </div>
            <div className="flex flex-col flex-grow w-full">
                <label htmlFor="construct-background" className="font-semibold gap-2 flex pb-1">Background
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('background'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <TokenTextarea
                    className="themed-input h-full"
                    value={constructBackground}
                    onChange={(event) => setConstructBackground(event)}
                />
            </div>
            <div className="flex flex-col flex-grow w-full">
                <label htmlFor="construct-personality" className="font-semibold gap-2 flex pb-1">Personality
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('persona'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <TokenTextarea
                    className="themed-input h-full"
                    value={constructPersonality}
                    onChange={(event) => setConstructPersonality(event)}
                />
            </div>
            <div className="flex flex-col overflow-y-auto flex-grow w-full">
                <label htmlFor="construct-relationships" className="font-semibold gap-2 flex pb-1">Relationships
                </label>
                <StringArrayEditorCards 
                    value={constructRelationships}
                    onChange={(event) => setConstructRelationships(event)}
                />
            </div>
            <div className="flex flex-col overflow-y-auto flex-grow w-full">
                <label htmlFor="construct-interests" className="font-semibold gap-2 flex pb-1">Interests
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('interests'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <StringArrayEditorCards
                    value={constructInterests}
                    onChange={(event) => setConstructInterests(event)}
                />
            </div>
            <div className="flex flex-col overflow-y-auto flex-grow w-full">
                <label htmlFor="construct-greetings" className="font-semibold gap-2 flex pb-1">Greetings
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('greeting'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <StringArrayEditorCards
                    value={constructGreetings}
                    onChange={(event) => setConstructGreetings(event)}
                />
            </div>
            <div className="flex flex-col overflow-y-auto flex-grow w-full">
                <label htmlFor="construct-farewells" className="font-semibold gap-2 flex pb-1">Farewells
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('farewell'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <StringArrayEditorCards
                    value={constructFarewells}
                    onChange={(event) => setConstructFarewells(event)}
                />
            </div>
            <div className="flex flex-col max-h-full overflow-y-auto">
                <label htmlFor="construct-commands" className="font-semibold">Construct Actions</label>
                <div className="themed-input">
                    <i>These are abilities active Constructs can use inside of Discord, and the Chat page.</i>
                    <div className="flex flex-col gap-1 themed-button overflow-y-auto">
                        {commandTypes.map((command, index) => {
                            return (
                                <>
                                    <div className="flex flex-row w-full justify-between">
                                        <label htmlFor={command.value}>{command.label}</label>
                                        <input type="checkbox" key={index} id={command.value} name={command.value} checked={constructCommands.includes(command.value)} onChange={(event) => {
                                            if(event.target.checked) {
                                                setConstructCommands([...constructCommands, command.value]);
                                            } else {
                                                setConstructCommands(constructCommands.filter((commandValue) => commandValue !== command.value));
                                            }
                                        }}/>
                                    </div>
                                    <i className="text-theme-italic">{command.explanation}</i>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto">
            <label className="font-semibold">Chat Defaults</label>
                <ConstructChatConfigPanel chatConfig={constructDefaultChatConfig} onChange={handleConfigEdit}/>
            </div>
            <div className="flex flex-col overflow-y-auto w-full">
                <label htmlFor="construct-thought-pattern" className="font-semibold gap-2 flex pb-1">Thought Pattern
                    <button className="themed-button-small" onClick={() => {assembleState().then(() => {setSelectedField('thoughtpattern'); setShowAutoComplete(true)})}}>
                        <RefreshCw size={'1rem'}/>
                    </button>
                </label>
                <TokenTextarea
                    className="themed-input h-full"
                    value={constructThoughtPattern}
                    onChange={(event) => setConstructThoughtPattern(event)}
                />
            </div>
            <div className="flex flex-col overflow-y-auto">
                <label className="font-semibold">Sprites</label>
                <div className="grid grid-cols-3 gap-2 max-h-full w-full overflow-y-auto themed-input flex-grow">
                    {emotions.map(emotion => {
                        const sprite = constructSprites.find(sprite => sprite.emotion === emotion.value);
                        return (
                            <>
                            <SpriteCrud sprite={sprite} addSprite={addSprite} emotion={emotion} key={emotion.label}/>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
        </>
    );
}
export default ConstructQuickCrud;