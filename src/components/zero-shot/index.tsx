import { useState } from "react";
import { getInstructResponse } from "./helpers";

const ZeroShotResponse = () => {
    const [message, setMessage] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [query, setQuery] = useState<string>("Zero Shot Response");

    return (
        <div className="w-1/2 h-75vh grid grid-rows-[auto,1fr] themed-root gap-4">
            <h2 className="text-theme-text text-shadow-xl font-semibold ">{query}</h2>
            <div className="flex flex-col flex-shrink-0">
                <textarea className="themed-input w-full h-1/3"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="themed-button w-full h-1/3"
                    onClick={() => {
                        getInstructResponse(message).then((res) => {
                            setResponse(res);
                        });
                    }}
                >
                    Send
                </button>
                <textarea className="themed-input w-full h-1/3"
                    placeholder="Response"
                    value={response}
                    disabled
                />
            </div>
        </div>
    );
};

export default ZeroShotResponse;