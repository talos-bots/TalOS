import { Link } from "react-router-dom";

interface RouteButtonProps {
    to: string;
    text: string;
    icon?: any;
    onClick?: () => void;
    className?: string;
    id?: string;
    children?: React.ReactNode;
}
const RouteButton = (props: RouteButtonProps) => {
    return (
        <Link id={props.id} to={props.to} className={"flex flex-row items-center justify-center gap-2 themed-button-pos " + props.className} onClick={props.onClick}>
            {props.icon}
            <span>{props.text}</span>
            {props.children}
        </Link>
    );
}

export default RouteButton;