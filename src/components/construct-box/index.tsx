import { Construct } from "@/classes/Construct";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { RiQuestionMark } from "react-icons/ri";
import './ConstructBox.scss';
import { deleteConstruct, getConstruct } from "@/api/dbapi";
import StringArrayEditor from "../string-array-editor";
import RouteButton from "../route-button";
import { setConstructAsPrimary, addConstructToActive, constructIsActive, getActiveConstructList, removeConstructFromActive } from "@/api/constructapi";
interface Props {
    character: Construct;
}
const ConstructBox: React.FC<Props> = ({character}) => {
    const [characterName, setCharacterName] = useState<string>(character.name);
    const [liveCharacter, setLiveCharacter] = useState<Construct | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPrimary, setIsPrimary] = useState<boolean>(false);

    useEffect(() => {
        setCharacterName(character.name);
        let fetchedConstruct = getConstruct(character._id);
        fetchedConstruct.then((construct) => {
            setLiveCharacter(construct);
        });
        const getActiveStatus = async () => {
            let status = await constructIsActive(character._id);
            setIsActive(status);
            getPrimaryStatus();
        }
        const getPrimaryStatus = async () => {
            if(isActive){
                let activeList = await getActiveConstructList();
                if(activeList.length > 0){
                    if(activeList[0] === character._id){
                        setIsPrimary(true);
                    }
                }
            }
        }
        getActiveStatus();
    }, [character]);

    const deleteConstructFrom = async () => {
        await deleteConstruct(character._id);
        window.location.reload();
    }

    const makeActive = async () => {
        await addConstructToActive(character._id);
        window.location.reload();
    }

    const makePrimary = async () => {
        await setConstructAsPrimary(character._id);
        window.location.reload();
    }

    const makeInactive = async () => {
        await removeConstructFromActive(character._id);
        window.location.reload();
    }

    return (
        <div className="character-box themed-box h-calc(100vh/6) w-full justify-center">
            <div className="text-2xl font-bold z-10 flex justify-between items-center">
                {characterName}
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <AiOutlineUp/> : <AiOutlineDown/>}
                </button>
            </div>
            {isOpen && liveCharacter && (
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1">
                    <Link to={`/constructs/${character._id}`}>
                        {liveCharacter && (liveCharacter.avatar === '' ? <RiQuestionMark className="construct-image-default"/> : <img src={liveCharacter.avatar} alt={characterName} className="cursor-pointer object-scale-down rounded-theme-border-radius"/>)}
                    </Link>
                    <i className="mt-4">
                        {liveCharacter.nickname}
                    </i>
                    <div className="text-left">
                        <b>Construct Status:</b> {isActive ? <span className="text-theme-flavor-text font-bold">Active</span> : <span className="text-theme-hover-neg font-bold">Inactive</span>}{isActive && <span className="text-theme-flavor-text font-bold"> + {isPrimary ? 'Primary': 'Secondary'}</span>}
                    </div>
                </div>
                <div className="col-span-4 grid-cols-3 gap-4 grid justify-start">
                    <div className="col-span-1 flex flex-col justify-start items-start">
                        <label className="text-xl">User Actions</label>
                        <div className="w-full h-1/2 overflow-hidden">
                            <div className="grid grid-rows-2 h-full">
                                <div className="row-span-1 flex flex-row">
                                    <button className="themed-button-pos w-1/3" onClick={() => makePrimary()}>Set as Primary Construct</button>
                                    <button className="themed-button-pos w-1/3" onClick={() => makeActive()}>Add as Secondary Construct</button>
                                    <button className="themed-button-neg w-1/3" onClick={() => makeInactive()}>Remove Active Construct</button>
                                </div>
                                <div className="row-span-1 flex flex-row">
                                    <RouteButton to={`/constructs/${character._id}`} text="Edit" className="w-1/2"/>
                                    <button className="themed-button-neg w-1/2" onClick={() => deleteConstructFrom()}>Delete</button>
                                </div>
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
                        <textarea
                            className="overflow-hidden w-full h-1/2 themed-input"
                            value={liveCharacter.personality}
                            disabled
                        />
                        <label className="text-xl">Background</label>
                        <textarea
                            className="overflow-hidden w-full h-1/2 themed-input"
                            value={liveCharacter.background}
                            disabled
                        />
                    </div>
                    <div className="col-span-1 flex flex-col justify-start">
                        <label className="text-xl">Relationships</label>
                        <div className="w-full h-1/4 overflow-hidden text-left themed-input">
                            <StringArrayEditor
                                value={liveCharacter.relationships}
                                disabled
                            />
                        </div>
                        <label className="text-xl">Interests</label>
                        <div className="w-full h-1/4 overflow-hidden themed-input">
                            <StringArrayEditor
                                value={liveCharacter.interests}
                                disabled
                            />
                        </div>
                        <label className="text-xl">Greetings</label>
                        <div className="w-full h-1/4 overflow-hidden themed-input">
                            <StringArrayEditor
                                value={liveCharacter.greetings}
                                disabled
                            />
                        </div>
                        <label className="text-xl">Farewells</label>
                        <div className="w-full h-1/4 overflow-hidden themed-input">
                            <StringArrayEditor
                                value={liveCharacter.farewells}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}
export default ConstructBox;