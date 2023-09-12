import { getStorageValue } from "@/api/dbapi";
import { sendDesktopNotification } from "@/components/desktop-notification";
import { IpcRendererEvent, ipcRenderer } from "electron";

function removeAllDiscordListeners() {
    ipcRenderer.removeAllListeners("discord-message");
    ipcRenderer.removeAllListeners("discord-ready");
    ipcRenderer.removeAllListeners("discord-disconnected");
    ipcRenderer.removeAllListeners("discord-message-update");
    ipcRenderer.removeAllListeners("discord-message-delete");
    ipcRenderer.removeAllListeners("discord-message-reaction-add");
    ipcRenderer.removeAllListeners("discord-message-reaction-remove");
    ipcRenderer.removeAllListeners("discord-presence-update");
    ipcRenderer.removeAllListeners("discord-message-reaction-remove");
    ipcRenderer.removeAllListeners("discord-message-reaction-remove-all");
    ipcRenderer.removeAllListeners("discord-message-reaction-remove-emoji");
    ipcRenderer.removeAllListeners("discord-channel-create");
    ipcRenderer.removeAllListeners("discord-channel-delete");
    ipcRenderer.removeAllListeners("discord-channel-pins-update");
    ipcRenderer.removeAllListeners("discord-channel-update");
    ipcRenderer.removeAllListeners("discord-emoji-create");
    ipcRenderer.removeAllListeners("discord-emoji-delete");
    ipcRenderer.removeAllListeners("discord-emoji-update");
    ipcRenderer.removeAllListeners("discord-guild-ban-add");
    ipcRenderer.removeAllListeners("discord-guild-ban-remove");
    ipcRenderer.removeAllListeners("discord-guild-create");
    ipcRenderer.removeAllListeners("discord-guild-delete");
    ipcRenderer.removeAllListeners("discord-guild-unavailable");
    ipcRenderer.removeAllListeners("discord-guild-integrations-update");
    ipcRenderer.removeAllListeners("discord-guild-member-add");
    ipcRenderer.removeAllListeners("discord-guild-member-remove");
    ipcRenderer.removeAllListeners("discord-guild-member-available");
    ipcRenderer.removeAllListeners("discord-guild-member-update");
    ipcRenderer.removeAllListeners("discord-guild-members-chunk");
    ipcRenderer.removeAllListeners("discord-guild-update");
    ipcRenderer.removeAllListeners("discord-interaction-create");
    ipcRenderer.removeAllListeners("discord-invite-create");
    ipcRenderer.removeAllListeners("discord-invite-delete");
}

