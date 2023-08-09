import React, { useState } from 'react';
import { Link, Menu } from 'lucide-react';

const ChatPage: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center gap-[44px] bg-[url('background/defaultbg.svg')] text-left text-[12px] text-white font-inter">
      <div className="w-full h-screen overflow-hidden shrink-0 flex flex-col items-center justify-end">
        <div className="relative rounded-t-31xl rounded-b-none bg-black bg-opacity-25 w-[1209px] h-[73px] overflow-hidden shrink-0 rounded-tr-3xl rounded-tl-3xl">
          <div className="absolute top-[0px] left-[11px] w-[73px] h-[73px] overflow-hidden flex flex-col items-center justify-center">
            <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative w-9 h-[37px] overflow-hidden shrink-0">
              <Link
                className="absolute h-[88.71%] w-[86.55%] top-[5.65%] right-[7.89%] bottom-[5.64%] left-[5.56%] max-w-full overflow-hidden max-h-full"
              />
            </button>
          </div>
          <input
            className="border-none bg-[#121212] absolute top-[12px] left-[83.5px] rounded-[25px] w-[1041px] h-[53px] px-4 text-white"
            type="text"
            placeholder="Type your message here..."
            required
            id="ChatInput"
          />
          <button
            className="cursor-pointer [border:none] p-0 bg-[transparent] absolute top-[18px] left-[1141px] w-9 h-[37px] overflow-hidden"
            id="ChatInputMenu"
          >
            <Menu
              size={100}
              className="absolute top-[5.65%] right-[7.89%] bottom-[5.64%] left-[5.56%] max-w-full overflow-hidden max-h-full"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage;