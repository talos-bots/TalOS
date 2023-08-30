import React, { useEffect, useState } from "react";
import "./InputGroup.scss"; // Import the Sass file
import { PlusCircle, SendHorizonal } from "lucide-react";
interface InputGroupProps {
    sendMessage: (event: any) => void;
}
const InputGroup = (props: InputGroupProps) => {
  	const { sendMessage } = props;
	const [message, setMessage] = useState<string>("");
	return (
		<div className="flex items-center w-full justify-between rounded-full bg-theme-root backdrop-blur-sm box-border py-1 px-2.5 border-theme-border border-theme-border-width theme-border-style">
			<button className={`flex cursor-pointer border-theme-border border-theme-border-width theme-border-style justify-center items-center p-0 relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75 bg-theme-box`}>
				<PlusCircle size={16}/>
			</button>
			<textarea
				autoComplete="off"
				className="border-none font-inter text-lg bg-transparent flex-grow h-10 overflow-hidden py-0 px-5 box-border items-start justify-center max-h-8 resize-none overflow-y-auto"
				value={message}
				placeholder="Type your message..."
				style={{ outline: "none" }}
				required={true}
				onChange={(e) => setMessage(e.target.value)}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						sendMessage(message);
						setMessage("");
					}
				}}
			/>
			<button className={`flex cursor-pointer border-theme-border border-theme-border-width theme-border-style justify-center items-center p-0 relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75 bg-theme-box`} onClick={() => { sendMessage(message); setMessage('') }}>
				<SendHorizonal size={16}/>
			</button>
		</div>
	);
	
};

export default InputGroup;
