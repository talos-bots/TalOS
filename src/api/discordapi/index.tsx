import { sendDesktopNotification } from '@/components/desktop-notification';
import axios from 'axios';
import { Snowflake, Webhook } from 'discord.js';
import { ipcRenderer } from 'electron';
type ValidStatus = 'online' | 'dnd' | 'idle' | 'invisible';

// Discord Login
export const loginToDiscord = async (rawToken?: string, appId?: string): Promise<boolean> => {
    try {
        const response = await axios.post('/api/discord/login', {
            rawToken: rawToken,
            appId: appId
        });
        sendDesktopNotification('Discord', 'Logged in successfully.', () => {});
        return response.data.success;
    } catch (error) {
        console.error('Failed to login to Discord via Axios:', error);
        return false;
    }
}

// Discord Logout
export const logoutFromDiscord = async (): Promise<boolean> => {
    try {
        const response = await axios.post('/api/discord/logout');
        sendDesktopNotification('Discord', 'Logged out successfully.', () => {});
        return response.data.success;
    } catch (error) {
        console.error('Failed to logout from Discord via Axios:', error);
        return false;
    }
};

// Set Bot Info
export const setBotInfo = async (botName: string, base64Avatar: string): Promise<boolean> => {
    const response = await axios.post(`/api/discord/set-bot-info`, { botName, base64Avatar });
    return response.data.success;
}

// Set Status
export const setStatus = async (message: string, type: string): Promise<boolean> => {
    const response = await axios.post(`/api/discord/set-status`, { message, type });
    return response.data.success;
}

// Set Online Mode
export const setOnlineMode = async (type: ValidStatus): Promise<boolean> => {
    const response = await axios.post(`/api/discord/set-online-mode`, { type });
    return response.data.success;
}

// Send Message
export const sendMessage = async (channelID: Snowflake, message: string): Promise<boolean> => {
    const response = await axios.post(`/api/discord/send-message`, { channelID, message });
    return response.data.success;
}

// Send Message As Character
export const sendMessageAsCharacter = async (charName: string, channelID: Snowflake, message: string): Promise<boolean> => {
    const response = await axios.post(`/api/discord/send-message-as-character`, { charName, channelID, message });
    return response.data.success;
}

// Get Webhooks for Channel
export const getWebhooksForChannel = async (channelID: Snowflake): Promise<Webhook[]> => {
    const response = await axios.get(`/api/discord/get-webhooks-for-channel/${channelID}`);
    return response.data.webhooks;
}

// Get Webhook for Character
export const getWebhookForCharacter = async (charName: string, channelID: Snowflake): Promise<Webhook> => {
    const response = await axios.get(`/api/discord/get-webhook-for-character`, { params: { charName, channelID } });
    return response.data.webhook;
}

// Remaining User Information Routes
export const getUserInfo = {
    id: async () => await fetchUserData('/discord/user/id'),
    username: async () => await fetchUserData('/discord/user/username'),
    avatar: async () => await fetchUserData('/discord/user/avatar'),
    discriminator: async () => await fetchUserData('/discord/user/discriminator'),
    tag: async () => await fetchUserData('/discord/user/tag'),
    createdAt: async () => await fetchUserData('/discord/user/createdAt')
}

async function fetchUserData(endpoint: string): Promise<any> {
    return axios.get(`/api${endpoint}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching user data:", error);
            throw error;
        });
}

// Get Bot Status
export const getBotStatus = async (): Promise<boolean> => {
    try {
        const response = await axios.get('/api/discord/bot/status');
        return response.data.status;
    } catch (error) {
        console.error('Failed to get bot status:', error);
        return false;
    }
};

// Get Token
export const getToken = async (): Promise<string> => {
    try {
        const response = await axios.get('/api/discord/token');
        return response.data.token;
    } catch (error) {
        console.error('Failed to get token:', error);
        return '';
    }
}

// Get Application ID
export const getApplicationID = async (): Promise<string> => {
    try {
        const response = await axios.get('/api/discord/application-id');
        return response.data.applicationID;
    } catch (error) {
        console.error('Failed to get application ID:', error);
        return '';
    }
}

// Get Guilds
export const getGuilds = async (): Promise<Array<any>> => {
    try {
        const response = await axios.get('/api/discord/guilds');
        return response.data;
    } catch (error) {
        console.error('Failed to get guilds:', error);
        return [];
    }
}

// Get Saved Discord Data
export const getSavedDiscordData = async (): Promise<any> => {
    try {
        const response = await axios.get('/api/discord/data');
        return response.data;
    } catch (error) {
        console.error('Failed to get saved discord data:', error);
        return null;
    }
}

// Save Discord Data
export const saveDiscordData = async (
    token: string,
    appID: string,
    discordCharacterMode: boolean,
    discordMultiCharacterMode: boolean,
    discordMultiConstructMode: boolean
): Promise<boolean> => {
    try {
        await axios.post('/api/discord/data', {
            newToken: token,
            newAppId: appID,
            discordCharacterMode,
            discordMultiCharacterMode,
            discordMultiConstructMode
        });
        return true;
    } catch (error) {
        console.error('Failed to save discord data:', error);
        return false;
    }
}

// Utility Functions
function fetchFromMain(event: string, replyEvent: string): Promise<any> {
    return new Promise((resolve) => {
        ipcRenderer.send(event);
        ipcRenderer.once(replyEvent, (_, data) => {
            resolve(data);
        });
    });
}

function fetchFromMainWithArgs(event: string, replyEvent: string, ...args: any[]): Promise<any> {
    return new Promise((resolve) => {
        ipcRenderer.send(event, ...args);
        ipcRenderer.once(replyEvent, (_, data) => {
            resolve(data);
        });
    });
}

// Enable Stable Diffusion Commands
export const getDoStableDiffusionStatus = (): Promise<boolean> => {
    return fetchFromMain('get-do-stable-diffusion', 'get-do-stable-diffusion-reply');
}

export const setDoStableDiffusionStatus = (status: boolean): Promise<boolean> => {
    return fetchFromMainWithArgs('set-do-stable-diffusion', 'set-do-stable-diffusion-reply', status);
}

export const setDoStableDiffusionReactsStatus = (status: boolean): Promise<boolean> => {
    return fetchFromMainWithArgs('set-do-stable-reactions', 'set-do-stable-reactions-reply', status);
}

export const getDoStableDiffusionReactsStatus = (): Promise<boolean> => {
    return fetchFromMain('get-do-stable-reactions', 'get-do-stable-reactions-reply');
}

export const getShowDiffusionDetailsStatus = (): Promise<boolean> => {
    return fetchFromMain('get-show-diffusion-details', 'get-show-diffusion-details-reply');
}

export const setShowDiffusionDetailsStatus = (status: boolean): Promise<boolean> => {
    return fetchFromMainWithArgs('set-show-diffusion-details', 'set-show-diffusion-details-reply', status);
}

export const getRegisteredChannelsForChat = (): Promise<Array<any>> => {
    return fetchFromMain('get-registered-channels-for-chat', 'get-registered-channels-for-chat-reply');
}

export const getRegisteredChannelsForDiffusion = (): Promise<Array<any>> => {
    return fetchFromMain('get-registered-channels-for-diffusion', 'get-registered-channels-for-diffusion-reply');
}