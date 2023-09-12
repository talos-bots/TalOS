import { deleteUser, getUsers } from "@/api/dbapi";
import { User } from "@/classes/User";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import UserInfo from "./user-info";
import { RiQuestionMark } from "react-icons/ri";
import UserCrud from "./user-crud";

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

    const onDelete = async (user: User) => {
        const newUsers = users.filter((u) => u._id !== user._id);
        setUsers(newUsers);
        await deleteUser(user._id);
    }

    const onEdit = (user: User) => {
        setSelectedUser(user);
        const newUsers = users.filter((u) => u._id !== user._id);
        newUsers.push(user);
        setUsers(newUsers);
    }

    const onSave = (user: User) => {
        setSelectedUser(user);
        const newUsers = users;
        newUsers.push(user);
        setUsers(newUsers);
    }

    return (
        <div className="w-full p-4 h-[calc(100vh-70px)] flex flex-col gap-2 row-0 overflow-y-auto overflow-x-hidden">
            <div className="grid grid-cols-3 w-full h-11/12 gap-2">
                <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col">
                    <h3 className="text-xl font-semibold">User Profiles</h3>
                    <button className="themed-button-pos w-full h-10" onClick={() => {setSelectedUser(null)}}>
                        New User
                    </button>
                    {Array.isArray(users) && users.map((user: User) => {
                        return (
                            <UserInfo key={user._id} user={user} onClick={(user: User | null) => {setSelectedUser(user)}} onDelete={onDelete}/>
                        );
                    })}
                </div>
                <div className="col-span-2">
                    <UserCrud user={selectedUser} onDelete={onDelete} onEdit={onEdit} onSave={onSave}/>
                </div>
            </div>
        </div>
    )
};

export default UserPage;