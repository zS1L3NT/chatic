import { motion } from "framer-motion"
import { DateTime } from "luxon"
import { PropsWithChildren, useContext, useState } from "react"

import { ContentCopy, Delete, Edit, Reply } from "@mui/icons-material"
import {
	Card, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Tooltip
} from "@mui/material"

import ChatsContext from "../../contexts/ChatsContext"
import useCurrentChatId from "../../hooks/useCurrentChatId"
import Dot from "../Dot"

const _MessageSent = (
	props: PropsWithChildren<{
		message: iMessage
		editable: boolean
	}>
) => {
	const { message, editable } = props

	const { setChatInput } = useContext(ChatsContext)
	const [contextMenu, setContextMenu] = useState<{ left: number; top: number }>()

	const chatId = useCurrentChatId()

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
		setChatInput(chatId, {
			text: "",
			type: "reply",
			messageId: message.id
		})
	}

	const handleClickEdit = () => {
		if (!chatId) return
		
		setContextMenu(undefined)
		setChatInput(chatId, {
			text: message.content!,
			type: "edit",
			messageId: message.id
		})
	}

	const getColor = () => {
		switch (message.status) {
			case 0:
				return null
			case 1:
				return "rgb(255, 0, 0)"
			case 2:
				return "rgb(255, 255, 0)"
			case 3:
				return "rgb(0, 255, 0)"
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
		<motion.div
			style={{ display: "flex" }}
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			layout="position">
			<Card
				sx={{
					width: "fit-content",
					maxWidth: "60%",
					ml: "auto",
					mr: 2,
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
					<Dot style={{ marginLeft: 8, marginBottom: 6 }} size={8} color={getColor()} />
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
						<MenuItem sx={{ pointerEvents: "auto!important" }} disabled={!editable}>
							<ListItemIcon>
								<Delete fontSize="small" />
							</ListItemIcon>
							<ListItemText>Delete</ListItemText>
						</MenuItem>
					</EditableWrapper>
					<Divider />
					<MenuItem>
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

export default _MessageSent
