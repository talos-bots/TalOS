import { useState, useEffect, useRef } from "react";
import InputGroup from "@/pages/chat/chat-input";
import { Chat } from "@/classes/Chat";
import { Message } from "@/classes/Message";
import { getChat, getConstruct, getStorageValue, getUser, saveNewAttachment, saveNewChat, updateChat } from "@/api/dbapi";
import MessageComponent from "@/pages/chat/chat-log/message";
import { addUserMessage, createSystemMessage, doSlashCommand, findFirstMention, getLoadingMessage, isConstructMentioned, regenerateMessage, regenerateUserMessage, sendMessage, sendThoughts, wait } from "../helpers";
import { Alert } from "@material-tailwind/react";
import ChatInfo from "@/pages/chat/chat-info";
import Loading from "@/components/loading";
import { User } from "@/classes/User";
import { addVectorFromMessage } from "@/api/vectorapi";
import { getDoCaptioning, getDoEmotions, getImageCaption, getTextEmotion } from "@/api/llmapi";
import { Attachment } from "@/classes/Attachment";
import { ipcRenderer } from "electron";
import ChatConfigPane from "../chat-config-pane";
import { Link } from "react-router-dom";
import SpriteDisplay from "@/components/sprite";
import { Construct, ConstructChatConfig, DefaultChatConfig } from "@/classes/Construct";
interface ChatLogProps {
	chatLogID?: string;
	goBack: () => void;
	user: User | null;
}
const ChatLog = (props: ChatLogProps) => {
	const { chatLogID, goBack, user } = props;
	const [chatLog, setChatLog] = useState<Chat | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [lastBotMessage, setLastBotMessage] = useState<Message | null>(null);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [numToDisplay, setNumToDisplay] = useState<number>(40);
	const [currentUser, setCurrentUser] = useState<User | null>(user);
	const [doEmotions, setDoEmotions] = useState<boolean>(false);
	const [doCaptioning, setDoCaptioning] = useState<boolean>(false);
	const [doGreetings, setDoGreetings] = useState<boolean>(false);
	const [characterMode, setCharacterMode] = useState<boolean>(false);
	const [doMultiline, setDoMultiline] = useState<boolean>(false);
	const [numberOfMessagesToSend, setNumberOfMessagesToSend] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [openChatConfig, setOpenChatConfig] = useState<boolean>(false);
	const [chatPaneClose, setChatPaneClose] = useState<boolean>(false);
	const [wasPoked, setWasPoked] = useState<boolean>(false);
	const [hasSentGreetings, setHasSentGreetings] = useState<boolean>(false);

	const filteredMessages = messages.filter((message) => {
		if(searchTerm === "") return true;
		if(searchTerm.startsWith("from:")){
			let user = searchTerm.split(":")[1];
			if(message.user.toLowerCase().includes(user.toLowerCase())) return true;
			return false;
		}
		if(searchTerm.startsWith("origin:")){
			let origin = searchTerm.split(":")[1];
			if(message.origin.toLowerCase().includes(origin.toLowerCase())) return true;
			return false;
		}
		if(message.text.toLowerCase().includes(searchTerm.toLowerCase())) return true;
		if(message.user.toLowerCase().includes(searchTerm.toLowerCase())) return true;
		if(message.origin.toLowerCase().includes(searchTerm.toLowerCase())) return true;
		if(message.participants.includes(searchTerm.toLowerCase())) return true;
		if(message.attachments.length > 0){
			for(let i = 0; i < message.attachments.length; i++){
				if(message.attachments[i].name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
				if(message.attachments[i].type.toLowerCase().includes(searchTerm.toLowerCase())) return true;
				if(message.attachments[i].fileext.toLowerCase().includes(searchTerm.toLowerCase())) return true;
				if(message.attachments[i].metadata !== undefined && message.attachments[i].metadata !== null){
					if(message.attachments[i].metadata.caption !== undefined && message.attachments[i].metadata.caption !== null){
						if(message.attachments[i].metadata.caption.toLowerCase().includes(searchTerm.toLowerCase())) return true;
					}
				}
			}
		}
		return false;
	});

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
		findLastBotMessage();
	}, [messages]);

	useEffect(() => {
		if(chatLog !== null){
			addGreetings(chatLog);
		}
	}, [chatLog]);

	const findLastBotMessage = () => {
		if(chatLog === null) return;
		let lastBotMessage = chatLog.messages[chatLog.messages.length - 1];
		if(lastBotMessage?.isHuman === true){
			lastBotMessage = chatLog.messages[chatLog.messages.length - 2];
		}
		let i = 1;
		do {
			lastBotMessage = chatLog.messages[chatLog.messages.length - i];
			i++;
		} while (lastBotMessage?.isHuman === true || (lastBotMessage?.userID === 'System' && lastBotMessage?.user === 'System'));
		setLastBotMessage(lastBotMessage);
	}

	const addGreetings = async (chat: Chat) => {
		if(chat === null) return;
		if(hasSentGreetings === true) return;
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
						if(!messages.includes(newMessage)){
							setMessages(prevMessages => {
								if (!prevMessages.includes(newMessage)) {
								   return [...prevMessages, newMessage];
								}
								return prevMessages;
							});
							chat.addMessage(newMessage);
							await updateChat(chat);
							setChatLog(chat);
							setHasSentGreetings(true);
						}
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
		let newMessage: Message;
		if(message.startsWith("/")){
			await doSlashCommand(message, chatLog, currentUser, setChatLog, setMessages, updateChat, setError, getBotResponse);
			return;
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
					saveNewAttachment(attachment);
				} catch (error) {
					console.error("File reading error", error);
				}
			}
			newAttachments = uploadedAttachments;
		}
		if((message !== "" && message !== null && message !== undefined && message !== " " && message !== "\n") || (newAttachments.length > 0)){
			newMessage = addUserMessage(message, currentUser);
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
			if(!messages.includes(newMessage)){
				setMessages(prevMessages => [...prevMessages, newMessage]);
			}
			handlePostUserMessage(newMessage);
		}
		await wait(750);
		let constructList: Construct[] = [];
		if(chatLog === null) return;
		for(let i = 0; i < chatLog.constructs.length; i++){
			let construct = await getConstruct(chat.constructs[i]);
			if(construct !== null){
				constructList.push(construct);
			}
		}
		if(constructList.length < 1) return;
		let mentionedConstruct = findFirstMention(chat.lastMessage.text, constructList);
		if (mentionedConstruct !== false) {
			// Find the index of the mentioned construct
			let mentionedIndex = -1;
			for (let i = 0; i < constructList.length; i++) {
				if (constructList[i]._id === mentionedConstruct) {
					console.log(constructList[i].name + " was mentioned");
					mentionedIndex = i;
					break;
				}
			}
	
			// If the mentioned construct was found in the array,
			// rearrange the array to make it the first element
			if (mentionedIndex !== -1) {
				const [mentioned] = constructList.splice(mentionedIndex, 1);
				constructList.unshift(mentioned);
			}
		}
		for (let i = 0; i < constructList.length; i++) {
			let replyChat = await getBotResponse(chat, constructList[i], currentUser);
			if(replyChat !== undefined){
				chat = replyChat;
				setChatLog(chat);
				await updateChat(chat);
			}
		}
		let hasBeenMention = true;
		let lastMessageText = chat?.lastMessage?.text;
		let iterations = 0;
		
		do {
			if (chat?.lastMessage?.text === undefined) break;
			
			if (iterations > 0) {
				if (lastMessageText === chat.lastMessage.text) break;
				lastMessageText = chat.lastMessage.text;
			}
		
			iterations++;
			hasBeenMention = false;
		
			for (let i = 0; i < constructList.length; i++) {
				if (isConstructMentioned(lastMessageText, constructList[i])) {
					if(constructList[i]._id === chat.lastMessage.userID) break;
					hasBeenMention = true;
					break;
				}
			}
		
			if (hasBeenMention) {
				for (let i = 0; i < constructList.length; i++) {
					let replyChat = await getBotResponse(chat, constructList[i], currentUser);
					if(replyChat !== undefined){
						chat = replyChat;
						setChatLog(chat);
						await updateChat(chat);
					}
				}
			}
		} while (hasBeenMention);   
		setHasSentMessage(false);
		setNumToDisplay(40);
	};	

	const getBotResponse = async (chat: Chat, activeConstruct: Construct, currentUser: User | null) => {
		let config = activeConstruct?.defaultConfig;
		if(config === undefined || config === null) return;
		for(let i = 0; i < chat.chatConfigs.length; i++){
			if(chat.chatConfigs[i]._id === currentUser?._id){
				//@ts-ignore
				config = chat.chatConfigs[i];
				return;
			}
		}
		if(activeConstruct === null) return;
		if(config === undefined) return;
		if(config.doLurk === true) return;
		let wasMentioned = isConstructMentioned(chat.lastMessage.text, activeConstruct);
		const wasMentionedByHuman = chat.lastMessage.isHuman && wasMentioned;
		const wasHuman = chat.lastMessage.isHuman;
		if(wasMentionedByHuman){
			if(config.replyToUserMention >= Math.random()){
				let replyLog = await doBotReply(chat, activeConstruct, currentUser, config);
				if(replyLog !== undefined){
					chat = replyLog;
				}
			}
		}else if(wasMentioned && chat.lastMessage.userID === activeConstruct._id){
			if(config.replyToConstructMention >= Math.random()){
				let replyLog = await doBotReply(chat, activeConstruct, currentUser, config);
				if(replyLog !== undefined){
					chat = replyLog;
				}
			}
		}else{
			if(wasHuman){
				if(config.replyToUser >= Math.random()){
					let replyLog = await doBotReply(chat, activeConstruct, currentUser, config);
					if(replyLog !== undefined){
						chat = replyLog;
					}
				}
			}else{
				if(config.replyToConstruct >= Math.random()){
					let replyLog = await doBotReply(chat, activeConstruct, currentUser, config);
					if(replyLog !== undefined){
						chat = replyLog;
					}
				}
			}
		}
		return chat;
	}

	const handlePostUserMessage = async (newMessage: Message) => {
		if(doEmotions === true){
			newMessage.emotion = await getTextEmotion(newMessage.text);
		}
		if(chatLog?.doVector === true){
			addVectorFromMessage(chatLog._id, newMessage);
		}
		setMessages(prevMessages => {
			// Remove the loadingMessage
			const updatedMessages = prevMessages.filter((message) => {
				return message._id !== newMessage?._id;
			});

			// Add the botMessage
			if (newMessage !== null) {
				updatedMessages.push(newMessage);
			}

			return updatedMessages;
		});
		chatLog?.editMessageEmotion(newMessage._id, newMessage.emotion);
		setChatLog(chatLog);
		if(chatLog !== null){
			await updateChat(chatLog);
		}
	};

	const doBotReply = async (chat: Chat, activeConstruct: Construct, currentUser: User | null, config: DefaultChatConfig | ConstructChatConfig) => {
		let botMessage: Message | null = null;
		if(config === undefined || config === null) return;
		if(config.haveThoughts !== undefined && config.haveThoughts !== null && config.haveThoughts === true){
			let thinkMessage: Message | null = null;
			if(config.thoughtChance > Math.random()){
				if(config.thinkBeforeChat){
					thinkMessage = await sendThoughts(chat, activeConstruct, currentUser);
				}else{
					botMessage = await sendMessage(chat, activeConstruct, currentUser, doMultiline, numberOfMessagesToSend);
				}
				if(thinkMessage !== null){
					chat.addMessage(thinkMessage);
					if(doEmotions === true){
						thinkMessage.emotion = await getTextEmotion(thinkMessage.text);
					}
					if(chat?.doVector === true){
						addVectorFromMessage(chat._id, thinkMessage);
					}
					setMessages(prevMessages => {
						// Remove the loadingMessage
						const updatedMessages = prevMessages.filter((message) => {
							return message._id !== thinkMessage?._id;
						});
			
						// Add the botMessage
						if (thinkMessage !== null) {
							updatedMessages.push(thinkMessage);
						}
			
						return updatedMessages;
					});
					if(thinkMessage !== null){
						setLastBotMessage(thinkMessage);
					}else{
						setError("No response from LLM. Check your connection settings and try again.");
					}
				}
			}
		}else{
			botMessage = await sendMessage(chat, activeConstruct, currentUser, doMultiline, numberOfMessagesToSend);
		}
		if(botMessage === null){
			botMessage = await sendMessage(chat, activeConstruct, currentUser, doMultiline, numberOfMessagesToSend);
		}
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
				const updatedMessages = prevMessages.filter((message) => {
					return message._id !== botMessage?._id;
				});
	
				// Add the botMessage
				if (botMessage !== null) {
					updatedMessages.push(botMessage);
				}
	
				return updatedMessages;
			});
			if(botMessage !== null){
				setLastBotMessage(botMessage);
			}
		}else{
			setMessages(prevMessages => {
				const updatedMessages = prevMessages;
				return updatedMessages;
			});
		}
		if(config.haveThoughts !== undefined && config.haveThoughts !== null && config.haveThoughts === true && config.thinkBeforeChat !== undefined && config.thinkBeforeChat !== null && config.thinkBeforeChat === false){
			let thinkMessage: Message | null = null;
			if(config.thoughtChance > Math.random()){
				thinkMessage = await sendThoughts(chat, activeConstruct, currentUser);
				if(thinkMessage !== null){
					chat.addMessage(thinkMessage);
					if(doEmotions === true){
						thinkMessage.emotion = await getTextEmotion(thinkMessage.text);
					}
					if(chat?.doVector === true){
						addVectorFromMessage(chat._id, thinkMessage);
					}
					setMessages(prevMessages => {
						// Remove the loadingMessage
						const updatedMessages = prevMessages.filter((message) => {
							return message._id !== thinkMessage?._id;
						});
						
						// Add the botMessage
						if (thinkMessage !== null) {
							updatedMessages.push(thinkMessage);
						}

						return updatedMessages;
					});
					if(thinkMessage !== null){
						setLastBotMessage(thinkMessage);
					}else{
						setError("No response from LLM. Check your connection settings and try again.");
					}
				}
			}
		}
		if(botMessage === null){
			setError("No response from LLM. Check your connection settings and try again.");
		}
		setChatLog(chat);
		await updateChat(chat);
		return chat;
	}

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
		console.log(newChat.constructs);
		setChatLog(newChat);
		setMessages(newChat.messages);
		await updateChat(newChat)
	}

	const handleOpenSettings = async () => {
		if(openChatConfig === true){
			setChatPaneClose(true);
			await new Promise(r => setTimeout(r, 1050));
			setOpenChatConfig(!openChatConfig);
			setChatPaneClose(false);
			return;
		}
		setOpenChatConfig(!openChatConfig)
	}

	const sendPoke = async () => {
		const sysMessage = createSystemMessage(`[${user ? (user.nickname || user.name) : 'DefaultUser'} pokes ${lastBotMessage?.user || 'ConstructOS'}'s body.]`)
		if(messages.includes(sysMessage)) return;
		chatLog?.addMessage(sysMessage);
		setMessages(prevMessages => {
			if (!prevMessages.includes(sysMessage)) {
			   return [...prevMessages, sysMessage];
			}
			return prevMessages;
		});
		if(chatLog?.constructs[0] === undefined) return;
		let lastActiveConstruct = await getConstruct(chatLog?.constructs[0]);
		if(chatLog !== null && chatLog !== undefined && lastBotMessage !== null && lastBotMessage !== undefined){
			updateChat(chatLog);
			getBotResponse(chatLog, lastActiveConstruct, currentUser);
		}
	}

	if(!isLoaded) return (<Loading/>);

	return (
		<>
			{error !== null ? (
				<Alert color="red" 
					className="absolute top-8 right-8 w-3/12 flex flex-col gap-8 text-left justify-start items-start" 
					style={{zIndex: 1000}} 
					onClose={() => setError(null)}
					animate={{
						mount: { y: 0 },
						unmount: { y: 100 },
					}}
					>
					<div>
					<p>{error}</p>
					</div>
					<Link to="/settings" className="themed-button-small absolute right-10 top-10">Settings</Link>
				</Alert>
			) : (
				null
			)}
			<div className="w-full grid grid-cols-8 justify-center">
			<div className="col-span-2 box-border h-[calc(100vh-70px)] flex flex-col gap-2 overflow-x-hidden pt-4 pr-4">
				<SpriteDisplay constructID={lastBotMessage?.userID? lastBotMessage?.userID : "" } emotion={lastBotMessage?.emotion || 'neutral'} sendPoke={sendPoke}/>
			</div>
			<div className="col-span-4 box-border h-[calc(100vh-70px)] flex flex-col gap-2 overflow-x-hidden p-4">
				<div className="w-full flex flex-row items-center justify-end">
					{chatLog === null ? (
						null
					) : (
						<ChatInfo chat={chatLog} onEdit={handleDetailsChange} goBack={goBack} searchTerm={searchTerm} setSearchTerm={setSearchTerm} openSettings={handleOpenSettings}/>
					)}
				</div>
				<div className="flex-grow overflow-y-auto">
					<div className="themed-message-box">
						{chatLog?.messages && chatLog.messages.length > numToDisplay && (
							<div className="w-full flex flex-row items-center justify-center">
								<button className="themed-button-small" onClick={() => setNumToDisplay(numToDisplay + 40)}>Load More</button>
							</div>
						)}
						{Array.isArray(filteredMessages) && filteredMessages.slice(-numToDisplay).map((message, index) => {
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
			<div className="col-span-2 box-border h-[calc(100vh-70px)] flex flex-col gap-2 overflow-x-hidden pt-4 pb-4 pr-4">
			{openChatConfig === true && chatLog !== null && (
				<ChatConfigPane chat={chatLog} chatPanelClose={chatPaneClose} onEdit={handleDetailsChange}/>
			)}
			</div>
			</div>
		</>
	);
	
};

export default ChatLog;