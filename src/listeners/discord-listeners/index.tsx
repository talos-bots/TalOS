import { socket } from "@/App";
import { getStorageValue } from "@/api/dbapi";
import { sendDesktopNotification } from "@/components/desktop-notification";

export function DiscordListeners(){
    socket.on("discord-message", (data: any) => {
        console.log(data);
        getStorageValue("discordNotifications").then((value: any) => {
            const isEnabled = JSON.parse(value)? true : false;
            if (isEnabled) {
                sendDesktopNotification(`[Discord - ${data.author.username}] `, `${data.content}`, () => {});
            }
        });
    });

    socket.on("discord-ready", ( data: any) => {
        sendDesktopNotification(`[Discord] ${data}`, "Logged in successfully.", () => {});
    });

    socket.on("discord-disconnected", ( data: any) => {
        console.log(data);
        sendDesktopNotification(`[Discord]`, "Disconnected.", () => {});
    });

    socket.on("discord-message-update", ( oldMessage: any, newMessage: any) => {
        console.log("Message updated:", oldMessage, newMessage);
    });

    socket.on("discord-message-delete", ( message: any) => {
        console.log("Message deleted:", message);
    });

    socket.on("discord-message-reaction-add", ( reaction: any, user: any) => {
        console.log("Reaction added:", reaction, user);
    });

    socket.on("discord-message-reaction-remove", ( reaction: any, user: any) => {
        console.log("Reaction removed:", reaction, user);
    });

    socket.on("discord-presence-update", ( oldPresence: any, newPresence: any) => {
        console.log("Presence updated:", oldPresence, newPresence);
    });

    socket.on("discord-message-reaction-remove", ( reaction: any, user: any) => {
        console.log("Reaction removed:", reaction, user);
    });

    socket.on("discord-message-reaction-remove-all", ( message: any) => {
        console.log("All reactions removed from message:", message);
    });

    socket.on("discord-message-reaction-remove-emoji", ( reaction: any) => {
        console.log("Emoji reaction removed:", reaction);
    });

    socket.on("discord-channel-create", ( channel: any) => {
        console.log("Channel created:", channel);
    });

    socket.on("discord-channel-delete", ( channel: any) => {
        console.log("Channel deleted:", channel);
    });

    socket.on("discord-channel-pins-update", ( channel: any, time: any) => {
        console.log("Channel pins updated:", channel, time);
    });

    socket.on("discord-channel-update", ( oldChannel: any, newChannel: any) => {
        console.log("Channel updated:", oldChannel, newChannel);
    });

    socket.on("discord-emoji-create", ( emoji: any) => {
        console.log("Emoji created:", emoji);
    });

    socket.on("discord-emoji-delete", ( emoji: any) => {
        console.log("Emoji deleted:", emoji);
    });

    socket.on("discord-emoji-update", ( oldEmoji: any, newEmoji: any) => {
        console.log("Emoji updated:", oldEmoji, newEmoji);
    });

    socket.on("discord-guild-ban-add", ( ban: any) => {
        console.log("Ban added:", ban);
    });

    socket.on("discord-guild-ban-remove", ( ban: any) => {
        console.log("Ban removed:", ban);
    });

    socket.on("discord-guild-create", ( guild: any) => {
        console.log("Guild created:", guild);
    });

    socket.on("discord-guild-delete", ( guild: any) => {
        console.log("Guild deleted:", guild);
    });

    socket.on("discord-guild-unavailable", ( guild: any) => {
        console.log("Guild unavailable:", guild);
    });

    socket.on("discord-guild-integrations-update", ( guild: any) => {
        console.log("Guild integrations updated:", guild);
    });

    socket.on("discord-guild-member-add", ( member: any) => {
        console.log("Guild member added:", member);
    });

    socket.on("discord-guild-member-remove", ( member: any) => {
        console.log("Guild member removed:", member);
    });

    socket.on("discord-guild-member-available", ( member: any) => {
        console.log("Guild member available:", member);
    });

    socket.on("discord-guild-member-update", ( oldMember: any, newMember: any) => {
        console.log("Guild member updated:", oldMember, newMember);
    });

    socket.on("discord-guild-members-chunk", ( members: any, guild: any) => {
        console.log("Guild members chunk received:", members, guild);
    });

    socket.on("discord-guild-update", ( oldGuild: any, newGuild: any) => {
        console.log("Guild updated:", oldGuild, newGuild);
    });

    socket.on("discord-interaction-create", ( interaction: any) => {
        console.log("Interaction created:", interaction);
    });

    socket.on("discord-invite-create", ( invite: any) => {
        console.log("Invite created:", invite);
    });

    socket.on("discord-invite-delete", ( invite: any) => {
        console.log("Invite deleted:", invite);
    });
};