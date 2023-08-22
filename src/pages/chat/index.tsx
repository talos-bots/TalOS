import { useState, useEffect } from "react";
import InputGroup from "@/components/chat-page/chat-input";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { getChat, saveNewChat, updateChat } from "@/api/dbapi";
import MessageComponent from "@/components/chat-page/message";
import { addUserMessage, sendMessage } from "./helpers";
import { getActiveConstructList } from "@/api/constructapi";

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
		let isNewChat = false;
		let chat;
		if(chatLog === null) {
			isNewChat = true;
			console.log("new chat");
			chat = new Chat();
		} else {
			chat = chatLog;
		}
		if(chat === null) return;
		chat._id = "testchat";
		if(chat.constructs.length === 0) {
			let activeConstructs = await getActiveConstructList();
			for(let i = 0; i < activeConstructs.length; i++) {
				chat.addConstruct(activeConstructs[i]);
			}
		}
		let newMessage = addUserMessage(message);
		chat.addMessage(newMessage);

		setMessages(prevMessages => [...prevMessages, newMessage]);

		for (let i = 0; i < chat.constructs.length; i++) {
			let botMessage = await sendMessage(chat, chat.constructs[i]);
			if (botMessage){
				chat.addMessage(botMessage);
				setMessages(prevMessages => {
					if(botMessage === null) return prevMessages; 
					const updatedMessages = [...prevMessages];
					updatedMessages.push(botMessage);
					return updatedMessages;
				});
			}
		}
		setChatLog(chat);
		if(isNewChat) {
			console.log("saving new chat");
			await saveNewChat(chat);
		} else {
			console.log("updating chat");
			await updateChat(chat);
		}
	};	

	const deleteMessage = (messageID: string) => {
		if(chatLog === null) return;
		chatLog.removeMessage(messageID);
		setChatLog(chatLog);
		updateChat(chatLog);
		let newMessages = messages.filter((message) => {
			return message._id !== messageID;
		});
		setMessages(newMessages);
	}

	return (
		<div className="relative w-full h-screen flex flex-col items-center justify-center">
			<div className="box-border w-3/6 h-[calc(100vh-70px)] flex flex-col gap-6">
				<div className="h-5/6">
					<div className="themed-message-box">
						{Array.isArray(messages) && messages.map((message) => {
							return (
								<MessageComponent key={message._id} message={message} onDelete={deleteMessage} />
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
