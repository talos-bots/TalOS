import React, { useEffect, useState } from "react";
import "./InputGroup.scss"; // Import the Sass file
import { PlusCircle, SendHorizonal } from "lucide-react";
import { Attachment } from "@/classes/Attachment";
interface InputGroupProps {
    sendMessage: (message: string, files?: File[]) => void;
}
const InputGroup = (props: InputGroupProps) => {
  	const { sendMessage } = props;
	const [message, setMessage] = useState<string>("");
	const [attachments, setAttachments] = useState<File[]>([]);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const fileArray = Array.from(files);
			setAttachments([...attachments, ...fileArray]);
		}
	};

	return (
		<div className="flex items-center w-full justify-between rounded-full bg-theme-root backdrop-blur-sm box-border py-1 px-2.5 border-theme-border border-theme-border-width theme-border-style">
			<input 
				type="file" 
				onChange={(event) => handleFileUpload(event)} 
				style={{ display: 'none' }} 
				id="file-upload" 
				multiple
			/>
			<label htmlFor="file-upload" className={`flex cursor-pointer border-theme-border border-theme-border-width theme-border-style justify-center items-center p-0 relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75 bg-theme-box`}>
				<PlusCircle size={16}/>
			</label>
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
						console.log(attachments)
						sendMessage(message, attachments);
						setMessage("");
						if(attachments.length > 0){
							setAttachments([]);
						}
					}
				}}
			/>
			<button className={`flex cursor-pointer border-theme-border border-theme-border-width theme-border-style justify-center items-center p-0 relative rounded-3xl w-[35px] h-[35px] overflow-hidden shrink-0 transition-all duration-125 hover:opacity-75 bg-theme-box`} onClick={() => { sendMessage(message, attachments); setMessage(''); setAttachments([]); }}>
				<SendHorizonal size={16}/>
			</button>
		</div>
	);
};

export default InputGroup;
