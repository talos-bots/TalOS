import { User } from "@/classes/User";
import { RiQuestionMark } from "react-icons/ri";

interface UserInfoProps {
    user: User;
    onClick?: (user: User) => void;
}

const UserInfo = (props: UserInfoProps) => {
    const { user, onClick } = props;

    return (
        <div className="themed-box-no-padding w-full flex flex-row justify-start p-1 items-center gap-4" onClick={()=> {if(onClick !== undefined) onClick(user)}}>
            <div className="themed-chat-avatar flex items-center justify-center">
                {user.avatar !== undefined ? (<img src={user.avatar} className="themed-chat-avatar"/>) : (<RiQuestionMark size={36}/>)}
            </div>
            <p>{user.name}</p>
            <p>{user.nickname}</p>
        </div>
    );
}
export default UserInfo;