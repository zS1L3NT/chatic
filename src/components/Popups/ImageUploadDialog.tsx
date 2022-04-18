import { Dispatch, PropsWithChildren, SetStateAction } from "react"

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

const _ImageUploadDialog = (
	props: PropsWithChildren<{
		open: boolean
		setOpen: Dispatch<SetStateAction<boolean>>
	}>
) => {
	const { open, setOpen } = props

	const handleSend = () => {
		setOpen(false)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Delete Message?</DialogTitle>
			<DialogContent></DialogContent>
			<DialogActions>
				<Button sx={{ color: "white" }} onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="contained" color="success" onClick={handleSend} autoFocus>
					Send
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default _ImageUploadDialog
