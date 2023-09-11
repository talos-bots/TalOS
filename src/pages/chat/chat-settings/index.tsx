import { getStorageValue, setStorageValue } from "@/api/dbapi";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const ChatSettings = () => {
    const [doGreetings, setDoGreetings] = useState(false);
    const [characterMode, setCharacterMode] = useState(false);

    useEffect(() => {
        getStorageValue('doGreetings').then((value) => {
            setDoGreetings(JSON.parse(value));
        }).catch((err) => {
            console.error(err);
        });
        getStorageValue('characterMode').then((value) => {
            setCharacterMode(JSON.parse(value));
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

    return (
        <div className="grid grid-cols-2 w-full">
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
                        <i className="text-sm">Use character names instead of player names.</i>
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
        </div>
    );
}
export default ChatSettings;