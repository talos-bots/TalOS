import { getConstructs, getStorageValue, setStorageValue } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct, ConstructChatConfig } from "@/classes/Construct";
import ConnectionBox from "@/components/llm-panel/connection-box";
import GenerationSettings from "@/components/llm-panel/generation-settings";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
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
    const [doMultiline, setDoMultiline] = useState<boolean>(false);
    const [messagesToSend, setMessagesToSend] = useState<number>(25);
    const [page, setPage] = useState<number>(1);
    const [swipeDirection, setSwipeDirection] = useState<string>("none");

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
        getStorageValue('doMultiline').then((value) => {
            setDoMultiline(JSON.parse(value)? JSON.parse(value) : false);
        }).catch((err) => {
            console.error(err);
        });
        getStorageValue('messagesToSend').then((value) => {
            setMessagesToSend(JSON.parse(value)? JSON.parse(value) : 25);
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
        onEdit && onEdit(chat);
    };

    const handleDoMultilineChange = async (newValue: boolean) => {
        setDoMultiline(newValue);
        try {
            await setStorageValue('doMultiline', JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMessagesToSendChange = async (newValue: number) => {
        setMessagesToSend(newValue);
        try {
            await setStorageValue('messagesToSend', JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
    };  

    const pageChangeRight = async (page: number) => {
        setSwipeDirection("right");
        await new Promise(r => setTimeout(r, 500));
        if(page === 1) {
            setPage(2);
        }
        if(page === 2) {
            setPage(3);
        }
        if(page === 3) {
            setPage(1);
        }
        setSwipeDirection("none");
    }

    const pageChangeLeft = async (page: number) => {
        setSwipeDirection("left");
        await new Promise(r => setTimeout(r, 500));
        if(page === 1) {
            setPage(3);
        }
        if(page === 2) {
            setPage(1);
        }
        if(page === 3) {
            setPage(2);
        }
        setSwipeDirection("none");
    }

    return (
        <div className={"overflow-y-auto w-full flex flex-col h-full themed-root slide-in-right " + (chatPanelClose? 'slide-out-right' : '')}>
            <button className="themed-button-pos absolute top-2 left-2" onClick={() => pageChangeLeft(page)}><ArrowBigLeft/></button>
            <button className="themed-button-pos absolute top-2 right-2" onClick={() => pageChangeRight(page)}><ArrowBigRight/></button>
            {page === 1 && (
            <div className={"flex flex-col w-full flex-grow gap-2 text-left " + ((swipeDirection === "right" && " slide-out-left " || swipeDirection === "left" && " slide-out-right "))}>
                <h3 className="font-bold text-center">Chat Settings</h3>
                <div className="flex flex-col">
                    <label className="font-semibold">Vector Memories</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                        <i className="text-sm">Adds messages to the persistent vector for only this chat. Only applies to all Constructs if Global is enabled.</i>
                        <ReactSwitch
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
                    <label className="font-semibold">Multiline Messages</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                        <i className="text-sm">Allows messages to be sent in multiple lines.</i>
                        <ReactSwitch
                            checked={doMultiline}
                            onChange={() => {handleDoMultilineChange(!doMultiline); handleEdit();}}
                            handleDiameter={30}
                            width={60}
                            uncheckedIcon={false}
                            checkedIcon={true}
                            id="doMultiline"
                        />
                    </div>
                    <label className="font-semibold">Messages to Send</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                        <i className="text-sm">The number of messages to send in the prompt.</i>
                        <input type="number" className="themed-input" value={messagesToSend} onChange={(e) => {handleMessagesToSendChange(parseInt(e.target.value)); handleEdit();}}/>
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
                                            {construct.avatar.length > 0 ? (<img src={construct.avatar} className="themed-chat-avatar"/>) : (<RiQuestionMark className="themed-chat-avatar" size={'2.5rem'}/>)}
                                        </div>
                                        <p>{construct.name}</p>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>
                    <label className="font-semibold">Construct Chat Configs</label>
                </div>
            </div>
            )}
            {page === 2 && (
                <div className={"flex flex-col w-full flex-grow gap-2 text-left " + ((swipeDirection === "right" && " slide-out-left " || swipeDirection === "left" && " slide-out-right "))}>
                    <h3 className="font-bold text-center">LLM Settings</h3>
                    <ConnectionBox/>
                    <GenerationSettings/>
                </div>
            )}
            {page === 3 && (
                <div className={"flex flex-col w-full flex-grow gap-2 text-left " + ((swipeDirection === "right" && " slide-out-left " || swipeDirection === "left" && " slide-out-right "))}>
                    <h3 className="font-bold text-center">Construct Details</h3>
                </div>
            )}
        </div>
    )
}
export default ChatConfigPane;