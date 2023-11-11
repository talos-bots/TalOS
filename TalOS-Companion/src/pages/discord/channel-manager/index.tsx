import { getGuilds, getRegisteredChannelsForChat, getRegisteredChannelsForDiffusion, leaveGuild } from "../../../api/discordapi";
import { useEffect, useState } from "react";
interface ChannelManagerProps {
    botActive: boolean;
}

const ChannelManager = (props: ChannelManagerProps) => {
    const { botActive } = props;
    const [discordGuilds, setDiscordGuilds] = useState<any[]>([]);

    useEffect(() => {
        getChannels();
    }, [botActive]);

    const getChannels = async () => {
        const retrivedData = await getGuilds();
        if(retrivedData && Array.isArray(retrivedData)) {
            setDiscordGuilds(retrivedData);
        }
    }

    const leaveSpecificGuild = async (guildID: string) => {
        await leaveGuild(guildID);
        getChannels();
    }

    return (
        <div className="max-w-full overflow-y-auto text-left gap-2">
            <div className="flex flex-col gap-2 h-96 overflow-y-auto">
                <label className="font-semibold">Discord Guilds (Only Visible while bot is active)</label>
                <button className="themed-button" onClick={getChannels}>Refresh</button>
                <div className="overflow-y-auto flex flex-col gap-2 themed-input flex-grow">
                    {Array.isArray(discordGuilds) && discordGuilds.map((guild) => {
                        return (
                            <div className={'themed-input justify-between text-left flex-shrink-0 flex flex-row'} key={guild._id}>
                                <b>{guild.name}</b>
                                <button className="themed-button-neg" onClick={() => leaveSpecificGuild(guild._id)}>Leave</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
export default ChannelManager;