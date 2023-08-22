import { Attachment } from "@/classes/Attachment";
import { Message } from "@/classes/Message";
import { useEffect, useState } from "react";

interface Props {
    message: Message;
}
const MessageComponent = ({ message }: Props) => {
    const [text, setText] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [time, setTime] = useState<number>(0);
    const [origin, setOrigin] = useState<string>("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    useEffect(() => {
        if(message === undefined || message === null) return;
        setText(message.text);
        setUser(message.user);
        setTime(message.timestamp);
        setOrigin(message.origin);
        setAttachments(message.attachments);
    }, [message]);

    return (
        <div>

        </div>
    );
};
export default MessageComponent;