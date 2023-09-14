import { User } from "@/classes/User";
import { Download, EditIcon, TrashIcon } from "lucide-react";
import { RiQuestionMark } from "react-icons/ri";

interface UserInfoProps {
    user: User | null;
    onClick?: (user: User | null) => void;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}

const UserInfo = (props: UserInfoProps) => {
    const { user, onClick, onDelete, onEdit } = props;

    const exportAsJSON = () => {
        if(user === null) return;
        const json = JSON.stringify(user);
        const element = document.createElement("a");
        const file = new Blob([json], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${user.name}.json`;
        document.body.appendChild(element);
        element.click();
    }

    return (
        <div className="themed-box-no-padding w-full flex flex-row justify-start p-1 items-center gap-4" onClick={()=> {if(onClick !== undefined) onClick(user ? user : null)}}>
            <div className="grid grid-cols-3 gap-6 w-2/3 justify-start items-center">
                <div className="themed-chat-avatar flex items-center justify-center">
                    {user?.avatar ? (<img src={user.avatar} className="themed-chat-avatar"/>) : (<RiQuestionMark size={36}/>)}
                </div>
                <p className="text-left">{user?.name ? user.name : 'New User'}</p>
                <p className="text-right">{user?.nickname ? `"${user.nickname}"` : null}</p>
            </div>
            <div className="flex flex-row gap-4 w-1/3 justify-end items-center">
                {user !== null ? (
                <>
                <button
                    className="message-button mr-4"
                    onClick={() => {
                        exportAsJSON();
                    }}
                >
                    <Download size={18} />
                </button>
                <button className="message-button mr-4"
                    onClick={() => {
                        if(onDelete === undefined) return;
                        if(user === null) return;
                        onDelete(user);
                    }}
                >
                    <TrashIcon size={18} />
                </button>
                </>
                ) : null}
            </div>
        </div>
    );
}
export default UserInfo;