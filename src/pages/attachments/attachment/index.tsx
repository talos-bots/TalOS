import { Attachment } from "@/classes/Attachment";
import { Download, TrashIcon } from "lucide-react";
import { useState } from "react";
interface AttachmentComponentProps {
    attachment: Attachment;
    handleDelete: (attachment: Attachment) => void;
    handleDownload: (attachment: Attachment) => void;
    getAttachmentData: (attachment: Attachment) => string;
    assembleMetadata: (attachment: Attachment) => string;
}
const ImageAttachmentComponent = (props: AttachmentComponentProps) => {
    const { attachment, handleDelete, handleDownload, getAttachmentData, assembleMetadata } = props;
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    return (
        <div className={`col-span-1 w-full h-full themed-root flex flex-col justify-center items-center gap-2 flex-grow-0 aspect-square ${isDeleted? 'pop-out': 'slide-in-left'}`}>
            <p className="text-center font-semibold">{attachment.name}</p>
            <img src={getAttachmentData(attachment)} className="w-full h-full object-contain rounded-theme-border-radius bg-theme-box border-theme-border-width border-theme-border"/>
            <p>
                {assembleMetadata(attachment)}
            </p>
            <div className="grid grid-cols-2 gap-2 justify-center">
                <button onClick={() => handleDownload(attachment)} className="themed-button-pos" title="Download">
                    <Download size={'1.5rem'} className="text-theme-text"/>
                </button>
                <button 
                    onClick={async () => 
                        {   setIsDeleted(true);
                            await new Promise(r => setTimeout(r, 700)); 
                            handleDelete(attachment)
                        }
                    } 
                    className="themed-button-neg" title="Delete"
                    >
                    <TrashIcon size={'1.5rem'} className="text-theme-text"/>
                </button>
            </div>
        </div>
    );
}
export default ImageAttachmentComponent;