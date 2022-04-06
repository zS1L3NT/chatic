import ChatContent from "../components/Chat/ChatContent"
import ChatList from "../components/Chat/ChatList"

const _Index = () => {
	return (
		<div style={{ display: "flex", height: "100%" }}>
			<div style={{ flex: 3, height: "100%" }}>
				<ChatList />
			</div>
			<div style={{ flex: 7, height: "100%", background: "#181818" }}>
				<ChatContent />
			</div>
		</div>
	)
}

export default _Index
