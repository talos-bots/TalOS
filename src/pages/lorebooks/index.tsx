import { Lorebook } from "@/classes/Lorebook";
import LorebookInfo from "./lorebook-info";
import { useState } from "react";
import Loading from "@/components/loading";

const LorebooksPage = () => {
    const [lorebooks, setLorebooks] = useState<Lorebook[]>([]);
    const [selectedBook, setSelectedBook] = useState<Lorebook | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    if(isLoading) return (<Loading />);

    const onDelete = async (book: Lorebook) => {
        const newUsers = lorebooks.filter((u) => u._id !== book._id);
        setLorebooks(newUsers);
        await deleteUser(book._id);
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

    return (
    <div className="w-95vw h-[calc(100vh-70px)] flex flex-col justify-center items-center gap-8 m-auto grow-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-3 m-auto w-full h-11/12 gap-2">
            <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                <h3 className="font-semibold">Lorebooks</h3>
                {Array.isArray(lorebooks) && lorebooks.map((book: Lorebook) => {
                    return (
                        <LorebookInfo book={book} onClick={(book: Lorebook | null) => {setSelectedBook(book)}} onDelete={onDelete}/>
                    );
                })}
            </div>
            <div className="col-span-2 themed-root gap-2 h-full overflow-y-auto flex flex-col">
            </div>
        </div>
    </div>
    );
}
export default LorebooksPage;