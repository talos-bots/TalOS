import { getSystemInfo, setSystemInfo } from "../../../../api/constructapi";
import { getStorageValue, setStorageValue } from "../../../../api/dbapi";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const ChatSettings = () => {
    const [doGreetings, setDoGreetings] = useState(false);
    const [doMultiline, setDoMultiline] = useState(false);
    const [doSystemInfo, setDoSystemInfo] = useState<boolean>(false);

    useEffect(() => {
        getStorageValue('doGreetings').then((value) => {
            setDoGreetings(JSON.parse(value) ? JSON.parse(value) : true);
        }).catch((err) => {
            console.error(err);
        });
        getStorageValue('doMultiline').then((value) => {
            setDoMultiline(JSON.parse(value)? JSON.parse(value) : false);
        }).catch((err) => {
            console.error(err);
        });
        getSystemInfo().then((value) => {
            setDoSystemInfo(value.doSystemInfo);
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

    const handleDoMultilineChange = async (newValue: boolean) => {
        setDoMultiline(newValue);
        try {
            await setStorageValue('doMultiline', JSON.stringify(newValue));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDoSystemInfoChange = async (newValue: boolean) => {
        setDoSystemInfo(newValue);
        try {
            await setSystemInfo(newValue);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="grid grid-cols-2 w-full gap-2">
            <div className="flex flex-col col-span-1 w-full h-full flex-grow">
                <div className="col-span-1 flex flex-col text-left flex-grow">
                    <label className="text-theme-text font-semibold">Send Greetings</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2">
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
            <div className="flex flex-col col-span-1 w-full h-full flex-grow">
                <div className="col-span-1 flex flex-col text-left flex-grow">
                    <label className="text-theme-text font-semibold">Multiline</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2">
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
            <div className="flex flex-col col-span-1 w-full h-full flex-grow">
                <div className="col-span-1 flex flex-col text-left flex-grow">
                    <label className="text-theme-text font-semibold">System Info</label>
                    <div className="themed-input flex flex-col items-center w-full flex-grow gap-2">
                        <i className="text-sm">Send system information to the llm.</i>
                        <ReactSwitch
                            checked={doSystemInfo}
                            onChange={() => handleDoSystemInfoChange(!doSystemInfo)}
                            handleDiameter={30}
                            width={60}
                            uncheckedIcon={false}
                            checkedIcon={true}
                            id="doSystemInfo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ChatSettings;