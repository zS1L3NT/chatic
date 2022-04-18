import { Dispatch, PropsWithChildren, SetStateAction, useRef, useState } from "react"

import {
	Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from "@mui/material"

import SkeletonImage from "../Skeletons/SkeletonImage"

const _ImageUploadDialog = (
	props: PropsWithChildren<{
		open: boolean
		setOpen: Dispatch<SetStateAction<boolean>>
	}>
) => {
	const { open, setOpen } = props

	const fileInputRef = useRef<HTMLInputElement>(null)
	const [link, setLink] = useState("")
	const [file, setFile] = useState<File | null>(null)

	const handleClickFile = () => {
		if (file) {
			setFile(null)
		} else {
			fileInputRef.current?.click()
		}
	}

	const handleSend = () => {
		setOpen(false)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Upload Image</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You can either upload an image by it's link or by uploading a file
				</DialogContentText>
				<TextField
					sx={{ width: "100%", mt: 2 }}
					variant="standard"
					placeholder="Paste image link here"
					value={link}
					onChange={e => setLink(e.target.value)}
					disabled={!!file}
				/>
				<Button
					sx={{ width: "100%", mt: 2 }}
					variant="contained"
					color={file ? "error" : "primary"}
					onClick={handleClickFile}
					disabled={!!link}>
					{file ? "Remove file" : "Select File"}
				</Button>
				<SkeletonImage
					style={{ margin: "16px auto" }}
					src={file ? URL.createObjectURL(file) : link}
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
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={e => setFile(e.target.files?.[0] || null)}
				/>
			</DialogContent>
			<DialogActions>
				<Button sx={{ color: "white" }} onClick={handleClose}>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="success"
					disabled={!file && !link}
					onClick={handleSend}
					autoFocus>
					Send
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default _ImageUploadDialog
