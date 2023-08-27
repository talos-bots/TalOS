import { getConstruct, updateChat } from "@/api/dbapi";
import { Chat } from "@/classes/Chat";
import { Construct } from "@/classes/Construct";
import { getFormattedTime } from "@/components/chat-page/message";
import { on } from "events";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatDetailsProps {
    chat: Chat;
    onClick?: (chat: Chat) => void;
    onEdit?: (chat: Chat) => void;
    onDelete?: (chat: Chat) => void;
}
const ChatDetails = (props: ChatDetailsProps) => {
    const { chat, onClick, onDelete, onEdit } = props;
    const [name, setName] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [constructs, setConstructs] = useState<Construct[]>([]);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [groupAvatar, setGroupAvatar] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    const constructsRef = useRef<Construct[]>([]);  // to keep track of current state within async functions

    useEffect(() => {
        if(chat === undefined || chat === null) return;
    
        const init = async () => {
            setName(chat.name);
            let fetchedConstructs: Construct[] = [];
            for (let i = 0; i < chat.constructs.length; i++) {
                let construct = await getConstruct(chat.constructs[i]);
                if (!construct) {
                    console.error(`Failed to fetch data for construct with ID: ${chat.constructs[i]}`);
                    continue;
                }                
    
                if (!fetchedConstructs.some(existingConstruct => existingConstruct._id === construct._id)) {
                    fetchedConstructs.push(construct);
                }
            }
            constructsRef.current = fetchedConstructs; // update the ref
            setConstructs(fetchedConstructs); // update the state directly
        };
    
        init();
    }, [chat]);
    
    
    useEffect(() => {
        if (constructs.length === 0) return;
        let avatarList: string[] = [];
        for (let construct of constructs) {
            avatarList.push(construct.avatar);  // assuming `avatar` is the property name in Construct
        }
        setAvatars(avatarList);
    }, [constructs]);

    const saveModifiedChat = async () => {
        if (constructsRef.current.length === 0) return;
        let newChat = chat;
        newChat.name = name;
        await updateChat(newChat);
        onEdit?.(newChat);
    };

    useEffect(() => {
        const generateAvatar = async () => {
            const newGroupAvatar = await renderGroupAvatar();
            if (newGroupAvatar === null) return;
            if (newGroupAvatar === undefined) return;
            setGroupAvatar(newGroupAvatar);
        };
        generateAvatar();
    }, [avatars]);
    
    
    const loadImageFromBase64 = (base64: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (errorEvent) => {
                console.error('Failed to load an image', errorEvent);
                reject(new Error('Failed to load an image'));
            };
            img.src = `${base64}`;
        });
    };    

    const avatarSize = 24;  // The size of each avatar in the grid
    const avatarsPerRow = 2;  // The number of avatars in each row

    const renderGroupAvatar = async () => {
        const numAvatars = avatars.length;
        const canvas = document.createElement('canvas');
        canvas.width = avatarSize * avatarsPerRow;
        canvas.height = avatarSize * avatarsPerRow;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        // Load all images
        const images = await Promise.all(avatars.map(loadImageFromBase64));
    
        if (numAvatars === 1) {
            // If only one avatar, draw it maintaining the aspect ratio
            
            const imageAspect = images[0].width / images[0].height;
            const canvasAspect = canvas.width / canvas.height;
    
            let renderWidth, renderHeight, xOffset, yOffset;
    
            // If image is wider than the canvas in aspect ratio
            if (imageAspect > canvasAspect) {
                renderHeight = canvas.height;
                renderWidth = images[0].width * (renderHeight / images[0].height);
                xOffset = (canvas.width - renderWidth) / 2;
                yOffset = 0;
            } else {
                renderWidth = canvas.width;
                renderHeight = images[0].height * (renderWidth / images[0].width);
                xOffset = 0;
                yOffset = (canvas.height - renderHeight) / 2;
            }
            
            ctx.drawImage(images[0], xOffset, yOffset, renderWidth, renderHeight);
        } 
    
        // Create a temporary canvas for the circle mask
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;
        const tmpCtx = tmpCanvas.getContext('2d');
        if (!tmpCtx) return;
        const radius = canvas.width / 2;
        tmpCtx.beginPath();
        tmpCtx.arc(radius, radius, radius, 0, 2 * Math.PI);
        tmpCtx.clip();
        tmpCtx.drawImage(canvas, 0, 0);
    
        return tmpCanvas.toDataURL();
    };     

    const handleSave = () => {
        setIsEditing(false);
        saveModifiedChat();
    };

    useEffect(() => {
        if (isEditing && spanRef.current && inputRef.current) {
            inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
        }
    }, [isEditing]);    
    
    return (
        <div className="themed-box flex flex-col justify-start items-start" onDoubleClick={()=> {if(onClick !== undefined) onClick(chat)}}>
            <div className="flex flex-row items-center justify-start">
                <img src={groupAvatar} alt="Group Avatar" className="rounded-full" />
                {isEditing ? (
                    <input 
                        value={name}
                        ref={inputRef}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setName(newValue);
                            if (spanRef.current && inputRef.current) {
                                inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
                            }
                        }}                                                    
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSave();
                            }
                        }}
                        autoFocus
                        style={{ width: 'auto', minWidth: '30px' }} // a starting width
                        className="ml-2 themed-input" // This gives a little spacing between the avatar and the input
                    />
                ) : (
                    <>
                        <span ref={spanRef} className="ml-2">{name}</span>
                        <button onClick={() => setIsEditing(true)} className="ml-2">
                            <Edit2Icon size={18} />
                        </button>
                    </>
                )}
                <button className="message-button ml-2"
                    onClick={() => {
                        if(onDelete === undefined) return;
                        onDelete(chat);
                    }}
                >
                    <TrashIcon size={18} />
                </button>
                <div className="w-full flex flex-row items-center justify-end absolute right-4 gap-4">
                    <i className="text-theme-italic">({chat.lastMessage.origin})</i>
                    <i className="text-theme-italic">{chat.lastMessage.user}: {chat.lastMessage.text}</i>
                    <i className="text-theme-italic">{getFormattedTime(chat.lastMessage.timestamp)}</i>
                </div>
            </div>
        </div>
    );
     
}

export default ChatDetails;