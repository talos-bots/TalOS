import { deleteUser, getUsers, saveNewUser } from "../../api/dbapi";
import { User } from "../../classes/User";
import Loading from "../../components/loading";
import { useEffect, useState } from "react";
import UserInfo from "./user-info";
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
            setIsLoading(false);
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
                const newUser: User = JSON.parse(contents) as User;
                await saveNewUser(newUser);
                setUsers([...users, newUser]);
            }
            reader.readAsText(file);
        }
        element.click();
    }

    return (
        <div className="w-full p-4 h-[calc(100vh-70px)] flex flex-col gap-2 row-0 overflow-y-auto overflow-x-hidden lg:p-8">
            <div className="grid grid-cols-3 w-full h-full gap-2">
                <div className="col-span-1 themed-root gap-2 h-full overflow-y-auto flex flex-col slide-in-left">
                    <h3 className="text-xl font-semibold">User Profiles</h3>
                    <button className="themed-button-pos w-full h-10" onClick={importFromJJSON}>
                        Import User
                    </button>
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