import { AnimatePresence } from "framer-motion"
import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { useAnimatingToEnd, useAtBottom, useAtTop } from "react-scroll-to-bottom"

import AuthContext from "../../contexts/AuthContext"
import useChatMessages from "../../hooks/useChatMessages"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import MessageReceived from "./MessageReceived"
import MessageSent from "./MessageSent"

const _ChatContentMessages = (
	props: PropsWithChildren<{
		getParent: () => HTMLDivElement | null
	}>
) => {
	const { getParent } = props

	const user = useContext(AuthContext)!
	const [queryMax, setQueryMax] = useState(20)

	const [atTop] = useAtTop()
	const [atBottom] = useAtBottom()
	const [animatingToEnd] = useAnimatingToEnd()
	const chatId = useCurrentChatId()!
	const messages = useChatMessages(chatId, queryMax)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setQueryMax(queryMax => queryMax + 20)
		}, 500)
		return () => clearTimeout(timeout)
	}, [])

	useEffect(() => {
		const parent = getParent()
		if (parent && atTop && !atBottom && !animatingToEnd) {
			setQueryMax(queryMax => queryMax + 20)
			parent.scrollTo({ top: 1, behavior: "smooth" })
		}
	}, [atTop, atBottom, animatingToEnd])

	const parent = getParent()
	if (parent && parent.scrollTop < 1) {
		parent.scrollTo({ top: 1, behavior: "smooth" })
	}

	return (
		<AnimatePresence>
			{messages?.map(message =>
				message.userId === user.id ? (
					<MessageSent key={message.id} message={message} />
				) : (
					<MessageReceived key={message.id} message={message} />
				)
			)}
		</AnimatePresence>
	)
}

export default _ChatContentMessages
