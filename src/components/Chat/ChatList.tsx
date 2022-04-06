import { orderBy, where } from "firebase/firestore"
import { CSSProperties, useContext, useState } from "react"

import AuthContext from "../../contexts/AuthContext"
import ChatSearchContext from "../../contexts/ChatSearchContext"
import useAppCollection from "../../hooks/useAppCollection"
import ChatListItem from "./ChatListItem"
import ChatListToolbar from "./ChatListToolbar"

// TODO Pagination

interface Props {
	style?: CSSProperties
}

const _ChatList = (props: Props) => {
	const { style } = props

	const user = useContext(AuthContext)!
	const [search, setSearch] = useState("")

	const [chats] = useAppCollection(
		"chats",
		where("users", "array-contains", user.id),
		orderBy("lastUpdated", "desc")
	)

	return (
		<div style={style}>
			<ChatSearchContext.Provider value={{ search, setSearch }}>
				<ChatListToolbar />
				{chats?.map(chat => (
					<ChatListItem key={chat.id} chat={chat} />
				))}
			</ChatSearchContext.Provider>
		</div>
	)
}

export default _ChatList
