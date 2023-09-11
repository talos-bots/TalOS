import { getDoCaptioning, getDoEmotions, setDoCaptioning, setDoEmotions } from "@/api/llmapi";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";

const ConstructSettingsPanel = () => {
    const [doEmotionClassification, setDoEmotionClassification] = useState(false);
    const [doImageCaptioning, setDoImageCaptioning] = useState(false);

    useEffect(() => {
        fetchConstructSettings();
    }, []);

    const fetchConstructSettings = () => {
        getDoEmotions().then((value) => {
            setDoEmotionClassification(value);
        }).catch((err) => {
            console.error(err);
        });
        getDoCaptioning().then((value) => {
            setDoImageCaptioning(value);
        }).catch((err) => {
            console.error(err);
        });
    };
    
    const saveConstructSettings = () => {
        setDoEmotions(doEmotionClassification)
        setDoCaptioning(doImageCaptioning)
    };

    return (
        <div className="grid grid-cols-2 w-full gap-2">
            <div className="col-span-1 flex flex-col text-left">
                <label className="text-theme-text font-semibold">Emotion Classification</label>
                <div className="themed-input flex flex-col items-center w-full overflow-y-auto">
                    <i className="text-sm">When enabled messages from users and constructs will be classified as one of 28 emotions. This will be used for thoughts, and other features such as sprites.<br/><b>Warning: This uses a small, but noticable amount of GPU/CPU and if you're not on a machine fast enough, this will slow down your chatting experience.</b></i>
                    <ReactSwitch
                        checked={doEmotionClassification}
                        onChange={() => setDoEmotionClassification(!doEmotionClassification)}
                        handleDiameter={30}
                        width={60}
                        uncheckedIcon={false}
                        checkedIcon={true}
                        id="doEmotionClassification"
                    />
                </div>
            </div>
            <div className="col-span-1 flex flex-col text-left">
                <label className="text-theme-text font-semibold">Image Captioning</label>
                <div className="themed-input flex flex-col items-center w-full overflow-y-auto">
                    <i className="text-sm">When enabled images will be captioned and descriptions will be shown to the LLM.<br/><b>Warning: This uses a small, but noticable amount of GPU/CPU and if you're not on a machine fast enough, this will slow down your chatting experience.</b></i>
                    <ReactSwitch
                        checked={doImageCaptioning}
                        onChange={() => setDoImageCaptioning(!doImageCaptioning)}
                        handleDiameter={30}
                        width={60}
                        uncheckedIcon={false}
                        checkedIcon={true}
                        id="doImageCaptioning"
                    />
                </div>
            </div>
            <button className="themed-button-pos col-span-2" onClick={() => saveConstructSettings()}>Save</button>
        </div>
    )
};
export default ConstructSettingsPanel;