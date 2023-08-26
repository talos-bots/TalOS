import { useEffect, useState } from "react";
import ChatLog from "./chat-log";
import { useParams } from "react-router-dom";
import ChatSelector from "./chat-selector";

const ChatPage = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    useEffect(() => {
        if(id !== undefined) {
            setSelectedChat(id);
        }
    }, [id !== undefined && id !== null]);

    return (
        <>
            {selectedChat !== null ? (<ChatLog chatLogID={selectedChat}/>) : (<ChatSelector/>)}
        </>
    )
}

export default ChatPage;