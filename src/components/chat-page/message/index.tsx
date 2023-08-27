import { getConstruct } from "@/api/dbapi";
import { Attachment } from "@/classes/Attachment";
import { Message } from "@/classes/Message";
import { EditIcon, RefreshCw, TrashIcon } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
    message: Message;
    onDelete?: (messageID: string) => void;
    onEdit?: (messageID: string, newText: string) => void;
    onRegenerate?: (messageID: string, messageText: string) => void;
}

export function getFormattedTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds} ${date.toLocaleDateString()}`;
}

const MessageComponent = ({ message, onDelete, onEdit, onRegenerate }: Props) => {
    const [text, setText] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [userID, setUserID] = useState<string>("");
    const [isHuman, setIsHuman] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [origin, setOrigin] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    useEffect(() => {
        if(message === undefined || message === null) return;
        const init = async () => {
            let isLoading = message.text.includes("Loading...");
            setIsTyping(isLoading);
            setText(message.text);
            setUser(message.user);
            setUserID(message.userID);
            setIsHuman(message.isHuman);
            setTime(message.timestamp);
            setOrigin(message.origin);
            setAttachments(message.attachments);
            if(message.isHuman === false) {
                let construct = await getConstruct(message.userID);
                if(construct === null) return;
                setAvatar(construct.avatar);
            }
            if(message.isHuman === true) {
                if(message.avatar === undefined || message.avatar === null) return;
                if(message.avatar.length === 0) return;
                setAvatar(message.avatar);
            }
        };
        init();
    }, [message]);

    useEffect(() => {
        if(message === undefined || message === null) return;
        if(isTyping === false) return;
        setIsTyping(false);
    }, [message.text]);

    const editedMessageRef = useRef<HTMLTextAreaElement>(null);

    if(message === undefined || message === null) return null;

    const handleEditMessage = (event: any) => {
        if(editedMessageRef.current !== null) {
            editedMessageRef.current.focus();
        }
        if(isEditing === true){
            setIsEditing(false);
            if(onEdit === undefined) return;
            onEdit(message._id, text);
            return;
        }
        setIsEditing(true);
    };

    function handleMessageKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            if(onEdit === undefined) return;
            onEdit(message._id, text);
            setIsEditing(false);
        }
    }

    const handleTextEdit = (newText: string) => {
        setText(newText);
        setIsEditing(false);
        if(onEdit === undefined) return;
        onEdit(message._id, newText);
    };

    return (
        <div className="themed-message pop-in">
            <div className="flex flex-col">
                <div className="flex flex-row items-center">
                    <div className="flex flex-row items-center w-full gap-2">
                        <div className="themed-message-avatar flex items-center justify-center">
                            {(avatar.length > 0 ? <img src={avatar} alt="avatar" className="themed-message-avatar" /> : <RiQuestionMark size={30}/>)}
                        </div>
                        <div className="themed-message-info">{user} {getFormattedTime(time)}</div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="flex flex-row text-xs top-3 absolute right-2 italic gap-1">
                            {isTyping === false && (
                                <>
                                {isHuman ? null : 
                                    <button className="message-button" 
                                        onClick={() => {
                                            if(onRegenerate === undefined) return;
                                            setIsTyping(true)
                                            onRegenerate(message._id, message.text)
                                        }}>
                                        <RefreshCw size={14} />
                                    </button>
                                }
                                <button className="message-button"
                                    onClick={() => {
                                        handleEditMessage(null)
                                    }}
                                >
                                    <EditIcon size={14} />
                                </button>
                                <button className="message-button"
                                    onClick={() => {
                                        if(onDelete === undefined) return;
                                        onDelete(message._id);
                                    }}
                                >
                                    <TrashIcon size={14} />
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    {isEditing ? (
                        <TextareaAutosize
                            className="m-0 bg-transparent text-theme-text h-auto py-1 rounded-lg border-2 border-gray-500 box-border resize-none overflow-y-auto w-[42.5rem] min-w-full"
                            style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.411)' }}
                            onBlur={(e) => handleTextEdit(e.target.value)}
                            onKeyDown={(e) => handleMessageKeyDown(e)}
                            ref={editedMessageRef}
                            defaultValue={message.text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    ) : (
                    <div onDoubleClick={(event) => handleEditMessage(event)}>
                        {isTyping ? (
                            <>
                                <div className="loading">
                                    <div className="loading__letter">.</div>
                                    <div className="loading__letter">.</div>
                                    <div className="loading__letter">.</div>
                                </div>
                            </>
                            ) : (
                                <ReactMarkdown 
                                    className='message-text m-0 font-sans text-base h-auto py-1 box-border resize-none overflow-y-auto min-w-full'
                                    components={{
                                        em: ({ node, ...props }) => <i style={{ color: "var(--theme-text-italic)" }} {...props} />,
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                        )}
                    </div>)}
                    <div className="flex flex-row gap-2">
                        {attachments.map((attachment, index) => {
                            return (
                                <div key={index} className="w-16 h-16 rounded-md bg-gray-300"></div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MessageComponent;