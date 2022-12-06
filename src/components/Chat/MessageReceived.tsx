import { motion } from "framer-motion"
import { DateTime } from "luxon"
import { PropsWithChildren, useState } from "react"

import { Card } from "@mui/material"

import MessageReceivedMenu from "../Popups/MessageReceivedMenu"

const _MessageReceived = (
	props: PropsWithChildren<{
		message: iMessage
	}>
) => {
	const { message } = props

	const [contextMenu, setContextMenu] = useState<{ left: number; top: number }>()

	const handleOpen = (event: React.MouseEvent) => {
		event.preventDefault()
		setContextMenu(
			!contextMenu ? { left: event.clientX - 2, top: event.clientY - 4 } : undefined
		)
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
			<MessageReceivedMenu
				message={message}
				contextMenu={contextMenu}
				setContextMenu={setContextMenu}
			/>
		</motion.div>
	)
}

export default _MessageReceived
