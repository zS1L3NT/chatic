import { motion } from "framer-motion"
import { PropsWithChildren } from "react"

import { Card } from "@mui/material"

const _MessageReceived = (
	props: PropsWithChildren<{
		message: iMessage
	}>
) => {
	const { message } = props

	return (
		<motion.div
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}>
			<Card
				sx={{
					width: "fit-content",
					maxWidth: "60%",
					mx: 2,
					px: 2,
					py: 1
				}}>
				{message.content}
			</Card>
		</motion.div>
	)
}

export default _MessageReceived
