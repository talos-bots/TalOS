import Accordian from "@/components/accordian";
import { useState } from "react";
import ReactSwitch from "react-switch";

const DiscordPage = () => {
    const [discordCharacterMode, setDiscordCharacterMode] = useState(false);
    const [discordBotToken, setDiscordBotToken] = useState("");
    const [discordApplicationID, setDiscordApplicationID] = useState("");
    const [discordMultiCharacterMode, setDiscordMultiCharacterMode] = useState(false);
    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] gap-4 themed-root overflow-y-auto overflow-x-hidden">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Discord Configuration Panel</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <Accordian title="Construct Configuration">
                    </Accordian>
                </div>
                <div className="col-span-1">
                    <Accordian title="Bot Information">
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
                    </Accordian>
                </div>
            </div>
        </div>
    );
}

export default DiscordPage;