import { AnimatePresence } from "framer-motion"
import { CSSProperties, PropsWithChildren, useState } from "react"

import useUserChats from "../../hooks/useUserChats"
import ChatListItem from "./ChatListItem"
import ChatListToolbar from "./ChatListToolbar"

// TODO Pagination

const _ChatList = (
	props: PropsWithChildren<{
		style?: CSSProperties
	}>
) => {
	const { style } = props

	const [search, setSearch] = useState("")
	const [filters, setFilters] = useState<Record<string, (search: string) => boolean>>({})

	const chats = useUserChats(10)

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
