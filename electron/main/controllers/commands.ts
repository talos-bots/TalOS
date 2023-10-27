import { AttachmentBuilder, CommandInteraction, EmbedBuilder, Message } from "discord.js";
import { Alias, ChatInterface, ConstructInterface, MessageInterface, SlashCommand } from "../types/types";
import { addAlias, addConstructToChatLog, addDiffusionWhitelist, addRegisteredChannel, continueChatLog, getDiffusionWhitelist, getRegisteredChannels, getShowDiffusionDetails, getUsername, removeConstructFromChatLog, removeDiffusionWhitelist, removeRegisteredChannel, setDoAutoReply, setInterrupted, setMaxMessages, setReplaceUser } from "./DiscordController";
import { addChat, getAllConstructs, getChat, getConstruct, removeChat, updateChat } from "../api/pouchdb";
import { assembleChatFromData, assembleConstructFromData, getIntactChatLog } from "../helpers/helpers";
import { retrieveConstructs, setDoMultiLine } from "./ChatController";
import { cleanEmotes, clearMessageQueue, clearWebhooksFromChannel, doGlobalNicknameChange, sendMessage, sendMessageAsCharacter } from "../api/discord";
import { doInstruct, generateText, getStatus } from "../api/llm";
import { deleteIndex } from "../api/vector";
import { getDefaultCfg, getDefaultHeight, getDefaultHighresSteps, getDefaultNegativePrompt, getDefaultSteps, getDefaultWidth, txt2img, getDefaultPrompt } from "../api/sd";
import { cat } from "@xenova/transformers";
import { setDoSystemInfo } from "./ActiveConstructController";

