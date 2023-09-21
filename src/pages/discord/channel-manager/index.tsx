import { getRegisteredChannelsForChat, getRegisteredChannelsForDiffusion } from "@/api/discordapi";
import { useEffect, useState } from "react";

const ChannelManager = () => {
    const [llmChannels, setLlmChannels] = useState<any[]>([]);
    const [diffusionChannels, setDiffusionChannels] = useState<any[]>([]);

    useEffect(() => {
        const getChannels = async () => {
            const llmChannels = await getRegisteredChannelsForChat()
            setLlmChannels(llmChannels);
            const diffChannels = await getRegisteredChannelsForDiffusion();
            setDiffusionChannels(diffChannels);
        }
        getChannels();
    }, []);

    return (
        <div className="grid grid-cols-2 max-w-full overflow-y-auto text-left gap-2">
            <div className="col-span-1 flex flex-col gap-2 h-96 overflow-y-auto">
                <label className="font-semibold">LLM Channels</label>
                <div className="overflow-y-auto flex flex-col gap-2 themed-input">
                    {llmChannels.map((channel) => {
                        return (
                            <div className={'themed-input justify-start text-left flex-shrink-0'} key={channel._id}>{channel._id}</div>
                        )
                    })}
                </div>
            </div>
            <div className="col-span-1 flex flex-col gap-2 h-96 overflow-y-auto">
                <label className="font-semibold">Diffusion Channels</label>
                <div className="overflow-y-auto flex flex-col gap-2 themed-input flex-grow">
                    {diffusionChannels.map((channel) => {
                        console.log(channel);
                        return (
                            <div className={'themed-input justify-start text-left flex-shrink-0'} key={channel}>{channel}</div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
export default ChannelManager;