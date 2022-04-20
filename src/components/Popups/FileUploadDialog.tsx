import { doc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { ChangeEvent, KeyboardEvent, PropsWithChildren, useEffect, useMemo, useState } from "react"
import VideoPlayer from "react-player"

import {
	Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from "@mui/material"

import { messagesColl, storage } from "../../firebase"
import useAppDispatch from "../../hooks/useAppDispatch"
import useAppSelector from "../../hooks/useAppSelector"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import { defaultInput, reset_input, set_input } from "../../slices/InputsSlice"
import SkeletonImage from "../Skeletons/SkeletonImage"

const _FileUploadDialog = (
	props: PropsWithChildren<{
		file: File | null
		setClosed: () => void
	}>
) => {
	const { file, setClosed } = props
	const [sending, setSending] = useState(false)
	const [loading, setLoading] = useState(false)

	const chatId = useCurrentChatId()

	const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

	const dispatch = useAppDispatch()
	const user = useAppSelector(state => state.auth)!
	const input = useAppSelector(state => state.inputs[chatId!] || defaultInput)

	useEffect(() => {
		if (chatId) dispatch(set_input({ chatId, ...input, type: "send" }))
	}, [chatId])

	const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!chatId) return

		if (sending) {
			setSending(false)
		} else {
			dispatch(set_input({ chatId, ...input, text: e.target.value }))
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (!chatId) return

		if (e.key === "Enter" && !e.shiftKey) {
			setSending(true)
			send()
		}
	}

	const handleClose = () => {
		if (!loading) setClosed()
	}

	const send = async () => {
		if (!chatId || !file) return

		setLoading(true)

		const message: iMessage = {
			id: input.messageId || doc(messagesColl).id,
			content: input.text,
			media: "",
			date: Date.now(),
			replyId: input.type === "reply" ? input.messageId : null,
			userId: user.id,
			chatId,
			status: 0
		}

		const mediaRef = ref(storage, `${chatId}/${message.id}-${file.name}`)
		try {
			await uploadBytes(mediaRef, file)
			message.media = await getDownloadURL(mediaRef)
			await setDoc(doc(messagesColl, message.id), message)
			dispatch(reset_input({ chatId }))
			setClosed()
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={!!file} onClose={handleClose} fullWidth>
			<DialogTitle>Upload File</DialogTitle>
			<DialogContent>
				<DialogContentText>Attach a file to this message</DialogContentText>
				{file?.type.startsWith("image/") ? (
					<SkeletonImage
						style={{ margin: "16px auto" }}
						src={objectUrl}
						width={250}
						height={250}
						variant="rectangular"
						component={[
							Box,
							src =>
								({
									component: "img",
									src,
									style: { objectFit: "contain" }
								} as const)
						]}
					/>
				) : file?.type.startsWith("video/") ? (
					<VideoPlayer
						style={{ margin: "16px auto" }}
						width="100%"
						height={250}
						url={objectUrl || ""}
						controls={true}
					/>
				) : (
					<></>
				)}

				<TextField
					sx={{ width: "100%", mt: 1, fontSize: 16 }}
					variant="standard"
					multiline
					maxRows={5}
					value={input.text}
					onChange={handleTextChange}
					onKeyDown={handleKeyDown}
					placeholder="Add a caption to this file..."
					autoFocus
				/>
			</DialogContent>
			<DialogActions>
				<Button sx={{ color: "white" }} disabled={loading} onClick={handleClose}>
					Cancel
				</Button>
				<Button
					sx={{ color: "white" }}
					variant="contained"
					color="success"
					disabled={!file || loading}
					onClick={send}>
					Send
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default _FileUploadDialog
