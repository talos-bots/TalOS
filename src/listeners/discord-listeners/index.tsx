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
};