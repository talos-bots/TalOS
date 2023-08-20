import React, { useState } from "react";
import "./InputGroup.scss"; // Import the Sass file

const InputGroup: React.FC = () => { 
  return (
    <div>
      <div className={`rounded-full bg-black bg-opacity-25 backdrop-blur-sm box-border w-[1151px] h-[51px] shrink-0 flex flex-row py-0 px-2.5 items-center justify-start gap-[23px] border-[1px] border-solid themed-chat-input`}>
        <button className={`cursor-pointer p-0 themed-chat-button relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`}>
          <img className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden" alt="" src="/chat-page-assets/pluscircle.svg" />
        </button>
        <input
          className="border-none font-inter text-lg bg-transparent w-[1013px] h-10 overflow-hidden shrink-0 flex flex-col py-0 px-5 box-border items-start justify-center"
          type="text"
          placeholder="Type your message..."
          style={{ outline: "none" }}
          required={true}
        />
        <button className={`cursor-pointer border-none p-0 themed-chat-button relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`}>
          <img className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden" alt="" src="/chat-page-assets/sendhorizonal.svg" />
        </button>
      </div>
    </div>
  );
};

export default InputGroup;
