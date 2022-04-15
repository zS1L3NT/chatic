import { doc, setDoc } from "firebase/firestore"
import { motion } from "framer-motion"
import {
	ChangeEvent, KeyboardEvent, PropsWithChildren, useContext, useEffect, useRef, useState
} from "react"

import { Clear, Edit, Reply } from "@mui/icons-material"
import {
	Box, Card, Divider, IconButton, styled, Tooltip, Typography, useTheme
} from "@mui/material"

import AuthContext from "../../contexts/AuthContext"
import ChatsContext from "../../contexts/ChatsContext"
import { messagesColl } from "../../firebase"
import useCurrentChatId from "../../hooks/useCurrentChatId"

const TextAreaWrapper = styled(Card)(({ theme }) => ({
	width: "100%",
	height: 48,
	maxHeight: 218,

	paddingTop: 14,
	paddingBottom: 14,
	paddingLeft: 16,
	paddingRight: 16,

	background: theme.palette.background.default,
	borderRadius: 10,
	cursor: "text"
}))

const TextArea = styled(`textarea`)(({ theme }) => ({
	resize: "none",

	width: "100%",
	height: 20,
	maxHeight: 190,
	padding: 0,
	margin: 0,
	color: theme.palette.primary.contrastText,
	background: theme.palette.background.default,

	outline: 0,
	border: 0,

	fontSize: 16,
	fontFamily: "Roboto",
	fontWeight: "normal",

	"&::-webkit-scrollbar": {
		width: 4
	},
	"&::-webkit-scrollbar-track": {
		background: theme.palette.background.default
	},
	"&::-webkit-scrollbar-thumb": {
		background: theme.palette.primary.main,
		borderRadius: 2
	}
}))

const _ChatContentInput = (
	props: PropsWithChildren<{
		receiver: iUser | null
	}>
) => {
	const { receiver } = props

	const user = useContext(AuthContext)!
	const { messages, getChatInput, setChatInput } = useContext(ChatsContext)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const [messageId, setMessageId] = useState(doc(messagesColl).id)
	const [sending, setSending] = useState(false)

	const theme = useTheme()
	const chatId = useCurrentChatId()

	const chatInput = getChatInput(chatId)

	useEffect(() => {
		if (chatId && inputRef.current) {
			inputRef.current.focus()
		}
	}, [chatId, inputRef, chatInput])

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (!chatId) return

		const input = inputRef.current
		if (input) {
			if (sending) {
				setSending(false)
			} else {
				setChatInput(chatId, { ...chatInput, text: e.target.value })
				input.style.height = "20px"
				input.style.height = input.scrollHeight + "px"
				input.parentElement!.style.height = input.scrollHeight + 28 + "px"
			}
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!chatId) return

		if (e.code === "Enter" && !e.shiftKey) {
			setSending(true)

			setMessageId(doc(messagesColl).id)
			setChatInput(chatId, { text: "", type: "send", messageId: "" })
			setDoc(doc(messagesColl, messageId), {
				id: messageId,
				content: chatInput.text,
				media: null,
				date: Date.now(),
				replyId: null,
				userId: user.id,
				chatId,
				status: 0
			})
		}
	}

	const handleClosePopup = () => {
		if (!chatId) return

		setChatInput(chatId, { text: "", type: "send", messageId: "" })
	}

	const handleClick = () => {
		inputRef.current?.focus()
	}

	const getPopupTitle = () => {
		if (!chatId) return

		if (chatInput.type === "reply") {
			const userId = messages[chatId]?.[chatInput.messageId]?.userId
			if (userId) {
				if (user.id === userId) {
					return `Replying to ${user.username}`
				} else {
					return `Replying to ${receiver?.username || "???"}`
				}
			} else {
				return "Replying to ???"
			}
		} else {
			return `Editing a message`
		}
	}

	return (
		<motion.div
			style={{ padding: 16, paddingTop: 8 }}
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}>
			{chatInput.type !== "send" && (
				<motion.div
					style={{
						background: theme.palette.background.default,
						borderTopLeftRadius: 10,
						borderTopRightRadius: 10
					}}
					transition={{ duration: 0.2 }}
					initial={{ height: 0 }}
					animate={{ height: 54 }}
					exit={{ height: 0 }}>
					<motion.div
						style={{
							display: "flex",
							padding: 6
						}}
						transition={{ delay: 0.1, duration: 0.1 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}>
						{chatInput.type === "reply" ? (
							<Reply sx={{ mx: 1.25, my: "auto" }} />
						) : (
							<Edit sx={{ mx: 1.25, my: "auto" }} />
						)}
						<Box style={{ flexGrow: 1 }}>
							<Typography variant="subtitle2" sx={{ color: "primary.light" }}>
								{getPopupTitle()}
							</Typography>
							<Typography variant="body2">
								{messages[chatId || ""]?.[chatInput.messageId]?.content}
							</Typography>
						</Box>
						<Tooltip title={`Clear message ${chatInput.type}`}>
							<IconButton sx={{ mx: 0.5, my: "auto" }} onClick={handleClosePopup}>
								<Clear fontSize="small" />
							</IconButton>
						</Tooltip>
					</motion.div>
					<Divider />
				</motion.div>
			)}
			<TextAreaWrapper
				sx={{
					borderTopLeftRadius: chatInput.type !== "send" ? 0 : 10,
					borderTopRightRadius: chatInput.type !== "send" ? 0 : 10
				}}
				onClick={handleClick}>
				<TextArea
					ref={inputRef}
					value={chatInput.text}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Type a message..."
				/>
			</TextAreaWrapper>
		</motion.div>
	)
}

export default _ChatContentInput
