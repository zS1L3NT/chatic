import {
	collection, CollectionReference, getDocs, getFirestore, limit, orderBy, query, startAfter, where
} from "firebase/firestore"
import { AnimatePresence } from "framer-motion"
import { PropsWithChildren, useContext, useEffect } from "react"
import { useAnimatingToEnd, useAtBottom, useAtTop } from "react-scroll-to-bottom"

import AuthContext from "../../contexts/AuthContext"
import ChatsContext from "../../contexts/ChatsContext"
import firebaseApp from "../../firebaseApp"
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

	const { setChatMessages } = useContext(ChatsContext)
	const user = useContext(AuthContext)!

	const [atTop] = useAtTop()
	const [atBottom] = useAtBottom()
	const [animatingToEnd] = useAnimatingToEnd()
	const chatId = useCurrentChatId()!
	const messages = useChatMessages(chatId)

	useEffect(() => {
		const parent = getParent()
		if (parent && atTop && !atBottom && !animatingToEnd) {
			const firestore = getFirestore(firebaseApp)
			const collRef = collection(firestore, "messages") as CollectionReference<iMessage>
			const queryRef = query(
				collRef,
				where("chatId", "==", chatId || "-"),
				orderBy("date", "desc"),
				startAfter(messages![0]!.date),
				limit(20)
			)
			getDocs(queryRef).then(snap => {
				setChatMessages(
					chatId,
					snap.docs.map(doc => doc.data())
				)
			})
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
