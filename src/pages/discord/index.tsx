import { handleLinkClick } from "@/App";
import { getActiveConstructList, removeConstructFromActive } from "@/api/constructapi";
import { getConstruct } from "@/api/dbapi";
import { getBotStatus, getDoStableDiffusionReactsStatus, getDoStableDiffusionStatus, getSavedDiscordData, getShowDiffusionDetailsStatus, loginToDiscord, logoutFromDiscord, saveDiscordData, setDoStableDiffusionReactsStatus, setDoStableDiffusionStatus, setShowDiffusionDetailsStatus } from "@/api/discordapi";
import { Construct } from "@/classes/Construct";
import Accordian from "@/components/accordian";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const DiscordPage = () => {
    const [discordCharacterMode, setDiscordCharacterMode] = useState(false);
    const [discordBotToken, setDiscordBotToken] = useState("");
    const [discordApplicationID, setDiscordApplicationID] = useState("");
    const [discordMultiCharacterMode, setDiscordMultiCharacterMode] = useState(false);
    const [discordMultiConstructMode, setDiscordMultiConstructMode] = useState(false);
    const [discordActiveConstructs, setDiscordActiveConstructs] = useState<Construct[]>([]);
    const [discordActiveGuilds, setDiscordActiveGuilds] = useState<any[]>([]); // TODO: Type this as a guild object [] when we know what that looks like
    const [discordActiveChannels, setDiscordActiveChannels] = useState<any[]>([]); // TODO: Type this as a channel object [] when we know what that looks like
    const [discordActiveUsers, setDiscordActiveUsers] = useState<any[]>([]); // TODO: Type this as a user object [] when we know what that looks like
    const [discordStableDiffusion, setDiscordStableDiffusion] = useState<boolean>(false);
    const [discordStableReacts, setDiscordStableReacts] = useState<boolean>(false);
    const [discordShowDiffusionDetails, setDiscordShowDiffusionDetails] = useState<boolean>(false);
    const [isBotActive, setIsBotActive] = useState(false);

    useEffect(() => {
        const getDiscordConfig = async () => {
            const data = await getSavedDiscordData();
            setDiscordBotToken(data.savedToken);
            setDiscordApplicationID(data.appId);
            setDiscordCharacterMode(data.discordCharacterMode);
            setDiscordMultiCharacterMode(data.discordMultiCharacterMode);
            setDiscordMultiConstructMode(data.discordMultiConstructMode);
            getDoStableDiffusionStatus().then(setDiscordStableDiffusion).catch(console.error);
            getDoStableDiffusionReactsStatus().then(setDiscordStableReacts).catch(console.error);
            getShowDiffusionDetailsStatus().then(setDiscordShowDiffusionDetails).catch(console.error);
        }
        const isBotActive = async () => {
            const status = await getBotStatus();
            setIsBotActive(status);
        }
        getDiscordConfig();
        getActiveConstructs();
        isBotActive();
    }, []);

    const toggleBotActive = async (e: boolean) => {
        if (e) {
            let result = await loginToDiscord(discordBotToken, discordApplicationID);
            if (result) {
                setIsBotActive(true);
            } else {
                setIsBotActive(false);
            }
        } else {
            let result = await logoutFromDiscord();
            if (result) {
                setIsBotActive(false);
            } else {
                setIsBotActive(true);
            }
        }
    }

    const getActiveConstructs = async () => {
        let constructList = await getActiveConstructList();
        console.log(constructList);
        let constructArray: Construct[] = [];
        if (constructList) {
            for (let i = 0; i < constructList.length; i++) {
                let construct = await getConstruct(constructList[i]);
                if (construct) {
                    constructArray.push(construct);
                }
            }
        }
        setDiscordActiveConstructs(constructArray);
    }

    const saveDiscordConfig = async () => {
        await saveDiscordData(discordBotToken, discordApplicationID, discordCharacterMode, discordMultiCharacterMode, discordMultiConstructMode);
    }

    const saveDiffusionConfig = async () => {
        setDoStableDiffusionStatus(discordStableDiffusion);
        setDoStableDiffusionReactsStatus(discordStableReacts);
        setShowDiffusionDetailsStatus(discordShowDiffusionDetails);
    }

    const removeActive = async (constructID: string) => {
        await removeConstructFromActive(constructID);
        getActiveConstructs();
    }

    return (
        <div className="w-full h-[calc(100vh-70px)] flex flex-col gap-2 themed-root overflow-y-auto overflow-x-hidden">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Discord Configuration Panel</h2>
            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                    <Accordian title="What is this?">
                    </Accordian>
                </div>
                <div className="col-span-1">
                    <Accordian title="How do I use this?">
                        <div className="text-left ">
                            <h3>Creating the Discord Bot</h3>
                            <ol>
                                <li>Go to <a>https://discord.com/developers/applications</a></li>
                                <li>Click "New Application"</li>
                                <li>Give it a name and click "Create"</li>
                                <li>Click "Bot" on the left side</li>
                                <li>Click "Add Bot"</li>
                                <li>Click "Copy" under the token</li>
                                <li>Paste the token into the "Bot Token" field in the "Bot Configuration" tab of this page.</li>
                                <li>Click "Save"</li>
                                <li>Return the the Discord Developer Portal</li>
                                <li>Go to your application and find the "Application ID" field</li>
                                <li>Copy the Application ID</li>
                                <li>Paste the Application ID into the "Application ID" field in the "Bot Configuration" tab of this page.</li>
                                <li>Click "Save"</li>
                                <li>Return to the Discord Developer Portal</li>
                                <li>Go to your application and find the "Bot" tab</li>
                                <li>Turn on all of the "Privileged Gateway Intents"</li>
                                <li>Click "Save Changes"</li>
                                <li>Flip the "Activate Bot" switch in the "Bot Configuration" tab.</li>
                            </ol>
                        </div>
                    </Accordian>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                    <Accordian title="Construct Chat Configuration">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Active Constructs</label>
                                <div className="themed-input flex flex-col items-center w-full h-15vh overflow-y-auto">
                                    {Array.isArray(discordActiveConstructs) && discordActiveConstructs.length > 0 && discordActiveConstructs.map((construct, index) => {
                                        return(
                                            <div className="flex flex-row w-full" key={construct._id}>
                                                <label className="text-theme-text font-semibold themed-button w-2/3">{construct.name} {index === 0 ? '(Primary)' : '(Secondary)'}</label>
                                                <button className="themed-button-neg w-1/3" onClick={() => {removeActive(construct._id)}}>Remove</button>
                                            </div>
                                    )})}
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Multiple Construct Mode</label>
                                <div className="themed-input flex flex-col items-center w-full h-15vh overflow-y-auto">
                                    <i className="text-sm">When enabled, the bot will operate as a Multi-Construct bot, and will attempt to maintain mutliple personas through one bot. Turning this off and on will require a bot restart.</i>
                                    <ReactSwitch
                                        disabled={discordCharacterMode}
                                        checked={discordMultiConstructMode}
                                        onChange={() => setDiscordMultiConstructMode(!discordMultiConstructMode)}
                                        handleDiameter={30}
                                        width={60}
                                        uncheckedIcon={false}
                                        checkedIcon={true}
                                        id="discordMultiConstructMode"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Character Mode</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">When enabled, the bot will operate as a Character Chat bot, and will not perform Agent tasks. Turning this off and on will require a bot restart.</i>
                                    <ReactSwitch
                                        disabled={discordMultiConstructMode}
                                        checked={discordCharacterMode}
                                        onChange={() => setDiscordCharacterMode(!discordCharacterMode)}
                                        handleDiameter={30}
                                        width={60}
                                        uncheckedIcon={false}
                                        checkedIcon={true}
                                        id="discordCharacterMode"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Multi-Character Mode</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">Can only be activated when in Character Chat Mode. This is distinct from the multi-construct mode. Turning this off and on will require a bot restart.</i>
                                    <ReactSwitch
                                        disabled={!discordCharacterMode}
                                        checked={discordMultiCharacterMode}
                                        onChange={() => setDiscordMultiCharacterMode(!discordMultiCharacterMode)}
                                        handleDiameter={30}
                                        width={60}
                                        uncheckedIcon={false}
                                        checkedIcon={true}
                                        id="discordMultiCharacterMode"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 flex flex-row text-left gap-4 mt-2">
                                <button className="themed-button-pos w-full" onClick={() => saveDiscordConfig()}>Save</button>
                            </div>
                        </div>
                    </Accordian>
                </div>
                <div className="col-span-1">
                    <Accordian title="Bot Configuration">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Bot Token</label>
                                <input 
                                    type="text" 
                                    className="themed-input" 
                                    aria-required
                                    value={discordBotToken}
                                    onChange={(e) => setDiscordBotToken(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Application ID</label>
                                <input 
                                    type="text" 
                                    className="themed-input" 
                                    aria-required
                                    value={discordApplicationID}
                                    onChange={(e) => setDiscordApplicationID(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Activate Bot</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">Can only be activated when both the applicationID and auth token are set.</i>
                                    <ReactSwitch
                                        disabled={discordBotToken === "" || discordApplicationID === "" || discordBotToken === undefined || discordApplicationID === undefined}
                                        checked={isBotActive}
                                        onChange={(e) => {
                                            toggleBotActive(e);
                                        }}
                                        handleDiameter={30}
                                        width={60}
                                        uncheckedIcon={false}
                                        checkedIcon={true}
                                        id="isBotActive"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Invite Link</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">This is the link you will use to invite the bot to your server. Only uses this after entering your applicationId and following the tutorial.</i>
                                    <a href={`https://discord.com/oauth2/authorize?client_id=${discordApplicationID}&scope=bot&permissions=41389525433936`} onClick={(e) => handleLinkClick(e, `https://discord.com/oauth2/authorize?client_id=${discordApplicationID}&scope=bot&permissions=41389525433936`)} className="themed-button-pos w-full">Invite Bot</a>
                                </div>
                            </div>
                            <div className="col-span-2 flex flex-row text-left gap-4 mt-2">
                                <button className="themed-button-pos w-full" onClick={() => saveDiscordConfig()}>Save</button>
                            </div>
                        </div>
                    </Accordian>
                </div>
                <div className="col-span-1">
                    <Accordian title="Stable Diffusion Extension">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Stable Diffusion Commands</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">Can only be activated in whitelisted channels. Whitelist channels inside of discord by using /sdaddchannel</i>
                                    <ReactSwitch
                                        checked={discordStableDiffusion}
                                        onChange={(e) => {
                                            setDiscordStableDiffusion(e);
                                        }}
                                        handleDiameter={30}
                                        width={60}
                                        uncheckedIcon={false}
                                        checkedIcon={true}
                                        id="doStableDiffusion"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Stable Diffusion Reactions</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">Can only be activated in whitelisted channels. Add a 🖼️ to message containing text and it will reply with an image of that prompt.</i>
                                    <ReactSwitch
                                        checked={discordStableReacts}
                                        onChange={(e) => {
                                            setDiscordStableReacts(e);
                                        }}
                                        handleDiameter={30}
                                        width={60}
                                        uncheckedIcon={false}
                                        checkedIcon={true}
                                        id="doStableReacts"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col text-left">
                                <label className="text-theme-text font-semibold">Show Diffusion Details</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">When set to on, generation details such as prompt, model, and resolution will be shown automatically by default. Hidden override will still apply for /cosimagine</i>
                                    <ReactSwitch
                                        checked={discordShowDiffusionDetails}
                                        onChange={(e) => {
                                            setDiscordShowDiffusionDetails(e);
                                        }}
                                        handleDiameter={30}
                                        width={60}
                                        uncheckedIcon={false}
                                        checkedIcon={true}
                                        id="showDiffusionDetails"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 flex flex-row text-left gap-2 mt-2">
                                <button className="themed-button-pos w-full" onClick={() => saveDiffusionConfig()}>Save</button>
                            </div>
                        </div>
                    </Accordian>
                </div>
            </div>
        </div>
    );
}

export default DiscordPage;