export function DiscordListeners(){
    removeAllDiscordListeners();
    ipcRenderer.on("discord-message", (event: IpcRendererEvent, data: any) => {
        console.log(data);
        getStorageValue("discordNotifications").then((value: any) => {
            const isEnabled = JSON.parse(value)? true : false;
            if (isEnabled) {
                sendDesktopNotification(`[Discord - ${data.author.username}] `, `${data.content}`, () => {});
            }
        });
    });

    ipcRenderer.on("discord-ready", (event: IpcRendererEvent, data: any) => {
        sendDesktopNotification(`[Discord] ${data}`, "Logged in successfully.", () => {});
    });

    ipcRenderer.on("discord-disconnected", (event: IpcRendererEvent, data: any) => {
        console.log(data);
        sendDesktopNotification(`[Discord]`, "Disconnected.", () => {});
    });

    ipcRenderer.on("discord-message-update", (event: IpcRendererEvent, oldMessage: any, newMessage: any) => {
        console.log("Message updated:", oldMessage, newMessage);
    });

    ipcRenderer.on("discord-message-delete", (event: IpcRendererEvent, message: any) => {
        console.log("Message deleted:", message);
    });

    ipcRenderer.on("discord-message-reaction-add", (event: IpcRendererEvent, reaction: any, user: any) => {
        console.log("Reaction added:", reaction, user);
    });

    ipcRenderer.on("discord-message-reaction-remove", (event: IpcRendererEvent, reaction: any, user: any) => {
        console.log("Reaction removed:", reaction, user);
    });

    ipcRenderer.on("discord-presence-update", (event: IpcRendererEvent, oldPresence: any, newPresence: any) => {
        console.log("Presence updated:", oldPresence, newPresence);
    });

    ipcRenderer.on("discord-message-reaction-remove", (event: IpcRendererEvent, reaction: any, user: any) => {
        console.log("Reaction removed:", reaction, user);
    });

    ipcRenderer.on("discord-message-reaction-remove-all", (event: IpcRendererEvent, message: any) => {
        console.log("All reactions removed from message:", message);
    });

    ipcRenderer.on("discord-message-reaction-remove-emoji", (event: IpcRendererEvent, reaction: any) => {
        console.log("Emoji reaction removed:", reaction);
    });

    ipcRenderer.on("discord-channel-create", (event: IpcRendererEvent, channel: any) => {
        console.log("Channel created:", channel);
    });

    ipcRenderer.on("discord-channel-delete", (event: IpcRendererEvent, channel: any) => {
        console.log("Channel deleted:", channel);
    });

    ipcRenderer.on("discord-channel-pins-update", (event: IpcRendererEvent, channel: any, time: any) => {
        console.log("Channel pins updated:", channel, time);
    });

    ipcRenderer.on("discord-channel-update", (event: IpcRendererEvent, oldChannel: any, newChannel: any) => {
        console.log("Channel updated:", oldChannel, newChannel);
    });

    ipcRenderer.on("discord-emoji-create", (event: IpcRendererEvent, emoji: any) => {
        console.log("Emoji created:", emoji);
    });

    ipcRenderer.on("discord-emoji-delete", (event: IpcRendererEvent, emoji: any) => {
        console.log("Emoji deleted:", emoji);
    });

    ipcRenderer.on("discord-emoji-update", (event: IpcRendererEvent, oldEmoji: any, newEmoji: any) => {
        console.log("Emoji updated:", oldEmoji, newEmoji);
    });

    ipcRenderer.on("discord-guild-ban-add", (event: IpcRendererEvent, ban: any) => {
        console.log("Ban added:", ban);
    });

    ipcRenderer.on("discord-guild-ban-remove", (event: IpcRendererEvent, ban: any) => {
        console.log("Ban removed:", ban);
    });

    ipcRenderer.on("discord-guild-create", (event: IpcRendererEvent, guild: any) => {
        console.log("Guild created:", guild);
    });

    ipcRenderer.on("discord-guild-delete", (event: IpcRendererEvent, guild: any) => {
        console.log("Guild deleted:", guild);
    });

    ipcRenderer.on("discord-guild-unavailable", (event: IpcRendererEvent, guild: any) => {
        console.log("Guild unavailable:", guild);
    });

    ipcRenderer.on("discord-guild-integrations-update", (event: IpcRendererEvent, guild: any) => {
        console.log("Guild integrations updated:", guild);
    });

    ipcRenderer.on("discord-guild-member-add", (event: IpcRendererEvent, member: any) => {
        console.log("Guild member added:", member);
    });

    ipcRenderer.on("discord-guild-member-remove", (event: IpcRendererEvent, member: any) => {
        console.log("Guild member removed:", member);
    });

    ipcRenderer.on("discord-guild-member-available", (event: IpcRendererEvent, member: any) => {
        console.log("Guild member available:", member);
    });

    ipcRenderer.on("discord-guild-member-update", (event: IpcRendererEvent, oldMember: any, newMember: any) => {
        console.log("Guild member updated:", oldMember, newMember);
    });

    ipcRenderer.on("discord-guild-members-chunk", (event: IpcRendererEvent, members: any, guild: any) => {
        console.log("Guild members chunk received:", members, guild);
    });

    ipcRenderer.on("discord-guild-update", (event: IpcRendererEvent, oldGuild: any, newGuild: any) => {
        console.log("Guild updated:", oldGuild, newGuild);
    });

    ipcRenderer.on("discord-interaction-create", (event: IpcRendererEvent, interaction: any) => {
        console.log("Interaction created:", interaction);
    });

    ipcRenderer.on("discord-invite-create", (event: IpcRendererEvent, invite: any) => {
        console.log("Invite created:", invite);
    });

    ipcRenderer.on("discord-invite-delete", (event: IpcRendererEvent, invite: any) => {
        console.log("Invite deleted:", invite);
    });
};