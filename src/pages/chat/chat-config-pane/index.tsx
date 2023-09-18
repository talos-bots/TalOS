import { getConstructs } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct, ConstructChatConfig } from "@/classes/Construct";
import { useEffect, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";
import ReactSwitch from "react-switch";

interface ChatConfigPaneProps { 
    chat: Chat | null;
    chatPanelClose: boolean;
    onEdit?: (chat: Chat) => void;
}
const ChatConfigPane = (props: ChatConfigPaneProps) => {
    const { chat, onEdit, chatPanelClose } = props;
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

    const handleEdit = () => {
        if(chat === null) return;
        chat.global = global;
        chat.doVector = doVector;
        chat.constructs = constructs;
        chat.chatConfigs = chatConfigs;
        onEdit && onEdit(chat);
    }

    return (
        <div className={"overflow-y-auto w-full themed-root slide-in-right " + (chatPanelClose? 'slide-out-right' : '')}>
            <h3 className="font-bold text-center">Chat Settings</h3>
            <div className="flex flex-col w-full flex-grow gap-2 text-left">
                <div className="flex flex-col">
                    <label className="font-semibold">Vector Memories</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                        <i className="text-sm">Adds messages to the persistent vector for only this chat. Only applies to all Constructs if Global is enabled.</i>
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
                    <label className="font-semibold">Global Context</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                        <i className="text-sm">Adds messages to the persistent vector store for all Constructs inside of the chat. Only if vectors are enabled.</i>
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
                    <label className="font-semibold">Constructs in Chat</label>
                    <div className="flex flex-col items-center w-full flex-grow gap-2 text-left">
                        <div className="flex flex-col w-full gap-1 overflow-y-auto">
                            {constructsList.map((construct) => {
                                const isChecked = constructs.includes(construct._id);
                                return (
                                    <div key={construct._id} className={"rounded-theme-border-radius object-cover border-theme-border-width border-theme-border hover:bg-theme-hover-pos p-2 flex flex-row gap-2 justify-start items-center relative cursor-pointer " + (isChecked ? "bg-theme-hover-pos" : "bg-theme-box")}
                                        onClick={() => {chat?._id !== 'activePool' && setConstructs(constructs.includes(construct._id) ? constructs.filter((id) => id !== construct._id) : [...constructs, construct._id]); handleEdit();}}
                                    >
                                        <div className="flex items-center justify-center">
                                            {construct.avatar.length > 0 ? (<img src={construct.avatar} className="themed-chat-avatar"/>) : (<RiQuestionMark className="themed-chat-avatar"size={36}/>)}
                                        </div>
                                        <p>{construct.name}</p>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChatConfigPane;