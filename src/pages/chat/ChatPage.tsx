import React from 'react';
import { Paperclip, Menu } from 'lucide-react';

const ChatPage: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center gap-[44px] bg-[url('background/defaultbg.svg')] text-left text-[12px] text-white font-inter">
      <div className="w-full h-screen overflow-hidden shrink-0 flex flex-col items-center justify-end">
        <div className="relative rounded-t-31xl rounded-b-none bg-black bg-opacity-25 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] h-[73px] overflow-hidden shrink-0 rounded-tr-3xl rounded-tl-3xl">
          <div className="absolute top-0 left-[11px] w-[73px] h-[73px] overflow-hidden flex flex-col items-center justify-center">
            <button className="cursor-pointer border-none p-0 bg-transparent relative w-9 h-[37px] overflow-hidden shrink-0">
              <Paperclip className="absolute h-[88.71%] w-[86.55%] top-[5.65%] right-[7.89%] bottom-[5.64%] left-[5.56%] max-w-full overflow-hidden max-h-full" />
            </button>
          </div>
          <input
            className="border-none bg-[#121212] absolute top-[12px] left-[83.5px] rounded-[25px] w-[75%] md:w-[70%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%] h-[53px] px-4 text-white"
            type="text"
            placeholder="Type your message here..."
            required
            id="ChatInput"
          />
          <button
            className="cursor-pointer border-none p-0 bg-transparent absolute top-[18px] right-[30px] md:right-[40px] w-9 h-[37px] overflow-hidden"
            id="ChatInputMenu"
          >
            <Menu className="absolute h-[88.71%] w-[86.55%] top-[5.65%] right-[7.89%] bottom-[5.64%] left-[5.56%] max-w-full overflow-hidden max-h-full" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
