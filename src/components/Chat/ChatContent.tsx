import { CSSProperties } from "react"

import useChatReceiver from "../../hooks/useChatReceiver"
import useCurrentChat from "../../hooks/useCurrentChat"
import useUserPresence from "../../hooks/useUserPresence"
import ChatContentToolbar from "./ChatContentToolbar"

interface Props {
	style?: CSSProperties
}

const _ChatContent = (props: Props) => {
	const { style } = props

	const [chatId, chat] = useCurrentChat()
	const receiver = useChatReceiver(chat)
	const presence = useUserPresence(receiver?.id)

	return (
		<div style={style}>
			{chatId && <ChatContentToolbar receiver={receiver} presence={presence} />}
		</div>
	)
}

export default _ChatContent
