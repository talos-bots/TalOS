export type Chat = {
    _id: string;
    name: string;
    type: string;
    messages: MessageInterface[];
    lastMessage: MessageInterface;
    lastMessageDate: Date;
    firstMessageDate: Date;
    agents: string[];
}
export type MessageInterface = {
    _id: string;
    user: string;
    text: string;
    timestamp: number;
    origin: string;
    isCommand: boolean;
    isPrivate: boolean;
    participants: string[];
    attachments: AttachmentInferface[];
}
export type AttachmentInferface = {
    _id: string;
    type: string;
    filename: string;
    data: string;
    size: number;
}
export type ConstructInterface = {
    _id: string;
    name: string;
    nickname: string;
    avatar: string;
    commands: string[];
    visualDescription: string;
    personality: string;
    background: string;
    relationships: string[];
    interests: string[];
    greetings: string[];
    farewells: string[];
}