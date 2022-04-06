import { CSSProperties } from "react"

import useCurrentChat from "../../hooks/useCurrentChat"
import ChatContentToolbar from "./ChatContentToolbar"

interface Props {
	style?: CSSProperties
}

const _ChatContent = (props: Props) => {
	const { style } = props

	const chat = useCurrentChat()

	return (
		<div style={style}>
			{chat && <ChatContentToolbar />}
		</div>
	)
}

export default _ChatContent
