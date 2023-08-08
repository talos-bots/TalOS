import { ipcMain } from 'electron';
import { ActivityType, Client, GatewayIntentBits, Collection, REST, Routes, Partials } from 'discord.js';

const intents = { 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, GatewayIntentBits.GuildEmojisAndStickers, 
    GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildModeration], 
    partials: [Partials.Channel, Partials.GuildMember, Partials.User, Partials.Reaction, Partials.Message] 
};

function cleanUsername(username: string) {
    // Remove leading characters
    let cleaned = username.replace(/^[._-]+/, '');
  
    // Remove trailing characters
    cleaned = cleaned.replace(/[._-]+$/, '');
  
    return cleaned;
}

function cleanEmoji(text: string) {
    // Remove emoji characters using regex
    return text.replace(/<:[a-zA-Z0-9_]+:[0-9]+>/g, '');
}

export function DiscordJSRoutes(){
    const disClient = new Client(intents);
    const commands = new Collection();

    disClient.on('ready', () => {
        if(!disClient.user) return;
        if(disClient.user){
            disClient.user.setActivity({ name: 'with your feelings', type: ActivityType.Playing });
        }
        console.log(`Logged in as ${disClient.user.tag}!`);
    });

    async function setStatus(message: string, type: string){
        if(!disClient.user) return;
        let activityType;
        switch (type) {
            case 'Playing':
            activityType = ActivityType.Playing;
            break;
            case 'Watching':
            activityType = ActivityType.Watching;
            break;
            case 'Listening':
            activityType = ActivityType.Listening;
            break;
            case 'Streaming':
            activityType = ActivityType.Streaming;
            break;
            case 'Competing':
            activityType = ActivityType.Competing;
            break;
            default:
            activityType = ActivityType.Playing;
            break;
        }
        if(!activityType) return;
        disClient.user.setActivity(`${message}`, {type: activityType});
    }
};