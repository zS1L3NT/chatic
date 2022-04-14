import { createContext, PropsWithChildren, useState } from "react"

interface iChatsData {
	messages: Record<string, Record<string, iMessage>>
	setChatMessages: (chatId: string, messages: iMessage[]) => void
	inputs: Record<string, string>
	setChatInput: (chatId: string, input: string) => void
}

const ChatsContext = createContext<iChatsData>({
	messages: {},
	setChatMessages: () => {},
	inputs: {},
	setChatInput: () => {}
})

const _ChatsProvider = (props: PropsWithChildren<{}>) => {
	const [messages, setMessages] = useState<iChatsData["messages"]>({})
	const [inputs, setInputs] = useState<iChatsData["inputs"]>({})

	const setChatMessages = (chatId: string, chatMessages: iMessage[]) => {
		setMessages(messages => ({
			...messages,
			[chatId]: {
				...messages[chatId],
				...chatMessages.reduce<Record<string, iMessage>>(
					(acc, message) => ({ ...acc, [message.id]: message }),
					{}
				)
			}
		}))
	}

	const setChatInput = (chatId: string, input: string) => {
		setInputs(inputs => ({ ...inputs, [chatId]: input }))
	}

	return (
		<ChatsContext.Provider value={{ messages, setChatMessages, inputs, setChatInput }}>
			{props.children}
		</ChatsContext.Provider>
	)
}

export { _ChatsProvider as ChatsProvider }
export default ChatsContext
