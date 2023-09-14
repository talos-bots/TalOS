import { deleteAttachment, getAttachments, getStorageValue } from "@/api/dbapi";
import { Attachment } from "@/classes/Attachment";
import Loading from "@/components/loading";
import { ArrowBigLeft, ArrowBigRight, Download, RefreshCcw, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

const AttachmentsPage = () => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageCols, setPageCols] = useState<number>(6);
    const [numAttachmentsPerPage, setNumAttachmentsPerPage] = useState<number>(pageCols * 3);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
    const [currentAttachments, setCurrentAttachments] = useState<Attachment[]>([]);
    const [search, setSearch] = useState<string>("");

    const assembleMetadata = (attachment: Attachment) => {
        for(let key in attachment.metadata){
            if(attachment.metadata[key] === undefined) continue;
            if(attachment.metadata[key] === null) continue;
            if(attachment.metadata[key] === "") continue;
            return `${key}: ${attachment.metadata[key]}`;
        }
        return "";
    }

    const filteredAttachments = attachments.filter((attachment) => {
        if(attachment.name.toLowerCase().includes(search.toLowerCase())) return true;
        if(attachment.fileext !== undefined){
            if(attachment.fileext.toLowerCase().includes(search.toLowerCase())) return true;
        }
        if(attachment.metadata !== undefined){
            for(let key in attachment.metadata){
                if(attachment.metadata[key] === undefined) continue;
                if(attachment.metadata[key] === null) continue;
                if(attachment.metadata[key] === "") continue;
                if(assembleMetadata(attachment).toLowerCase().includes(search.toLowerCase())) return true;
            }
        }
        return false;
    });

    const numberOfPages = Math.ceil(filteredAttachments.length / numAttachmentsPerPage);

    const currentAttachmentsStart = (page - 1) * numAttachmentsPerPage;
    const currentAttachmentsEnd = page * numAttachmentsPerPage;

    useEffect(() => {
        fetchPageSettings();
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
    
    const fetchPageSettings = async () => {
        const retrievedPageCols = parseInt(await getStorageValue("attachmentsPageCols"));
        const retrievedNumAttachmentsPerPage = parseInt(await getStorageValue("attachmentsNumAttachmentsPerPage"));
        if(retrievedPageCols !== null) setPageCols(retrievedPageCols);
        if(retrievedNumAttachmentsPerPage !== null) setNumAttachmentsPerPage(retrievedNumAttachmentsPerPage);
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
        }
        return attachment.data;
    }

    const handleDownload = (attachment: Attachment) => {
        if(attachment.data === undefined) return;
    
        let dataString = getAttachmentData(attachment);
        if (!dataString) return;
    
        // Removing the data URL scheme to get only base64 data
        const base64Data = dataString.split(",")[1];
        if (!base64Data) return;
    
        // Decoding base64 data
        const decodedData = atob(base64Data);
    
        // Converting decoded base64 string to a Uint8Array to create a Blob
        const uint8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
            uint8Array[i] = decodedData.charCodeAt(i);
        }
    
        // The rest of your code
        let mimetype = "";
        if(attachment.fileext === undefined) return;
        switch(attachment.fileext){
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "webp":
            case "svg":
                mimetype = `image/${attachment.fileext}`;
                break;
            case "mp4":
            case "webm":
            case "ogg":
                mimetype = `video/${attachment.fileext}`;
                break;
            case "mp3":
            case "wav":
            case "flac":
                mimetype = `audio/${attachment.fileext}`;
                break;
            default:
                mimetype = `application/${attachment.fileext}`;
                break;
        }
        const file = new Blob([uint8Array], {type: mimetype});
        const element = document.createElement("a");
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

    if(!isLoaded) return (<Loading/>);
    
    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] overflow-y-auto overflow-x-hidden p-4 gap-2">
            <div className="w-full themed-root">
                <h3 className="font-semibold">Attachments</h3>
                <p className="text-left">Here you can view all of the attachments sent to the bot by you, discord users, and those images generated by SD, and download them. You can also delete them, but be careful, as this is permanent.</p>
                <div className="flex flex-row gap-1">
                    <input type="number" className="themed-input w-16" max={12} min={1} placeholder="Columns" title="Page Columns" value={pageCols} onChange={(e) => setPageCols(parseInt(e.target.value))}/>
                    <input type="number" className="themed-input w-16" max={pageCols * 3} min={1} placeholder="Items per page" title="Items per page" value={numAttachmentsPerPage} onChange={(e) => setNumAttachmentsPerPage(parseInt(e.target.value))}/>
                    <input type="text" className="themed-input flex-grow" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button className="themed-button-pos" onClick={() => fetchAttachments()} title="Refresh Attachments"><RefreshCcw size={26}/></button>
                    <button className="themed-button-pos" onClick={() => {page > 1 && setPage(page - 1)}} title="Previous Page"><ArrowBigLeft size={26}/></button>
                    <input type="number" className="themed-input w-16" max={numberOfPages} min={1} placeholder="Page" title="Current Page" value={page} onChange={(e) => setPage(parseInt(e.target.value))}/>
                    <button className="themed-button-pos" onClick={() => {page < numberOfPages && setPage(page + 1)}} title="Next Page"><ArrowBigRight size={26}/></button>
                </div>
            </div>
            <div className={`w-full h-11/12 grid grid-cols-${pageCols} gap-2`}>
                {filteredAttachments.slice(currentAttachmentsStart, currentAttachmentsEnd).map((attachment) => {
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