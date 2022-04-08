import { AnimatePresence } from "framer-motion"
import { CSSProperties, PropsWithChildren } from "react"

import useChatReceiver from "../../hooks/useChatReceiver"
import useCurrentChat from "../../hooks/useCurrentChat"
import useUserPresence from "../../hooks/useUserPresence"
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

	return (
		<div style={style}>
			<AnimatePresence>
				{chatId && <ChatContentToolbar receiver={receiver} presence={presence} />}
			</AnimatePresence>
		</div>
	)
}

export default _ChatContent
