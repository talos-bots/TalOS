
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './agent-menu.module.scss';
import { FiPlus } from "react-icons/fi";
import { Agent } from "@/classes/Agent";
import { getAgents } from "@/api/dbapi";
import AgentBox from "@/components/agent-box";

const AgentsPage = () => {
    const [characters, setCharacters] = useState<Agent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const charactersPerPage = 12;

    const filteredCharacters = characters ? characters.filter((character) => {
        return Object.values(character).some((value) =>
          value && 
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }) : [];
    
    const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

    // Get the characters for the current page
    const getCurrentPageCharacters = () => {
        const startIndex = (currentPage - 1) * charactersPerPage;
        const endIndex = startIndex + charactersPerPage;
        return filteredCharacters.slice(startIndex, endIndex);
    };

    // Update the current page when the user clicks a page number button
    const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
        <>
        <div className="">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Agents</h2>
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-4 gap-0 w-15vw h-5vh">
                    <Link to="/agents/new" className="themed-button-pos flex items-center justify-center">
                        <FiPlus className='absolute'size={50}/>
                    </Link>
                    {characters && 
                        <div className="chara-search-bar col-span-2">
                            <input
                            type="text"
                            placeholder="Search characters"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    }
                </div>
                <div className="grid grid-cols-6 grid-rows-2 gap-4">
                    {Array.isArray(characters) && getCurrentPageCharacters().map((character, index) => (
                        <AgentBox key={index} character={character} />
                    ))}
                </div>
                <div className="flex items-center justify-center mt-6 mb-3">
                    {Array.isArray(characters) && 
                    Array.from({ length: totalPages }, (_, index) => (
                        <button
                        key={index + 1}
                        className={`bg-theme-box aspect-w-1 aspect-h-1 rounded-lg shadow-md backdrop-blur-md p-2 w-16 border-2 border-solid border-theme-border outline-none justify-center cursor-pointer transition-colors hover:bg-theme-hover-pos ${currentPage === index + 1 ? "bg-theme-hover-pos text-theme-text" : "bg-selected-light text-selected"}`}
                        onClick={() => handlePageClick(index + 1)}
                        >
                        {index + 1}
                        </button>
                    ))
                    }
                </div>
            </div>
        </div>
        </>
    )
};

export default AgentsPage;
