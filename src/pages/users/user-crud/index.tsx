import { User } from "@/classes/User";

interface UserCrudProps {
    user: User;
    onClick?: (user: User) => void;
}

const UserCrud = (props: UserCrudProps) => {
    const { user, onClick } = props;

    return (
        <div className="themed-root">

        </div>
    )
};
export default UserCrud;