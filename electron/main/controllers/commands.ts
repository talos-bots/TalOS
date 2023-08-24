import { CommandInteraction, EmbedBuilder } from "discord.js";
import { MessageInterface, SlashCommand } from "../types/types";
import { addRegisteredChannel, continueChatLog, getRegisteredChannels, removeRegisteredChannel, setDoAutoReply, setMaxMessages } from "./DiscordController";
import { addChat, getChat, getConstruct, removeChat } from "../api/pouchdb";
import { assembleChatFromData, assembleConstructFromData } from "../helpers/helpers";
import { retrieveConstructs, setDoMultiLine } from "./ConstructController";
import { clearWebhooksFromChannel, doGlobalNicknameChange } from "../api/discord";
import { getStatus } from "../api/llm";

export const RegisterCommand: SlashCommand = {
    name: 'register',
    description: 'Registers the current channel.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        addRegisteredChannel({
            _id: interaction.channelId,
            guildId: interaction.guildId,
            constructs: [],
            aliases: [],
        });
        await interaction.editReply({
            content: "Channel registered.",
        });
    }
}

export const UnregisterCommand: SlashCommand = {
    name: 'unregister',
    description: 'Unregisters the current channel.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        removeRegisteredChannel(interaction.channelId);
        await interaction.editReply({
            content: "Channel unregistered.",
        });
    }
}

export const ListRegisteredCommand: SlashCommand = {
    name: 'listregistered',
    description: 'Lists all registered channels.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        const registeredChannels = getRegisteredChannels();
        let reply = 'Registered Channels:\n';
        for(let i = 0; i < registeredChannels.length; i++){
            reply += `<#${registeredChannels[i]._id}>\n`;
        }
        await interaction.editReply({
            content: reply,
        });
    }
}

export const ListCharactersCommand: SlashCommand = {
    name: 'charlist',
    description: 'Lists all registered characters.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply();
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        const constructs = retrieveConstructs();
        let constructArray = [];
        for (let i = 0; i < constructs.length; i++) {
            let constructDoc = await getConstruct(constructs[i]);
            let construct = assembleConstructFromData(constructDoc);
            constructArray.push(construct);
        }
        let fields = [];
        for(let i = 0; i < constructArray.length; i++){
            let status = 'Secondary';
            if(i === 0 ){
                status = 'Primary';
            }
            fields.push({
                name: constructArray[i].name,
                value: status,
            });
        }

        let embed = new EmbedBuilder()
        .setTitle('Registered Characters')
        .addFields(fields);
        await interaction.editReply({
            embeds: [embed],
        });
    }
}

export const ClearLogCommand: SlashCommand = {
    name: 'clear',
    description: 'Clears the chat log for the current channel.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply();
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        await removeChat(interaction.channelId);
        await interaction.editReply({
            content: "Chat log cleared.",
        });
    }
}

export const SetBotNameCommand: SlashCommand = {
    name: 'setbotname',
    description: 'Sets the name of the bot.',
    options: [
        {
            name: 'name',
            description: 'The name to set.',
            type: 3,
            required: true,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        const name = interaction.options.get('name')?.value as string;
        doGlobalNicknameChange(name);
        await interaction.editReply({
            content: `Set bot name to ${name}`,
        });
    }
}

export const ContinueChatCommand: SlashCommand = {
    name: 'cont',
    description: 'Continues the chat log for the current channel.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        await continueChatLog(interaction);
        await interaction.editReply({
            content: "Continuing...",
        });
    }
}