export const RegisterCommand: SlashCommand = {
    name: 'register',
    description: 'Registers the current channel.',
    execute: async (interaction: CommandInteraction) => {
        let constructs = await getAllConstructs();
        console.log(constructs);
        if(constructs === null){
            await interaction.reply('No constructs found.');
            return;
        }
        let constructArray: ConstructInterface[] = [];
        for(let i = 0; i < constructs.length; i++){
            let assembledConstruct = assembleConstructFromData(constructs[i]);
            console.log(assembledConstruct);
            if(assembledConstruct === null) continue;
            constructArray.push(assembledConstruct);
        }
        if (interaction.channelId === null) {
            await interaction.reply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.reply({
            content: "This command can only be used in a server channel.",
            });
            return;
        }
        const registeredChannels = getRegisteredChannels();
        let registered = false;
        for(let i = 0; i < registeredChannels.length; i++){
            if(registeredChannels[i]._id === interaction.channelId){
                registered = true;
                break;
            }
        }
        if(registered){
            await interaction.reply({
                content: "Channel already registered.",
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

        let currentPage = 0;
        const itemsPerPage = 10;

        const constructEmbed = new EmbedBuilder().setTitle("Choose which Constructs to add to the Channel").setDescription('React with the number of the construct to add or remove it from the chat log.').addFields([{name: 'Constructs', value: 'Loading...'}]);
        let chatLog: ChatInterface = {
            _id: interaction.channelId,
            name: 'Discord "' + (interaction?.channel?.isDMBased()? `DM ${interaction.user.displayName}` : `${interaction?.channel?.id}`) + `" Chat`,
            type: 'Discord',
            messages: [],
            // @ts-ignore
            lastMessage: null,
            // @ts-ignore
            lastMessageDate: null,
            // @ts-ignore
            firstMessageDate: null,
            constructs: [],
            humans: [interaction.user.id],
            chatConfigs: [],
            doVector: (interaction?.channel?.isDMBased()? true : false),
            global: (interaction?.channel?.isDMBased()? true : false),
        }
        await addChat(chatLog);
        const menuMessage = await interaction.reply({ embeds: [constructEmbed], fetchReply: true }) as Message;
        const updateMenu = async (page: number) => {
            // @ts-ignore
            chatLog = await getIntactChatLog(interaction);
            if(chatLog === null) return;
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            let fields = [];
            let number = 1;
            for (let i = start; i < end && i < constructArray.length; i++) {
                console.log(constructArray[i]);
                fields.push({
                    name: `${getEmojiByNumber(number)} ${constructArray[i].name}`,
                    value: `${chatLog?.constructs.includes(constructArray[i]._id) ? '(Currently in Chat) ✅' : '(Not in Chat) ❎'}`,
                });
                number++;
            }
            fields.push({
                name: 'Page:',
                value: `${page + 1}/${Math.ceil(constructArray.length / itemsPerPage)}`,
            });
            const newEmbed = new EmbedBuilder().setTitle("Choose which Constructs to add to the Channel").setFields(fields).setDescription('React with the number of the construct to add or remove it from the chat log.');
            await menuMessage.edit({ embeds: [newEmbed] });
            if (currentPage > 0) await menuMessage.react('◀');
            if ((currentPage + 1) * itemsPerPage < constructArray.length) await menuMessage.react('▶');
            // Add number reactions based on items in current page
            for (let i = start; i < end && i < constructArray.length; i++) {
                await menuMessage.react(['1️⃣', `2️⃣`, '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][i % 10]);
            }
            await menuMessage.react('❎');
            await menuMessage.react('🗑️');
        };

        const collector = menuMessage.createReactionCollector({ time: 60000 });

        collector.on('collect', async (reaction: any, user: any) => {
            if (user.bot) return;
            if(!reaction.message.guild) return;
            if(!reaction) return;
            if(!reaction.emoji) return;
            if(!reaction.emoji.name) return;

            const index = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'].indexOf(reaction.emoji.name);
            if (index !== -1) {
                const constructIndex = currentPage * itemsPerPage + index;
                if (constructIndex < constructArray.length) {
                    // Call addConstructToChatLog with appropriate construct ID
                    if(!chatLog?.constructs.includes(constructArray[constructIndex]._id)){
                        await addConstructToChatLog(constructArray[constructIndex]._id, interaction.channelId);
                    }else{
                        await removeConstructFromChatLog(constructArray[constructIndex]._id, interaction.channelId);
                    }
                }
                await updateMenu(currentPage);
            } else if (reaction.emoji.name === '◀' && currentPage > 0) {
                currentPage--;
                await updateMenu(currentPage);
            } else if (reaction.emoji.name === '▶' && (currentPage + 1) * itemsPerPage < constructArray.length) {
                currentPage++;
                await updateMenu(currentPage);
            } else if (reaction.emoji.name === '❎') {
                // clear all constructs
                if(chatLog === null) return;
                chatLog.constructs = [];
                await updateChat(chatLog);
            } else if(reaction.emoji.name === '🗑️'){
                menuMessage.delete();
                collector.stop();
            }

            // Remove the user's reaction
            await reaction.users.remove(user.id);
        });
        try{
            updateMenu(0);
        }catch(e){
            console.log(e);
        }
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
        let pulledChat = await getChat(interaction.channelId) as ChatInterface;
        if(pulledChat === null){
            await interaction.editReply({
                content: "No chat log for this channel.",
            });
            return;
        }else{
            if(pulledChat?.messages === undefined){
                await interaction.editReply({
                    content: "No chat log for this channel.",
                });
            }else{
                pulledChat.messages = [];
                await updateChat(pulledChat);
            }
            
        }
        deleteIndex(interaction.channelId);
        setInterrupted();
        clearMessageQueue();
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
        try{
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
        }catch(e){
            console.log(e);
        }
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
        const pulledLog = await getIntactChatLog(interaction);
        const constructs = pulledLog?.constructs;
        if(!constructs || constructs.length < 1) return;
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
        const activeConstructs = retrieveConstructs();
        if(activeConstructs[0] === constructs[0]){
            await sendMessage(interaction.channelId, randomGreeting.replaceAll('{{user}}', `${user}`).replaceAll('{{char}}', `${construct.name}`))
        }else{
            await sendMessageAsCharacter(construct, interaction.channelId, randomGreeting.replaceAll('{{user}}', `${user}`).replaceAll('{{char}}', `${construct.name}`));
        }
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
        const pulledLog = await getIntactChatLog(interaction)
        const constructs = pulledLog?.constructs;
        if(!constructs || constructs.length < 1) return;
        let constructDoc = await getConstruct(constructs[0]);
        let construct = assembleConstructFromData(constructDoc);
        if(construct === null) return;
        const message = interaction.options.get('message')?.value as string;
        const newMessage: MessageInterface = {
            _id: Date.now().toString(),
            user: construct.name,
            avatar: construct.avatar,
            text: cleanEmotes(message.trim()),
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
                constructs: [],
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
        let isHidden = interaction.options.get('toggle')?.value as boolean;
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

const instructCommand: SlashCommand = {
    name: 'instruct',
    description: 'Instructs the bot to do something.',
    options: [
        {
            name: 'instruction',
            description: 'The instruction to give.',
            type: 3,  // String type
            required: true,
        },
        {
            name: 'guidance',
            description: 'The guidance to give.',
            type: 3,  // String type
            required: false,
        },
        {
            name: 'context',
            description: 'The context to give.',
            type: 3,  // String type
            required: false,
        },
        {
            name: 'examples',
            description: 'The examples to give.',
            type: 3,  // String type
            required: false,
        }
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: false});
        const instruction = interaction.options.get('instruction')?.value as string;
        const guidance = interaction.options.get('guidance')?.value as string;
        const context = interaction.options.get('context')?.value as string;
        const examples = interaction.options.get('examples')?.value as string;
        const reply = await doInstruct(instruction, guidance, context, examples);
        await interaction.editReply({
            content: `Instruct: ${instruction}\n\nResponse:\n${reply}`,
        });
        return;
    }
};

const replaceUserCommand: SlashCommand = {
    name: 'doplaceholderreplace',
    description: 'Where or not to replace a {{user}} with a username, and {{char}} with the construct name.',
    options: [
        {
            name: 'replace',
            description: 'Whether to replace the placeholders.',
            type: 5,  // Boolean type
            required: true,
        }
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: false});
        const replace = interaction.options.get('replace')?.value as boolean;
        setReplaceUser(replace);
        await interaction.editReply({
            content: `Set replace user to ${replace}`,
        });
    }
}

const leaveServerCommand: SlashCommand = {
    name: 'leave',
    description: 'Leaves the current server.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        if (interaction.guildId === null) {
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        if(interaction.guild === null){
            await interaction.editReply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        await interaction.guild.leave();
        await interaction.editReply({
            content: `Left server.`,
        });
        return;
    }
};

const stopCommand: SlashCommand = {
    name: 'stop',
    description: 'Stops the bot.',
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: true});
        setInterrupted();
        clearMessageQueue();
        await interaction.editReply({
            content: `*Stopping...*`,
        });
    }
};

const toggleSystemInfo: SlashCommand = {
    name: 'sysinfotoggle',
    description: 'Toggles whether system info is shown inside of the prompt.',
    options: [
        {
            name: 'toggle',
            description: 'Whether to show system info.',
            type: 5,  // Boolean type
            required: true,
        }
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: false});
        const toggle = interaction.options.get('toggle')?.value as boolean;
        setDoSystemInfo(toggle);
        await interaction.editReply({
            content: `Set show system info to ${toggle}`,
        });
    }
}

