import { getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { Box, CircularProgress, styled } from "@mui/material"

import { messagesColl } from "../../firebase"
import useAppDispatch from "../../hooks/useAppDispatch"
import useAppSelector from "../../hooks/useAppSelector"
import useChatMessages from "../../hooks/useChatMessages"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import { set_messages } from "../../slices/MessagesSlice"
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
	const [hasMore, setHasMore] = useState(true)

	const chatId = useCurrentChatId()
	const messages = useChatMessages(chatId)

	const dispatch = useAppDispatch()
	const user = useAppSelector(state => state.auth)!

	useEffect(() => {
		if (messages && hasMore) {
			setHasMore(messages.length >= 40)
		}
	}, [messages, hasMore])

	const loadMore = async () => {
		if (!chatId) return

		const queryRef = query(
			messagesColl,
			where("chatId", "==", chatId || "-"),
			orderBy("date", "desc"),
			startAfter(messages!.at(-1)!.date),
			limit(20)
		)
		const snap = await getDocs(queryRef)
		setHasMore(snap.docs.length === 20)
		dispatch(
			set_messages({
				chatId,
				messages: snap.docs.map(doc => doc.data())
			})
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
						hasMore={hasMore}
						loader={
							<Box
								sx={{
									width: "100%",
									display: "flex",
									justifyContent: "center",
									my: 1.5
								}}>
								<CircularProgress />
							</Box>
						}
						scrollableTarget="infinite-scroll">
						<AnimatePresence>
							{messages?.map((message, i) =>
								message.userId === user.id ? (
									<MessageSent
										key={message.id}
										message={message}
										editable={i < 40}
									/>
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
