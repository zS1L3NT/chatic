import { AnimatePresence } from "framer-motion"
import { CSSProperties, PropsWithChildren } from "react"

import { chatsColl } from "../../firebase"
import useAppDocument from "../../hooks/useAppDocument"
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
	const [chat] = useAppDocument(chatsColl, chatId)
	const receiver = useChatReceiver(chat)
	const presence = useUserPresence(receiver?.id)

	return (
		<div style={style}>
			<AnimatePresence>
				{chatId && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							height: "100%",
							overflow: "hidden"
						}}>
						<ChatContentToolbar key="toolbar" receiver={receiver} presence={presence} />
						<ChatContentMessages key="messages" />
						<ChatContentInput key="input" receiver={receiver} />
					</div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default _ChatContent
