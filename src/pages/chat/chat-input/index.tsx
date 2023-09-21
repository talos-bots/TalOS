import React, { useEffect, useRef, useState } from "react";
import { PlusCircle, SendHorizonal, Smartphone, SmilePlus } from "lucide-react";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface InputGroupProps {
    sendMessage: (message: string, files?: File[]) => void;
}
const InputGroup = (props: InputGroupProps) => {
  	const { sendMessage } = props;
	const [message, setMessage] = useState<string>("");
	const [attachments, setAttachments] = useState<File[]>([]);
	const [showPicker, setShowPicker] = useState<boolean>(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
	
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const fileArray = Array.from(files);
			setAttachments([...attachments, ...fileArray]);
		}
	};

	const addEmoji = (emoji: any) => {
		const start = (textAreaRef.current?.selectionStart) || 0;
		const end = (textAreaRef.current?.selectionEnd) || 0;
		const currentMessage = message;
		const before = currentMessage.slice(0, start);
		const after = currentMessage.slice(end);
		const text = before + emoji.native + after;
		
		setMessage(text);
		setShowPicker(false);
		
		setTimeout(() => {
			textAreaRef.current?.setSelectionRange(start + emoji.native.length, start + emoji.native.length);
			textAreaRef.current?.focus();
		}, 0);
	};

	return (
		<>
		{showPicker && 
			<div className="absolute z-100 bottom-20">
				<Picker data={data} onEmojiSelect={addEmoji} className="" />
			</div>
		}
		<div className="chat-input-bar slide-in-bottom">
			<div className="flex flex-row gap-2">
				<input 
					type="file" 
					onChange={(event) => handleFileUpload(event)} 
					style={{ display: 'none' }} 
					id="file-upload" 
					multiple
				/>
				<label htmlFor="file-upload" className={`message-button`} title="Upload attachments">
					<PlusCircle size={'1.5rem'}/>
				</label>
				<button className={`message-button`} onClick={() => setShowPicker((prev) => !prev)} title="Pick an Emoji">
					<SmilePlus size={'1.5rem'}/>
				</button>
			</div>
			<textarea
				ref={textAreaRef}
				autoComplete="on"
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
			<button className={`message-button`} onClick={async () => { sendMessage(message, attachments); setMessage(''); setAttachments([]); }} title="Send message">
				<SendHorizonal size={'1.5rem'}/>
			</button>
		</div>
		</>
	);
};

export default InputGroup;
