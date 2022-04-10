import { collection, CollectionReference, doc, getFirestore, setDoc } from "firebase/firestore"
import { motion } from "framer-motion"
import { ChangeEvent, KeyboardEvent, PropsWithChildren, useContext, useRef, useState } from "react"

import { Card, styled } from "@mui/material"

import AuthContext from "../../contexts/AuthContext"
import firebaseApp from "../../firebaseApp"
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
	const firestore = getFirestore(firebaseApp)

	const user = useContext(AuthContext)!
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const [message, setMessage] = useState("")
	const [sending, setSending] = useState(false)

	const chatId = useCurrentChatId()!

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const input = inputRef.current
		if (input) {
			if (sending) {
				setSending(false)
			} else {
				setMessage(e.target.value)
				input.style.height = "20px"
				input.style.height = input.scrollHeight + "px"
				input.parentElement!.style.height = input.scrollHeight + 28 + "px"
			}
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.code === "Enter" && !e.shiftKey) {
			setSending(true)
			setMessage("")

			const messagesColl = collection(firestore, "messages") as CollectionReference<iMessage>
			const messageDoc = doc(messagesColl)
			setDoc(messageDoc, {
				id: messageDoc.id,
				content: message,
				media: null,
				date: Date.now(),
				replyId: null,
				userId: user.id,
				chatId
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
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			<TextAreaWrapper onClick={handleClick}>
				<TextArea
					ref={inputRef}
					value={message}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Type a message..."
				/>
			</TextAreaWrapper>
		</motion.div>
	)
}

export default _ChatContentInput
