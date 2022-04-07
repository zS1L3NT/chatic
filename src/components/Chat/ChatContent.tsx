import { CSSProperties, useContext } from "react"

import ChatContext from "../../contexts/ChatContext"
import ChatContentToolbar from "./ChatContentToolbar"

interface Props {
	style?: CSSProperties
}

const _ChatContent = (props: Props) => {
	const { style } = props

	const { chat } = useContext(ChatContext)

	return <div style={style}>{chat && <ChatContentToolbar />}</div>
}

export default _ChatContent
