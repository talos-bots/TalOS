import { FunctionComponent, useState, useEffect } from "react";
import InputGroup from "@/components/chat-page/ChatInput";
import MessageRenderer from "@/components/chat-page/message-renderer";

const ChatPage: React.FC = () => {
	useEffect(() => {
		document.body.style.overflow = "hidden";

		return () => {
		document.body.style.overflow = "auto"; // i might be royally retarded but uhh yeah this is the only way i could disable scrolling while keeping the vh calc
		};
	}, []);

	const handleMessageSend = async (message: string) => {
		console.log(message);
	};

	return (
		<div className="relative w-full h-screen flex flex-col items-center justify-center">
			<div className="box-border w-4/6 h-[calc(100vh-70px)] flex flex-col gap-6">
				<div className="h-5/6">
					<MessageRenderer />
				</div>
				<div className="w-full">
					<InputGroup sendMessage={handleMessageSend} />
				</div>
	
			</div>
		</div>
	);
	
};

export default ChatPage;
