import { orderBy, where } from "firebase/firestore"
import { AnimatePresence } from "framer-motion"
import { CSSProperties, useContext, useState } from "react"

import AuthContext from "../../contexts/AuthContext"
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
	const [filters, setFilters] = useState<Record<string, (search: string) => boolean>>({})

	const [chats] = useAppCollection(
		"chats",
		where("users", "array-contains", user.id),
		orderBy("lastUpdated", "desc")
	)

	return (
		<div style={style}>
			<ChatListToolbar search={search} setSearch={setSearch} />
			<AnimatePresence>
				{chats
					?.filter(chat => (filters[chat.id] ? filters[chat.id]!(search) : true))
					.map(chat => (
						<ChatListItem key={chat.id} chat={chat} setFilters={setFilters} />
					))}
			</AnimatePresence>
		</div>
	)
}

export default _ChatList
