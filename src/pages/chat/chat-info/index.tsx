import { Chat } from "@/classes/Chat";
import BackButton from "@/components/back-button";
import { Edit2Icon, LucideArrowBigLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatInfoProps { 
    chat: Chat;
    onEdit?: (chat: Chat) => void;
}
const ChatInfo = (props: ChatInfoProps) => {
    const { chat, onEdit } = props;
    const [name, setName] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setName(chat.name);
    }, [chat]);

    const handleEdit = () => {
        chat.name = name;
        if (onEdit !== undefined) onEdit(chat);
        setIsEditing(false);
    }

    return (
        <div className="themed-root w-full h-5/6 flex flex-row justify-start align-middle items-center gap-6">
            <button className="message-button" onClick={() => {window.location.reload()}}>
                <LucideArrowBigLeft size={36} className="text-theme-text"/>
            </button>
            {isEditing ? (
                <input
                    value={name}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setName(newValue);
                    }}
                    onBlur={() => {
                        handleEdit();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleEdit();
                        }
                    }}
                    autoFocus
                    style={{ width: 'auto', minWidth: '30px', backgroundColor: 'transparent' }}
                />
            ) : (
                <div className="flex flex-row gap-2">
                    <p>{name}</p>
                    <button onClick={() => setIsEditing(true)} className="message-button">
                        <Edit2Icon size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
export default ChatInfo;