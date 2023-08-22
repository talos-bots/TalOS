import { FunctionComponent, useState, useEffect } from "react";
import InputGroup from "@/components/chat-page/ChatInput";

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
		<div className={`relative w-full flex flex-col items-center justify-center themed-root`}>
			<div className="box-border w-[1440px] h-[calc(100vh-70px)] shrink-0 flex flex-col pt-[740px] px-[145px] pb-[47px] items-start justify-end gap-[10px]">
				<InputGroup sendMessage={handleMessageSend}/>
			</div>
		</div>
	);
};

export default ChatPage;
