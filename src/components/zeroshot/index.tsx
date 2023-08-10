import React, { useState } from "react";
import { ipcRenderer } from "electron";

const Zero = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("Command");

  const sendMessage = () => {
    fetch("http://localhost:5000/zero-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data.response);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl text-white mb-12">Zero Shot</h1>
      <div className="p-6 bg-gray-800 text-white rounded shadow-md w-80">
        <h1 className="text-lg mb-2">{response}</h1>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="w-full py-2 px-4 bg-black text-white rounded hover:bg-blue-700 focus:outline-none"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Zero;
