import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren, useContext } from "react"
import ScrollToBottom from "react-scroll-to-bottom"

import { styled } from "@mui/material"

import AuthContext from "../../contexts/AuthContext"
import useChatMessages from "../../hooks/useChatMessages"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import MessageReceived from "./MessageReceived"
import MessageSent from "./MessageSent"

const Scrollable = styled(ScrollToBottom)(({ theme }) => ({
	width: "100%",
	height: "100%",

	"& > div": {
		width: "100%",
		height: "100%",
		overflowX: "hidden",
		overflowY: "scroll",

		"&::-webkit-scrollbar": {
			width: 15
		},
		"&::-webkit-scrollbar-track": {
			background: "#181818"
		},
		"&::-webkit-scrollbar-thumb": {
			border: "5px solid #181818",
			background: theme.palette.primary.main,
			backgroundClip: "padding-box",
			borderRadius: 9999
		}
	},

	"& > button": {
		display: "none"
	}
}))

const _ChatContentMessages = (props: PropsWithChildren<{}>) => {
	const user = useContext(AuthContext)!

	const chatId = useCurrentChatId()!
	const messages = useChatMessages(chatId, 50)

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
					<Scrollable>
						<AnimatePresence>
							{messages?.map((message, i) =>
								message.userId === user.id ? (
									<MessageSent
										key={message.chatId + "-" + message.id}
										message={message}
										isStartBlock={messages[i - 1]?.userId !== user.id}
										isEndBlock={messages[i + 1]?.userId !== user.id}
									/>
								) : (
									<MessageReceived
										key={message.chatId + "-" + message.id}
										message={message}
										isStartBlock={messages[i - 1]?.userId === user.id}
										isEndBlock={messages[i + 1]?.userId === user.id}
									/>
								)
							)}
						</AnimatePresence>
					</Scrollable>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}

export default _ChatContentMessages
