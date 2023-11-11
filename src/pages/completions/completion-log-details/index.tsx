import { updateCompletion } from "../../../api/dbapi";
import { getFormattedTime } from "../../../pages/chat/chat-log/message";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { confirmModal } from "../../../components/confirm-modal";
import { CompletionLog } from "../../../classes/CompletionLog";
interface ChatDetailsProps {
    chat: CompletionLog;
    onDoubleClick?: (chat: CompletionLog) => void;
    onClick?: (chat: CompletionLog) => void;
    onEdit?: (chat: CompletionLog) => void;
    onDelete?: (chat: CompletionLog) => void;
    disabled?: boolean;
    selected?: boolean;
}
const CompletionLogDetails = (props: ChatDetailsProps) => {
    const { chat, onDoubleClick, onClick, onDelete, onEdit, disabled, selected } = props;
    const [name, setName] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    useEffect(() => {
        if(chat === undefined || chat === null) return;
        const init = async () => {
            setName(chat.name);
        };
        init();
    }, [chat]);

    const saveModifiedChat = async () => {
        let newChat = chat;
        newChat.name = name;
        await updateCompletion(newChat);
        onEdit?.(newChat);
    };

    const handleSave = () => {
        setIsEditing(false);
        saveModifiedChat();
    };

    return (
        <div
            title="Double Click me to Open!"
            className={`rounded-theme-border-radius object-cover bg-theme-box border-theme-border-width border-theme-border hover:bg-theme-hover-pos p-2 flex flex-col justify-start items-start relative cursor-pointer ${isDeleted? 'slide-out-left': 'slide-in-left'} ` + (selected ? "bg-theme-hover-pos" : "bg-theme-box")}
            onClick={() => {if(onClick !== undefined) onClick(chat)}} 
            onDoubleClick={()=> {if(onDoubleClick !== undefined) onDoubleClick(chat)}}
        >
            <div className="flex flex-row items-center justify-start">
                {isEditing ? (
                    <textarea 
                        value={name}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setName(newValue);
                        }}                                                    
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSave();
                            }
                        }}
                        autoFocus
                        style={{ width: 'auto', minWidth: '30px' }}
                        className="ml-2 themed-input h-6"
                    />
                ) : (
                    <>
                        <p className="ml-2">{name}</p>
                        {!disabled &&
                        <>
                            <button onClick={() => setIsEditing(true)} className="message-button ml-2 cursor-pointer" title="Edit Chat name">
                                <Edit2Icon size={'1rem'} />
                            </button>
                        </>}
                    </>
                )}
                {!disabled && (
                    <>
                <button className="message-button ml-2 cursor-pointer"
                    onClick={async () => {
                        setIsDeleted(true);
                        await new Promise(r => setTimeout(r, 750));
                        if(onDelete === undefined) return;
                        if(!await confirmModal(`Are you sure you want to delete this chat? This cannot be undone.`)){
                            setIsDeleted(false);
                            return;
                        }
                        onDelete(chat);
                    }}
                    title="Delete Chat"
                >
                    <TrashIcon size={'1rem'} />
                </button>
                    </>
                )}
            </div>
        </div>
    );
     
}

export default CompletionLogDetails;