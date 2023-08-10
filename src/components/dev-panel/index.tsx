import React, { useState } from "react";
import RouteButton from "../route-button";

const DevPanel = () => {
  const [isMinimized, setMinimized] = useState(true);

  return isMinimized ? (
    <button
      className="fixed bottom-0 right-0 themed-button-pos"
      onClick={() => setMinimized(false)}
    >
      <span className="font-bold text-2xl">+</span>
    </button>
  ) : (
    <div className="fixed bottom-0 right-0 themed-root">
      <div className="flex justify-between items-center">
        <h1>Dev Panel</h1>
        <button
          onClick={() => setMinimized(true)}
          className="themed-button-neg"
        >
          <span className="font-bold text-2xl text-theme-text">-</span>
        </button>
      </div>
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <RouteButton to="/terminal" text="Terminal" />
          <RouteButton to="/playground" text="Playground" />
          <RouteButton to="/" text="Home" />
        </div>
        <div className="col-span-1">
          <RouteButton to="/agents" text="Agents" />
          <RouteButton to="/settings" text="Settings" />
          <RouteButton to="/actions" text="Actions" />
        </div>
        <div className="col-span-1">
          <RouteButton to="/docs" text="Docs" />
          <RouteButton to="/chat" text="Chat" />
          <RouteButton to="/zero" text="Zero" />
        </div>
        <div className="col-span-1"></div>
      </div>
      {/* <ThemeMenu /> */}
    </div>
  );
};

export default DevPanel;
