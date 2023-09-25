import { getImageURL } from "@/api/baseapi";
import { Construct } from "@/classes/Construct";
import { PlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Props {
    character: Construct;
    onClick?: (construct: Construct) => void;
    active?: boolean;
}

const ConstructProfile: React.FC<Props> = ({ character, onClick, active }) => {
    const [characterImage, setCharacterImage] = useState<string>(character.avatar);
    const [characterName, setCharacterName] = useState<string>(character.name);
    const [isHovered, setIsHovered] = useState<boolean>(false); // State for hover

    useEffect(() => {
        setCharacterImage(character.avatar);
        setCharacterName(character.name);
    }, [character]);

    return (
        <div
            className={"themed-root-no-padding w-36 min-h-52 flex flex-col justify-center items-center cursor-pointer relative shrink-0 grow-0 pop-in min-h-52 h-52"}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
            onClick={() => { if (onClick !== undefined) onClick(character) }}
        >
            <img src={getImageURL(characterImage)} alt={characterName} className="object-cover w-full h-full rounded-theme-border-radius" />
            <p className="text-theme-text first-line font-bold absolute bottom-4 left-4 right-4 text-shadow-xl themed-root-no-padding overflow-y-auto">
                {characterName}
            </p>
    
            {isHovered && (
                <div className="absolute inset-0 bg-themed-root hover:bg-theme-root flex items-center justify-center rounded-theme-border-radius">
                    <span className="text-theme-text font-bold justify-center items-center align-middle flex flex-col">
                        New Chat
                        <br/>
                        <PlusIcon size={52} className="text-theme-text"/>
                    </span>
                </div>
            )}
    
            {active && !isHovered && (
                <div className="absolute top-0 left-0 w-7 h-7 bg-theme-root shadow-lg rounded-tl-lg rounded-br-lg">
                    <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 shadow-lg rounded-full"></div>
                </div>
            )}
        </div>
    );
    
}

export default ConstructProfile;
