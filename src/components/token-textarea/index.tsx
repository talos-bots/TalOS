import { getGPTTokens, getLlamaTokens } from "../../api/llmapi";
import { useEffect, useState } from "react";

interface TokenTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    tokenType?: 'LLaMA' | 'GPT';
    className?: string;
    disabled?: boolean;
    readonly?: boolean;
}
const TokenTextarea = (props: TokenTextareaProps) => {
    const { value, onChange, placeholder, tokenType, className, disabled, readonly} = props;
    const [numTokens, setNumTokens] = useState(0);

    useEffect(() => {
        setNumTokens(getTokens(value));
    }, [value, tokenType]);

    const getTokens = (text: string) => {
        let tokens: number;
        switch (tokenType) {
            case "LLaMA":
                tokens = getLlamaTokens(text);
                break;
            case "GPT":
                tokens = getGPTTokens(text);
                break;
            default:
                tokens = getLlamaTokens(text);
                break;
        }
        return tokens;
    };
    
    return (
        <div className="flex flex-col w-full h-full gap-1">
            <textarea
                className={className}
                placeholder={placeholder}
                value={value}
                onChange={(e) => {onChange(e.target.value); setNumTokens(getTokens(e.target.value));}}
                disabled={disabled}
                readOnly={readonly}
                spellCheck={true}
                autoComplete={"on"}
                autoCorrect="on"
            />
            <div className="flex flex-row justify-end">
                <span className="text-theme-text">{numTokens} tokens</span>
            </div>
        </div>
    );
};
export default TokenTextarea;