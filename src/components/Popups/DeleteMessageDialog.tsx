import { doc, updateDoc } from "firebase/firestore"
import { Dispatch, PropsWithChildren, SetStateAction } from "react"

import {
	Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material"

import { messagesColl } from "../../firebase"

const _DeleteMessageDialog = (
	props: PropsWithChildren<{
		messageId: string
		open: boolean
		setOpen: Dispatch<SetStateAction<boolean>>
	}>
) => {
	const { messageId, open, setOpen } = props

	const handleDelete = () => {
		setOpen(false)

		/**
		 * Deleting a message involved making it null first.
		 * A firebase function / server will automatically clear nulled messages
		 * This needs to happen so the web client will know that a message has been nulled,
		 *   then remove it from the list of messages
		 */
		updateDoc(doc(messagesColl, messageId), {
			// @ts-ignore
			content: null,
			media: null
		})
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Delete Message?</DialogTitle>
			<DialogContent>
				<DialogContentText>Deleting a message is an irreversable action!</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button sx={{ color: "white" }} onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="contained" color="error" onClick={handleDelete} autoFocus>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default _DeleteMessageDialog
