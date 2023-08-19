import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../types/types";
import { addRegisteredChannel, getRegisteredChannels, removeRegisteredChannel } from "./DiscordController";
import { getConstruct, removeChat } from "../api/pouchdb";
import { assembleConstructFromData } from "../helpers/helpers";
import { retrieveConstructs } from "./ConstructController";

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
        await removeChat(interaction.channelId);
        await interaction.editReply({
            content: "Chat log cleared.",
        });
    }
}

export const DefaultCommands = [
    RegisterCommand,
    UnregisterCommand,
    ListRegisteredCommand,
    ListCharactersCommand,
    ClearLogCommand,
];