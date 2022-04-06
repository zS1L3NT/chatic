import { orderBy, where } from "firebase/firestore"
import { CSSProperties, useContext } from "react"

import AuthContext from "../../contexts/AuthContext"
import useAppCollection from "../../hooks/useAppCollection"
import ChatListItem from "./ChatListItem"

// TODO Pagination

interface Props {
	style?: CSSProperties
}

const _ChatList = (props: Props) => {
	const { style } = props

	const user = useContext(AuthContext)!

	const [chats] = useAppCollection(
		"chats",
		where("users", "array-contains", user.id),
		orderBy("lastUpdated", "desc")
	)

	return (
		<div style={style}>
			{chats?.map(chat => (
				<ChatListItem key={chat.id} chat={chat} />
			))}
		</div>
	)
}

export default _ChatList
