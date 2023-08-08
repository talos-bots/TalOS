import { sendDesktopNotification } from "@/components/desktop-notification";
import { IpcRendererEvent, ipcRenderer } from "electron";

export const DiscordListeners = () => {

    ipcRenderer.on("discord-message", (event: IpcRendererEvent, data: any) => {
        console.log(data);
        sendDesktopNotification(`[Discord - ${data.channel.id}] ${data.author.username}`, data.cleanContent, () => {
            console.log("clicked");
        });
    });

    ipcRenderer.on("discord-ready", (event: IpcRendererEvent, data: any) => {
        console.log(data);
        sendDesktopNotification(`[Discord] ${data.user.username}`, "Logged in successfully.", () => {
            console.log("clicked");
        });
    });

    ipcRenderer.on("discord-disconnected", (event: IpcRendererEvent, data: any) => {
        console.log(data);
        sendDesktopNotification(`[Discord]`, "Disconnected.", () => {
            console.log("clicked");
        });
    });

    return null;
};