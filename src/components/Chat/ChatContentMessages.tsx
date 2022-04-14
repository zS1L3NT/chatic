import {
	collection, CollectionReference, getDocs, getFirestore, limit, orderBy, query, startAfter, where
} from "firebase/firestore"
import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren, useContext } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { styled } from "@mui/material"

import AuthContext from "../../contexts/AuthContext"
import ChatsContext from "../../contexts/ChatsContext"
import firebaseApp from "../../firebaseApp"
import useChatMessages from "../../hooks/useChatMessages"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import MessageReceived from "./MessageReceived"
import MessageSent from "./MessageSent"

const InfiniteScrollWrapper = styled(motion.div)(({ theme }) => ({
	position: "absolute",
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column-reverse",
	overflow: "hidden scroll",

	"&::-webkit-scrollbar": {
		width: 15,
		background: "red"
	},

	"&::-webkit-scrollbar-track": {
		background: "#181818"
	},

	"&::-webkit-scrollbar-thumb": {
		border: "5px solid #181818",
		background: theme.palette.primary.main,
		backgroundClip: "padding-box",
		borderRadius: 9999
	}
}))

const _ChatContentMessages = (props: PropsWithChildren<{}>) => {
	const { setChatMessages } = useContext(ChatsContext)
	const user = useContext(AuthContext)!

	const chatId = useCurrentChatId()!
	const messages = useChatMessages(chatId)

	const loadMore = async () => {
		const firestore = getFirestore(firebaseApp)
		const collRef = collection(firestore, "messages") as CollectionReference<iMessage>
		const queryRef = query(
			collRef,
			where("chatId", "==", chatId || "-"),
			orderBy("date", "desc"),
			startAfter(messages!.at(-1)!.date),
			limit(20)
		)
		const snap = await getDocs(queryRef)
		setChatMessages(
			chatId,
			snap.docs.map(doc => doc.data())
		)
	}

	return (
		<div
			style={{
				flexGrow: 1,
				position: "relative",
				overflow: "hidden"
			}}>
			<AnimatePresence exitBeforeEnter>
				<InfiniteScrollWrapper
					key={chatId}
					id="infinite-scroll"
					transition={{ duration: 0.2 }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<InfiniteScroll
						dataLength={messages?.length || 0}
						next={loadMore}
						style={{
							overflow: "hidden",
							display: "flex",
							flexDirection: "column-reverse"
						}}
						inverse={true}
						hasMore={true}
						loader={<h4>Loading</h4>}
						scrollableTarget="infinite-scroll">
						<AnimatePresence>
							{messages?.map(message =>
								message.userId === user.id ? (
									<MessageSent key={message.id} message={message} />
								) : (
									<MessageReceived key={message.id} message={message} />
								)
							)}
						</AnimatePresence>
					</InfiniteScroll>
				</InfiniteScrollWrapper>
			</AnimatePresence>
		</div>
	)
}

export default _ChatContentMessages
