import { getConstructs, updateChat } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct, ConstructChatConfig } from "@/classes/Construct";
import { useEffect, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";
import ReactSwitch from "react-switch";

interface ChatConfigProps { 
    chat: Chat | null;
}
const ChatConfigMain = (props: ChatConfigProps) => {
    const { chat } = props;
    const [global, setGlobal] = useState<boolean>(false);
    const [doVector, setDoVector] = useState<boolean>(false);
    const [isPool, setIsPool] = useState<boolean>(false);
    const [constructs, setConstructs] = useState<string[]>([]);
    const [constructsList, setConstructsList] = useState<Construct[]>([]);
    const [chatConfigs, setChatConfigs] = useState<ConstructChatConfig[]>([]);

    useEffect(() => {
        if(chat?._id === 'activePool'){
            setGlobal(true);
            setIsPool(true);
        }
        if(chat === null) return;
        setGlobal(chat.global);
        setDoVector(chat.doVector);
        setConstructs(chat.constructs);
        setChatConfigs(chat.chatConfigs);
    }, [chat]);

    useEffect(() => {
        getConstructs().then((recievedData) => {
            setConstructsList(recievedData);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const handleEdit = async () => {
        if(chat === null) return;
        chat.global = global;
        chat.doVector = doVector;
        chat.constructs = constructs;
        chat.chatConfigs = chatConfigs;
        await updateChat(chat);
    }

    return (
        <div className="w-full gap-2 grid grid-cols-2 text-left grow-0 shrink-0">
            <div className="flex flex-col col-span-1">
                <label className="text-theme-text font-semibold lg:text-xl">Vector Memories</label>
                <div className="themed-input flex flex-col items-center w-full gap-1 text-left">
                    <i className="text-sm lg:text-lg ">Adds messages to the persistent vector for only this chat. Only applies to all Constructs if Global is enabled.</i>
                    <ReactSwitch
                        disabled={!global}
                        checked={doVector}
                        onChange={() => {setDoVector(!doVector); handleEdit();}}
                        handleDiameter={30}
                        width={60}
                        uncheckedIcon={false}
                        checkedIcon={true}
                        id="doVector"
                    />
                </div>
                <label className="text-theme-text font-semibold lg:text-xl">Global Context</label>
                <div className="themed-input flex flex-col items-center w-full gap-1 text-left">
                    <i className="text-sm lg:text-lg ">Adds messages to the persistent vector store for all Constructs inside of the chat. Only if vectors are enabled.</i>
                    <ReactSwitch
                        disabled={isPool}
                        checked={global}
                        onChange={() => {setGlobal(!global); handleEdit();}}
                        handleDiameter={30}
                        width={60}
                        uncheckedIcon={false}
                        checkedIcon={true}
                        id="global"
                    />
                </div>
            </div>
            <div className="flex flex-col col-span-1 grow-0 shrink-0">
                <label className="text-theme-text font-semibold lg:text-xl">Constructs in Chat</label>
                <div className="flex flex-col w-full gap-2 h-20vh overflow-y-auto">
                    {constructsList.map((construct) => {
                        const isChecked = constructs.includes(construct._id);
                        return (
                            <div key={construct._id} className={"w-full rounded-theme-border-radius border-theme-border-width border-theme-border hover:bg-theme-hover-pos p-2 flex flex-row gap-2 justify-start items-center cursor-pointer " + (isChecked ? "bg-theme-hover-pos" : "bg-theme-box")}
                                onClick={() => {chat?._id !== 'activePool' && setConstructs(constructs.includes(construct._id) ? constructs.filter((id) => id !== construct._id) : [...constructs, construct._id]); handleEdit();}}
                            >
                                <div className="flex items-center justify-center">
                                    {construct.avatar.length > 0 ? (<img src={construct.avatar} className="themed-chat-avatar"/>) : (<RiQuestionMark className="themed-chat-avatar" size={`4rem`}/>)}
                                </div>
                                <p>{construct.name}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default ChatConfigMain;