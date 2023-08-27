import { deleteChat, getChats, getConstructs, saveNewChat } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import ConstructProfile from "@/components/construct-profile";
import { useEffect, useState } from "react";
import ChatDetails from "./chat-details";
interface ChatSelectorProps {
    onClick?: (chatID: Chat) => void;
}
const ChatSelector = (props: ChatSelectorProps) => {
    const { onClick } = props;
    const [chats, setChats] = useState<Chat[]>([]);
    const [constructs, setConstructs] = useState<Construct[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            await getChats().then((chats) => {
                setChats(chats);
            }).catch((err) => {
                console.error(err);
            });
        }
        const fetchConstructs = async () => {
            await getConstructs().then((constructs) => {
                setConstructs(constructs);
            }).catch((err) => {
                console.error(err);
            });
        }
        fetchConstructs();
        fetchChats();
    }, []);

    const handleConstructClick = (construct: Construct) => {
        const newChat = new Chat();
        newChat.addConstruct(construct._id);
        newChat.setChatName(`New Chat with ${construct.name}`);
        newChat.setChatType("DM");
        saveNewChat(newChat).then(() => {
            setChats(prevChats => [...prevChats, newChat]);
            if(onClick !== undefined) onClick(newChat);
        }).catch((err) => {
            console.error(err);
        });
    }

    const handleChatClick = (chat: Chat) => {
        if(onClick !== undefined) onClick(chat);
    }

    const handleChatDelete = async (chat: Chat) => {
        await deleteChat(chat._id);
        setChats(prevChats => prevChats.filter((prevChat) => prevChat._id !== chat._id));
    }

    return (
        <div className="grid grid-rows-3 w-11/12 h-[calc(95vh-70px)] gap-4 m-auto mt-4">
            <div className="row-span-1 w-full min-h-fit flex flex-col themed-root shrink-0">
                <h3 className="h-1/6">Constructs</h3>
                <div className="flex flex-row w-full h-5/6 gap-4">
                    {Array.isArray(constructs) && constructs.map((construct) => {
                        return (
                            <ConstructProfile key={construct._id} character={construct} onClick={handleConstructClick}/>
                        )
                    }
                    )}
                </div>
            </div>
            <div className="row-span-2 w-full h-full flex flex-col themed-root shrink-0 overflow-y-auto">
                <h3 className="">Chats</h3>
                <div className="flex flex-col w-full gap-4">
                    {Array.isArray(chats) && chats.map((chat) => {
                        return (
                            <ChatDetails key={chat._id} chat={chat} onClick={handleChatClick} onDelete={handleChatDelete}/>
                        )
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatSelector;