import { createContext, PropsWithChildren, useState } from "react"

interface iChatInput {
	text: string
	type: "send" | "reply" | "edit"
	messageId: string
}

interface iChatsData {
	getChatMessages: (chatId: string | null | undefined) => Record<string, iMessage>
	setChatMessages: (chatId: string, messages: iMessage[]) => void
	removeChatMessages: (chatId: string, messageIds: string[]) => void
	getChatInput: (chatId: string | null | undefined) => iChatInput
	setChatInput: (chatId: string, input: iChatInput) => void
}

const ChatsContext = createContext<iChatsData>({
	getChatMessages: () => ({}),
	setChatMessages: () => {},
	removeChatMessages: () => {},
	getChatInput: () => ({ text: "", type: "send", messageId: "" }),
	setChatInput: () => {}
})

const _ChatsProvider = (props: PropsWithChildren<{}>) => {
	const [messages, setMessages] = useState<Record<string, Record<string, iMessage>>>({})
	const [inputs, setInputs] = useState<Record<string, iChatInput>>({})

	const getChatMessages = (chatId: string | null | undefined) => {
		const chatMessages = {}
		if (typeof chatId !== "string" || !messages[chatId]) {
			return chatMessages
		}
		return messages[chatId]!
	}

	const setChatMessages = (chatId: string, chatMessages: iMessage[]) => {
		setMessages(messages => ({
			...messages,
			[chatId]: {
				...messages[chatId],
				...chatMessages
					.filter(message => message.chatId === chatId)
					.reduce<Record<string, iMessage>>(
						(acc, message) => ({ ...acc, [message.id]: message }),
						{}
					)
			}
		}))
	}

	const removeChatMessages = (chatId: string, messageIds: string[]) => {
		setMessages(messages => ({
			...messages,
			[chatId]: {
				...Object.keys(messages[chatId] || {})
					.filter(key => !messageIds.includes(key))
					.reduce((obj, key) => ({ ...obj, [key]: messages[chatId]![key] }), {})
			}
		}))
	}

	const getChatInput = (chatId: string | null | undefined) => {
		const chatInput: iChatInput = { text: "", type: "send", messageId: "" }
		if (typeof chatId !== "string" || !inputs[chatId]) {
			return chatInput
		}
		return inputs[chatId]!
	}

	const setChatInput = (chatId: string, input: iChatInput) => {
		setInputs(inputs => ({
			...inputs,
			[chatId]: input
		}))
	}

	return (
		<ChatsContext.Provider
			value={{
				getChatMessages,
				setChatMessages,
				removeChatMessages,
				getChatInput,
				setChatInput
			}}>
			{props.children}
		</ChatsContext.Provider>
	)
}

export { _ChatsProvider as ChatsProvider }
export default ChatsContext
