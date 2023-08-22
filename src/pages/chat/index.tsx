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
		<div className={`relative w-full flex flex-col items-center justify-center`}>
			<div className="box-border w-4/6 h-[calc(100vh-70px)] grid grid-cols-1 items-center justify-center">
				<div className="col-span-1 flex flex-col w-full h-full gap-4 justify-center items-end">
					<div className="w-full h-5/6 pt-4">
						<MessageRenderer />
					</div>
					<div className="w-full h-1/6">
						<InputGroup sendMessage={handleMessageSend}/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
