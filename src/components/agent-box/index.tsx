import {Agent} from "@/classes/Agent";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { RiQuestionMark } from "react-icons/ri";
import './agent-box.scss';
import { getAgent } from "@/api/dbapi";
interface Props {
    character: Agent;
}
const AgentBox: React.FC<Props> = ({character}) => {
    const [characterName, setCharacterName] = useState<string>(character.name);
    const [liveCharacter, setLiveCharacter] = useState<Agent | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setCharacterName(character.name);
        let fetchedAgent = getAgent(character._id);
        fetchedAgent.then((agent) => {
            setLiveCharacter(agent);
        });
    }, [character]);

    return (
        <div className="character-box themed-root h-calc(100vh/6) w-full justify-center">
            <div className="text-2xl font-bold z-10 flex justify-between items-center">
                {characterName}
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <AiOutlineUp/> : <AiOutlineDown/>}
                </button>
            </div>
            {isOpen && liveCharacter && (
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1">
                    <Link to={`/agents/${character._id}`}>
                        {liveCharacter && (liveCharacter.avatar === '' ? <RiQuestionMark className="agent-image-default"/> : <img src={liveCharacter.avatar} alt={characterName} className="cursor-pointer object-scale-down rounded-theme-border-radius"/>)}
                    </Link>
                    <i className="mt-4">
                        {liveCharacter.nickname}
                    </i>
                </div>
                <div className="col-span-4 grid-cols-3 gap-4 grid justify-start">
                    <div className="col-span-1 flex flex-col justify-start items-start">
                        <label className="text-xl">User Actions</label>
                        <div className="w-full h-1/2 overflow-hidden themed-input">
                            <div className="grid grid-rows-2">

                            </div>
                        </div>
                        <label className="text-xl">Commands</label>
                        <div className="w-full h-1/2 overflow-hidden themed-input">
                            {liveCharacter.commands.map((command, index) => {
                                return (
                                    <div key={index}>
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-start items-start">
                        <label className="text-xl">Personality</label>
                        <div className="overflow-hidden w-full h-1/2 text-left themed-input">
                            {liveCharacter.personality}
                        </div>
                        <label className="text-xl">Background</label>
                        <div className="overflow-hidden w-full h-1/2 text-left themed-input">
                            {liveCharacter.background}
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-start">
                        <label className="text-xl">Relationships</label>
                        <div className="w-full h-1/4 overflow-hidden text-left themed-input">
                            {liveCharacter.relationships.map((command, index) => {
                                return (
                                    <div key={index}>
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                        <label className="text-xl">Interests</label>
                        <div className="w-full h-1/4 overflow-hidden themed-input">
                            {liveCharacter.interests.map((command, index) => {
                                return (
                                    <div key={index}>
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                        <label className="text-xl">Greetings</label>
                        <div className="w-full h-1/4 overflow-hidden themed-input">
                            {liveCharacter.greetings.map((command, index) => {
                                return (
                                    <div key={index}>
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                        <label className="text-xl">Farewells</label>
                        <div className="w-full h-1/4 overflow-hidden themed-input">
                            {liveCharacter.farewells.map((command, index) => {
                                return (
                                    <div key={index}>
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}
export default AgentBox;