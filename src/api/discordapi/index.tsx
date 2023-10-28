import { url } from '@/App';
import { sendDesktopNotification } from '@/components/desktop-notification';
import axios from 'axios';
import { Snowflake, Webhook } from 'discord.js';
type ValidStatus = 'online' | 'dnd' | 'idle' | 'invisible';

// Discord Login
export const loginToDiscord = async (rawToken?: string, appId?: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${url}/api/discord/login`, {
            rawToken: rawToken,
            appId: appId
        });
        return response.data.success;
    } catch (error) {
        console.error('Failed to login to Discord via Axios:', error);
        return false;
    }
}

// Discord Logout
export const logoutFromDiscord = async (): Promise<boolean> => {
    try {
        const response = await axios.post(`${url}/api/discord/logout`);
        sendDesktopNotification('Discord', 'Logged out successfully.', () => {});
        return response.data.success;
    } catch (error) {
        console.error('Failed to logout from Discord via Axios:', error);
        return false;
    }
};

// Set Bot Info
export const setBotInfo = async (botName: string, base64Avatar: string): Promise<boolean> => {
    const response = await axios.post(`${url}/api/discord/set-bot-info`, { botName, base64Avatar });
    return response.data.success;
}

// Set Status
export const setStatus = async (message: string, type: string): Promise<boolean> => {
    const response = await axios.post(`${url}/api/discord/set-status`, { message, type });
    return response.data.success;
}

// Set Online Mode
export const setOnlineMode = async (type: ValidStatus): Promise<boolean> => {
    const response = await axios.post(`${url}/api/discord/set-online-mode`, { type });
    return response.data.success;
}

// Send Message
export const sendMessage = async (channelID: Snowflake, message: string): Promise<boolean> => {
    const response = await axios.post(`${url}/api/discord/send-message`, { channelID, message });
    return response.data.success;
}

// Send Message As Character
export const sendMessageAsCharacter = async (charName: string, channelID: Snowflake, message: string): Promise<boolean> => {
    const response = await axios.post(`${url}/api/discord/send-message-as-character`, { charName, channelID, message });
    return response.data.success;
}

// Get Webhooks for Channel
export const getWebhooksForChannel = async (channelID: Snowflake): Promise<Webhook[]> => {
    const response = await axios.get(`${url}/api/discord/get-webhooks-for-channel/${channelID}`);
    return response.data.webhooks;
}

// Get Webhook for Character
export const getWebhookForCharacter = async (charName: string, channelID: Snowflake): Promise<Webhook> => {
    const response = await axios.get(`${url}/api/discord/get-webhook-for-character`, { params: { charName, channelID } });
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
    return axios.get(`${url}/api${endpoint}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching user data:", error);
            throw error;
        });
}

// Get Bot Status
export const getBotStatus = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`${url}/api/discord/bot/status`);
        return response.data.status;
    } catch (error) {
        console.error('Failed to get bot status:', error);
        return false;
    }
};

// Get Token
export const getToken = async (): Promise<string> => {
    try {
        const response = await axios.get(`${url}/api/discord/token`);
        return response.data.token;
    } catch (error) {
        console.error('Failed to get token:', error);
        return '';
    }
}

// Get Application ID
export const getApplicationID = async (): Promise<string> => {
    try {
        const response = await axios.get(`${url}/api/discord/application-id`);
        return response.data.applicationID;
    } catch (error) {
        console.error('Failed to get application ID:', error);
        return '';
    }
}

