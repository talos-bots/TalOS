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
    userID: string;
    timestamp: number;
    origin: string;
    isHuman: boolean;
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
export type Alias = {
    _id: string;
    name: string;
    location: string;
}
export type ChannelConfigInterface = {
    _id: string;
    guildId: string;
    constructs: string[];
    aliases: Alias[];
}
interface SlashCommandOption {
    name: string;
    description: string;
    type: number;  // Changed this from 'STRING' | 'INTEGER' ... to number
    required?: boolean;
    choices?: { name: string; value: string | number }[];
}
  

export interface SlashCommand {
    name: string;
    description: string;
    options?: SlashCommandOption[];
    execute: (interaction: CommandInteraction) => void | Promise<void>;
}
