import { motion } from "framer-motion"
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
		<motion.div
			style={{ flexGrow: 1 }}
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			{messages?.reverse().map(message =>
				message.userId === user.id ? (
					<MessageSent key={message.chatId + "-" + message.id} message={message} />
				) : (
					<MessageReceived key={message.chatId + "-" + message.id} message={message} />
				)
			)}
		</motion.div>
	)
}

export default _ChatContentMessages
