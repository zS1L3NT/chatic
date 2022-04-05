import AuthContext from "../contexts/AuthContext"
import ChatListItem from "../components/Chat/ChatListItem"
import useAppCollection from "../hooks/useAppCollection"
import { motion } from "framer-motion"
import { useContext } from "react"
import { where } from "firebase/firestore"

const Index = () => {
	const user = useContext(AuthContext)!
	const [chats] = useAppCollection("chats", where("users", "array-contains", user.id))

	return (
		<>
			<motion.div style={{ width: "30%" }}>
				{chats?.map(chat => (
					<ChatListItem key={chat.id} chat={chat} />
				))}
			</motion.div>
		</>
	)
}

export default Index
