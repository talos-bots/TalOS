import { Chat } from "@/classes/Chat";

interface ChatDetailsProps {
    chat: Chat;
    onClick?: (chat: Chat) => void;
}
const ChatDetails = (props: ChatDetailsProps) => {
    const { chat, onClick } = props;

    return (
        <div onClick={() => {if(onClick !== undefined) onClick(chat)}}>
            <p>{chat.name}</p>
        </div>
    );
}

export default ChatDetails;