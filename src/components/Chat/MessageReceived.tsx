import { motion } from "framer-motion"
import { DateTime } from "luxon"
import { useSnackbar } from "notistack"
import { PropsWithChildren, useState } from "react"

import { ContentCopy, Reply } from "@mui/icons-material"
import { Card, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material"

import useAppDispatch from "../../hooks/useAppDispatch"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import { set_input } from "../../slices/InputsSlice"

const _MessageReceived = (
	props: PropsWithChildren<{
		message: iMessage
	}>
) => {
	const { message } = props

	const [contextMenu, setContextMenu] = useState<{ left: number; top: number }>()

	const { enqueueSnackbar } = useSnackbar()
	const chatId = useCurrentChatId()

	const dispatch = useAppDispatch()

	const handleOpen = (event: React.MouseEvent) => {
		event.preventDefault()
		setContextMenu(
			!contextMenu ? { left: event.clientX - 2, top: event.clientY - 4 } : undefined
		)
	}

	const handleClose = () => {
		setContextMenu(undefined)
	}

	const handleClickReply = () => {
		if (!chatId) return

		setContextMenu(undefined)
		dispatch(
			set_input({
				chatId,
				text: "",
				type: "reply",
				messageId: message.id
			})
		)
	}

	const handleClickCopyText = async () => {
		if (!chatId) return

		setContextMenu(undefined)
		if ("clipboard" in navigator) {
			try {
				await navigator.clipboard.writeText(message.content)
				enqueueSnackbar("Copied text to clipboard", { variant: "success" })
			} catch (err) {
				console.error(err)
				enqueueSnackbar("Error copying text to clipboard", { variant: "error" })
			}
		} else {
			enqueueSnackbar("Clipboard unavailable on your browser", { variant: "error" })
		}
	}

	return (
		<motion.div
			style={{ display: "flex" }}
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			layout="position">
			<Card
				sx={{
					width: "fit-content",
					maxWidth: "60%",
					mx: 2,
					my: 0.75,
					px: 2,
					py: 1
				}}
				onContextMenu={handleOpen}>
				{message.content}
				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						float: "right",
						height: 24
					}}>
					<span
						style={{
							marginLeft: 8,
							opacity: 0.5,
							fontSize: 14
						}}>
						{DateTime.fromMillis(message.date).toFormat("hh:mma").toLowerCase()}
					</span>
				</div>
			</Card>
			<Menu
				PaperProps={{ style: { width: 200 } }}
				BackdropProps={{
					onContextMenu: e => e.preventDefault()
				}}
				open={!!contextMenu}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={contextMenu}>
				<MenuList>
					<MenuItem onClick={handleClickReply}>
						<ListItemIcon>
							<Reply fontSize="small" />
						</ListItemIcon>
						<ListItemText>Reply</ListItemText>
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleClickCopyText}>
						<ListItemIcon>
							<ContentCopy fontSize="small" />
						</ListItemIcon>
						<ListItemText>Copy Text</ListItemText>
					</MenuItem>
				</MenuList>
			</Menu>
		</motion.div>
	)
}

export default _MessageReceived
