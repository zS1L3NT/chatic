import { orderBy, where } from "firebase/firestore"
import { motion } from "framer-motion"
import { useContext } from "react"

import ChatListItem from "../components/Chat/ChatListItem"
import AuthContext from "../contexts/AuthContext"
import useAppCollection from "../hooks/useAppCollection"

const Index = () => {
	const user = useContext(AuthContext)!

	const [chats] = useAppCollection(
		"chats",
		where("users", "array-contains", user.id),
		orderBy("lastUpdated", "desc")
	)

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
