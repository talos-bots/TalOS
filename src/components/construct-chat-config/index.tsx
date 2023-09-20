import { ConstructChatConfig, DefaultChatConfig } from "@/classes/Construct";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

interface ConstructChatConfigProps {
    chatConfig: ConstructChatConfig | DefaultChatConfig
    onChange: (chatConfig: ConstructChatConfig | DefaultChatConfig) => void
}
const ConstructChatConfigPanel = (props: ConstructChatConfigProps) => {
    const { chatConfig, onChange } = props;
    const [doInstruct, setDoInstruct] = useState<boolean>(chatConfig.doInstruct);
    const [doMemories, setDoMemories] = useState<boolean>(chatConfig.doMemories);
    const [doActions, setDoActions] = useState<boolean>(chatConfig.doActions);
    const [doSprites, setDoSprites] = useState<boolean>(chatConfig.doSprites);
    const [doVoice, setDoVoice] = useState<boolean>(chatConfig.doVoice);
    const [doLurk, setDoLurk] = useState<boolean>(chatConfig.doLurk);
    const [doRandomGreeting, setDoRandomGreeting] = useState<boolean>(chatConfig.doRandomGreeting);
    const [doRandomFarewell, setDoRandomFarewell] = useState<boolean>(chatConfig.doRandomFarewell);
    const [doRandomThought, setDoRandomThought] = useState<boolean>(chatConfig.doRandomThought);
    const [haveThoughts, setHaveThoughts] = useState<boolean>(chatConfig.haveThoughts);
    const [thinkBeforeChat, setThinkBeforeChat] = useState<boolean>(chatConfig.thinkBeforeChat);
    const [replyToConstruct, setReplyToConstruct] = useState<number>(chatConfig.replyToConstruct);
    const [replyToConstructMention, setReplyToConstructMention] = useState<number>(chatConfig.replyToConstructMention);
    const [replyToUser, setReplyToUser] = useState<number>(chatConfig.replyToUser);
    const [replyToUserMention, setReplyToUserMention] = useState<number>(chatConfig.replyToUserMention);
    const [thoughtChance, setThoughtChance] = useState<number>(chatConfig.thoughtChance);

    const handleEdit = () => {
        chatConfig.doInstruct = doInstruct;
        chatConfig.doMemories = doMemories;
        chatConfig.doActions = doActions;
        chatConfig.doSprites = doSprites;
        chatConfig.doVoice = doVoice;
        chatConfig.doLurk = doLurk;
        chatConfig.doRandomGreeting = doRandomGreeting;
        chatConfig.doRandomFarewell = doRandomFarewell;
        chatConfig.doRandomThought = doRandomThought;
        chatConfig.haveThoughts = haveThoughts;
        chatConfig.thinkBeforeChat = thinkBeforeChat;
        chatConfig.replyToConstruct = replyToConstruct;
        chatConfig.replyToConstructMention = replyToConstructMention;
        chatConfig.replyToUser = replyToUser;
        chatConfig.replyToUserMention = replyToUserMention;
        chatConfig.thoughtChance = thoughtChance;
        onChange(chatConfig);
    }

    useEffect(() => {
        handleEdit();
    }, [doInstruct, doMemories, doActions, doSprites, doVoice, doLurk, doRandomGreeting, doRandomFarewell, doRandomThought, haveThoughts, thinkBeforeChat, replyToConstruct, replyToConstructMention, replyToUser, replyToUserMention, thoughtChance]);
    
    return (
        <div className="w-full h-full max-h-full max-w-full themed-input overflow-y-auto">
            <label className="font-semibold">Random Thought</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct will use a random thought when it is idle.</i>
                <ReactSwitch
                    checked={doRandomThought}
                    onChange={() => {setDoRandomThought(!doRandomThought);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doRandomThought"
                />
            </div>
            <label className="font-semibold">Thoughts</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct will use thoughts when chatting.</i>
                <ReactSwitch
                    checked={haveThoughts}
                    onChange={() => {setHaveThoughts(!haveThoughts);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="haveThoughts"
                />
            </div>
            <label className="font-semibold">Think Before Chatting</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct will think before sending a chat. Increases coherrence on average.</i>
                <ReactSwitch
                    checked={thinkBeforeChat}
                    onChange={() => {setThinkBeforeChat(!thinkBeforeChat);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="thinkBeforeChat"
                />
            </div>
            <label className="font-semibold">Thought Chance</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Percentage of the time this construct will think.</i>
                <input
                    className="themed-input"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={thoughtChance}
                    onChange={(e) => {setThoughtChance(Number(e.target.value));}}
                />
            </div>
            <label className="font-semibold">Instruct Prompting</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Uses alpacca instruct prompting for character mode instead of traditional chat format.</i>
                <ReactSwitch
                    checked={doInstruct}
                    onChange={() => {setDoInstruct(!doInstruct);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doInstruct"
                />
            </div>
            <label className="font-semibold">Memories</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Uses vector memories for character chat logs by default.</i>
                <ReactSwitch
                    checked={doMemories}
                    onChange={() => {setDoMemories(!doMemories);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doMemories"
                />
            </div>
            <label className="font-semibold">Actions</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct can perform the actions listed in the Actions section of the construct creation page.</i>
                <ReactSwitch
                    checked={doActions}
                    onChange={() => {setDoActions(!doActions);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doActions"
                />
            </div>
            <label className="font-semibold">Sprites</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct can use sprites.</i>
                <ReactSwitch
                    checked={doSprites}
                    onChange={() => {setDoSprites(!doSprites);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doSprites"
                />
            </div>
            <label className="font-semibold">Voice</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct can use TTS.</i>
                <ReactSwitch
                    checked={doVoice}
                    onChange={() => {setDoVoice(!doVoice);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doVoice"
                />
            </div>
            <label className="font-semibold">Lurk</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct will lurk in chat without replying.</i>
                <ReactSwitch
                    checked={doLurk}
                    onChange={() => {setDoLurk(!doLurk);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doLurk"
                />
            </div>
            <label className="font-semibold">Random Greeting</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct will use a random greeting when it joins chat or at separate intervals to attract a user's attention.</i>
                <ReactSwitch
                    checked={doRandomGreeting}
                    onChange={() => {setDoRandomGreeting(!doRandomGreeting);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doRandomGreeting"
                />
            </div>
            <label className="font-semibold">Random Farewell</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Whether or not this construct will use a random farewell when it leaves chat.</i>
                <ReactSwitch
                    checked={doRandomFarewell}
                    onChange={() => {setDoRandomFarewell(!doRandomFarewell);}}
                    handleDiameter={30}
                    width={60}
                    uncheckedIcon={false}
                    checkedIcon={true}
                    id="doRandomFarewell"
                />
            </div>
            <label className="font-semibold">Reply to Construct Percentage</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Percentage of the time this construct will reply to another construct's chat.</i>
                <input
                    className="themed-input"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={replyToConstruct}
                    onChange={(e) => {setReplyToConstruct(Number(e.target.value));}}
                />
            </div>
            <label className="font-semibold">Reply to Construct Mention Percentage</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Percentage of the time this construct will reply to another construct's mention of their name.</i>
                <input
                    className="themed-input"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={replyToConstructMention}
                    onChange={(e) => {setReplyToConstructMention(Number(e.target.value));}}
                />
            </div>
            <label className="font-semibold">Reply to User Percentage</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Percentage of the time this construct will reply to a user's chat.</i>
                <input
                    className="themed-input"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={replyToUser}
                    onChange={(e) => {setReplyToUser(Number(e.target.value));}}
                />
            </div>
            <label className="font-semibold">Reply to User Mention Percentage</label>
            <div className="themed-input flex flex-col items-center w-full flex-grow gap-2 text-left">
                <i className="text-sm">Percentage of the time this construct will reply to a user's mention of their name.</i>
                <input
                    className="themed-input"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={replyToUserMention}
                    onChange={(e) => {setReplyToUserMention(Number(e.target.value));}}
                />
            </div>
        </div>
    )
};
export default ConstructChatConfigPanel;