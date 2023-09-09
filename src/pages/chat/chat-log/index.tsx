import { useState, useEffect, useRef } from "react";
import InputGroup from "@/pages/chat/chat-input";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { getChat, getUser, saveNewChat, updateChat } from "@/api/dbapi";
import MessageComponent from "@/pages/chat/chat-log/message";
import { addUserMessage, getLoadingMessage, regenerateMessage, sendMessage, wait } from "../helpers";
import { Alert } from "@material-tailwind/react";
import ChatInfo from "@/pages/chat/chat-info";
import Loading from "@/components/loading";
import { User } from "@/classes/User";
import { addVectorFromMessage } from "@/api/vectorapi";
interface ChatLogProps {
	chatLogID?: string;
}
const ChatLog = (props: ChatLogProps) => {
	const { chatLogID } = props;
	const [chatLog, setChatLog] = useState<Chat | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [numToDisplay, setNumToDisplay] = useState<number>(35);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

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
			getChatLog().then(() => {
				setIsLoaded(true);
			}).catch((err) => {
				console.error(err);
			});
			let userID = JSON.parse(localStorage.getItem("currentUser")?.toString() || "");
			if(userID !== null && userID !== undefined){
				getUser(userID).then((user) => {
					if(user === null) throw new Error("User not found");
					setCurrentUser(user);
				}).catch((err) => {
					console.error(err);
				});
			}
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
		let chat: Chat | null = chatLog;
		if(chat === null) return;
		if(message !== "" && message !== null && message !== undefined && message !== " " && message !== "\n"){
			let newMessage = addUserMessage(message, currentUser);
			chat.addMessage(newMessage);
			if(messages.includes(newMessage)){
				console.log("message already exists");
			}else{
				setMessages(prevMessages => [...prevMessages, newMessage]);
				if(chat?.doVector === true){
					addVectorFromMessage(chat._id, newMessage);
				}
			}
		}
		await wait(750);
		for (let i = 0; i < chat.constructs.length; i++) {
			let loadingMessage = await getLoadingMessage(chat.constructs[i]);
			loadingMessage._id += "-loading";
			setMessages(prevMessages => [...prevMessages, loadingMessage]);
			let botMessage = await sendMessage(chat, chat.constructs[i], currentUser);
			if (botMessage !== null){
				chat.addMessage(botMessage);
				setMessages(prevMessages => {
					// Remove the loadingMessage
					const updatedMessages = prevMessages.filter(msg => msg._id !== loadingMessage._id);
		
					// Add the botMessage
					if (botMessage !== null) {
						updatedMessages.push(botMessage);
						if(chat?.doVector === true){
							addVectorFromMessage(chat._id, botMessage);
						}
					}
		
					return updatedMessages;
				});
			}else{
				setMessages(prevMessages => {
					const updatedMessages = prevMessages.filter(msg => msg._id !== loadingMessage._id);
					return updatedMessages;
				});
				setError("Invalid response from LLM endpoint. Check your settings and try again.");
			}
		}
		setChatLog(chat);
		await updateChat(chat);
		setHasSentMessage(false);
		setNumToDisplay(35);
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
		setMessages(newChat.messages);
		await updateChat(newChat)
	}

	if(!isLoaded) return (<Loading/>);

	return (
		<>
		{error !== null ? (
			<Alert color="red" 
				className="absolute top-8 right-8 w-3/12" 
				style={{zIndex: 1000}} 
				onClose={() => setError(null)}
				animate={{
					mount: { y: 0 },
					unmount: { y: 100 },
				}}
				>
				{error}
			</Alert>
		) : (
			null
		)}
		<div className="flex flex-row w-full h-full items-center justify-center overflow-y-hidden"
			onScroll={(e) => {
				if(e.currentTarget.scrollTop === 0){
					setNumToDisplay(numToDisplay + 35);
				}
			}}
		>
			<div className="box-border w-3/6 h-[calc(100vh-70px)] flex flex-col gap-2">
				<div className="w-full flex flex-row items-center justify-end">
					{chatLog === null ? (
						null
					) : (
						<ChatInfo chat={chatLog} onEdit={handleDetailsChange}/>
					)}
				</div>
				<div className="h-5/6">
					<div className="themed-message-box">
						{Array.isArray(messages) && messages.slice(messages.length - numToDisplay, messages.length).map((message) => {
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
		</>
	);
	
};

export default ChatLog;