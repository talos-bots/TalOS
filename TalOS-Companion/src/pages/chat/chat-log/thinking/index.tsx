interface Props {
    style?: React.CSSProperties;
    className?: string;
}

export function getFormattedTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds} ${date.toLocaleDateString()}`;
}

const ThinkingMessage = ({ style, className }: Props) => {
    return (
        <div className={`themed-message slide-in-bottom-message ${className}`}>
            <div className="flex flex-col">
                <div className="flex flex-row items-center">
                    <div className="flex flex-row items-center w-full gap-2">
                        <div className="flex flex-col pt-6 w-full">
                            <div className="loading">
                                <div className="loading__letter">.</div>
                                <div className="loading__letter">.</div>
                                <div className="loading__letter">.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ThinkingMessage;