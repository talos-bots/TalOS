import { Lorebook } from "@/classes/Lorebook";
import LorebookInfo from "./lorebook-info";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { deleteLorebook, getLorebooks, saveNewLorebook } from "@/api/dbapi";
import LorebookCrud from "./lorebook-crud";

const LorebooksPage = () => {
    const [lorebooks, setLorebooks] = useState<Lorebook[]>([]);
    const [selectedBook, setSelectedBook] = useState<Lorebook | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchLorebooks().then(() => {
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const fetchLorebooks = async () => {
        const newLorebooks = await getLorebooks();
        console.log(newLorebooks);
        if(Array.isArray(newLorebooks)){
            setLorebooks(newLorebooks);
        }
    }

    const onDelete = async (book: Lorebook) => {
        const newUsers = lorebooks.filter((u) => u._id !== book._id);
        setLorebooks(newUsers);
        await deleteLorebook(book._id);
    }

    const onEdit = (book: Lorebook) => {
        setSelectedBook(book);
        const newUsers = lorebooks.filter((u) => u._id !== book._id);
        newUsers.push(book);
        setLorebooks(newUsers);
    }

    const onSave = (book: Lorebook) => {
        setSelectedBook(book);
        const newUsers = lorebooks;
        newUsers.push(book);
        setLorebooks(newUsers);
    }

    if(isLoading) return (<Loading />);

    const importFromJJSON = () => {
        const element = document.createElement("input");
        element.type = "file";
        element.accept = ".json";
        element.onchange = async () => {
            if(element.files === null) return;
            const file = element.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                if(e.target === null) return;
                const contents = e.target.result;
                if(typeof contents !== "string") return;
                const newBook: Lorebook = JSON.parse(contents) as Lorebook;
                await saveNewLorebook(newBook);
                setLorebooks([...lorebooks, newBook]);
            }
            reader.readAsText(file);
        }
        element.click();
    }

    return (
    <div className="w-full p-4 h-[calc(100vh-70px)] flex flex-col gap-2 grow-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-3 w-full h-11/12 gap-2">
            <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <h3 className="font-semibold">Lorebooks</h3>
                <button className="themed-button-neg w-full h-10" onClick={importFromJJSON}>
                    Import Lorebook
                </button>
                <button className="themed-button-pos w-full h-10" onClick={() => {setSelectedBook(null)}}>
                    New Lorebook
                </button>
                {Array.isArray(lorebooks) && lorebooks.map((book: Lorebook) => {
                    return (
                        <LorebookInfo key={book._id} book={book} onClick={(book: Lorebook | null) => {setSelectedBook(book)}} onDelete={onDelete}/>
                    );
                })}
            </div>
            <div className="col-span-2 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <LorebookCrud book={selectedBook} onDelete={onDelete} onEdit={onEdit} onSave={onSave}/>
            </div>
        </div>
    </div>
    );
}
export default LorebooksPage;