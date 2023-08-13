
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Agent } from "@/classes/Agent";
import { getAgents } from "@/api/dbapi";
import AgentBox from "@/components/agent-box";
import './agent-page.module.scss';

const AgentsPage = () => {
    const [characters, setCharacters] = useState<Agent[]>([]);
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

    // Get the characters for the current page
    const getCurrentPageCharacters = () => {
        return filteredCharacters;
    };

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
            let retrievedChars: Agent[] = await getAgents();
            if(retrievedChars){
                setCharacters(retrievedChars);
            }
        }
        retrieveCharacters();
    }, []);

    return (
        <div className="w-full h-calc(100vh - 70px) grid grid-rows-[auto,1fr] gap-2">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Agents</h2>
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-4 gap-0 w-15vw h-5vh">
                    <Link to="/agents/new" className="themed-button-pos flex items-center justify-center">
                        <FiPlus className='absolute'size={50}/>
                    </Link>
                    {characters && 
                        <div className="agent-search-bar col-span-2">
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
                    {Array.isArray(characters) && getCurrentPageCharacters().map((character, index) => (
                        <AgentBox key={index} character={character} />
                    ))}
                </div>
            </div>
        </div>
    )
};

export default AgentsPage;
