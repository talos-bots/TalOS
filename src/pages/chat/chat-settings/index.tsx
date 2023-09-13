import { getStorageValue, setStorageValue } from "@/api/dbapi";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const ChatSettings = () => {
    const [doGreetings, setDoGreetings] = useState(true);
    const [characterMode, setCharacterMode] = useState(false);
    const [doMultiline, setDoMultiline] = useState(false);
    const [messagesToSend, setMessagesToSend] = useState<number>(25);

    useEffect(() => {
        getStorageValue('doGreetings').then((value) => {
            setDoGreetings(JSON.parse(value) ? JSON.parse(value) : true);
        }).catch((err) => {
            console.error(err);
        });
        getStorageValue('characterMode').then((value) => {
            setCharacterMode(JSON.parse(value)? JSON.parse(value) : false);
        }).catch((err) => {
            console.error(err);
        });
        getStorageValue('doMultiline').then((value) => {
            setDoMultiline(JSON.parse(value)? JSON.parse(value) : false);
        }).catch((err) => {
            console.error(err);
        });
        getStorageValue('messagesToSend').then((value) => {
            setMessagesToSend(JSON.parse(value)? JSON.parse(value) : 25);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const handleDoGreetingsChange = async (newValue: boolean) => {
        setDoGreetings(newValue);
        try {
            await setStorageValue('doGreetings', JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCharacterModeChange = async (newValue: boolean) => {
        setCharacterMode(newValue);
        try {
            await setStorageValue('characterMode', JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDoMultilineChange = async (newValue: boolean) => {
        setDoMultiline(newValue);
        try {
            await setStorageValue('doMultiline', JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMessagesToSendChange = async (newValue: number) => {
        setMessagesToSend(newValue);
        try {
            await setStorageValue('messagesToSend', JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="grid grid-cols-2 w-full gap-1">
            <div className="flex flex-col col-span-1 w-full h-full">
                <div className="col-span-1 flex flex-col text-left">
                    <label className="text-theme-text font-semibold">Send Greetings</label>
                    <div className="themed-input flex flex-col items-center w-full">
                        <i className="text-sm">Send greetings as the first message in a ChatLog.</i>
                        <ReactSwitch
                            checked={doGreetings}
                            onChange={() => handleDoGreetingsChange(!doGreetings)}
                            handleDiameter={30}
                            width={60}
                            uncheckedIcon={false}
                            checkedIcon={true}
                            id="doGreetings"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col col-span-1 w-full h-full">
                <div className="col-span-1 flex flex-col text-left">
                    <label className="text-theme-text font-semibold">Character Mode</label>
                    <div className="themed-input flex flex-col items-center w-full">
                        <i className="text-sm">Use character mode instead of Construct mode.</i>
                        <ReactSwitch
                            checked={characterMode}
                            onChange={() => handleCharacterModeChange(!characterMode)}
                            handleDiameter={30}
                            width={60}
                            uncheckedIcon={false}
                            checkedIcon={true}
                            id="characterMode"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col col-span-1 w-full h-full">
                <div className="col-span-1 flex flex-col text-left">
                    <label className="text-theme-text font-semibold">Multiline</label>
                    <div className="themed-input flex flex-col items-center w-full">
                        <i className="text-sm">Use multiline messages instead of single line messages.</i>
                        <ReactSwitch
                            checked={doMultiline}
                            onChange={() => handleDoMultilineChange(!doMultiline)}
                            handleDiameter={30}
                            width={60}
                            uncheckedIcon={false}
                            checkedIcon={true}
                            id="doMultiline"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col col-span-1 w-full h-full">
                <div className="col-span-1 flex flex-col text-left">
                    <label className="text-theme-text font-semibold">Messages to Send</label>
                    <div className="themed-input flex flex-col items-center w-full">
                        <i className="text-sm">The number of messages send send in the prompt.</i>
                        <input
                            className="themed-input"
                            type="number"
                            value={messagesToSend}
                            onChange={(e) => handleMessagesToSendChange(parseInt(e.target.value))}
                            min={4}
                            max={100}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ChatSettings;