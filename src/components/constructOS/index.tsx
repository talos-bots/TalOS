import React, { useEffect, useRef, useState } from 'react';
import './ConstructOS.module.scss';

export const ConstructOS: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const bottomRef = useRef(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setHistory(prev => [...prev, inputValue]);
            setInputValue('');
        }
    };

    // Ensure the terminal always shows the most recent command
    useEffect(() => {
        if (bottomRef.current) {
            (bottomRef.current as any).scrollIntoView();
        }
    }, [history]);

    return (
        <div className="terminal">
            <ul className="command-history">
                {history.map((command, index) => (
                    <li key={index}>Shell &gt;&gt; :ConstructOS:&gt; {command}</li>
                ))}
            </ul>
            Shell &gt;&gt; :ConstructOS:&gt; 
            <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: 'calc(100% - 15em)' }}
            />
            <span className="blinking-cursor"></span>
            <div ref={bottomRef}></div>
        </div>
    );
};