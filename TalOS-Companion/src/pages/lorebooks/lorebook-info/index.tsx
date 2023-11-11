import { getImageURL } from "../../../api/baseapi";
import { Lorebook } from "../../../classes/Lorebook";
import { confirmModal } from "../../../components/confirm-modal";
import { Book, Download, TrashIcon } from "lucide-react";

interface LorebookInfoProps {
    book: Lorebook | null;
    onClick?: (book: Lorebook | null) => void;
    onEdit?: (book: Lorebook) => void;
    onDelete?: (book: Lorebook) => void;
}

const LorebookInfo = (props: LorebookInfoProps) => {
    const { book, onClick, onDelete, onEdit } = props;

    const exportAsJSON = () => {
        if(book === null) return;
        const json = JSON.stringify(book);
        const element = document.createElement("a");
        const file = new Blob([json], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${book.name}.json`;
        document.body.appendChild(element);
        element.click();
    }

    return (
        <div className="themed-box-no-padding w-full flex flex-row justify-start p-1 items-center gap-2" onClick={()=> {if(onClick !== undefined) onClick(book ? book : null)}}>
            <div className="grid grid-cols-3 gap-6 w-2/3 justify-start items-center">
                <div className="flex items-center justify-center">
                    {book?.avatar ? (<img src={getImageURL(book.avatar)} className="themed-chat-avatar"/>) : (<Book size={36} className="themed-chat-avatar"/>)}
                </div>
                <p className="text-left">{book?.name ? book.name : 'New Lorebook'}</p>
            </div>
            <div className="flex flex-row gap-2 w-1/3 justify-end items-center">
                {book !== null ? (
                <>
                    <button 
                    className="message-button mr-4"
                        onClick={() => {
                            exportAsJSON();
                        }}
                    >
                        <Download size={'1rem'} />
                    </button>
                    <button className="message-button mr-4"
                        onClick={async () => {
                            if(onDelete === undefined) return;
                            if(book === null) return;
                            if(! await confirmModal(`Are you sure you want to delete ${book.name}?`)) return;
                            onDelete(book);
                        }}
                    >
                        <TrashIcon size={'1rem'} />
                    </button>
                </>
                ) : null}
            </div>
        </div>
    );
}
export default LorebookInfo;