import { deleteChat, getChat, getChats, getConstructs, saveNewChat } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import ConstructProfile from "@/components/construct-profile";
import { useEffect, useState } from "react";
import ChatDetails from "./chat-details";
import Loading from "@/components/loading";
import { Link } from "react-router-dom";
import { PlusIcon, RefreshCcw } from "lucide-react";
import { AiOutlineUpload } from "react-icons/ai";
import { getActiveConstructList } from "@/api/constructapi";
import { removeAllMemories } from "@/api/vectorapi";
import ChatSettings from "./chat-settings";
import ChatConfigMain from "./chat-config-main";
interface ChatSelectorProps {
    onClick?: (chatID: Chat) => void;
}
const ChatSelector = (props: ChatSelectorProps) => {
    const { onClick } = props;
    const [chats, setChats] = useState<Chat[]>([]);
    const [constructs, setConstructs] = useState<Construct[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [activeConstructs, setActiveConstructs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredChats = chats ? chats.filter((chat) => {
        return Object.values(chat).some((value) =>
          value && 
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
    }) : [];

    useEffect(() => {
        fetchInfo().then(() => {
            setIsLoaded(true);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const fetchInfo = async () => {
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
        getChat('activePool').then((chat) => {
            if(chat === null) throw new Error("Chat not found");
            setActiveChat(chat);
        }).catch((err) => {
            console.error(err);
        });
        getActiveConstructList().then((constructs) => {
            setActiveConstructs(constructs);
        }).catch((err) => {
            console.error(err);
        });
        await Promise.all([fetchChats(), fetchConstructs()]);
    }

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

    const handleChatDoubleClick = (chat: Chat) => {
        if(onClick !== undefined) onClick(chat);
    }

    const handleChatClick = (chat: Chat) => {
        setSelectedChat(chat);
    }

    const handleChatDelete = async (chat: Chat) => {
        await deleteChat(chat._id);
        setChats(prevChats => prevChats.filter((prevChat) => prevChat._id !== chat._id));
        if(chat.doVector){
            if(chat.global){
                for(let i = 0; i < chat.constructs.length; i++){
                    const construct = chat.constructs[i];
                    removeAllMemories(construct).then(() => {
                        console.log("Removed all memories");
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            }else{
                removeAllMemories(chat._id).then(() => {
                    console.log("Removed all memories");
                }).catch((err) => {
                    console.error(err);
                });
            }
        }
    }

    const handleImportChat = async (files: FileList | null) => {
        if(files === null) return;
        for(let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = async (e) => {
                if(e.target === null) return;
                const result = e.target.result;
                if(typeof result !== "string") return;
                const chat = JSON.parse(result);
                await saveNewChat(chat);
                setChats(prevChats => [...prevChats, chat]);
            }
            reader.readAsText(file);
        }
    }

    if(!isLoaded) return (<Loading/>);

    return (
        <div className="grid grid-rows-3 w-full p-4 h-[calc(100vh-70px)] max-[h-[calc(100vh-70px)]] gap-2 grow-0 lg:gap-4 lg:p-6">
          <div className="row-span-1 themed-root grow-0 overflow-x-hidden slide-in-top lg:flex lg:flex-col lg:space-x-4">
            <h3 className="font-semibold lg:text-xl">Constructs</h3>
            <div className="flex flex-row w-full max-w-full h-5/6 gap-2 overflow-x-auto grow-0 lg:gap-2">
              <Link
                className="themed-root-no-padding w-36 h-48 flex flex-col justify-center items-center cursor-pointer relative shrink-0 grow-0 lg:w-[calc(100% - 2rem)] lg:h-[calc(100%)]"
                to={"/constructs/new"}
              >
                <div className="absolute inset-0 bg-themed-root hover:bg-theme-hover-pos flex items-center justify-center rounded-theme-border-radius">
                  <span className="text-theme-text text-2xl font-bold justify-center items-center align-middle flex flex-col lg:text-2xl">
                    New Construct
                    <br />
                    <PlusIcon size={`4rem`} className="text-theme-text lg:text-4xl" />
                  </span>
                </div>
              </Link>
              {Array.isArray(constructs) && constructs.sort((a, b) => {
                // Check if either construct is active
                const aIsActive = activeConstructs.includes(a._id);
                const bIsActive = activeConstructs.includes(b._id);

                // If both constructs are either active or inactive, sort by name
                if (aIsActive === bIsActive) {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    }
                    return 0;  // <-- Ensures a number is returned in all scenarios
                }
                // If only one of the constructs is active, prioritize it
                if (aIsActive) return -1;
                return 1;  // If only `b` is active or any other case not caught above
              }).map((construct) => {
                if (activeConstructs.includes(construct._id)) {
                  return <ConstructProfile key={construct._id} character={construct} onClick={handleConstructClick} active />
                } else {
                  return <ConstructProfile key={construct._id} character={construct} onClick={handleConstructClick} />
                }
              })}
            </div>
          </div>
          <div className="row-span-2 grid grid-cols-4 grow-0 gap-2 lg:gap-4 lg:grid-cols-6">
            <div className="col-span-2 flex flex-col themed-root overflow-y-auto slide-in-left lg:col-span-3">
              <h3 className="font-semibold lg:text-2xl">Chats</h3>
              <div className="h-11/12">
                <div className="grid grid-cols-12 gap-1 w-full grow-0 shrink-0 mb-2 lg:gap-2 lg:grid-cols-16">
                  <label htmlFor="character-image-input" className="themed-button-pos flex items-center justify-center col-span-1" data-tooltip="Import Chat" id="importChat">
                    <AiOutlineUpload className='absolute' size={`2.5rem`} />
                  </label>
                  <input
                    type="file"
                    accept="application/json"
                    id="character-image-input"
                    onChange={(e) => handleImportChat(e.target.files)}
                    style={{ display: 'none' }}
                    multiple={true}
                  />
                  <button className="themed-button-pos col-span-1 flex items-center justify-center" onClick={() => fetchInfo()} data-tooltip="Refresh Chats" id="refreshChats">
                    <RefreshCcw size={`2.5rem`} />
                  </button>
                  <div className="construct-search-bar col-span-2 lg:col-span-3">
                    <input
                      type="text"
                      placeholder="Search Chats"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="lg:text-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full gap-2 overflow-y-auto h-13/14 grow-0 shrink-0">
                  {activeChat !== null && (<ChatDetails key={'activePool'} chat={activeChat} onDoubleClick={handleChatDoubleClick} onClick={handleChatClick} onDelete={handleChatDelete} disabled selected={(activeChat?._id === selectedChat?._id)} />)}
                  {Array.isArray(filteredChats) && filteredChats.sort((a, b) => b.lastMessageDate - a.lastMessageDate).filter((chat) => { return chat._id !== 'activePool' }).map((chat) => {
                    return (
                      <ChatDetails key={chat._id} chat={chat} onDoubleClick={handleChatDoubleClick} onClick={handleChatClick} onDelete={handleChatDelete} selected={(chat?._id === selectedChat?._id)} />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-2 max-h-full overflow-y-auto overflow-x-hidden lg:gap-4">
              <div className="row-span-1 themed-root flex flex-col max-h-full slide-in-right overflow-y-auto lg:h-full">
                <h3 className="font-semibold lg:text-2xl">Chatting Settings</h3>
                <ChatSettings  />
              </div>
              <div className="row-span-1 themed-root flex flex-col max-h-full slide-in-right overflow-y-auto lg:h-full">
                <h3 className="font-semibold lg:text-2xl">Selected Chat Details</h3>
                {selectedChat !== null && (<ChatConfigMain chat={selectedChat} />)}
              </div>
            </div>
          </div>
        </div>
      )      
}

export default ChatSelector;