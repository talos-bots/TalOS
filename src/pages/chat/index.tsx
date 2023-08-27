import { useEffect, useState } from "react";
import ChatLog from "./chat-log";
import { useParams } from "react-router-dom";
import ChatSelector from "./chat-selector";
import { Chat } from "@/classes/Chat";

const ChatPage = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    useEffect(() => {
        if(id !== undefined) {
            setSelectedChat(id);
        }
    }, [id !== undefined && id !== null]);

    const handleChatSelect = (chat: Chat) => {
        setSelectedChat(chat._id);
    }

    return (
        <>
            {selectedChat !== null ? (<ChatLog chatLogID={selectedChat}/>) : (<ChatSelector onClick={handleChatSelect}/>)}
        </>
    )
}

export default ChatPage;