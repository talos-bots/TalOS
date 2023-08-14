import React, { useState } from "react";
import RouteButton from "../route-button";
import { defaultThemes } from "@/constants";
import { setStorageValue } from "@/api/dbapi";

const DevPanel = () => {
    const [isMinimized, setMinimized] = useState(true);

    const setTheme = async (themeID: string) => {
        await setStorageValue("uiTheme", themeID);
        window.location.reload();
    };
    return isMinimized ? (
        <button
            className="fixed bottom-0 right-0 themed-button-pos"
            onClick={() => setMinimized(false)}
        >
        <span className='font-bold text-2xl'>+</span>
        </button>
    ) : (
        <div className="fixed bottom-0 right-0 themed-root">
            <div className="flex justify-between items-center">
                <h2>Dev Panel</h2>
                <button onClick={() => setMinimized(true)} className='themed-button-neg'>
                    <span className='font-bold text-2xl text-theme-text'>-</span>
                </button>
            </div>
            <div className="grid grid-cols-4">
                <div className="col-span-1">
                    <RouteButton to="/terminal" text="Terminal" />
                    <RouteButton to="/playground" text="Playground" />
                    <RouteButton to="/" text="Home" />
                    
                </div>
                <div className="col-span-1">
                    <RouteButton to="/constructs" text="Constructs" />
                    <RouteButton to="/constructs/new" text="New Construct" />
                    <RouteButton to="/settings" text="Settings" />
                </div>
                <div className="col-span-1">
                    <RouteButton to="/docs" text="Docs" />
                    <RouteButton to="/chat" text="Chat" />
                    <RouteButton to="/actions" text="Actions" />
                </div>
                <div className="col-span-1">
                    <RouteButton to="/Zero" text="Zero" />
                    <RouteButton to="/discord" text="Discord" />
                </div>
                <div className="col-span-1">
                </div>
            </div>
            <div className="flex flex-col">
                <h3>Themes</h3>
                <div className="flex flex-row">
                    {Array.isArray(defaultThemes) && defaultThemes.map((theme, index) => {
                        return (
                            <button key={index} onClick={() => setTheme(theme._id)} className="themed-button-pos">
                                {theme.name}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default DevPanel;
