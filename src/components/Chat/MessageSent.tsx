import { motion } from "framer-motion"
import { PropsWithChildren } from "react"

import { Card } from "@mui/material"

const _MessageSent = (
	props: PropsWithChildren<{
		message: iMessage
	}>
) => {
	const { message } = props

	return (
		<motion.div
			layoutId={message.chatId + "-" + message.id}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			<Card
				sx={{
					width: "fit-content",
					maxWidth: "60%",
					ml: "auto",
					mr: 2,
					px: 2,
					py: 1
				}}>
				{message.content}
			</Card>
		</motion.div>
	)
}

export default _MessageSent