export const SetMultiLineCommand: SlashCommand = {
    name: 'setmultiline',
    description: 'Sets whether the bot will send multiple lines of text at once.',
    options: [
        {
            name: 'multiline',
            description: 'Whether to send multiple lines of text at once.',
            type: 5,
            required: true,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        const multiline = interaction.options.get('multiline')?.value as boolean;
        setDoMultiLine(multiline);
        await interaction.editReply({
            content: `Set multiline to ${multiline}`,
        });
    }
}

export const SetMaxMessagesCommand: SlashCommand = {
    name: 'hismessages',
    description: 'Sets the maximum number of messages to include in the prompt.',
    options: [
        {
            name: 'maxmessages',
            description: 'The maximum number of messages to include in the prompt.',
            type: 4,
            required: true,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        const maxMessages = interaction.options.get('maxmessages')?.value as number;
        setMaxMessages(maxMessages);
        await interaction.editReply({
            content: `Set max messages to ${maxMessages}`,
        });
    }
}

export const SetDoAutoReply: SlashCommand = {
    name: 'setautoreply',
    description: 'Sets whether the bot will automatically reply to messages.',
    options: [
        {
            name: 'autoreply',
            description: 'Whether to automatically reply to messages.',
            type: 5,
            required: true,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        const autoreply = interaction.options.get('autoreply')?.value as boolean;
        setDoAutoReply(autoreply);
        await interaction.editReply({
            content: `Set auto reply to ${autoreply}`,
        });
    }
}

export const SetAliasCommand: SlashCommand = {
    name: 'alias',
    description: 'Sets an alias for a user in the current channel.',
    options: [
        {
            name: 'alias',
            description: 'The alias to set.',
            type: 3,
            required: true,
        },
        {
            name: 'user',
            description: 'The user to set the alias for.',
            type: 6,
            required: false,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        const user = interaction.options.get('user')?.value as string;
        const alias = interaction.options.get('alias')?.value as string;
        addRegisteredChannel({
            _id: interaction.channelId,
            guildId: interaction.guildId,
            constructs: [],
            aliases: [{
                _id: user ? user : interaction.user.id,
                name: alias,
                location: 'Discord',
            }],
        });
        await interaction.editReply({
            content: `Alias ${alias} set for <@${user ? user : interaction.user.id}>.`,
        });
    }
}

export const ClearAllWebhooksCommand: SlashCommand = {
    name: 'clearallwebhooks',
    description: 'Clears all webhooks for the current channel.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        await clearWebhooksFromChannel(interaction.channelId);
        await interaction.editReply({
            content: `Cleared all webhooks for this channel.`,
        });
    }
}

export const DoCharacterGreetingsCommand: SlashCommand = {
    name: 'greeting',
    description: 'Adds the character greeting to the chat.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply();
        if (interaction.channelId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        const constructs = retrieveConstructs();
        let constructDoc = await getConstruct(constructs[0]);
        let construct = assembleConstructFromData(constructDoc);
        let greeting = construct.greetings[0]
        let greetingMessage: MessageInterface = {
            _id: Date.now().toString(),
            user: construct.name,
            text: greeting,
            userID: construct._id,
            timestamp: Date.now(),
            origin: interaction.channelId,
            isHuman: false,
            attachments: [],
            isCommand: false,
            isPrivate: false,
            participants: [construct._id],
        }
        let registeredChannels = getRegisteredChannels();
        let registered = false;
        for(let i = 0; i < registeredChannels.length; i++){
            if(registeredChannels[i]._id === interaction.channelId){
                registered = true;
                break;
            }
        }
        if(!registered) return;
        let chatLogData = await getChat(interaction.channelId);
        let chatLog;
        if (chatLogData) {
            chatLog = assembleChatFromData(chatLogData);
            chatLog.messages.push(greetingMessage);
            chatLog.lastMessage = greetingMessage;
            chatLog.lastMessageDate = greetingMessage.timestamp;
            if(!chatLog.constructs.includes(greetingMessage.userID)){
                chatLog.constructs.push(greetingMessage.userID);
            }
            if(!chatLog.humans.includes(interaction.user.id)){
                chatLog.humans.push(interaction.user.id);
            }
        }else{
            chatLog = {
                _id: interaction.channelId,
                name: interaction.channelId + ' Chat ' +construct.name,
                type: 'Discord',
                messages: [greetingMessage],
                lastMessage: greetingMessage,
                lastMessageDate: greetingMessage.timestamp,
                firstMessageDate: greetingMessage.timestamp,
                constructs: constructs,
                humans: [interaction.user.id],
            }
            if(chatLog.messages.length > 0){
                await addChat(chatLog);
            }else{
                return;
            }
        }
        await interaction.editReply({
            content: greeting,
        });
    }
}

export const PingCommand: SlashCommand = {
    name: 'ping',
    description: 'Ping!',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply();
        const status = await getStatus();
        await interaction.editReply(`Pong! I'm currently connected to: ${status}`);
    }
}
export const DefaultCommands = [
    PingCommand,
    RegisterCommand,
    UnregisterCommand,
    ListRegisteredCommand,
    ListCharactersCommand,
    ClearLogCommand,
    ContinueChatCommand,
    SetBotNameCommand,
    SetMultiLineCommand,
    SetMaxMessagesCommand,
    SetDoAutoReply,
    SetAliasCommand,
    ClearAllWebhooksCommand,
    DoCharacterGreetingsCommand,
];