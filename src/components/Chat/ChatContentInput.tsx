import { doc, setDoc, updateDoc } from "firebase/firestore"
import { AnimatePresence, motion } from "framer-motion"
import { ChangeEvent, KeyboardEvent, PropsWithChildren, useEffect, useRef, useState } from "react"

import { Attachment, Clear, Edit, Reply } from "@mui/icons-material"
import {
	Box, Card, Divider, IconButton, styled, Tooltip, Typography, useTheme
} from "@mui/material"

import { messagesColl } from "../../firebase"
import useAppDispatch from "../../hooks/useAppDispatch"
import useAppSelector from "../../hooks/useAppSelector"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import { defaultInput, reset_input, set_input } from "../../slices/InputsSlice"
import ImageUploadDialog from "../Popups/ImageUploadDialog"

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

	const inputRef = useRef<HTMLTextAreaElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [messageId, setMessageId] = useState(doc(messagesColl).id)
	const [sending, setSending] = useState(false)
	const [file, setFile] = useState<File | null>(null)

	const theme = useTheme()
	const chatId = useCurrentChatId()

	const dispatch = useAppDispatch()
	const user = useAppSelector(state => state.auth)!
	const messages = useAppSelector(state => state.messages[chatId!] || {})
	const input = useAppSelector(state => state.inputs[chatId!] || defaultInput)

	useEffect(() => {
		if (chatId && inputRef.current) {
			inputRef.current.focus()
		}
	}, [chatId, inputRef, input])

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (!chatId) return

		const inputEl = inputRef.current
		if (inputEl) {
			if (sending) {
				setSending(false)
			} else {
				dispatch(set_input({ chatId, ...input, text: e.target.value }))
				inputEl.style.height = "20px"
				inputEl.style.height = inputEl.scrollHeight + "px"
				inputEl.parentElement!.style.height = inputEl.scrollHeight + 28 + "px"
			}
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!chatId) return

		if (e.code === "Enter" && !e.shiftKey && input.text.trim().length > 0) {
			setSending(true)

			setMessageId(doc(messagesColl).id)
			dispatch(reset_input({ chatId }))

			// Firestore calls lagged animations, delayed to prevent lag
			setTimeout(() => {
				if (input.type === "edit") {
					updateDoc(doc(messagesColl, input.messageId), {
						content: input.text.trim()
					})
				} else {
					setDoc(doc(messagesColl, messageId), {
						id: messageId,
						content: input.text.trim(),
						media: null,
						date: Date.now(),
						replyId: input.type === "reply" ? input.messageId : null,
						userId: user.id,
						chatId,
						status: 0
					})
				}
			}, 200)
		}
	}

	const handleClosePopup = () => {
		if (!chatId) return

		dispatch(reset_input({ chatId }))
	}

	const handleClick = () => {
		inputRef.current?.focus()
	}

	const handleClickAttachment = () => {
		// setImageUploadDialogOpen(true)
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.item(0)
		e.target.value = ""
		if (file) {
			setFile(file)
		}
	}

	const getPopupTitle = () => {
		if (!chatId) return

		if (input.type === "reply") {
			const userId = messages[input?.messageId]?.userId
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
		<>
			<motion.div
				style={{ padding: 16, paddingTop: 8 }}
				transition={{ duration: 0.2 }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 20 }}>
				<AnimatePresence>
					{input.type !== "send" && (
						<motion.div
							style={{
								background: theme.palette.background.default,
								borderTopLeftRadius: 10,
								borderTopRightRadius: 10
							}}
							transition={{ duration: 0.2 }}
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 54, opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}>
							<div
								style={{
									display: "flex",
									padding: 6
								}}>
								{input.type === "reply" ? (
									<Reply sx={{ mx: 1.25, my: "auto" }} />
								) : (
									<Edit sx={{ mx: 1.25, my: "auto" }} />
								)}
								<Box style={{ flexGrow: 1 }}>
									<Typography variant="subtitle2" sx={{ color: "primary.light" }}>
										{getPopupTitle()}
									</Typography>
									<Typography variant="body2">
										{messages[input.messageId]?.content}
									</Typography>
								</Box>
								<Tooltip title={`Clear message ${input.type}`}>
									<IconButton
										sx={{ mx: 0.5, my: "auto" }}
										onClick={handleClosePopup}>
										<Clear fontSize="small" />
									</IconButton>
								</Tooltip>
							</div>
							<Divider />
						</motion.div>
					)}
				</AnimatePresence>
				<TextAreaWrapper
					sx={{
						position: "relative",
						display: "flex",
						paddingLeft: 1,

						borderTopLeftRadius: input.type !== "send" ? 0 : 10,
						borderTopRightRadius: input.type !== "send" ? 0 : 10
					}}
					onClick={handleClick}>
					<div
						style={{
							position: "absolute",
							bottom: 6,
							width: 40
						}}>
						<IconButton onClick={handleClickAttachment}>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								hidden
								onChange={handleFileChange}
							/>
							<Attachment fontSize="small" />
						</IconButton>
					</div>
					<TextArea
						ref={inputRef}
						sx={{ ml: 5 }}
						value={input.text}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder="Type a message..."
					/>
				</TextAreaWrapper>
			</motion.div>
			<ImageUploadDialog file={file} setClosed={() => setFile(null)} />
		</>
	)
}

export default _ChatContentInput
