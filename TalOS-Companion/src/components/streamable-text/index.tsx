import { useEffect, useState } from "react";

interface Props {
    text: string;
    delay?: number;
    typingSpeed?: number;
    isDisabled?: boolean;
}

const StreamableText: React.FC<Props> = ({ text, delay = 0, typingSpeed, isDisabled = false }) => {
    const [streamedText, setStreamedText] = useState<string>('');
    const [typingSpeedState, setTypingSpeedState] = useState<number>(100);

    useEffect(() => {
        if(typingSpeed) {
            setTypingSpeedState(typingSpeed);
        }
    }, [typingSpeed]);
    
    useEffect(() => {
        let textToStream = '';
        let i = 0;
        let timeoutId: NodeJS.Timeout | null = null;
    
        // This function will add characters to streamedText over time
        const streamText = () => {
            if(i < text.length && !isDisabled) {  // Check if isDisabled is true before streaming next character
                textToStream += text.charAt(i);
                setStreamedText(textToStream);
                i++;
                timeoutId = setTimeout(streamText, typingSpeedState);
            }
        }
    
        // Use setTimeout to delay the start of text streaming
        timeoutId = setTimeout(() => {
            if(text.length > 0 && !isDisabled) {  // Check if isDisabled is true before starting text stream
                streamText();
            }
        }, delay * 1000);  // Convert delay from seconds to milliseconds
    
        // If the component is unmounted or text changes, clear the timeout to prevent a memory leak
        return () => {
            if(timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [text, delay, isDisabled === false]);  // Watch isDisabled state as well    

    return (
        <>
        {isDisabled ? text : streamedText}
        </>
    );
}

export default StreamableText;