import ChatContent from "../components/Chat/ChatContent"
import ChatList from "../components/Chat/ChatList"
import { ChatProvider } from "../contexts/ChatContext"

const _Index = () => {
	return (
		<div style={{ display: "flex", height: "100%" }}>
			<ChatProvider>
				<ChatList style={{ flex: 3, height: "100%" }} />
				<ChatContent style={{ flex: 7, height: "100%", background: "#181818" }} />
			</ChatProvider>
		</div>
	)
}

export default _Index
