import { AnimatePresence } from "framer-motion"
import { PropsWithChildren, useContext } from "react"

import AuthContext from "../../contexts/AuthContext"
import useChatMessages from "../../hooks/useChatMessages"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import MessageReceived from "./MessageReceived"
import MessageSent from "./MessageSent"

const _ChatContentMessages = (props: PropsWithChildren<{}>) => {
	const user = useContext(AuthContext)!

	const chatId = useCurrentChatId()!
	const messages = useChatMessages(chatId, 50)

	return (
		<AnimatePresence>
			<div key="header" style={{ height: 12 }} />
			{messages?.map(message =>
				message.userId === user.id ? (
					<MessageSent key={message.id} message={message} />
				) : (
					<MessageReceived key={message.id} message={message} />
				)
			)}
			<div key="footer" style={{ height: 12 }} />
		</AnimatePresence>
	)
}

export default _ChatContentMessages