const manageConstructsCommand: SlashCommand = {
    name: 'channelconstructs',
    description: 'Manages the constructs for the current channel.',
    execute: async (interaction: CommandInteraction) => {
        let constructs = await getAllConstructs();
        console.log(constructs);
        if(constructs === null){
            await interaction.reply('No constructs found.');
            return;
        }
        let constructArray: ConstructInterface[] = [];
        for(let i = 0; i < constructs.length; i++){
            let assembledConstruct = assembleConstructFromData(constructs[i]);
            console.log(assembledConstruct);
            if(assembledConstruct === null) continue;
            constructArray.push(assembledConstruct);
        }
        if (interaction.channelId === null) {
            await interaction.reply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        if(interaction.guildId === null){
            await interaction.reply({
            content: "This command can only be used in a server.",
            });
            return;
        }
        let registeredChannels = getRegisteredChannels();
        let registered = false;
        for(let i = 0; i < registeredChannels.length; i++){
            if(registeredChannels[i]._id === interaction.channelId){
                registered = true;
                break;
            }
        }
        if(!registered){
            await interaction.reply({
                content: "This channel is not registered.",
            });
            return;
        }
        let chatLog = await getIntactChatLog(interaction);
        if(chatLog === null) return;
        let currentPage = 0;
        const itemsPerPage = 10;

        const constructEmbed = new EmbedBuilder().setTitle("Choose a Construct").setDescription('React with the number of the construct to add or remove it from the chat log.').addFields([{name: 'Constructs', value: 'Loading...'}]);

        const menuMessage = await interaction.reply({ embeds: [constructEmbed], fetchReply: true }) as Message;
        const updateMenu = async (page: number) => {
            chatLog = await getIntactChatLog(interaction);
            if(chatLog === null) return;
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            let fields = [];
            let number = 1;
            for (let i = start; i < end && i < constructArray.length; i++) {
                console.log(constructArray[i]);
                fields.push({
                    name: `${getEmojiByNumber(number)} ${constructArray[i].name}`,
                    value: `${chatLog?.constructs.includes(constructArray[i]._id) ? '(Currently in Chat) ✅' : '(Not in Chat) ❎'}`,
                });
                number++;
            }
            fields.push({
                name: 'Page:',
                value: `${page + 1}/${Math.ceil(constructArray.length / itemsPerPage)}`,
            });
            const newEmbed = new EmbedBuilder().setTitle("Choose a Construct").setFields(fields).setDescription('React with the number of the construct to add or remove it from the chat log.');
            await menuMessage.edit({ embeds: [newEmbed] });
            if (currentPage > 0) await menuMessage.react('◀');
            if ((currentPage + 1) * itemsPerPage < constructArray.length) await menuMessage.react('▶');
            // Add number reactions based on items in current page
            for (let i = start; i < end && i < constructArray.length; i++) {
                await menuMessage.react(['1️⃣', `2️⃣`, '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][i % 10]);
            }
            await menuMessage.react('❎');
            await menuMessage.react('🗑️');
        };

        const collector = menuMessage.createReactionCollector({ time: 60000 });

        collector.on('collect', async (reaction: any, user: any) => {
            if (user.bot) return;
            if(!reaction.message.guild) return;
            if(!reaction) return;
            if(!reaction.emoji) return;
            if(!reaction.emoji.name) return;
            await reaction.users.remove(user.id);
            const index = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'].indexOf(reaction.emoji.name);
            if (index !== -1) {
                const constructIndex = currentPage * itemsPerPage + index;
                if (constructIndex < constructArray.length) {
                    // Call addConstructToChatLog with appropriate construct ID
                    if(!chatLog?.constructs.includes(constructArray[constructIndex]._id)){
                        await addConstructToChatLog(constructArray[constructIndex]._id, interaction.channelId);
                    }else{
                        await removeConstructFromChatLog(constructArray[constructIndex]._id, interaction.channelId);
                    }
                }
                await updateMenu(currentPage);
            } else if (reaction.emoji.name === '◀' && currentPage > 0) {
                currentPage--;
                await updateMenu(currentPage);
            } else if (reaction.emoji.name === '▶' && (currentPage + 1) * itemsPerPage < constructArray.length) {
                currentPage++;
                await updateMenu(currentPage);
            }else if (reaction.emoji.name === '❎') {
                // clear all constructs
                if(chatLog === null) return;
                chatLog.constructs = [];
                await updateChat(chatLog);
            } else if(reaction.emoji.name === '🗑️'){
                menuMessage.delete();
                collector.stop();
            }
        });
        try{
            updateMenu(0);
        }catch(e){
            console.log(e);
        }
    }
};

function getEmojiByNumber(input: number){
    switch(input){
        case 1:
            return '1️⃣';
        case 2:
            return '2️⃣';
        case 3:
            return '3️⃣';
        case 4:
            return '4️⃣';
        case 5:
            return '5️⃣';
        case 6:
            return '6️⃣';
        case 7:
            return '7️⃣';
        case 8:
            return '8️⃣';
        case 9:
            return '9️⃣';
        case 10:
            return '🔟';
        default:
            return '❎';
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
    SetAliasCommand,
    ClearAllWebhooksCommand,
    DoCharacterGreetingsCommand,
    SysCommand,
    toggleVectorCommand,
    completeString,
    instructCommand,
    replaceUserCommand,
    stopCommand,
    manageConstructsCommand,
    toggleSystemInfo
];

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
        if(!getDiffusionWhitelist().includes(interaction.channelId)){
            await interaction.editReply({
                content: 'This command is not allowed in this channel.',
            });
            return;
        }
        const prompt = interaction.options.get('prompt')?.value as string;
        const negativePrompt = interaction.options.get('negativeprompt')?.value as string;
        const steps = interaction.options.get('steps')?.value as number;
        const cfg = interaction.options.get('cfg')?.value as number;
        const width = interaction.options.get('width')?.value as number;
        const height = interaction.options.get('height')?.value as number;
        const highresSteps = interaction.options.get('highressteps')?.value as number;
        let hidden = interaction.options.get('hidden')?.value as boolean;
        if(hidden === undefined){
            hidden = !getShowDiffusionDetails();
        }
        const imageData = await txt2img(prompt, negativePrompt, steps, cfg, width, height, highresSteps);
        if(imageData === null){
            await interaction.editReply({
                content: 'An unknown error has occured. Please check your endpoint, settings, and try again.',
            });
            return;
        }
        const buffer = Buffer.from(imageData.base64, 'base64');
        let attachment = new AttachmentBuilder(buffer, {name: `${imageData.name}`});
        const embed = new EmbedBuilder()
        .setTitle('Imagine')
        .setFields([
            {
                name: 'Prompt',
                value: getDefaultPrompt() + prompt,
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
            },
            {
                name: 'Model',
                value: `${imageData.model}`,
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

const addDiffusionWhitelistCommand: SlashCommand = {
    name: 'sdaddchannel',
    description: 'Adds a channel to the diffusion whitelist.',
    options: [
        {
            name: 'channel',
            description: 'The channel to add.',
            type: 7,  // Channel type
            required: false,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: false});
        let channel = interaction.options.get('channel')?.value as string;
        if(channel === undefined){
            channel = interaction.channelId;
        }
        addDiffusionWhitelist(channel);
        await interaction.editReply({
            content: `Added <#${channel}> to the diffusion whitelist.`,
        });
        return;
    }
};

const removeDiffusionWhitelistCommand: SlashCommand = {
    name: 'sdremovechannel',
    description: 'Removes a channel from the diffusion whitelist.',
    options: [
        {
            name: 'channel',
            description: 'The channel to remove.',
            type: 7,  // Channel type
            required: false,
        },
    ],
    execute: async (interaction: CommandInteraction) => {
        await interaction.deferReply({ephemeral: false});
        let channel = interaction.options.get('channel')?.value as string;
        if(channel === undefined){
            channel = interaction.channelId;
        }
        removeDiffusionWhitelist(channel);
        await interaction.editReply({
            content: `Removed <#${channel}> from the diffusion whitelist.`,
        });
        return;
    }
};

export const stableDiffusionCommands = [
    constructImagine,
    addDiffusionWhitelistCommand,
    removeDiffusionWhitelistCommand,
];