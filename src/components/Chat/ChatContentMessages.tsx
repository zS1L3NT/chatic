import { AnimatePresence, motion } from "framer-motion"
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
	const reversedMessages = messages ? Array.from(messages).reverse() : null

	return (
		<div
			style={{
				flexGrow: 1,
				position: "relative",
				overflow: "hidden"
			}}>
			<AnimatePresence exitBeforeEnter>
				<motion.div
					key={chatId}
					style={{
						position: "absolute",
						width: "100%",
						height: "100%"
					}}
					transition={{ duration: 0.2 }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					{reversedMessages?.map((message, i) =>
						message.userId === user.id ? (
							<MessageSent
								key={message.chatId + "-" + message.id}
								message={message}
								isStartBlock={reversedMessages[i - 1]?.userId !== user.id}
								isEndBlock={reversedMessages[i + 1]?.userId !== user.id}
							/>
						) : (
							<MessageReceived
								key={message.chatId + "-" + message.id}
								message={message}
								isStartBlock={reversedMessages[i - 1]?.userId !== user.id}
								isEndBlock={reversedMessages[i + 1]?.userId !== user.id}
							/>
						)
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	)
}

export default _ChatContentMessages
