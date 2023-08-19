import { CommandInteraction } from 'discord.js';
export type ChatInterface = {
    _id: string;
    name: string;
    type: string;
    messages: MessageInterface[];
    lastMessage: MessageInterface;
    lastMessageDate: number;
    firstMessageDate: number;
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
export type ChannelConfigInterface = {
    _id: string;
    guildId: string;
    constructs: string[];
}
export interface SlashCommand {
  name: string;
  description: string;
  execute: (interaction: CommandInteraction) => void | Promise<void>;
}
