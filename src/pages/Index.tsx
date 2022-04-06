import ChatList from "../components/Chat/ChatList"

const Index = () => {
	return (
		<div style={{ display: "flex", height: "100%" }}>
			<div style={{ flex: 3, height: "100%" }}>
				<ChatList />
			</div>
			<div style={{ flex: 7, height: "100%", background: "#181818" }}>

			</div>
		</div>
	)
}

export default Index
