import {Agent} from "@/classes/Agent";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Props {
    character: Agent;
}
const AgentBox: React.FC<Props> = ({character}) => {
    const [characterImage, setCharacterImage] = useState<string>(character.avatar);
    const [characterName, setCharacterName] = useState<string>(character.name);

    useEffect(() => {
        setCharacterImage(character.avatar);
        setCharacterName(character.name);
    }, [character]);

    return (
        <Link to={`/characters/${character._id}`} className="character-box themed-button w-10vw h-20vh justify-center">
            <img src={characterImage} alt={characterName} className="cursor-pointer object-scale-down w-4/5 h-4/5"/>
            <div className="text-xl font-bold z-10">
                {characterName}
            </div>
        </Link>
    )
}
export default AgentBox;