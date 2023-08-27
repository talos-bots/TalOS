import { Construct } from "@/classes/Construct";
import React, { useState, useEffect } from "react";

interface Props {
    character: Construct;
    onClick?: (construct: Construct) => void;
}
const ConstructProfile: React.FC<Props> = ({character, onClick}) => {
    const [characterImage, setCharacterImage] = useState<string>(character.avatar);
    const [characterName, setCharacterName] = useState<string>(character.name);

    useEffect(() => {
        setCharacterImage(character.avatar);
        setCharacterName(character.name);
    }, [character]);

    return (
        <div 
            className="themed-root-no-padding w-10vw h-full flex flex-col justify-center items-center cursor-pointer relative" 
            onClick={() => {if(onClick !== undefined) onClick(character)}}
        >
            <img src={characterImage} alt={characterName} className="object-cover w-full h-full rounded-lg"/>
            <p className="text-xl font-bold z-999 absolute bottom-2 left-2 right-2 text-shadow-xl themed-root-no-padding overflow-y-auto">
                {characterName}
            </p>
        </div>
    )

}
export default ConstructProfile;
