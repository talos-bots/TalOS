import { ipcMain } from 'electron';
import { ActivityType, Client, GatewayIntentBits, Collection, REST, Routes, Partials } from 'discord.js';

const intents = { 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, GatewayIntentBits.GuildEmojisAndStickers, 
    GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildModeration], 
    partials: [Partials.Channel, Partials.GuildMember, Partials.User, Partials.Reaction, Partials.Message] 
};

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
};