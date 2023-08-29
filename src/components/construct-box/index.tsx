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
import StringArrayEditorCards from "../string-array-editor-cards";
interface Props {
    character: Construct;
}
const ConstructBox: React.FC<Props> = ({character}) => {
    const [characterName, setCharacterName] = useState<string>(character.name);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPrimary, setIsPrimary] = useState<boolean>(false);

    useEffect(() => {
        setCharacterName(character.name);
        const getActiveStatus = async () => {
            let activeConstructs = await getActiveConstructList();
            let status = false;
            for(let i = 0; i < activeConstructs.length; i++){
                if(activeConstructs[i] === character._id){
                    status = true;
                }
            }
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

    useEffect(() => {
        if(localStorage.getItem(characterName+'-expanded')){
            let state = JSON.parse(localStorage.getItem(characterName+'-expanded')?.toString() || '{}');
            if(state.isExpanded === true){
                setIsOpen(true);
            }
        }
    }, [characterName]);

    useEffect(() => {
        localStorage.setItem(characterName+'-expanded', JSON.stringify({isExpanded: isOpen}));
    }, [isOpen, characterName]);

    return (
        <div className="character-box themed-box h-calc(100vh/6) w-full justify-center">
            <div className="text-2xl font-bold z-10 flex justify-between items-center" onDoubleClick={() => setIsOpen(!isOpen)}>
                <div className="flex flex-row gap-4 justify-center items-center">
                    {!isOpen ? (
                    <div className="themed-message-avatar">
                        {character && (character.avatar === '' ? <RiQuestionMark /> : <img id={character._id} src={character.avatar} alt={characterName} className="themed-message-avatar"/>)}
                    </div>
                    ): null}
                    {characterName}
                </div>
                <button onClick={() => setIsOpen(!isOpen)} data-tooltip={isOpen ? `Collapse ${characterName} details.` : `Expand ${characterName} details.`}>
                    {isOpen ? <AiOutlineUp/> : <AiOutlineDown/>}
                </button>
            </div>
            {isOpen && character && (
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-1">
                    <Link to={`/constructs/${character._id}`}>
                        {character && (character.avatar === '' ? <RiQuestionMark className="construct-image-default"/> : <img id={character._id} src={character.avatar} alt={characterName} className="cursor-pointer object-fit rounded-theme-border-radius"/>)}
                    </Link>
                    <i className="mt-4 font-semibold">
                        {character.nickname}
                    </i>
                    <div className="text-left">
                        <b>Construct Status:</b> {isActive ? <span className="text-theme-flavor-text font-bold">Active</span> : <span className="text-theme-hover-neg font-bold">Inactive</span>}{isActive && <span className="text-theme-flavor-text font-bold"> + {isPrimary ? 'Primary': 'Secondary'}</span>}
                    </div>
                </div>
                <div className="col-span-4 grid-cols-3 gap-4 grid justify-start">
                    <div className="col-span-1 flex flex-col justify-start items-start">
                        <label className="text-xl font-semibold text-left">User Actions</label>
                        <div className="w-full h-1/2 overflow-hidden">
                            <div className="grid grid-rows-2 h-full gap-1">
                                <div className="row-span-1 flex flex-row gap-1">
                                    <button disabled={isPrimary} className={isPrimary ? "w-1/3 themed-button-no-bg bg-theme-hover-pos" : "w-1/3 themed-button-no-bg bg-theme-root hover:bg-theme-hover-pos"} onClick={() => makePrimary()}>Set as Primary Construct</button>
                                    <button disabled={isActive && !isPrimary} className={isActive && !isPrimary ? "w-1/3 themed-button-no-bg bg-theme-hover-pos hover:bg-theme-root" : "w-1/3 themed-button-no-bg bg-theme-root hover:bg-theme-hover-pos"} onClick={() => makeActive()}>Add as Secondary Construct</button>
                                    <button className="themed-button-neg w-1/3" onClick={() => makeInactive()}>Remove Active Construct</button>
                                </div>
                                <div className="row-span-1 flex flex-row gap-1">
                                    <RouteButton to={`/constructs/${character._id}`} text="Edit" className="w-1/2"/>
                                    <button className="themed-button-neg w-1/2" onClick={() => deleteConstructFrom()}>Delete</button>
                                </div>
                            </div>
                        </div>
                        <label className="text-xl font-semibold text-left">Commands</label>
                        <div className="w-full h-1/2 overflow-hidden themed-input-root">
                            {character.commands.map((command, index) => {
                                return (
                                    <div key={index}>
                                        {command}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-start items-start">
                        <label className="text-xl font-semibold text-left">Personality</label>
                        <textarea
                            className="overflow-hidden w-full h-1/3 themed-input-root"
                            value={character.personality}
                            disabled
                        />
                        <label className="text-xl font-semibold text-left">Background</label>
                        <textarea
                            className="overflow-hidden w-full h-1/3 themed-input-root"
                            value={character.background}
                            disabled
                        />
                        <label className="text-xl font-semibold text-left">Author's Note</label>
                        <textarea
                            className="overflow-hidden w-full h-1/3 themed-input-root"
                            value={character.authorsNote}
                            disabled
                        />
                    </div>
                    <div className="col-span-1 flex flex-col justify-start">
                        <label className="text-xl font-semibold text-left">Relationships</label>
                        <div className="w-full h-1/4 overflow-hidden text-left">
                            <StringArrayEditorCards
                                value={character.relationships}
                                disabled
                            />
                        </div>
                        <label className="text-xl font-semibold text-left">Interests</label>
                        <div className="w-full h-1/4 overflow-hidden">
                            <StringArrayEditorCards
                                value={character.interests}
                                disabled
                            />
                        </div>
                        <label className="text-xl font-semibold text-left">Greetings</label>
                        <div className="w-full h-1/4 overflow-hidden">
                            <StringArrayEditorCards
                                value={character.greetings}
                                disabled
                            />
                        </div>
                        <label className="text-xl font-semibold text-left">Farewells</label>
                        <div className="w-full h-1/4 overflow-hidden">
                            <StringArrayEditorCards
                                value={character.farewells}
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