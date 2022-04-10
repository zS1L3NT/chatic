import ChatContent from "../components/Chat/ChatContent"
import ChatList from "../components/Chat/ChatList"

const _Chat = () => {
	return (
		<div style={{ display: "flex", height: "100%" }}>
			<ChatList style={{ flex: 3, height: "100%" }} />
			<ChatContent style={{ flex: 7, height: "100%", background: "#181818" }} />
		</div>
	)
}

export default _Chat
