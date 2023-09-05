import { saveNewLorebook, updateLorebook } from "@/api/dbapi";
import { Lorebook } from "@/classes/Lorebook";
import StringArrayEditorCards from "@/components/string-array-editor-cards";
import { useEffect, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";

interface LorebookCrudProps {
    book: Lorebook | null;
    onSave?: (book: Lorebook) => void;
    onEdit?: (book: Lorebook) => void;
    onDelete?: (book: Lorebook) => void;
}

const LorebookCrud = (props: LorebookCrudProps) => {
    const { book, onSave, onDelete, onEdit } = props;
    const [bookName, setLorebookName] = useState<string>('');
    const [bookImage, setLorebookImage] = useState<string>('');
    const [bookDescription, setLorebookDescription] = useState<string>('');
    const [currentLorebook, setCurrentLorebook] = useState<Lorebook | null>(null);

    useEffect(() => {
        if(book) {
            setLorebookName(book.name);
            setLorebookImage(book.avatar);
            setCurrentLorebook(book)
        }else{
            setLorebookImage('');
            setLorebookName('');
        }
    }, [book]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLorebookImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleLorebookUpdate = async () => {
        if(book) {
            book.name = bookName;
            book.avatar = bookImage;
            await updateLorebook(book);
            if(onEdit === undefined) return;
            onEdit(book);
        }else{
            const newLorebook = new Lorebook()
            newLorebook.name = bookName;
            newLorebook.avatar = bookImage;
            await saveNewLorebook(newLorebook);
            setCurrentLorebook(newLorebook);
            if(onSave === undefined) return;
            onSave(newLorebook);
        }
    }

    const handleLorebookDelete = async () => {
        if(book) {
            if(onDelete === undefined) return;
            onDelete(book);
            setCurrentLorebook(null);
        }else{
            setLorebookImage('');
            setLorebookName('');
        }
    }

    const makeCurrentLorebook = async () => {
        if(currentLorebook !== null) {
            localStorage.setItem('currentLorebook', JSON.stringify(currentLorebook._id));
        }
    }

    return (
        <div className="gap-2 h-full overflow-y-auto flex flex-col">
            <div className="w-full h-full grid grid-cols-4 justify-start gap-4">
                <div className="col-span-1 flex flex-col gap-4 h-full text-left">
                    <div className="flex flex-col items-center justify-center h-1/6 mt-4">
                        <label htmlFor="image-upload">
                            {bookImage === '' ? <RiQuestionMark className="book-image-default"/> : <img src={bookImage} alt={bookName} className="book-image"/>}
                        </label>
                        <input 
                            type="file" 
                            required={true}
                            id="image-upload" 
                            className="hidden" 
                            accept=".png, .jpg, .jpeg"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="flex flex-col w-full h-1/12">
                        <label htmlFor="book-role" className="font-semibold">Name</label>
                        <input
                            type="text"
                            required={true}
                            id="book-name"
                            className="themed-input w-full"
                            value={bookName}
                            onChange={(event) => setLorebookName(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-grow-0 w-full h-1/6">
                        <label htmlFor="book-role" className="font-semibold">Description</label>
                        <textarea
                            required={false}
                            id="book-role"
                            className="themed-input w-full h-full"
                            value={bookDescription}
                            onChange={(event) => setLorebookDescription(event.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-grow-0 w-full h-1/6">
                        <div className="flex flex-row gap-1 h-1/2">
                            <button className="themed-button-pos w-1/2" onClick={handleLorebookUpdate}>Save</button>
                            <button className="themed-button-neg w-1/2" onClick={handleLorebookDelete}>{book !== null ? 'Delete' : 'Clear'}</button>
                        </div>
                        {currentLorebook !== null ? (
                            <button className="themed-button-pos w-full h-1/2" onClick={makeCurrentLorebook}>Set as Current Lorebook</button>
                        ) : null}
                    </div>
                </div>
                <div className="col-span-3 flex flex-col gap-4 h-full w-full text-left">
                </div>
            </div>
        </div>
    )
};
export default LorebookCrud;