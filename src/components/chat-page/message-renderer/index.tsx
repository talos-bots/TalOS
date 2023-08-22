import { Chat } from "@/classes/Chat";
import MessageComponent from "./message";

interface MessageRendererProps {
    chatLog?: Chat;
}
const MessageRenderer = (props: MessageRendererProps) => {
    const { chatLog } = props;

    return (
        <div className="w-full h-full min-h-full themed-root">
            {chatLog?.messages.map((message, index) => {
                return (
                    <MessageComponent key={index} message={message} />
                );
            })}
        </div>
    );
};

export default MessageRenderer;