// Get Guilds
export const getGuilds = async () => {
    try {
        const response = await axios.get(`${url}/api/discord/guilds`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to get guilds:', error);
        return [];
    }
}

// Leave guild
export const leaveGuild = async (guildID: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${url}/api/discord/leave-guild`, { guildID });
        return response.data.success;
    } catch (error) {
        console.error('Failed to leave guild:', error);
        return false;
    }
}

// Get Saved Discord Data
export const getSavedDiscordData = async (): Promise<any> => {
    try {
        const response = await axios.get(`${url}/api/discord/data`);
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
    discordMultiConstructMode: boolean
): Promise<boolean> => {
    try {
        await axios.post(`${url}/api/discord/data`, {
            newToken: token,
            newAppId: appID,
            discordMultiConstructMode
        });
        return true;
    } catch (error) {
        console.error('Failed to save discord data:', error);
        return false;
    }
}

export const getDoStableDiffusionStatus = async (): Promise<boolean> => {
    const response = await axios.get(`${url}/api/discord/diffusion`);
    return response.data.value;
}

export const setDoStableDiffusionStatus = async (status: boolean): Promise<void> => {
    await axios.post(`${url}/api/discord/diffusion`, { value: status });
}

export const getDoStableDiffusionReactsStatus = async (): Promise<boolean> => {
    const response = await axios.get(`${url}/api/discord/diffusion-reactions`);
    return response.data.value;
}

export const setDoStableDiffusionReactsStatus = async (status: boolean): Promise<void> => {
    await axios.post(`${url}/api/discord/diffusion-reactions`, { value: status });
}

export const getShowDiffusionDetailsStatus = async (): Promise<boolean> => {
    const response = await axios.get(`${url}/api/discord/diffusion-details`);
    return response.data.value;
}

export const setShowDiffusionDetailsStatus = async (status: boolean): Promise<void> => {
    await axios.post(`${url}/api/discord/diffusion-details`, { value: status });
}

export const getRegisteredChannelsForDiffusion = async (): Promise<Array<any>> => {
    const response = await axios.get(`${url}/api/discord/diffusion-channels`);
    return response.data.channels;
}

export const getDiffusionWhitelist = async (): Promise<Array<string>> => {
    const response = await axios.get(`${url}/api/discord/diffusion-whitelist`);
    return response.data.channels;
}

export const addChannelToDiffusionWhitelist = async (channel: string): Promise<void> => {
    await axios.post(`${url}/api/discord/diffusion-whitelist`, { channel });
}

export const removeChannelFromDiffusionWhitelist = async (channel: string): Promise<void> => {
    await axios.delete(`${url}/api/discord/diffusion-whitelist`, { data: { channel } });
}

// Get list of registered Discord channels
export const getRegisteredChannelsForChat = async (): Promise<any> => {
    try {
        const response = await axios.get(`${url}/api/discord/channels`);
        return response.data.channels;
    } catch (error: any) {
        throw error.response.data.error;
    }
};

// Register a new Discord channel
export const registerDiscordChannel = async (channel: string): Promise<any> => {
    try {
        const response = await axios.post(`${url}/api/discord/channels/register`, { channel });
        return response.data.message;
    } catch (error: any) {
        throw error.response.data.error;
    }
};

// Unregister a Discord channel
export const unregisterDiscordChannel = async (channel: string): Promise<any> => {
    try {
        const response = await axios.delete(`${url}/api/discord/channels/unregister`, { data: { channel } });
        return response.data.message;
    } catch (error: any) {
        throw error.response.data.error;
    }
};

// Check if a Discord channel is registered
export const checkIfDiscordChannelIsRegistered = async (channel: string): Promise<boolean> => {
    try {
        const response = await axios.get(`${url}/api/discord/channels/check`, { params: { channel } });
        return response.data.isRegistered;
    } catch (error: any) {
        throw error.response.data.error;
    }
};

// Get delay value
export const getDelayValue = async (): Promise<number> => {
    try {
        const response = await axios.get(`${url}/api/discord/delay`);
        return response.data.value;
    } catch (error: any) {
        throw error.response.data.error;
    }
};

// Set delay value
export const setDelayValue = async (value: number): Promise<string> => {
    try {
        const response = await axios.post(`${url}/api/discord/delay`, { value });
        return response.data.message;
    } catch (error: any) {
        throw error.response.data.error;
    }
};

// Get doDelay value
export const getDoDelayValue = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`${url}/api/discord/delay-enabled`);
        return response.data.value;
    } catch (error: any) {
        throw error.response.data.error;
    }
};

// Set doDelay value
export const setDoDelayValue = async (value: boolean): Promise<string> => {
    try {
        const response = await axios.post(`${url}/api/discord/delay-enabled`, { value });
        return response.data.message;
    } catch (error: any) {
        throw error.response.data.error;
    }
};
