import { Link } from "react-router-dom";

interface RouteButtonProps {
    to: string;
    text: string;
    icon?: any;
    onClick?: () => void;
}
const RouteButton = (props: RouteButtonProps) => {
    return (
        <Link to={props.to} className="flex flex-row items-center justify-center gap-2 themed-button-pos" onClick={props.onClick}>
            {props.icon}
            <span>{props.text}</span>
        </Link>
    );
}

export default RouteButton;