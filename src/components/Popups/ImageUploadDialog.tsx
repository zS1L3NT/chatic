import { PropsWithChildren } from "react"

import {
	Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material"

import SkeletonImage from "../Skeletons/SkeletonImage"

const _ImageUploadDialog = (
	props: PropsWithChildren<{
		file: File | null
		setClosed: () => void
	}>
) => {
	const { file, setClosed } = props

	const handleSend = () => {
		setClosed()
	}

	const handleClose = () => {
		setClosed()
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
			</DialogContent>
			<DialogActions>
				<Button sx={{ color: "white" }} onClick={handleClose}>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="success"
					disabled={!file}
					onClick={handleSend}
					autoFocus>
					Send
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default _ImageUploadDialog
