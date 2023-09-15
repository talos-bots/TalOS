import React, { useEffect, useState } from "react";
import { PlusCircle, SendHorizonal } from "lucide-react";
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
		<div className="chat-input-bar">
			<input 
				type="file" 
				onChange={(event) => handleFileUpload(event)} 
				style={{ display: 'none' }} 
				id="file-upload" 
				multiple
			/>
			<label htmlFor="file-upload" className={`message-button`}>
				<PlusCircle size={26}/>
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
			<button className={`message-button`} onClick={() => { sendMessage(message, attachments); setMessage(''); setAttachments([]); }}>
				<SendHorizonal size={26}/>
			</button>
		</div>
	);
};

export default InputGroup;
