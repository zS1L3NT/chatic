import { useSnackbar } from "notistack"
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react"

import { ContentCopy, Delete, Edit, Reply } from "@mui/icons-material"
import {
	Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Tooltip
} from "@mui/material"

import useAppDispatch from "../../hooks/useAppDispatch"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import { set_input } from "../../slices/InputsSlice"
import DeleteMessageDialog from "./DeleteMessageDialog"

const _MessageSentMenu = (
	props: PropsWithChildren<{
		message: iMessage
		editable: boolean
		contextMenu: { left: number; top: number } | undefined
		setContextMenu: Dispatch<SetStateAction<{ left: number; top: number } | undefined>>
	}>
) => {
	const { message, editable, contextMenu, setContextMenu } = props

	const [deleteMessageDialogOpen, setDeleteMessageDialogOpen] = useState(false)

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

	const handleClickEdit = () => {
		if (!chatId) return

		setContextMenu(undefined)
		dispatch(
			set_input({
				chatId,
				text: message.content!,
				type: "edit",
				messageId: message.id
			})
		)
	}

	const handleClickDelete = () => {
		if (!chatId) return

		setContextMenu(undefined)
		setDeleteMessageDialogOpen(true)
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

	const EditableWrapper = (props: PropsWithChildren<{ title: string }>) =>
		editable ? (
			<>{props.children}</>
		) : (
			<Tooltip title={props.title} placement="left" arrow>
				{props.children as JSX.Element}
			</Tooltip>
		)

	return (
		<>
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
					<EditableWrapper title="Message is too old to be edited!">
						<MenuItem
							sx={{ pointerEvents: "auto!important" }}
							disabled={!editable}
							onClick={handleClickEdit}>
							<ListItemIcon>
								<Edit fontSize="small" />
							</ListItemIcon>
							<ListItemText>Edit</ListItemText>
						</MenuItem>
					</EditableWrapper>
					<EditableWrapper title="Message is too old to be deleted!">
						<MenuItem
							sx={{ pointerEvents: "auto!important" }}
							disabled={!editable}
							onClick={handleClickDelete}>
							<ListItemIcon>
								<Delete fontSize="small" />
							</ListItemIcon>
							<ListItemText>Delete</ListItemText>
						</MenuItem>
					</EditableWrapper>
					<Divider />
					<MenuItem onClick={handleClickCopyText}>
						<ListItemIcon>
							<ContentCopy fontSize="small" />
						</ListItemIcon>
						<ListItemText>Copy Text</ListItemText>
					</MenuItem>
				</MenuList>
			</Menu>
			<DeleteMessageDialog
				messageId={message.id}
				open={deleteMessageDialogOpen}
				setOpen={setDeleteMessageDialogOpen}
			/>
		</>
	)
}

export default _MessageSentMenu
