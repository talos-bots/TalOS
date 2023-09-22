
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";
import { Construct } from "@/classes/Construct";
import { getConstructs, saveNewConstruct, updateConstruct } from "@/api/dbapi";
import ConstructBox from "@/components/construct-box";
import { importTavernCharacter } from "@/api/extrasapi";
import { AiOutlineUpload } from "react-icons/ai";
import { getActiveConstructList, removeAllActiveConstructs } from "@/api/constructapi";
import Loading from "@/components/loading";
import ConstructProfile from "@/components/construct-profile";
import ConstructEditProfile from "./construct-edit-profile";
import { PlusIcon } from "lucide-react";

const ConstructsPage = () => {
    const [characters, setCharacters] = useState<Construct[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [activeChars, setActiveChars] = useState<string[]>([]);

    const filteredCharacters = characters ? characters.filter((character) => {
        return Object.values(character).some((value) =>
          value && 
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
    }) : [];


    const handleImageUpload = async (files: FileList | null) => {
        if (!files) return;
        const filesArray = Array.from(files);
        
        const uploadPromises = filesArray.map(async (file) => {
            try {
                const importData = await importTavernCharacter(file);
                return importData;
            } catch (error) {
                console.error(error);
            }
        });
        const constructs: any[] = await Promise.all(uploadPromises);
        for (const character of constructs) {
            if(character){
                setCharacters([...characters, character]);
            }
        }
    };    

    useEffect(() => {
        const retrieveCharacters = async () => {
            let retrievedChars: Construct[] = await getConstructs();
            if(retrievedChars){
                setCharacters(retrievedChars);
            }else{
                console.log('no constructs found');
                setCharacters([]);
            }
        }
        getActiveConstructList().then((activeChars) => {
            setActiveChars(activeChars);
        }).catch((err) => {
            console.error(err);
        });
        retrieveCharacters().then(() => {
            setIsLoaded(true);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const refreshList = async () => {
        getActiveConstructList().then((activeChars) => {
            setActiveChars(activeChars);
        }).catch((err) => {
            console.error(err);
        });
    }

    const clearActive = async () => {
        await removeAllActiveConstructs();
        window.location.reload();
    }

    const removeConstruct = (construct: Construct) => {
        const newConstructs = characters.filter((char) => char._id !== construct._id);
        setCharacters(newConstructs);
    }

    const editConstruct = async (construct: Construct) => {
        const newConstructs = characters.map((char) => {
            if(char._id === construct._id){
                return construct;
            }
            return char;
        });
        setCharacters(newConstructs);
        await updateConstruct(construct);
    }
    if(!isLoaded) return (<Loading/>);
    
    return (
        <div className="max-w-[100%] h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] overflow-y-auto overflow-x-hidden p-4 lg:p-8">
            <div className="flex flex-col gap-2">
                <div className="themed-root slide-in-top overflow-x-auto">
                    <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Constructs</h2>
                    <div className="grid grid-cols-5 gap-1 w-15vw mb-4 h-14">
                        <button onClick={clearActive} className="themed-button-pos flex items-center justify-center" data-tooltip="Clear Active Constructs">
                            <FiX className='absolute'size={'3rem'}/>
                        </button>
                        <label htmlFor="character-image-input" className="themed-button-pos flex items-center justify-center" data-tooltip="Import Character Card" id="importCard">
                            <AiOutlineUpload className='absolute'size={'3rem'}/>
                        </label>
                        <input
                            type="file"
                            accept="image/png, application/json"
                            id="character-image-input"
                            onChange={(e) => handleImageUpload(e.target.files)}
                            style={{ display: 'none' }}
                            multiple={true}
                        />
                        {characters && 
                            <div className="construct-search-bar col-span-2">
                                <input
                                type="text"
                                placeholder="Search Constructs"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>
                        }
                    </div>
                    <div className="flex flex-row w-95vw max-w-full gap-2 overflow-x-auto grow-0 lg:gap-2">
                        <div className="flex flex-row max-w-full gap-2 overflow-x-auto grow-0 lg:gap-2">
                            <Link
                                className="themed-root-no-padding w-36 h-48 flex flex-col justify-center items-center cursor-pointer relative shrink-0 grow-0 lg:w-[calc(100% - 2rem)] lg:h-[calc(100%)]"
                                to={"/constructs/new"}
                            >
                                <div className="absolute inset-0 bg-themed-root hover:bg-theme-hover-pos flex items-center justify-center rounded-theme-border-radius">
                                <span className="text-theme-text text-2xl font-bold justify-center items-center align-middle flex flex-col lg:text-2xl">
                                    New Construct
                                    <br />
                                    <PlusIcon size={`4rem`} className="text-theme-text lg:text-4xl" />
                                </span>
                                </div>
                            </Link>
                            {Array.isArray(filteredCharacters) && filteredCharacters.sort((a, b) => {
                                // Check if either construct is active
                                const aIsActive = activeChars.includes(a._id);
                                const bIsActive = activeChars.includes(b._id);

                                // If both constructs are either active or inactive, sort by name
                                if (aIsActive === bIsActive) {
                                    if (a.name && b.name) {
                                        return a.name.localeCompare(b.name);
                                    }
                                    return 0;  // <-- Ensures a number is returned in all scenarios
                                }
                                // If only one of the constructs is active, prioritize it
                                if (aIsActive) return -1;
                                return 1;  // If only `b` is active or any other case not caught above
                            }).map((character, index) => (
                                <ConstructEditProfile key={index} character={character} active={activeChars.includes(character._id)} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                {Array.isArray(filteredCharacters) && filteredCharacters.sort((a, b) => {
                    // Check if either construct is active
                    const aIsActive = activeChars.includes(a._id);
                    const bIsActive = activeChars.includes(b._id);

                    // If both constructs are either active or inactive, sort by name
                    if (aIsActive === bIsActive) {
                        if (a.name && b.name) {
                            return a.name.localeCompare(b.name);
                        }
                        return 0;  // <-- Ensures a number is returned in all scenarios
                    }
                    // If only one of the constructs is active, prioritize it
                    if (aIsActive) return -1;
                    return 1;  // If only `b` is active or any other case not caught above
                }).map((character, index) => (
                    <ConstructBox key={index} character={character} onCharacterDelete={removeConstruct} onCharacterEdit={editConstruct} onEditStatus={refreshList}/>
                ))}
                </div>
            </div>
        </div>
    )
};

export default ConstructsPage;
