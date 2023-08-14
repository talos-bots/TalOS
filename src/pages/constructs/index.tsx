
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Construct } from "@/classes/Construct";
import { getConstructs } from "@/api/dbapi";
import ConstructBox from "@/components/construct-box";
import './construct-page.scss';

const ConstructsPage = () => {
    const [characters, setCharacters] = useState<Construct[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCharacters = characters ? characters.filter((character) => {
        return Object.values(character).some((value) =>
          value && 
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
    }) : [];


    const returnToMenu = () => {
        console.log('returning to menu');
        location.href = '/';
    }

    useEffect(() => {
        const closeOnEscapeKey = (e: { key: string; }) => e.key === "Escape" ? returnToMenu() : null;
        document.body.addEventListener("keydown", closeOnEscapeKey);
        return () => {
            document.body.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, []);

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
        retrieveCharacters();
    }, []);

    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] themed-root gap-4">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Constructs</h2>
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-4 gap-0 w-15vw h-5vh">
                    <Link to="/constructs/new" className="themed-button-pos flex items-center justify-center">
                        <FiPlus className='absolute'size={50}/>
                    </Link>
                    {characters && 
                        <div className="construct-search-bar col-span-2">
                            <input
                            type="text"
                            placeholder="Search characters"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    }
                </div>
                <div className="flex flex-col">
                    {Array.isArray(filteredCharacters) && filteredCharacters.map((character, index) => (
                        <ConstructBox key={index} character={character} />
                    ))}
                </div>
            </div>
        </div>
    )
};

export default ConstructsPage;
