import { useState, useEffect } from "react";
import InputGroup from "@/components/chat-page/ChatInput";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { getChat, saveNewChat, updateChat } from "@/api/dbapi";
import MessageComponent from "@/components/chat-page/message";

const ChatPage: React.FC = () => {
	const [chatLog, setChatLog] = useState<Chat | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const getChatLog = async () => {
			await getChat("testchat").then((chat) => {
				setChatLog(chat);
				setMessages(chat.messages);
			}).catch((err) => {
				console.error(err);
			});
		}
		getChatLog();
		document.body.style.overflow = "hidden";
		return () => {
		document.body.style.overflow = "auto"; // i might be royally retarded but uhh yeah this is the only way i could disable scrolling while keeping the vh calc
		};
	}, []);
	
	const handleMessageSend = async (message: string) => {
		console.log(message);
		let isNewChat = false;
		let chat;
		if(chatLog === null) {
			isNewChat = true;
			console.log("new chat");
			chat = new Chat();
		}else{
			chat = chatLog;
		}
		if(chat === null) return;
		chat._id = "testchat";
		console.log(chat);
		let newMessage = new Message()
		newMessage.text = message;
		newMessage.user = "testuser";
		newMessage.timestamp = Date.now();
		newMessage.origin = "ConstructOS";
		newMessage.isHuman = true;
		newMessage.attachments = [];
		chat.addMessage(newMessage);
		setChatLog(chat);
		if(isNewChat) {
			console.log("saving new chat");
			await saveNewChat(chat);
		}else{
			console.log("updating chat");
			await updateChat(chat);
		}
		setMessages([...messages, newMessage])
	};

	return (
		<div className="relative w-full h-screen flex flex-col items-center justify-center">
			<div className="box-border w-4/6 h-[calc(100vh-70px)] flex flex-col gap-6">
				<div className="h-5/6">
					<div className="themed-message-box">
						{Array.isArray(messages) && messages.map((message) => {
							return (
								<MessageComponent key={message.timestamp} message={message} />
							);
						})}
					</div>
				</div>
				<div className="w-full">
					<InputGroup sendMessage={handleMessageSend} />
				</div>
			</div>
		</div>
	);
	
};

export default ChatPage;
