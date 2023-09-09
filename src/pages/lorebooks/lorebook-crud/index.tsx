import { getConstructs, saveNewLorebook, updateLorebook } from "@/api/dbapi";
import { LoreEntry, Lorebook } from "@/classes/Lorebook";
import { useEffect, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";
import ReactSwitch from "react-switch";
import EntryCrud from "./entry-crud";
import { Construct } from "@/classes/Construct";

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
    const [bookGlobal, setLorebookGlobal] = useState<boolean>(false);
    const [bookConstructs, setLorebookConstructs] = useState<string[]>([]);
    const [bookEntries, setLorebookEntries] = useState<LoreEntry[]>([]);
    const [currentLorebook, setCurrentLorebook] = useState<Lorebook | null>(null);
    const [availableConstructs, setAvailableConstructs] = useState<Construct[]>([]);

    useEffect(() => {
        fetchConstructs();
    }, []);

    const fetchConstructs = async () => {
        getConstructs().then((constructs) => {
            setAvailableConstructs(constructs);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if(book) {
            setLorebookName(book.name);
            setLorebookImage(book.avatar);
            setLorebookDescription(book.description);
            setLorebookGlobal(book.global);
            setLorebookEntries(book.entries);
            setLorebookConstructs(book.constructs);
            setCurrentLorebook(book)
        }else{
            setLorebookImage('');
            setLorebookName('');
            setLorebookDescription('');
            setLorebookGlobal(false);
            setCurrentLorebook(null);
            setLorebookConstructs([]);
            setLorebookEntries([])
        }
    }, [book]);

    useEffect(() => {
        if(bookEntries.length === 0) return;
        handleLorebookUpdate();
    }, [bookEntries]);

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
        if(currentLorebook) {
            currentLorebook.name = bookName;
            currentLorebook.avatar = bookImage;
            currentLorebook.description = bookDescription;
            currentLorebook.global = bookGlobal;
            currentLorebook.entries = bookEntries;
            currentLorebook.constructs = bookConstructs;
            await updateLorebook(currentLorebook);
            if(onEdit === undefined) return;
            onEdit(currentLorebook);
        }else{
            const newLorebook = new Lorebook()
            newLorebook.name = bookName;
            newLorebook.avatar = bookImage;
            newLorebook.description = bookDescription;
            newLorebook.global = bookGlobal;
            newLorebook.entries = bookEntries;
            newLorebook.constructs = bookConstructs;
            await saveNewLorebook(newLorebook);
            setCurrentLorebook(newLorebook);
            if(onSave === undefined) return;
            onSave(newLorebook);
        }
    }

    const handleLorebookDelete = async () => {
        if(currentLorebook) {
            if(onDelete === undefined) return;
            onDelete(currentLorebook);
            setCurrentLorebook(null);
        }else{
            setLorebookImage('');
            setLorebookName('');
            setLorebookDescription('');
            setLorebookGlobal(false);
            setLorebookEntries([])
            setLorebookConstructs([]);
        }
    }

    const handleEntrySave = async (entry: LoreEntry) => {
        setLorebookEntries(prevEntries => {
            const updatedEntries = [...prevEntries];
            const index = updatedEntries.findIndex(e => e._id === entry._id);
            if (index !== -1) {
                updatedEntries[index] = entry;
            }
            return updatedEntries;
        });
    }

    const handleEntryDelete = async (entry: LoreEntry) => {
        setLorebookEntries(prevEntries => prevEntries.filter(e => e._id !== entry._id));
    }
    
    const handleEntryEdit = async (entry: LoreEntry) => {
        setLorebookEntries(prevEntries => {
            const updatedEntries = [...prevEntries];
            const index = updatedEntries.findIndex(e => e._id === entry._id);
            if (index !== -1) {
                updatedEntries[index] = entry;
            }
            return updatedEntries;
        });
    }

    return (
        <div className="gap-2 h-full overflow-y-auto flex flex-col">
            <div className="w-full h-full grid grid-cols-4 justify-start gap-2">
                <div className="col-span-1 flex flex-col gap-2 h-full text-left">
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
                    <div className="flex flex-col text-left h-1/6">
                        <label className="text-theme-text font-semibold">Global Lorebook</label>
                        <div className="themed-input flex flex-col items-center w-full overflow-y-auto">
                            <i className="text-sm">When flipped, this lorebook will be applied to all constructs.</i>
                            <ReactSwitch
                                checked={bookGlobal}
                                onChange={() => setLorebookGlobal(!bookGlobal)}
                                handleDiameter={30}
                                width={60}
                                uncheckedIcon={false}
                                checkedIcon={true}
                                id="discordMultiConstructMode"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col text-left h-1/6">
                        <label className="text-theme-text font-semibold">Selected Constructs</label>
                        <div className="themed-input flex flex-col items-center w-full h-5/6 overflow-y-auto">
                            <i className="text-sm">Select which constructs this lorebook will be applied to.</i>
                            <div className="flex flex-col gap-1 w-full">
                                {availableConstructs.map((construct, index) => {
                                    return (
                                        <div key={index} className="flex flex-row items-center justify-between w-full">
                                            <label htmlFor={construct._id}>{construct.name}</label>
                                            <input
                                                type="checkbox"
                                                id={construct._id}
                                                checked={bookConstructs.includes(construct._id)}
                                                onChange={(event) => {
                                                    if(event.target.checked) {
                                                        setLorebookConstructs(prevConstructs => [...prevConstructs, construct._id]);
                                                    }else{
                                                        setLorebookConstructs(prevConstructs => prevConstructs.filter(c => c !== construct._id));
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow-0 w-full h-1/6">
                        <div className="flex flex-row gap-1">
                            <button className="themed-button-pos w-1/2" onClick={handleLorebookUpdate}>Save</button>
                            <button className="themed-button-neg w-1/2" onClick={handleLorebookDelete}>{book !== null ? 'Delete' : 'Clear'}</button>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 flex flex-col gap-2 h-full w-full overflow-y-auto">
                    <h3 className="font-semibold">Entries</h3>
                    <button className="themed-button-pos w-full" onClick={() => setLorebookEntries([...bookEntries, new LoreEntry()])}>Add Entry</button>
                    {Array.isArray(bookEntries) && bookEntries.map((entry, index) => {
                        return (
                            <EntryCrud key={index} entry={entry} onSave={handleEntrySave} onDelete={handleEntryDelete} onEdit={handleEntryEdit}/>
                        );
                    })}
                </div>
            </div>
        </div>
    )
};
export default LorebookCrud;