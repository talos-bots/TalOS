import { Link } from "react-router-dom"
import { BiArrowBack } from "react-icons/bi";
interface Props {
    to?: string;
}
const BackButton = (props: Props) => {    
    return (
        <div className="back-button fixed top-4 left-4">
            <Link to={props.to ? props.to : "/"} className="themed-button-neg">
                <BiArrowBack className="inline-block text-2xl"/>
            </Link>
        </div>
    );
}

export default BackButton;