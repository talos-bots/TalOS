import { Construct } from "@/classes/Construct";
import { Edit, PlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Props {
    character: Construct;
    active?: boolean;
}

const ConstructEditProfile: React.FC<Props> = ({ character, active }) => {
    const [characterImage, setCharacterImage] = useState<string>(character.avatar);
    const [characterName, setCharacterName] = useState<string>(character.name);
    const [isHovered, setIsHovered] = useState<boolean>(false); // State for hover

    useEffect(() => {
        setCharacterImage(character.avatar);
        setCharacterName(character.name);
    }, [character]);

    return (
        <Link to={`/constructs/${character._id}`}
            className={"themed-root-no-padding w-36 h-full flex flex-col justify-center items-center cursor-pointer relative shrink-0 grow-0 pop-in"}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={characterImage} alt={characterName} className="object-cover w-full h-full rounded-theme-border-radius" />
            <p className="text-theme-text first-line font-bold absolute bottom-4 left-4 right-4 text-shadow-xl themed-root-no-padding overflow-y-auto">
                {characterName}
            </p>
    
            {isHovered && (
                <div className="absolute inset-0 bg-themed-root hover:bg-theme-root flex items-center justify-center rounded-theme-border-radius">
                    <span className="text-theme-text font-bold justify-center items-center align-middle flex flex-col text-xl">
                        Edit
                        <br/>
                        <Edit size={48} className="text-theme-text"/>
                    </span>
                </div>
            )}
    
            {active && !isHovered && (
                <div className="absolute top-0 left-0 w-7 h-7 bg-theme-root shadow-lg rounded-tl-lg rounded-br-lg">
                    <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 shadow-lg rounded-full"></div>
                </div>
            )}
        </Link>
    );
    
}

export default ConstructEditProfile;
