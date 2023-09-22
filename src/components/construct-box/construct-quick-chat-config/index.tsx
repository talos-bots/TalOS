import { Construct } from "@/classes/Construct";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickChatCongfigProps {
    construct: Construct;
    onEdit: (chat: Construct) => void;
}
const QuickChatCongfig = (props: QuickChatCongfigProps) => {
    const { construct, onEdit } = props;
    const [userMentionReply, setUserMentionReply] = useState<number>(construct.defaultConfig.replyToUserMention);
    const [userReply, setUserReply] = useState<number>(construct.defaultConfig.replyToUser);
    const [constructMentionReply, setConstructMentionReply] = useState<number>(construct.defaultConfig.replyToConstructMention);
    const [constructReply, setConstructReply] = useState<number>(construct.defaultConfig.replyToConstruct);
    const [doThoughts, setDoThoughts] = useState<boolean>(construct.defaultConfig.haveThoughts);
    const [thoughtsPercentage, setThoughtsPercentage] = useState<number>(construct.defaultConfig.thoughtChance);
    const [thinkBeforeChat, setThinkBeforeChat] = useState<boolean>(construct.defaultConfig.thinkBeforeChat);

    useEffect(() => {
        if(construct){
            construct.defaultConfig.replyToUserMention = userMentionReply;
            construct.defaultConfig.replyToUser = userReply;
            construct.defaultConfig.replyToConstructMention = constructMentionReply;
            construct.defaultConfig.replyToConstruct = constructReply;
            construct.defaultConfig.haveThoughts = doThoughts;
            construct.defaultConfig.thoughtChance = thoughtsPercentage;
            construct.defaultConfig.thinkBeforeChat = thinkBeforeChat;
            onEdit(construct);
        }
    }, [userMentionReply, userReply, constructMentionReply, constructReply, doThoughts, thoughtsPercentage, thinkBeforeChat]);

    return (
        <div className="flex flex-col gap-1 w-full text-left">
            <div className="flex flex-row gap-1 items-center w-full">
                <span className="themed-input flex-grow">Reply to users mentions</span>
                <input className="themed-input" type="number" max={1} min={0} step={0.01} onChange={(e) => setUserMentionReply(e.target.valueAsNumber)} value={userMentionReply}/>
            </div>
            <div className="flex flex-row gap-1 items-center w-full">
                <span className="themed-input flex-grow">Reply to users</span>
                <input className="themed-input" type="number" max={1} min={0} step={0.01} onChange={(e) => setUserReply(e.target.valueAsNumber)} value={userReply}/>
            </div>
            <div className="flex flex-row gap-1 items-center w-full">
                <span className="themed-input flex-grow">Reply to constructs mentions</span>
                <input className="themed-input" type="number" max={1} min={0} step={0.01} onChange={(e) => setConstructMentionReply(e.target.valueAsNumber)} value={constructMentionReply}/>
            </div>
            <div className="flex flex-row gap-1 items-center w-full">
                <span className="themed-input flex-grow">Reply to constructs</span>
                <input className="themed-input" type="number" max={1} min={0} step={0.01} onChange={(e) => setConstructReply(e.target.valueAsNumber)} value={constructReply}/>
            </div>
            <div className="flex flex-row gap-1 items-center w-full">
                <span className="themed-input flex-grow">Have thoughts</span>
                <div className="themed-input">
                    <input className="themed-input" type="checkbox" onChange={(e) => setDoThoughts(e.target.checked as boolean)} checked={doThoughts}/>
                </div>
            </div>
            <div className="flex flex-row gap-1 items-center w-full">
                <span className="themed-input flex-grow">Thoughts chance</span>
                <input className="themed-input" type="number" max={1} min={0} step={0.01} onChange={(e) => setThoughtsPercentage(e.target.valueAsNumber)} value={thoughtsPercentage}/>
            </div>
            <div className="flex flex-row gap-1 items-center w-full">
                <span className="themed-input flex-grow">Think before chat</span>
                <div className="themed-input">
                    <input className="themed-input" type="checkbox" onChange={(e) => setThinkBeforeChat(e.target.checked)} checked={thinkBeforeChat}/>
                </div>
            </div>
        </div>
    )
};
export default QuickChatCongfig;