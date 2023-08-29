import { getUsers } from "@/api/dbapi";
import { User } from "@/classes/User";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";

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
        if(newUsers) {
            setUsers(newUsers);
        }
    }

    if(isLoading) return (<Loading />);

    return (
        <div className="grid grid-cols-3">
            <div className="col-span-1">
                
            </div>
            <div className="col-span-2">

            </div>
        </div>
    )
};

export default UserPage;