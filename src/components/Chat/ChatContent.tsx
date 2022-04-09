import { AnimatePresence } from "framer-motion"
import { CSSProperties, PropsWithChildren } from "react"
import useAppDocument from "../../hooks/useAppDocument"

import useChatMessages from "../../hooks/useChatMessages"
import useChatReceiver from "../../hooks/useChatReceiver"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import useUserPresence from "../../hooks/useUserPresence"
import ChatContentInput from "./ChatContentInput"
import ChatContentMessages from "./ChatContentMessages"
import ChatContentToolbar from "./ChatContentToolbar"

const _ChatContent = (
	props: PropsWithChildren<{
		style?: CSSProperties
	}>
) => {
	const { style } = props

	const chatId = useCurrentChatId()
	const [chat] = useAppDocument("chats", chatId)
	const receiver = useChatReceiver(chat)
	const presence = useUserPresence(receiver?.id)

	return (
		<div style={style}>
			<AnimatePresence exitBeforeEnter>
				{chatId && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							height: "100%"
						}}>
						<ChatContentToolbar key="toolbar" receiver={receiver} presence={presence} />
						<ChatContentMessages key="messages" />
						<ChatContentInput key="input" />
					</div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default _ChatContent
