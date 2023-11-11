import { Construct } from "../../../classes/Construct";
import TokenTextarea from "../../../components/token-textarea";
import { useEffect, useState } from "react";
import { getReturnValue } from "./helpers";

export type requestTypes = 'plist' | 'plaintext' | 'dialogueExamples'

export type fieldTypes = 'persona' | 'background' | 'greeting' | 'farewell' | 'interests' | 'name' | 'nickname' | 'authorsnote' | 'visualDescription' | 'thoughtpattern'

interface AutoFillGeneratorProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    field: fieldTypes | null;
    fill: (text: string, fieldType: fieldTypes) => void;
    currentState: Construct | null;
    setError: (error: string) => void;
}

function getFieldName(field: fieldTypes | null): string {
    switch(field) {
        case 'persona':
            return 'Personality';
        case 'background':
            return 'Background';
        case 'greeting':
            return 'Greeting';
        case 'farewell':
            return 'Farewell';
        case 'interests':
            return 'Interests';
        case 'name':
            return 'Name';
        case 'nickname':
            return 'Nickname';
        case 'authorsnote':
            return 'Author\'s Note';
        case 'visualDescription':
            return 'Visual Description';
        case 'thoughtpattern':
            return 'Thought Pattern';
    }
    return '';
}

const AutoFillGenerator = (props: AutoFillGeneratorProps) => {
    const [reply, setReply] = useState<string>('');
    const [request, setRequest] = useState<string>('');
    const [type, setType] = useState<requestTypes>('plaintext');
    const [extraContext, setExtraContext] = useState<string>('');
    const [useExisting, setUseExisting] = useState<boolean>(false);
    const [appendToExisting, setAppendToExisting] = useState<boolean>(false);
    useEffect(() => {
        if(props.field === null) return;
        setRequest('');
        setReply('');
        setExtraContext('');
        setUseExisting(false);
        if(props.field === 'name' || props.field === 'nickname' || props.field === 'visualDescription' || props.field === 'thoughtpattern') {
            setType('plaintext');
        }
        if(props.field === 'visualDescription'){
            setRequest('Create a prompt for StableDiffusion using the danbooru 2019 dataset tags, comma separate them.');
        }
    }, [props.field]);

    const handleRequest = async () => {
        if(!props.field) return;
        let response: string;
        response = await getReturnValue(type, props.field as string, request, props.currentState, extraContext, useExisting);
        if(response === "" || response === null) {
            props.setError('Error generating reply. Check your LLM settings and try again.');
            return;
        }else{
            setReply(response);
        }
    }

    const handleFill = () => {
        if(!props.field) return;
        props.fill(reply, props.field);
        props.setVisible(false);
    }

    if(!props.visible) return (<></>);

    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="themed-root flex flex-col justify-start items-center p-4 rounded-lg backdrop-blur-theme-blur w-3/5 h-3/4">
                    <span className="absolute top-0 right-0 m-4 text-theme-text cursor-pointer" onClick={() => props.setVisible(false)}>
                        X
                    </span>
                    <h1 className="text-2xl font-semibold">Field Generator</h1>
                    <h3 className="text-lg font-semibold">Generate a value for {getFieldName(props.field)}</h3>
                    <div className="grid grid-cols-3 w-full gap-4 mt-4 h-full">
                        <div className="flex flex-col gap-2 text-left col-span-1">
                            <label className="text-theme-text font-semibold">Request</label>
                            <div className="flex flex-col gap-2 text-left flex-grow themed-input">
                                <i className="text-med">"A name for a cute redhead.", "A lovable roomate who wants to cuddle.", etc.</i>
                                <TokenTextarea
                                    value={request}
                                    onChange={(e) => setRequest(e)}
                                    disabled={false}
                                    className="themed-input flex-grow w-full "
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-left">
                                <span className="text-theme-text font-semibold">Use existing values as basis</span>
                                <div className="themed-input flex justify-center">
                                    <input className="themed-input themed-accent" type="checkbox" checked={useExisting} onChange={(e) => setUseExisting(e.target.checked)}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-left col-span-1 w-full h-full">
                            <label className="text-theme-text font-semibold">Extra Context</label>
                            <div className="flex flex-col gap-2 text-left flex-grow themed-input">
                                <i className="text-med">Shove some examples in here, or maybe some random stuff you found on a wiki for this character. Idk, it just gets put above the instruct.</i>
                                <TokenTextarea
                                    value={extraContext}
                                    onChange={(e) => setExtraContext(e)}
                                    disabled={false}
                                    className="themed-input flex-grow w-full "
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-left col-span-1 w-full h-full">
                            <div className="flex flex-col gap-2 text-left">
                                <label className="text-theme-text font-semibold">Type of value to generate</label>
                                <select className="themed-input" value={type} onChange={(e) => setType(e.target.value as requestTypes)}>
                                    {props.field !== null && props.field !== 'name' && props.field !== 'nickname' && props.field !== 'visualDescription' && props.field !== 'thoughtpattern' && (
                                        <>
                                        <option value="plist">Plist</option>
                                        <option value="dialogueExamples">Dialogue Examples</option>
                                        </>
                                    )}
                                    <option value="plaintext">Plain Text</option>
                                </select>
                                <button className="themed-button-pos w-full" onClick={handleRequest}>Generate</button>
                            </div>
                            <label className="text-theme-text font-semibold">Output (Unedited)</label>
                            <div className="flex flex-col gap-2 text-left flex-grow themed-input">
                                <i className="text-med">It's reccomended that you edit this after it is generated. The prompts are experimental, and may not work perfectly on all models.</i>
                                <TokenTextarea
                                    value={reply}
                                    onChange={(e) => setReply(e)}
                                    disabled={false}
                                    className="themed-input flex-grow w-full "
                                />
                            </div>
                            <button className="themed-button-pos w-full" onClick={handleFill}>Accept and Fill</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default AutoFillGenerator;