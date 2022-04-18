import { useMediaQuery } from "@mui/material"

import ChatContent from "../components/Chat/ChatContent"
import ChatList from "../components/Chat/ChatList"
import useCurrentChatId from "../hooks/useCurrentChatId"

const _Chat = () => {
	const isMobile = useMediaQuery("(max-width:1000px)")
	const chatId = useCurrentChatId()

	return isMobile ? (
		<div style={{ height: "100%" }}>
			{chatId ? (
				<ChatContent style={{ width: "100%", height: "100%", background: "#181818" }} />
			) : (
				<ChatList style={{ width: "100%", height: "100%" }} />
			)}
		</div>
	) : (
		<div style={{ display: "flex", height: "100%" }}>
			<ChatList style={{ flex: 3, height: "100%" }} />
			<ChatContent style={{ flex: 7, height: "100%", background: "#181818" }} />
		</div>
	)
}

export default _Chat
