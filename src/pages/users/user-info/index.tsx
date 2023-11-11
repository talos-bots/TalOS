import { getImageURL } from "../../../api/baseapi";
import { User } from "../../../classes/User";
import { confirmModal } from "../../../components/confirm-modal";
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
                <div className="flex items-center justify-center">
                    {user?.avatar ? (<img src={getImageURL(user.avatar)} className="themed-chat-avatar"/>) : (<RiQuestionMark size={'3.5rem'} className="themed-chat-avatar"/>)}
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
                    <Download size={'1rem'} />
                </button>
                <button className="message-button mr-4"
                    onClick={async () => {
                        if(onDelete === undefined) return;
                        if(!await confirmModal(`Are you sure you want to delete ${user.name}?`)) return;
                        if(user === null) return;
                        onDelete(user);
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
export default UserInfo;