import { createContext, PropsWithChildren, useState } from "react"

interface iChatInput {
	text: string
	type: "send" | "reply" | "edit"
	messageId: string
}

interface iChatsData {
	messages: Record<string, Record<string, iMessage>>
	setChatMessages: (chatId: string, messages: iMessage[]) => void
	getChatInput: (chatId: string | null | undefined) => iChatInput
	setChatInput: (chatId: string, input: iChatInput) => void
}

const ChatsContext = createContext<iChatsData>({
	messages: {},
	setChatMessages: () => {},
	getChatInput: () => ({ text: "", type: "send", messageId: "" }),
	setChatInput: () => {}
})

const _ChatsProvider = (props: PropsWithChildren<{}>) => {
	const [messages, setMessages] = useState<iChatsData["messages"]>({})
	const [inputs, setInputs] = useState<Record<string, iChatInput>>({})

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
		<ChatsContext.Provider value={{ messages, setChatMessages, getChatInput, setChatInput }}>
			{props.children}
		</ChatsContext.Provider>
	)
}

export { _ChatsProvider as ChatsProvider }
export default ChatsContext
