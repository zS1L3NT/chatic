import { doc } from "firebase/firestore"
import { PropsWithChildren, useState } from "react"

import {
	Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from "@mui/material"

import { messagesColl } from "../../firebase"
import useAppSelector from "../../hooks/useAppSelector"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import { defaultInput } from "../../slices/InputsSlice"
import SkeletonImage from "../Skeletons/SkeletonImage"

const _ImageUploadDialog = (
	props: PropsWithChildren<{
		file: File | null
		setClosed: () => void
	}>
) => {
	const { file, setClosed } = props
	const [text, setText] = useState("")
	const [loading, setLoading] = useState(false)

	const chatId = useCurrentChatId()

	const user = useAppSelector(state => state.auth)!
	const input = useAppSelector(state => state.inputs[chatId!] || defaultInput)

	const handleClose = () => {
		setClosed()
	}

	const send = () => {
		if (!chatId || !file) return

		setLoading(true)

		const message: iMessage = {
			id: doc(messagesColl).id,
			content: text,
			media: "",
			date: Date.now(),
			replyId: input.type === "reply" ? input.messageId : null,
			userId: user.id,
			chatId,
			status: 0
		}
	}

	return (
		<Dialog open={!!file} onClose={handleClose}>
			<DialogTitle>Upload Image</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You can either upload an image by it's link or by uploading a file
				</DialogContentText>
				<SkeletonImage
					style={{ margin: "16px auto" }}
					src={file && URL.createObjectURL(file)}
					width={250}
					height={250}
					variant="rectangular"
					component={[
						Box,
						src => {
							console.log(src)
							return {
								component: "img",
								src,
								style: { objectFit: "contain" }
							} as const
						}
					]}
				/>
				<TextField
					sx={{ width: "100%", mt: 1, fontSize: 16 }}
					variant="standard"
					multiline
					maxRows={5}
					value={text}
					onChange={e => setText(e.target.value)}
					placeholder="Add a caption to this file..."
				/>
			</DialogContent>
			<DialogActions>
				<Button sx={{ color: "white" }} onClick={handleClose}>
					Cancel
				</Button>
				<Button
					sx={{ color: "white" }}
					variant="contained"
					color="success"
					disabled={!file}
					onClick={send}
					autoFocus>
					Send
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default _ImageUploadDialog
