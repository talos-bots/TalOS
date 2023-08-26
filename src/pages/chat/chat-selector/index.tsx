import { getChats, getConstructs } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import ConstructProfile from "@/components/construct-profile";
import { useEffect, useState } from "react";

const ChatSelector = () => {
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
    return (
        <div className="grid grid-rows-4 w-full h-[calc(100vh-70px)]">
            <div className="row-span-1 w-full h-full flex flex-col">
                <h3>Chats</h3>
                <div className="flex flex-row w-full h-full gap-4">
                    {Array.isArray(constructs) && constructs.map((construct) => {
                        return (
                            <ConstructProfile key={construct._id} character={construct}/>
                        )
                    }
                    )}
                </div>
            </div>
            <div className="row-span-3 w-full h-full flex flex-col">
            </div>
        </div>
    )
}

export default ChatSelector;