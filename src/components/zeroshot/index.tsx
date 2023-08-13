import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
// import { sendZeroMessage } from "../src/api/pyapi;
import { sendZeroMessage } from "../../api/pyapi";

const ZeroShot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("Command");
  const [responses, setResponses] = useState<string[]>([]);
  const BASE_URL = "http://127.0.0.1:5000/zero";

  const sendMessage = async () => {
    try {
      console.log("Sending message to server...");
      const response = await sendZeroMessage({ message }, BASE_URL);
      console.log("Response from server:", response);
      setResponse(response);
      setResponses([...responses, response]);
    } catch (error) {
      console.log("Error sending message to server:", error);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen w-full">
      {/* dark box behind the div */}
      <div
        className="p-7 text-gray-400 rounded-2xl shadow-lg w-full sm:w-2/6 sm:w-3/5 md:w-3/4 lg:w-1/2 mx-auto mb-8 bg-theme-bg"
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className={`rounded bg-black w-full bg-opacity-25 box-border overflow-hidden shrink-0 flex flex-row py-2 px-1 items-center justify-start gap-[23px]left-[10px]   border-[1px] border-solid border-lime-200`}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-none font-inter w-full left-[10px]  text-lg bg-transparent overflow-hidden shrink-0 flex-col py-0 px-5 box-border items-start justify-center"
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
            className="absolute top-[8px] left-[10px] w-[20px]  h-[20px] overflow-hidden"
            alt=""
            src="/chat-page-assets/sendhorizonal.svg"
          />
        </button>
      </div>

      {responses.map((response, index) => (
        <div key={index} className={`my-2 text-center`}>
          {index === 0 ? (
            <h1 className="text-lime-200 text-2xl">{response}</h1>
          ) : (
            <p className="text-lime-200 text-lg">{response}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ZeroShot;
