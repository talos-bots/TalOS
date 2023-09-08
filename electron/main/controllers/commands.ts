import { AttachmentBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { Alias, MessageInterface, SlashCommand } from "../types/types";
import { addAlias, addRegisteredChannel, continueChatLog, getRegisteredChannels, getUsername, removeRegisteredChannel, setDoAutoReply, setMaxMessages } from "./DiscordController";
import { addChat, getChat, getConstruct, removeChat, updateChat } from "../api/pouchdb";
import { assembleChatFromData, assembleConstructFromData } from "../helpers/helpers";
import { retrieveConstructs, setDoMultiLine } from "./ConstructController";
import { clearWebhooksFromChannel, doGlobalNicknameChange } from "../api/discord";
import { generateText, getStatus } from "../api/llm";
import { deleteIndex } from "../api/vector";
import { getDefaultCfg, getDefaultHeight, getDefaultHighresSteps, getDefaultNegativePrompt, getDefaultSteps, getDefaultWidth, txt2img } from "../api/sd";

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
            authorsNotes: [],
            authorsNoteDepth: 0,
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
            if(construct === null) continue;
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
        deleteIndex(interaction.channelId);
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
            content: "*Continuing...*",
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
        await interaction.deferReply({ephemeral: false});
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
        const registeredChannels = getRegisteredChannels();
        let registered = false;
        for(let i = 0; i < registeredChannels.length; i++){
            if(registeredChannels[i]._id === interaction.channelId){
                registered = true;
                break;
            }
        }
        if(!registered){
            addRegisteredChannel({
                _id: interaction.channelId,
                guildId: interaction.guildId,
                constructs: [],
                aliases: [{
                    _id: user ? user : interaction.user.id,
                    name: alias,
                    location: 'Discord',
                }],
                authorsNotes: [],
                authorsNoteDepth: 0,
            });
        }else{
            let newAlias: Alias = {
                _id: user ? user : interaction.user.id,
                name: alias,
                location: 'Discord',
            }
            addAlias(newAlias, interaction.channelId);
        }
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
        if (interaction.channel?.isDMBased()) {
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        if (interaction.channel === null) {
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        const constructs = retrieveConstructs();
        let constructDoc = await getConstruct(constructs[0]);
        let construct = assembleConstructFromData(constructDoc);
        let user = getUsername(interaction.user.id, interaction.channelId);
        if(construct === null) return;
        let randomGreeting = construct?.greetings[Math.floor(Math.random() * construct.greetings.length)];
        if(randomGreeting === undefined){
            await interaction.editReply({
                content: "*No greeting set.*",
            });
            return;
        }
        let greetingMessage: MessageInterface = {
            _id: Date.now().toString(),
            user: construct.name,
            avatar: construct.avatar,
            text: randomGreeting.replaceAll('{{user}}', `${user}`).replaceAll('{{char}}', `${construct.name}`),
            userID: construct._id,
            timestamp: Date.now(),
            origin: interaction.channelId,
            isHuman: false,
            attachments: [],
            isCommand: false,
            isPrivate: false,
            participants: [construct._id],
            isThought: false,
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
            if(chatLog === null) return;
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
                name: 'Discord "' + interaction.channelId + '" Chat',
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
            content: randomGreeting.replaceAll('{{user}}', `${user}`).replaceAll('{{char}}', `${construct.name}`),
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

export const SysCommand: SlashCommand = {
    name: 'sys',
    description: 'Adds a system message to the prompt',
    options: [
        {
            name: 'message',
            description: 'The message to add.',
            type: 3,
            required: true,
        },
        {
            name: 'hidden',
            description: 'Whether the message should be hidden.',
            type: 5,
            required: false,
        }
    ],
    execute: async (interaction: CommandInteraction) => {
        let isHidden = interaction.options.get('hidden')?.value as boolean;
        if(isHidden === undefined) isHidden = false;
        await interaction.deferReply({ephemeral: isHidden});
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
        let constructDoc = await getConstruct(constructs[0]);
        let construct = assembleConstructFromData(constructDoc);
        if(construct === null) return;
        const message = interaction.options.get('message')?.value as string;
        const newMessage: MessageInterface = {
            _id: Date.now().toString(),
            user: construct.name,
            avatar: construct.avatar,
            text: message,
            userID: construct._id,
            timestamp: Date.now(),
            origin: interaction.channelId,
            isHuman: false,
            attachments: [],
            isCommand: true,
            isPrivate: false,
            participants: [construct._id],
            isThought: false,
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
            if(chatLog === null) return;
            chatLog.messages.push(newMessage);
            chatLog.lastMessage = newMessage;
            chatLog.lastMessageDate = newMessage.timestamp;
            if(!chatLog.constructs.includes(newMessage.userID)){
                chatLog.constructs.push(newMessage.userID);
            }
            if(!chatLog.humans.includes(interaction.user.id)){
                chatLog.humans.push(interaction.user.id);
            }
        }else{
            chatLog = {
                _id: interaction.channelId,
                name: 'Discord "' + interaction.channelId + '" Chat',
                type: 'Discord',
                messages: [newMessage],
                lastMessage: newMessage,
                lastMessageDate: newMessage.timestamp,
                firstMessageDate: newMessage.timestamp,
                constructs: constructs,
                humans: [interaction.user.id],
                chatConfigs: [],
                doVector: false,
                global: false,
            }
            if(chatLog.messages.length > 0){
                await addChat(chatLog);
            }else{
                return;
            }
        }
        await updateChat(chatLog);
        await interaction.editReply({
            content: message,
        });
        await continueChatLog(interaction);
    }
}

export const toggleVectorCommand: SlashCommand = {
    name: 'vector',
    description: 'Adds a system message to the prompt',
    options: [
        {
            name: 'toggle',
            description: 'Whether the chatlog should be vectorized.',
            type: 5,
            required: true,
        }
    ],
    execute: async (interaction: CommandInteraction) => {
        let isHidden = interaction.options.get('on')?.value as boolean;
        if(isHidden === undefined) isHidden = false;
        await interaction.deferReply({ephemeral: isHidden});
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
        let constructDoc = await getConstruct(constructs[0]);
        let construct = assembleConstructFromData(constructDoc);
        if(construct === null) return;
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
            if(chatLog === null) return;
            chatLog.doVector = isHidden;
            await updateChat(chatLog);
        }else{
            chatLog = {
                _id: interaction.channelId,
                name: 'Discord "' + interaction.channelId + '" Chat',
                type: 'Discord',
                messages: [],
                lastMessage: null,
                lastMessageDate: null,
                firstMessageDate: null,
                constructs: constructs,
                humans: [interaction.user.id],
                chatConfigs: [],
                doVector: true,
                global: false,
            }
            await addChat(chatLog);

        }
        await interaction.editReply({
            content: `Vectorization set to ${isHidden}`,
        });
    }
};

export const constructImagine: SlashCommand = {
    name: 'cosimagine',
    description: 'Makes an image from text.',
    options: [
        {
            name: 'prompt',
            description: 'Primary prompt',
            type: 3,  // String type
            required: true,
        },
        {
            name: 'negativeprompt',
            description: 'Negative prompt',
            type: 3,  // String type
            required: false,
        },
        {
            name: 'steps',
            description: 'Steps',
            type: 4,  // Integer type
            required: false,
        },
        {
            name: 'cfg',
            description: 'Configuration value',
            type: 4,  // Integer type
            required: false,
        },
        {
            name: 'width',
            description: 'Width',
            type: 4,  // Integer type
            required: false,
        },
        {
            name: 'height',
            description: 'Height',
            type: 4,  // Integer type
            required: false,
        },
        {
            name: 'highressteps',
            description: 'High resolution steps',
            type: 4,  // Integer type
            required: false,
        },
        {
            name: 'hidden',
            description: 'Whether the prompt data should be hidden.',
            type: 5,  // Boolean type
            required: false,
        }
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: false});
        const prompt = interaction.options.get('prompt')?.value as string;
        const negativePrompt = interaction.options.get('negativeprompt')?.value as string;
        const steps = interaction.options.get('steps')?.value as number;
        const cfg = interaction.options.get('cfg')?.value as number;
        const width = interaction.options.get('width')?.value as number;
        const height = interaction.options.get('height')?.value as number;
        const highresSteps = interaction.options.get('highressteps')?.value as number;
        let hidden = interaction.options.get('hidden')?.value as boolean;
        if(hidden === undefined) hidden = true;
        const imageData = await txt2img(prompt, negativePrompt, steps, cfg, width, height, highresSteps);
        const buffer = Buffer.from(imageData.base64, 'base64');
        let attachment = new AttachmentBuilder(buffer, {name: `${imageData.name}`});
        const embed = new EmbedBuilder()
        .setTitle('Imagine')
        .setFields([
            {
                name: 'Prompt',
                value: prompt,
                inline: false,
            },
            {
                name: 'Negative Prompt',
                value: negativePrompt? negativePrompt : `${getDefaultNegativePrompt()}`,
                inline: false,
            },
            {
                name: 'Steps',
                value: steps? steps.toString() : getDefaultSteps().toString(),
                inline: true,
            },
            {
                name: 'CFG',
                value: cfg? cfg.toString() : getDefaultCfg().toString(),
                inline: false,
            },
            {
                name: 'Width',
                value: width? width.toString() : getDefaultWidth().toString(),
                inline: true,
            },
            {
                name: 'Height',
                value: height? height.toString() : getDefaultHeight().toString(),
                inline: true,
            },
            {
                name: 'Highres Steps',
                value: highresSteps? highresSteps.toString() : getDefaultHighresSteps().toString(),
                inline: false,
            }
        ])
        .setImage(`attachment://${imageData.name}`)
        .setFooter({text: 'Powered by Stable Diffusion'});
        if(hidden){
            await interaction.editReply({
                embeds: [],
                files: [attachment],
            });
            return;
        }else{
            await interaction.editReply({
                embeds: [embed],
                files: [attachment],
            });
            return;
        }
    }
};

const completeString: SlashCommand = {
    name: 'complete',
    description: 'Completes a prompt.',
    options: [
        {
            name: 'prompt',
            description: 'Primary prompt',
            type: 3,  // String type
            required: true,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: false});
        const prompt = interaction.options.get('prompt')?.value as string;
        const reply = await generateText(prompt);
        if(reply === null){
            await interaction.editReply({
                content: 'Prompt too short.',
            });
            return;
        }else{
            await interaction.editReply({
                content: `${prompt} ${reply.results[0]}`,
            });
            return;
        }
    }
};

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
    SysCommand,
    toggleVectorCommand,
    constructImagine,
    completeString,
];