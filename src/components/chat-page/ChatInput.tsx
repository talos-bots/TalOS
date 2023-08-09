import React, { useState } from "react";
import AttachmentMenu from "./AttachmentMenu";
import themeProps from "../themes/Themes";
import "./InputGroup.scss"; // Import the Sass file

interface InputGroupProps {
  themeProps: themeProps
}

const InputGroup: React.FC<InputGroupProps> = ({ themeProps }) => {
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);

  const toggleAttachmentMenu = () => {
    setAttachmentMenuOpen(!attachmentMenuOpen);
  };

  return (
    <div>
      <div className={`rounded-full bg-gray box-border w-[1151px] h-[51px] overflow-hidden shrink-0 flex flex-row py-0 px-2.5 items-center justify-start gap-[23px] border-[1px] border-solid border-${themeProps.borderColor}`}>
        <button className={`cursor-pointer p-0 bg-${themeProps.bgColor} relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 ${attachmentMenuOpen ? "attachment-menu-open" : ""}`} onClick={toggleAttachmentMenu}>
          <img className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden" alt="" src="/chat-page-assets/pluscircle.svg" />
        </button>
        <input
          className="border-none font-inter text-lg bg-transparent w-[1013px] h-10 overflow-hidden shrink-0 flex flex-col py-0 px-5 box-border items-start justify-center"
          type="text"
          placeholder="Type your message..."
          required
        />
        <button className={`cursor-pointer border-none p-0 bg-${themeProps.bgColor} relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0`}>
          <img className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden" alt="" src="/chat-page-assets/sendhorizonal.svg" />
        </button>
      </div>
      <AttachmentMenu themeProps={themeProps} isOpen={attachmentMenuOpen} />
    </div>
  );
};

export default InputGroup;
