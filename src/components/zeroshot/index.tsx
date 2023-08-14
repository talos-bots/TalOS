import React, { useState, useEffect } from "react";
import { sendZeroMessage } from "../../api/pyapi";

const ZeroShot = () => {
  const [message, setMessage] = useState("");
  const [interactions, setInteractions] = useState<string[]>([]);
  const placeholder = "hello world";
  const sendMessage = async () => {
    try {
      console.log("Sending message to server...");
      const serverResponse = await sendZeroMessage({ message }, placeholder);
      console.log("Response from server:", serverResponse);
      // Prepend both user message and server response to interactions
      setInteractions((prev) => [message, serverResponse, ...prev].slice(0, 6));
      setMessage(""); // clear the message box
    } catch (error) {
      console.log("Error sending message to server:", error);
    }
  };
  return (
    <div className="dark:bg-gray-800 dark:text-gray-100">
      <div className="container max-w-5xl px-4 py-12 mx-auto">
        <div className="grid gap-4 mx-4 sm:grid-cols-12">
          <div className="col-span-12 sm:col-span-3">
            <div className="text-center sm:text-left mb-14 before:block before:w-24 before:h-3 before:mb-5 before:rounded-md before:mx-auto sm:before:mx-0 before:dark:bg-violet-400">
              <h3 className="text-3xl font-semibold">
                ZeroShot React Search Agent
              </h3>
              {/* You can add a subtitle or remove this line */}
              <span className="text-sm font-bold tracki uppercase dark:text-gray-400">
                Vestibulum diam nunc
              </span>
            </div>
          </div>
          <div className="relative col-span-12 px-4 space-y-6 sm:col-span-9">
            <div className="col-span-12 space-y-12 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-700">
              {interactions.map((interaction, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-violet-400"
                >
                  <h3 className="text-xl font-semibold tracki">
                    {index % 2 === 0 ? "Question:" : "Answer:"}
                  </h3>
                  <time className="text-xs tracki uppercase dark:text-gray-400">
                    {new Date().toLocaleDateString()}
                  </time>
                  <p className="mt-3">{interaction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`p-7 text-gray-400 rounded-2xl shadow-lg w-full xs:w-3/4 sm:w-3/5 md:w-3/4 lg:w-1/2 mx-auto mb-8 bg-theme-bg`}
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
      <div
          className={`rounded bg-black w-full bg-opacity-25 box-border overflow-hidden shrink-0 flex flex-row py-2 px-1 items-center justify-start gap-[23px]left-[10px] border-[1px] border-solid border-lime-200`}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-none font-inter w-full left-[10px] text-lg bg-transparent overflow-hidden shrink-0 flex-col py-0 px-5 box-border items-start justify-center"
            placeholder="Type your message..."
            required
            style={{ resize: "none", height: "auto", minHeight: "50px" }}
          />
        </div>
        <button
          onClick={sendMessage}
          className={`cursor-pointer border-none p-0 bg-lime-200 relative rounded-3xl left-[5px] w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`}
        >
          <img
            className="absolute top-[8px] left-[10px] w-[20px] h-[20px] overflow-hidden"
            alt=""
            src="/chat-page-assets/sendhorizonal.svg"
          />
        </button>
        <div className="h-1/6"></div>
    </div>
  );
};

export default ZeroShot;