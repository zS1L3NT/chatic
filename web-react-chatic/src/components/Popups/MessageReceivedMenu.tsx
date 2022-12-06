import { useSnackbar } from "notistack"
import { Dispatch, PropsWithChildren, SetStateAction } from "react"

import { ContentCopy, Reply } from "@mui/icons-material"
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material"

import useAppDispatch from "../../hooks/useAppDispatch"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import { set_input } from "../../slices/InputsSlice"

const _MessageReceivedMenu = (
	props: PropsWithChildren<{
		message: iMessage
		contextMenu: { left: number; top: number } | undefined
		setContextMenu: Dispatch<SetStateAction<{ left: number; top: number } | undefined>>
	}>
) => {
	const { message, contextMenu, setContextMenu } = props

	const { enqueueSnackbar } = useSnackbar()
	const chatId = useCurrentChatId()

	const dispatch = useAppDispatch()

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
	)
}

export default _MessageReceivedMenu
