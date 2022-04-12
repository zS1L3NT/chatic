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
							<div key="header" style={{ height: 12 }} />
							{messages?.map((message, i) =>
								message.userId === user.id ? (
									<MessageSent key={message.id} message={message} />
								) : (
									<MessageReceived key={message.id} message={message} />
								)
							)}
							<div key="footer" style={{ height: 12 }} />
						</AnimatePresence>
					</Scrollable>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}

export default _ChatContentMessages
