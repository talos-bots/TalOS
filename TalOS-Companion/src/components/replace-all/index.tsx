import { useState } from "react";

interface ReplaceAllProps {
    text: string;
    setText: (text: string) => void;
}
const ReplaceAll = (props: ReplaceAllProps) => {
    const { text, setText } = props;
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [search, setSearch] = useState("");
    const [replace, setReplace] = useState("");

    const replaceAll = () => {
        const regex = new RegExp(search, caseSensitive ? "g" : "gi");
        setText(text.replace(regex, replace));
    };

    return (
        <div className="flex flex-row w-full">
            <input
                className="themed-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <input
                className="themed-input"
                type="text"
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
            />
            <label htmlFor="case-sensitive">Case sensitive</label>
            <div className="themed-input flex justify-center items-center">
                <input
                    type="checkbox"
                    id="case-sensitive"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                />
            </div>
            <button className="themed-button-small" onClick={replaceAll}>Replace all</button>
        </div>
    );
}
export default ReplaceAll;