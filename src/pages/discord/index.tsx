import Accordian from "@/components/accordian";

const DiscordPage = () => {

    return (
        <div className="w-full h-[calc(100vh-70px)] grid grid-rows-[auto,1fr] gap-4 themed-root">
            <h2 className="text-2xl font-bold text-theme-text text-shadow-xl">Discord Configuration Panel</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <Accordian title="Construct Configuration">
                    </Accordian>
                </div>
                <div className="col-span-1">
                    <Accordian title="Bot Information">
                    </Accordian>
                </div>
            </div>
        </div>
    );
}

export default DiscordPage;