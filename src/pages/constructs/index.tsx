
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";
import { Construct } from "@/classes/Construct";
import { getConstructs, saveNewConstruct } from "@/api/dbapi";
import ConstructBox from "@/components/construct-box";
import { importTavernCharacter } from "@/api/extrasapi";
import { AiOutlineUpload } from "react-icons/ai";
import { removeAllActiveConstructs } from "@/api/constructapi";
import Loading from "@/components/loading";

const ConstructsPage = () => {
    const [characters, setCharacters] = useState<Construct[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
        retrieveCharacters().then(() => {
            setIsLoaded(true);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const clearActive = async () => {
        await removeAllActiveConstructs();
        window.location.reload();
    }

    const removeConstruct = (construct: Construct) => {
        const newConstructs = characters.filter((char) => char._id !== construct._id);
        setCharacters(newConstructs);
    }

    if(!isLoaded) return (<Loading/>);
    
    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] overflow-y-auto overflow-x-hidden p-4">
            <div className="flex flex-col gap-2">
                <div className="themed-root">
                    <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Constructs</h2>
                    <div className="grid grid-cols-5 gap-1 w-15vw h-5vh mb-4">
                        <Link to="/constructs/new" className="themed-button-pos flex items-center justify-center" data-tooltip="Add New Construct" id="newConstruct">
                            <FiPlus className='absolute'size={50}/>
                        </Link>
                        <button onClick={clearActive} className="themed-button-pos flex items-center justify-center" data-tooltip="Clear Active Constructs">
                            <FiX className='absolute'size={50}/>
                        </button>
                        <label htmlFor="character-image-input" className="themed-button-pos flex items-center justify-center" data-tooltip="Import Character Card" id="importCard">
                            <AiOutlineUpload className='absolute'size={50}/>
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
                </div>
                <div className="flex flex-col gap-2">
                {Array.isArray(filteredCharacters) && filteredCharacters.sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return 0;
                    }
                }).map((character, index) => (
                    <ConstructBox key={index} character={character} onCharacterDelete={removeConstruct}/>
                ))}
                </div>
            </div>
        </div>
    )
};

export default ConstructsPage;
