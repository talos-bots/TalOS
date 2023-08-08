import { Snowflake, Webhook } from 'discord.js';
import { ipcRenderer } from 'electron';
type ValidStatus = 'online' | 'dnd' | 'idle' | 'invisible';

// Discord Login
export const loginToDiscord = async (token: string): Promise<boolean> => {
    return ipcRenderer.invoke('discord-login', token);
}

// Discord Logout
export const logoutFromDiscord = async (): Promise<boolean> => {
    return ipcRenderer.invoke('discord-logout');
}

// Set Bot Info
export const setBotInfo = async (botName: string, base64Avatar: string): Promise<boolean> => {
    return ipcRenderer.invoke('discord-set-bot-info', botName, base64Avatar);
}

// Set Status
export const setStatus = async (message: string, type: string): Promise<boolean> => {
    return ipcRenderer.invoke('discord-set-status', message, type);
}

// Set Online Mode
export const setOnlineMode = async (type: ValidStatus): Promise<boolean> => {
    return ipcRenderer.invoke('discord-set-online-mode', type);
}

// Send Message
export const sendMessage = async (channelID: Snowflake, message: string): Promise<boolean> => {
    return ipcRenderer.invoke('discord-send-message', channelID, message);
}

// Send Message As Character
export const sendMessageAsCharacter = async (charName: string, channelID: Snowflake, message: string): Promise<boolean> => {
    return ipcRenderer.invoke('discord-send-message-as-character', charName, channelID, message);
}

// Get Webhooks for Channel
export const getWebhooksForChannel = (channelID: Snowflake): Promise<Webhook[]> => {
    return new Promise((resolve) => {
        ipcRenderer.send('discord-get-webhooks-for-channel', channelID);
        ipcRenderer.once('discord-get-webhooks-for-channel-reply', (_, webhooks) => {
        resolve(webhooks);
        });
    });
}

// Get Webhook for Character
export const getWebhookForCharacter = (charName: string, channelID: Snowflake): Promise<Webhook> => {
    return new Promise((resolve) => {
        ipcRenderer.send('discord-get-webhook-for-character', charName, channelID);
        ipcRenderer.once('discord-get-webhook-for-character-reply', (_, webhook) => {
        resolve(webhook);
        });
    });
}

// Remaining User Information Routes
export const getUserInfo = {
    id: () => fetchUserData('discord-get-user-id', 'discord-get-user-id-reply'),
    username: () => fetchUserData('discord-get-user-username', 'discord-get-user-username-reply'),
    avatar: () => fetchUserData('discord-get-user-avatar', 'discord-get-user-avatar-reply'),
    discriminator: () => fetchUserData('discord-get-user-discriminator', 'discord-get-user-discriminator-reply'),
    tag: () => fetchUserData('discord-get-user-tag', 'discord-get-user-tag-reply'),
    createdAt: () => fetchUserData('discord-get-user-createdAt', 'discord-get-user-createdAt-reply')
}

function fetchUserData(event: string, replyEvent: string): Promise<any> {
    return new Promise((resolve) => {
        ipcRenderer.send(event);
        ipcRenderer.once(replyEvent, (_, data) => {
        resolve(data);
        });
    });
}

// Get Bot Status
export const getBotStatus = (): Promise<boolean> => {
    return new Promise((resolve) => {
        ipcRenderer.send('discord-bot-status');
        ipcRenderer.once('discord-bot-status-reply', (_, status) => {
        resolve(status);
        });
    });
}
  