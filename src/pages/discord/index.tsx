import { getActiveConstructList, removeConstructFromActive } from "@/api/constructapi";
import { getConstruct } from "@/api/dbapi";
import { getBotStatus, getSavedDiscordData, loginToDiscord, logoutFromDiscord, saveDiscordData } from "@/api/discordapi";
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
    const [isBotActive, setIsBotActive] = useState(false);

    useEffect(() => {
        const getDiscordConfig = async () => {
            const data = await getSavedDiscordData();
            setDiscordBotToken(data.savedToken);
            setDiscordApplicationID(data.appId);
            setDiscordCharacterMode(data.discordCharacterMode);
            setDiscordMultiCharacterMode(data.discordMultiCharacterMode);
            setDiscordMultiConstructMode(data.discordMultiConstructMode);
        }
        const isBotActive = async () => {
            const status = await getBotStatus();
            setIsBotActive(status);
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

    const saveDiscordConfig = async () => {
        await saveDiscordData(discordBotToken, discordApplicationID, discordCharacterMode, discordMultiCharacterMode, discordMultiConstructMode);
    }

    const removeActive = async (constructID: string) => {
        await removeConstructFromActive(constructID);
        window.location.reload();
    }

    return (
        <div className="w-full h-[calc(100vh-70px)] flex flex-col gap-4 themed-root overflow-y-auto overflow-x-hidden">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Discord Configuration Panel</h2>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <Accordian title="Construct Configuration">
                    <div className="flex flex-row text-left gap-4 mt-2">
                        <div className="flex flex-col text-left w-1/2">
                            <label className="text-theme-text font-semibold">Active Constructs</label>
                            <div className="themed-input flex flex-col items-center w-full h-15vh overflow-y-auto">
                                {Array.isArray(discordActiveConstructs) && discordActiveConstructs.length > 0 && discordActiveConstructs.map((construct, index) => {
                                    return(
                                        <div className="flex flex-row w-full" key={index}>
                                            <label key={index} className="text-theme-text font-semibold themed-button w-2/3">{construct.name} {index === 0 ? '(Primary)' : '(Secondary)'}</label>
                                            <button key={index} className="themed-button-neg w-1/3" onClick={() => {removeActive(construct._id)}}>Remove</button>
                                        </div>
                                )})}
                            </div>
                        </div>
                        <div className="flex flex-col text-left w-1/2">
                            <label className="text-theme-text font-semibold">Multiple Construct Mode</label>
                            <div className="themed-input flex flex-col items-center w-full h-15vh overflow-y-auto">
                                <i className="text-sm">When enabled, the bot will operate as a Multi-Construct bot, and will attempt to maintain mutliple personas through one bot. Turning this off and on will require a bot restart.</i>
                                <ReactSwitch
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
                    </div>
                    </Accordian>
                </div>
                <div className="col-span-1">
                    <Accordian title="Bot Configuration">
                        <div className="flex flex-row text-left gap-4 mt-2">
                            <div className="flex flex-col text-left w-1/2">
                                <label className="text-theme-text font-semibold">Bot Token</label>
                                <input 
                                    type="text" 
                                    className="themed-input" 
                                    aria-required
                                    value={discordBotToken}
                                    onChange={(e) => setDiscordBotToken(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col text-left w-1/2">
                                <label className="text-theme-text font-semibold">Application ID</label>
                                <input 
                                    type="text" 
                                    className="themed-input" 
                                    aria-required
                                    value={discordApplicationID}
                                    onChange={(e) => setDiscordApplicationID(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row text-left gap-4 mt-2">
                            <div className="flex flex-col text-left w-1/2">
                                <label className="text-theme-text font-semibold">Character Mode</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">When enabled, the bot will operate as a Character Chat bot, and will not perform Agent tasks. Turning this off and on will require a bot restart.</i>
                                    <ReactSwitch
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
                            <div className="flex flex-col text-left w-1/2">
                                <label className="text-theme-text font-semibold">Multi-Character Mode</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">Can only be activated when in Character Chat Mode. This is distinct from the multi-construct mode. Turning this off and on will require a bot restart.</i>
                                    <ReactSwitch
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
                        </div>
                        <div className="flex flex-row text-left gap-4 mt-2">
                            <div className="flex flex-col text-left w-1/2">
                                <label className="text-theme-text font-semibold">Activate Bot</label>
                                <div className="themed-input flex flex-col items-center w-full">
                                    <i className="text-sm">Can only be activated when both the applicationID and auth token are set.</i>
                                    <ReactSwitch
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
                            <div className="flex flex-col text-left w-1/2">
                            </div>
                        </div>
                        <div className="flex flex-row text-left gap-4 mt-2">
                            <button className="themed-button-pos w-full" onClick={() => saveDiscordConfig()}>Save</button>
                        </div>
                    </Accordian>
                </div>
            </div>
        </div>
    );
}

export default DiscordPage;