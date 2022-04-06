import { orderBy, where } from "firebase/firestore"
import { useContext } from "react"
import AuthContext from "../../contexts/AuthContext"

import useAppCollection from "../../hooks/useAppCollection"
import ChatListItem from "./ChatListItem"

// TODO Pagination

const ChatList = () => {
	const user = useContext(AuthContext)!

	const [chats] = useAppCollection(
		"chats",
		where("users", "array-contains", user.id),
		orderBy("lastUpdated", "desc")
	)

	return (
		<>
			{chats?.map(chat => (
				<ChatListItem key={chat.id} chat={chat} />
			))}
		</>
	)
}

export default ChatList
