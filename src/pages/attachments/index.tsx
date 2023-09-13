import { deleteAttachment, getAttachments } from "@/api/dbapi";
import { Attachment } from "@/classes/Attachment";
import Loading from "@/components/loading";
import { Download, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

const AttachmentsPage = () => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
    useEffect(() => {
        fetchAttachments().then(() => {
            setIsLoaded(true);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const fetchAttachments = async () => {
        const retrievedAttachments = await getAttachments();
        setAttachments(retrievedAttachments);
    }
    
    const getAttachmentData = (attachment: Attachment) => {
        if(attachment.data !== undefined){
            let dataString = "";
            switch(attachment.fileext){
                case "png":
                case "jpg":
                case "jpeg":
                case "gif":
                case "webp":
                case "svg":
                    dataString = `data:image/${attachment.fileext};base64,${attachment.data}`;
                    break;
                case "mp4":
                case "webm":
                case "ogg":
                    dataString = `data:video/${attachment.fileext};base64,${attachment.data}`;
                    break;
                case "mp3":
                case "wav":
                case "flac":
                    dataString = `data:audio/${attachment.fileext};base64,${attachment.data}`;
                    break;
                default:
                    dataString = `data:application/${attachment.fileext};base64,${attachment.data}`;
                    break;
            }
            return dataString;
        }else{
            return undefined;
        }
    }

    const handleDownload = (attachment: Attachment) => {
        if(attachment.data === undefined) return;
        const element = document.createElement("a");
        const file = new Blob([attachment.data], {type: `application/${attachment.fileext}`});
        element.href = URL.createObjectURL(file);
        element.download = `${attachment.name}`;
        document.body.appendChild(element);
        element.click();
    }

    const handleDelete = (attachment: Attachment) => {
        if(attachment.data === undefined) return;
        if(!confirm(`Are you sure you want to delete ${attachment.name}?`)) return;
        deleteAttachment(attachment._id).then(() => {
            let newAttachments = attachments.filter((att) => {
                return att._id !== attachment._id;
            });
            setAttachments(newAttachments);
        }).catch((err) => {
            console.error(err);
        });
    }

    const assembleMetadata = (attachment: Attachment) => {
        for(let key in attachment.metadata){
            if(attachment.metadata[key] === undefined) continue;
            if(attachment.metadata[key] === null) continue;
            if(attachment.metadata[key] === "") continue;
            return `${key}: ${attachment.metadata[key]}`;
        }
        return "";
    }

    if(!isLoaded) return (<Loading/>);
    
    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] overflow-y-auto overflow-x-hidden p-4">
            <div className="w-full h-full grid grid-cols-6 gap-2">
                {attachments.map((attachment) => {
                    if(attachment.data === undefined) return;
                    if(attachment.fileext === "png" || attachment.fileext === "jpg" || attachment.fileext === "jpeg" || attachment.fileext === "gif" || attachment.fileext === "webp" || attachment.fileext === "svg"){
                        return (
                            <div className="col-span-1 w-full h-full themed-root flex flex-col justify-center items-center gap-2 aspect-square">
                                <p className="text-center font-semibold">{attachment.name}</p>
                                <img src={getAttachmentData(attachment)} className="w-full h-full object-contain rounded-md"/>
                                <p>
                                    {assembleMetadata(attachment)}
                                </p>
                                <div className="grid grid-cols-2 gap-2 justify-center">
                                    <button onClick={() => handleDownload(attachment)} className="themed-button-pos" title="Download">
                                        <Download size={24} className="text-theme-text"/>
                                    </button>
                                    <button onClick={() => handleDelete(attachment)} className="themed-button-neg" title="Delete">
                                        <TrashIcon size={24} className="text-theme-text"/>
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    if(attachment.fileext === "mp4" || attachment.fileext === "webm" || attachment.fileext === "ogg"){
                        return (
                            <div className="col-span-1 w-full h-full themed-root flex flex-col justify-center items-center gap-2 aspect-square">
                                <p className="text-center font-semibold">{attachment.name}</p>
                                <video src={getAttachmentData(attachment)} className="w-full h-full object-contain" controls/>
                                <div className="grid grid-cols-2 gap-2 justify-center">
                                    <button onClick={() => handleDownload(attachment)} className="themed-button-pos" title="Download">
                                        <Download size={24} className="text-theme-text"/>
                                    </button>
                                    <button onClick={() => handleDelete(attachment)} className="themed-button-neg" title="Delete">
                                        <TrashIcon size={24} className="text-theme-text"/>
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    if(attachment.fileext === "mp3" || attachment.fileext === "wav" || attachment.fileext === "flac"){
                        return (
                            <div className="col-span-1 w-full h-full themed-root flex flex-col justify-center items-center gap-2">
                                <p className="text-center font-semibold">{attachment.name}</p>
                                <audio src={getAttachmentData(attachment)} className="w-full h-full object-contain" controls/>
                                <div className="grid grid-cols-2 gap-2 justify-center">
                                    <button onClick={() => handleDownload(attachment)} className="themed-button-pos" title="Download">
                                        <Download size={24} className="text-theme-text"/>
                                    </button>
                                    <button onClick={() => handleDelete(attachment)} className="themed-button-neg" title="Delete">
                                        <TrashIcon size={24} className="text-theme-text"/>
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="col-span-1 w-full h-full themed-root flex flex-col justify-center items-center gap-2">
                            <p className="text-center font-semibold">{attachment.name}</p>
                            <p className="text-center">{attachment.fileext}</p>
                            <div className="grid grid-cols-2 gap-2 justify-center">
                                <button onClick={() => handleDownload(attachment)} className="themed-button-pos" title="Download">
                                    <Download size={24} className="text-theme-text"/>
                                </button>
                                <button onClick={() => handleDelete(attachment)} className="themed-button-neg" title="Delete">
                                    <TrashIcon size={24} className="text-theme-text"/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default AttachmentsPage;