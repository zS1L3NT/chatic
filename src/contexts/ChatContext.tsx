import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react"

interface iChatData {
	chat: iChat | null
	setChat: Dispatch<SetStateAction<iChat | null>>
	receiver: iUser | null
	setReceiver: Dispatch<SetStateAction<iUser | null>>
	presence: iPresence | null
	setPresence: Dispatch<SetStateAction<iPresence | null>>
}

const ChatContext = createContext<iChatData>({
	chat: null,
	setChat: () => {},
	receiver: null,
	setReceiver: () => {},
	presence: null,
	setPresence: () => {}
})

const _ChatProvider = (props: PropsWithChildren<{}>) => {
	const [chat, setChat] = useState<iChat | null>(null)
	const [receiver, setReceiver] = useState<iUser | null>(null)
	const [presence, setPresence] = useState<iPresence | null>(null)

	return (
		<ChatContext.Provider
			value={{
				chat,
				setChat,
				receiver,
				setReceiver,
				presence,
				setPresence
			}}>
			{props.children}
		</ChatContext.Provider>
	)
}

export { _ChatProvider as ChatProvider }
export default ChatContext
