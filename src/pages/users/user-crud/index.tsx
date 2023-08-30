import { User } from "@/classes/User";
import { useEffect, useState } from "react";
import { RiQuestionMark } from "react-icons/ri";

interface UserCrudProps {
    user: User | null;
    onClick?: (user: User) => void;
}

const UserCrud = (props: UserCrudProps) => {
    const { user, onClick } = props;
    const [constructName, setConstructName] = useState<string>('');
    const [constructImage, setConstructImage] = useState<string>('');
    const [constructNickname, setConstructNick] = useState<string>('');

    useEffect(() => {
        if(user) {
            setConstructName(user.name);
            setConstructImage(user.avatar);
            setConstructNick(user.nickname);
        }
    }, [user]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setConstructImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="themed-root gap-2 h-full overflow-y-auto flex flex-col">
            <div className="w-full h-full grid grid-cols-2 justify-start">
                <div className="col-span-1 flex flex-col gap-4 h-3/4 items-center justify-start">
                    <div className="row-span-1 flex flex-col">
                        <label htmlFor="construct-role" className="font-semibold">Name</label>
                        <input
                            type="text"
                            required={true}
                            id="construct-name"
                            className="themed-input"
                            value={constructName}
                            onChange={(event) => setConstructName(event.target.value)}
                        />
                    </div>
                    <div className="row-span-1 flex flex-col">
                        <label htmlFor="image-upload">
                            {constructImage === '' ? <RiQuestionMark className="user-image-default"/> : <img src={constructImage} alt={constructName} className="user-image"/>}
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
                    <div className="row-span-1 flex flex-col flex-grow-0">
                        <label htmlFor="construct-role" className="font-semibold">Nickname</label>
                        <input
                            type="text"
                            required={false}
                            id="construct-role"
                            className="themed-input"
                            value={constructNickname}
                            onChange={(event) => setConstructNick(event.target.value)}
                        />
                    </div>
                </div>
                <div className="col-span-1">
                </div>
            </div>
        </div>
    )
};
export default UserCrud;