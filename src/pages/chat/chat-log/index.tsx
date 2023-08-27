import { useState, useEffect, useRef } from "react";
import InputGroup from "@/components/chat-page/chat-input";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { getChat, saveNewChat, updateChat } from "@/api/dbapi";
import MessageComponent from "@/components/chat-page/message";
import { addUserMessage, getLoadingMessage, regenerateMessage, sendMessage, wait } from "../helpers";
import { getActiveConstructList } from "@/api/constructapi";
import ChatInfo from "@/components/chat-page/chat-info";
interface ChatLogProps {
	chatLogID?: string;
}
const ChatLog = (props: ChatLogProps) => {
	const { chatLogID } = props;
	const [chatLog, setChatLog] = useState<Chat | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);

	useEffect(() => {
		if(chatLogID !== undefined) {
			const getChatLog = async () => {
				await getChat(chatLogID).then((chat) => {
					setChatLog(chat);
					setMessages(chat.messages);
				}).catch((err) => {
					console.error(err);
				});
			}
			getChatLog();
		}
	}, [chatLogID !== undefined && chatLogID !== null]);

	useEffect(() => {
		// scroll to last message when messages state updates
		if (messagesEndRef.current !== null) {
		  messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleMessageSend = async (message: string) => {
		if(hasSentMessage === true) return;
		setHasSentMessage(true);
		let chat;
		chat = chatLog;
		if(chat === null) return;
		let newMessage = addUserMessage(message);
		chat.addMessage(newMessage);
		if(messages.includes(newMessage)){
			console.log("message already exists");
		}else{
			setMessages(prevMessages => [...prevMessages, newMessage]);
		}
		await wait(750);
		for (let i = 0; i < chat.constructs.length; i++) {
			let loadingMessage = await getLoadingMessage(chat.constructs[i]);
			loadingMessage._id += "-loading";
			setMessages(prevMessages => [...prevMessages, loadingMessage]);
			let botMessage = await sendMessage(chat, chat.constructs[i]);
			if (botMessage){
				chat.addMessage(botMessage);
				setMessages(prevMessages => {
					// Remove the loadingMessage
					const updatedMessages = prevMessages.filter(msg => msg._id !== loadingMessage._id);
	
					// Add the botMessage
					if (botMessage !== null) {
						updatedMessages.push(botMessage);
					}
	
					return updatedMessages;
				});
			}
		}
		setChatLog(chat);
		await updateChat(chat);
		setHasSentMessage(false);
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

	const editMessage = (messageID: string, newText: string) => {
		if(chatLog === null) return;
		chatLog.editMessageText(messageID, newText);
		setChatLog(chatLog);
		updateChat(chatLog);
		let newMessages = messages.map((message) => {
			if(message._id === messageID) {
				message.text = newText;
			}
			return message;
		});
		setMessages(newMessages);
	}

	const onRegenerate = async (messageID: string, messageText: string) => {
		if(chatLog === null) return;
		await regenerateMessage(chatLog, messageText, messageID).then((newMessage) => {
			if(newMessage === null) return;
			chatLog.editMessageText(messageID, newMessage);
			setChatLog(chatLog);
			let newMessages = messages.map((message) => {
				if(message._id === messageID) {
					message.text = newMessage;
				}
				return message;
			});
			setMessages(newMessages);
		});
	}

	const handleDetailsChange = async (newChat: Chat) => {
		setChatLog(newChat);
		await updateChat(newChat)
	}

	return (
		<div className="flex flex-row w-full h-full items-center justify-center overflow-y-hidden">
			<div className="box-border w-3/6 h-[calc(100vh-70px)] flex flex-col gap-4">
				<div className="w-full flex flex-row items-center justify-end">
					{chatLog === null ? (
						null
					) : (
						<ChatInfo chat={chatLog} onEdit={handleDetailsChange}/>
					)}
				</div>
				<div className="h-5/6">
					<div className="themed-message-box">
						{Array.isArray(messages) && messages.map((message) => {
							return (
								<MessageComponent key={message._id} message={message} onDelete={deleteMessage} onEdit={editMessage} onRegenerate={onRegenerate}/>
							);
						})}
						<div ref={messagesEndRef}></div>
					</div>
				</div>
				<div className="w-full">
					<InputGroup sendMessage={handleMessageSend} />
				</div>
			</div>
		</div>
	);
	
};

export default ChatLog;