import { useState, useEffect, useRef } from "react";
import InputGroup from "@/pages/chat/chat-input";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { getChat, getConstruct, getStorageValue, getUser, saveNewChat, updateChat } from "@/api/dbapi";
import MessageComponent from "@/pages/chat/chat-log/message";
import { addUserMessage, doSlashCommand, getLoadingMessage, regenerateMessage, regenerateUserMessage, sendMessage, wait } from "../helpers";
import { Alert } from "@material-tailwind/react";
import ChatInfo from "@/pages/chat/chat-info";
import Loading from "@/components/loading";
import { User } from "@/classes/User";
import { addVectorFromMessage } from "@/api/vectorapi";
import { getDoCaptioning, getDoEmotions, getImageCaption, getTextEmotion } from "@/api/llmapi";
import { Attachment } from "@/classes/Attachment";
import { ipcRenderer } from "electron";
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
	const [numToDisplay, setNumToDisplay] = useState<number>(60);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [doEmotions, setDoEmotions] = useState<boolean>(false);
	const [doCaptioning, setDoCaptioning] = useState<boolean>(false);
	const [doGreetings, setDoGreetings] = useState<boolean>(false);
	const [characterMode, setCharacterMode] = useState<boolean>(false);
	const [doMultiline, setDoMultiline] = useState<boolean>(false);
	const [numberOfMessagesToSend, setNumberOfMessagesToSend] = useState<number>(1);

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
			let userID = JSON.parse(localStorage.getItem("currentUser")?.toString() || "{}");
			if(userID !== null && userID !== undefined){
				getUser(userID).then((user) => {
					if(user === null) throw new Error("User not found");
					setCurrentUser(user);
				}).catch((err) => {
					console.error(err);
				});
			}
			ipcRenderer.on(`chat-message-${chatLogID}`, () => {
				getChat(chatLogID).then((chat) => {
					if(chat === null) return;
					if(chat.messages.length > messages.length){
						setMessages(chat.messages);
						setChatLog(chat);
					}
				}).catch((err) => {
					console.error(err);
				});
			});
		}
		return () => {
			ipcRenderer.removeAllListeners(`chat-message-${chatLogID}`);
		}
	}, [chatLogID !== undefined && chatLogID !== null]);

	useEffect(() => {
		// scroll to last message when messages state updates
		if (messagesEndRef.current !== null) {
		  messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
		getDoEmotions().then((value) => {
			setDoEmotions(value);
		}).catch((err) => {
			// console.error(err);
		});
		getDoCaptioning().then((value) => {
			setDoCaptioning(value);
		}).catch((err) => {
			// console.error(err);
		});
		getStorageValue('doGreetings').then((value) => {
            setDoGreetings(JSON.parse(value)? JSON.parse(value) : true);
        }).catch((err) => {
            // console.error(err);
        });
        getStorageValue('characterMode').then((value) => {
            setCharacterMode(JSON.parse(value)? JSON.parse(value) : false);
        }).catch((err) => {
            // console.error(err);
        });
		getStorageValue('doMultiline').then((value) => {
			setDoMultiline(JSON.parse(value)? JSON.parse(value) : false);
		}).catch((err) => {
			// console.error(err);
		});
		getStorageValue('messagesToSend').then((value) => {
			setNumberOfMessagesToSend(JSON.parse(value)? JSON.parse(value) : 25);
		}).catch((err) => {
			// console.error(err);
		});
	}, [messages]);

	useEffect(() => {
		if(chatLog !== null){
			addGreetings(chatLog);
		}
	}, [chatLog]);

	const addGreetings = async (chat: Chat) => {
		if(chat === null) return;
		if(messages.length < 1){
			if(chatLog !== null && chatLog !== undefined){
				if(doGreetings){
					const construct = await getConstruct(chatLog.constructs[0])
					if(construct !== null && construct !== undefined){
						if(construct.greetings.length < 1) return;
						let randomGreeting = construct?.greetings[Math.floor(Math.random() * construct?.greetings.length)];
						let newMessage = new Message();
						newMessage.text = randomGreeting;
						newMessage.avatar = construct?.avatar;
						newMessage.user = construct?.name;
						newMessage.origin = 'ConstructOS';
						newMessage.timestamp = new Date().getTime();
						newMessage.isCommand = false;
						newMessage.isPrivate = true;
						newMessage.isHuman = false;
						newMessage.participants = [currentUser?._id || 'DefaultUser', construct?._id];
						newMessage.userID = construct?._id;
						newMessage.emotion = 'neutral';
						newMessage.isThought = false;
						setMessages(prevMessages => [...prevMessages, newMessage]);
						chat.addMessage(newMessage);
						await updateChat(chat);
						setChatLog(chat);
					}
				}
			}
		}
	}

	const readFileAsDataURL = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result as string);
			};
			reader.onerror = () => {
				reject(new Error("File reading failed"));
			};
			reader.readAsDataURL(file);
		});
	};

	const handleMessageSend = async (message: string, attachments?: File[]) => {
		if(message.startsWith("/")){
			await doSlashCommand(message, chatLog, currentUser, setChatLog, setMessages, updateChat, setError);
		}
		if(hasSentMessage === true) return;
		setHasSentMessage(true);
		let chat: Chat | null = chatLog;
		if(chat === null) return;
		let newAttachments: Attachment[] = [];
		if (Array.isArray(attachments)) {
			const uploadedAttachments: Attachment[] = [];
			for (const file of attachments) {
				try {
					const dataUrl = await readFileAsDataURL(file);
					const base64Data = dataUrl.split(',')[1];
					let attachment = new Attachment();
					attachment.data = base64Data || '';
					attachment.fileext = file.name.split('.').pop() || '';
					attachment.name = file.name;
					attachment.type = file.type;
					uploadedAttachments.push(attachment);
				} catch (error) {
					console.error("File reading error", error);
				}
			}
			newAttachments = uploadedAttachments;
		}
		if((message !== "" && message !== null && message !== undefined && message !== " " && message !== "\n") || (newAttachments.length > 0)){
			let newMessage = addUserMessage(message, currentUser);
			if(doEmotions === true){
				newMessage.emotion = await getTextEmotion(newMessage.text);
			}
			if(newAttachments !== undefined && newAttachments.length > 0){
				for(let i = 0; i < newAttachments.length; i++){
					if(newAttachments[i] !== undefined && newAttachments[i] !== null){
						console.log(newAttachments[i]);
						if(newAttachments[i].type.includes("image")){
							if(doCaptioning === true){
								let caption = await getImageCaption(newAttachments[i].data);
								console.log(caption);
								if(caption !== null){
									newAttachments[i].metadata = {
										caption: caption,
										userID: currentUser?._id
									};
								};
							}
						}
					}
					newMessage.attachments.push(newAttachments[i]);
				}
			}
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
			let botMessage = await sendMessage(chat, chat.constructs[i], currentUser, doMultiline, numberOfMessagesToSend);
			if (botMessage !== null){
				chat.addMessage(botMessage);
				if(doEmotions === true){
					botMessage.emotion = await getTextEmotion(botMessage.text);
				}
				if(chat?.doVector === true){
					addVectorFromMessage(chat._id, botMessage);
				}
				setMessages(prevMessages => {
					// Remove the loadingMessage
					const updatedMessages = prevMessages.filter(msg => msg._id !== loadingMessage._id);
		
					// Add the botMessage
					if (botMessage !== null) {
						updatedMessages.push(botMessage);
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
		setNumToDisplay(60);
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

	const userRegenerate = async (messageID: string, messageText: string) => {
		if(chatLog === null) return;
		await regenerateUserMessage(chatLog, messageText, messageID).then((newMessage) => {
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

	const splitChatLogAtMessage = (messageID: string) => {
		if(chatLog === null) return;
		
		let index = chatLog.messages.findIndex(message => message._id === messageID);
		if (index === -1) return;
	
		let newChat = new Chat();
		newChat.name = chatLog.name + ` (${messageID} branch)`;
		newChat.constructs = chatLog.constructs;
		newChat.chatConfigs = chatLog.chatConfigs;
		newChat.humans = chatLog.humans;
		newChat.global = chatLog.global;
		newChat.doVector = chatLog.doVector;
		newChat.messages = chatLog.messages.slice(0, index + 1);
		saveNewChat(newChat);
		setChatLog(newChat);
		setMessages(newChat.messages);
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
								<MessageComponent key={message._id} message={message} onDelete={deleteMessage} onEdit={editMessage} onRegenerate={onRegenerate} onSplit={splitChatLogAtMessage} onUserRegenerate={userRegenerate}/>
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