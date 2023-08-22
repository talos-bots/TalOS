import React, { useEffect, useState } from "react";
import "./InputGroup.scss"; // Import the Sass file
interface InputGroupProps {
    sendMessage: (event: any) => void;
}
const InputGroup = (props: InputGroupProps) => {
  	const { sendMessage } = props;
	const [message, setMessage] = useState<string>("");
	return (
		<div className="flex items-center w-full justify-between rounded-full bg-black bg-opacity-25 backdrop-blur-sm box-border py-1 px-2.5 border-[1px] border-solid themed-chat-input">
			<button className={`cursor-pointer p-0 themed-chat-button relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`}>
				<img className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden" alt="" src="/chat-page-assets/pluscircle.svg" />
			</button>
			<input
				className="border-none font-inter text-lg bg-transparent flex-grow h-10 overflow-hidden py-0 px-5 box-border items-start justify-center"
				type="text"
				value={message}
				placeholder="Type your message..."
				style={{ outline: "none" }}
				required={true}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						if (message === "") {
							return;
						}
						sendMessage(message);
						setMessage("");
					}
				}}
			/>
			<button className={`cursor-pointer border-none p-0 themed-chat-button relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75`} onSubmit={() => { sendMessage(message); setMessage('') }}>
				<img className="absolute top-[10px] left-[10px] w-[15px] h-[15px] overflow-hidden" alt="" src="/chat-page-assets/sendhorizonal.svg" />
			</button>
		</div>
	);
	
};

export default InputGroup;
