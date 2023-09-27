import { getImageURL } from "@/api/baseapi";
import { getConstruct } from "@/api/dbapi";
import { Attachment } from "@/classes/Attachment";
import { Message } from "@/classes/Message";
import { EditIcon, File, RefreshCw, Split, TrashIcon } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
    message: Message;
    onDelete?: (messageID: string) => void;
    onEdit?: (messageID: string, newText: string) => void;
    onRegenerate?: (messageID: string, messageText: string) => void;
    onSplit?: (messageID: string) => void;
    onUserRegenerate?: (messageID: string, messageText: string) => void;
    style?: React.CSSProperties;
    className?: string;
}

export function getFormattedTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds} ${date.toLocaleDateString()}`;
}

const MessageComponent = ({ message, onDelete, onEdit, onRegenerate, onSplit, onUserRegenerate, style, className }: Props) => {
    const [text, setText] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [userID, setUserID] = useState<string>("");
    const [isHuman, setIsHuman] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [origin, setOrigin] = useState<string>("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

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
        <div className={`themed-message slide-in-bottom-message ${className} ${isDeleted && 'slide-out-left'}`}>
            <div className="flex flex-col">
                <div className="flex flex-row items-center">
                    <div className="flex flex-row items-center w-full gap-2">
                        <div className="flex items-center justify-center">
                            {(message.avatar.length > 0 ? <img src={getImageURL(message.avatar)} alt="avatar" className="themed-message-avatar" /> : <RiQuestionMark className="themed-message-avatar" size={'2rem'}/>)}
                        </div>
                        <div className="themed-message-info text-theme-italic">{!message.isThought? user : `${user}'s thoughts (Internal)`} {getFormattedTime(time)} {message?.emotion ? `(${message.emotion})` : null}</div>
                        <div className="flex flex-col pt-6 w-full">
                            {isEditing ? (
                                <TextareaAutosize
                                    className="m-0 bg-transparent text-theme-text h-auto py-1 rounded-lg border-2 border-gray-500 box-border resize-none overflow-y-auto w-full min-w-full"
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
                                            className='message-text m-0 h-auto py-1 box-border resize-none overflow-y-auto min-w-full'
                                            components={{
                                                em: ({ node, ...props }) => <i className="text-theme-italic" {...props} />,
                                                code: ({ node, ...props }) => <code {...props} />,
                                            }}
                                        >
                                            {message.text}
                                        </ReactMarkdown>
                                )}
                            </div>)}
                            <div className="flex flex-row gap-2">
                                {attachments.map((attachment, index) => {
                                    let newData = attachment.data;
                                    if(attachment.type === "image/png" && !attachment.data.startsWith("/api")) {
                                        newData = "data:image/png;base64," + newData;
                                    } else if(attachment.type === "image/jpeg" && !attachment.data.startsWith("/api")) {
                                        newData = "data:image/jpeg;base64," + newData;
                                    } else if(attachment.type === "image/gif" && !attachment.data.startsWith("/api")) {
                                        newData = "data:image/gif;base64," + newData;
                                    } else if(attachment.type === "image/webp" && !attachment.data.startsWith("/api")) {
                                        newData = "data:image/webp;base64," + newData;
                                    }else if(!attachment.data.startsWith("http") && !attachment.data.startsWith("/api")){
                                        newData = `data:${attachment.type};base64,` + newData;
                                    }else{
                                        newData = attachment.data;
                                    }
                                    console.log(newData);
                                    if(attachment.type === "image/png" || attachment.type === "image/jpeg" || attachment.type === "image/gif" || attachment.type === "image/webp"){
                                        return (
                                            <div key={index}>
                                                <img className="w-1/2 object-cover rounded-md"src={getImageURL(newData)} alt={attachment?.metadata?.caption ? attachment?.metadata?.caption : 'A Photo'} title={attachment?.metadata?.caption ? attachment?.metadata?.caption : 'A Photo'}/>
                                            </div>
                                        )
                                    }else{
                                        return (
                                            <div key={index}>
                                                <a href={newData} download={attachment.name}><File size={'3rem'} />{attachment.name}</a>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="flex flex-row text-xs top-3 absolute right-2 italic gap-1">
                            {isTyping === false && (
                                <>
                                {isHuman ? 
                                    <button className="message-button"
                                        title="Regenerate"
                                        onClick={() => {
                                            if(onUserRegenerate === undefined) return;
                                            onUserRegenerate(message._id, message.text)
                                        }}>
                                        <RefreshCw size={'1rem'} />
                                    </button>
                                : 
                                    <button className="message-button"
                                        title="Regenerate"
                                        onClick={() => {
                                            if(onRegenerate === undefined) return;
                                            onRegenerate(message._id, message.text)
                                        }}>
                                        <RefreshCw size={'1rem'} />
                                    </button>
                                }
                                <button className="message-button"
                                    title="New Chat from this message"
                                    onClick={() => {
                                        if(onSplit === undefined) return;
                                        onSplit(message._id);
                                    }}
                                    >
                                    <Split size={'1rem'} />
                                </button>
                                <button className="message-button"
                                    title="Edit"
                                    onClick={() => {
                                        handleEditMessage(null)
                                    }}
                                >
                                    <EditIcon size={'1rem'} />
                                </button>
                                <button className="message-button"
                                    title="Delete"
                                    onClick={async () => {
                                        setIsDeleted(true);
                                        await new Promise(r => setTimeout(r, 500));
                                        if(onDelete === undefined) return;
                                        onDelete(message._id);
                                    }}
                                >
                                    <TrashIcon size={'1rem'} />
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MessageComponent;