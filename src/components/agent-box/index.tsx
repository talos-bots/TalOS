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
        <div className="character-box themed-root h-calc(100vh/6) w-full justify-center">
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1">
                    <div className="text-2xl font-bold z-10">
                        {characterName}
                    </div>
                    <Link to={`/agents/${character._id}`}>
                        <img src={characterImage} alt={characterName} className="cursor-pointer object-scale-down rounded-theme-border-radius"/>
                    </Link>
                    <i className="mt-4">
                        {character.nickname}
                    </i>
                </div>
                <div className="col-span-4 grid-cols-3 gap-4 grid justify-start">
                    <div className="col-span-1 flex flex-col justify-start items-start">
                        <label className="text-xl">User Actions:</label>
                        <div className="w-full h-1/2 overflow-hidden">
                        </div>
                        <label className="text-xl">Commands:</label>
                        <div className="w-full h-1/2 overflow-hidden">
                            {character.commands.map((command, index) => {
                                return (
                                    <div key={index} className="themed-input">
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-start items-start">
                        <label className="text-xl">Personality:</label>
                        <div className="overflow-hidden w-full h-1/2 text-left themed-input">
                            {character.personality}
                        </div>
                        <label className="text-xl">Background:</label>
                        <div className="overflow-hidden w-full h-1/2 text-left themed-input">
                            {character.background}
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-start">
                        <label className="text-xl">Relationships:</label>
                        <div className="w-full h-1/4 overflow-hidden text-left">
                            {character.relationships.map((command, index) => {
                                return (
                                    <div key={index} className="themed-input">
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                        <label className="text-xl">Interests:</label>
                        <div className="w-full h-1/4 overflow-hidden">
                            {character.interests.map((command, index) => {
                                return (
                                    <div key={index} className="themed-input">
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                        <label className="text-xl">Greetings:</label>
                        <div className="w-full h-1/4 overflow-hidden">
                            {character.greetings.map((command, index) => {
                                return (
                                    <div key={index} className="themed-input">
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                        <label className="text-xl">Farewells:</label>
                        <div className="w-full h-1/4 overflow-hidden">
                            {character.farewells.map((command, index) => {
                                return (
                                    <div key={index} className="themed-input">
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AgentBox;