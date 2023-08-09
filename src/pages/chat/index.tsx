import { FunctionComponent, useState } from "react";
import AttachmentMenu from "@/components/chat-page/AttachmentMenu";
import InputGroup from "@/components/chat-page/ChatInput";
import themeProps from "@/components/themes/Themes";

interface ChatPageProps {
  themeProps: themeProps;
}

const ChatPage: React.FC<ChatPageProps> = ({ themeProps }) => {

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[url(${themeProps.bgImage})]`}>
      <div className="box-border w-[1440px] h-[1024px] overflow-hidden shrink-0 flex flex-col pt-[740px] px-[145px] pb-[47px] items-start justify-end gap-[10px]">
        <InputGroup themeProps={themeProps}/>
      </div>
    </div>
  );
};

export default ChatPage;