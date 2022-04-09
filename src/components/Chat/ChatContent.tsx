import { AnimatePresence, motion } from "framer-motion"
import { CSSProperties, PropsWithChildren } from "react"

import useChatMessages from "../../hooks/useChatMessages"
import useChatReceiver from "../../hooks/useChatReceiver"
import useCurrentChat from "../../hooks/useCurrentChat"
import useUserPresence from "../../hooks/useUserPresence"
import ChatContentInput from "./ChatContentInput"
import ChatContentToolbar from "./ChatContentToolbar"

const _ChatContent = (
	props: PropsWithChildren<{
		style?: CSSProperties
	}>
) => {
	const { style } = props

	const [chatId, chat] = useCurrentChat()
	const receiver = useChatReceiver(chat)
	const presence = useUserPresence(receiver?.id)
	const messages = useChatMessages(chatId, 50)

	return (
		<div style={style}>
			<AnimatePresence>
				{chatId && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							height: "100%"
						}}>
						<ChatContentToolbar key="toolbar" receiver={receiver} presence={presence} />
						<motion.div style={{ flexGrow: 1 }}>Messages go here</motion.div>
						<ChatContentInput key="input" />
					</div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default _ChatContent
