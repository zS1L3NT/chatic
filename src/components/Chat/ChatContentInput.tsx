import { doc, setDoc } from "firebase/firestore"
import { motion } from "framer-motion"
import {
	ChangeEvent, KeyboardEvent, PropsWithChildren, useContext, useEffect, useRef, useState
} from "react"

import { Card, styled } from "@mui/material"

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

const _ChatContentInput = (props: PropsWithChildren<{}>) => {
	const user = useContext(AuthContext)!
	const { getChatInput, setChatInput } = useContext(ChatsContext)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const [messageId, setMessageId] = useState(doc(messagesColl).id)
	const [sending, setSending] = useState(false)

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
				setChatInput(chatId, { text: e.target.value, type: "send", messageId })
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

	const handleClick = () => {
		inputRef.current?.focus()
	}

	return (
		<motion.div
			style={{ padding: 16, paddingTop: 8 }}
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}>
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
