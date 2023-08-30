import { getUsers } from "@/api/dbapi";
import { User } from "@/classes/User";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import UserInfo from "./user-info";
import { RiQuestionMark } from "react-icons/ri";

const UserPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUsers().then(() => {
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const fetchUsers = async () => {
        const newUsers = await getUsers();
        if(Array.isArray(newUsers)) {
            setUsers(newUsers);
        }
    }

    if(isLoading) return (<Loading />);

    return (
        <div className="w-95vw h-[calc(100vh-70px)] gap-4 m-auto grow-0 overflow-y-auto overflow-x-hidden">
            <div className="grid grid-cols-3 m-auto w-full h-15/16 gap-2 mt-8">
                <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                    <h3 className="text-xl font-semibold">User Profiles</h3>
                    {Array.isArray(users) && users.map((user: User) => {
                        return (
                            <UserInfo user={user} onClick={(user: User) => {setSelectedUser(user)}}/>
                        );
                    })}
                </div>
                <div className="col-span-2 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                </div>
            </div>
        </div>
    )
};

export default UserPage;