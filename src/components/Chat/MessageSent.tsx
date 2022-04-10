import { motion } from "framer-motion"
import { DateTime } from "luxon"
import { PropsWithChildren } from "react"

import { Card, useTheme } from "@mui/material"

import Dot from "../Dot"

const _MessageSent = (
	props: PropsWithChildren<{
		message: iMessage
		isStartBlock: boolean
		isEndBlock: boolean
	}>
) => {
	const { message, isStartBlock, isEndBlock } = props

	const theme = useTheme()

	return (
		<motion.div
			style={{ display: "flex" }}
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}>
			<Card
				sx={{
					width: "fit-content",
					maxWidth: "60%",
					ml: "auto",
					mr: 2,
					mt: isStartBlock ? 1.5 : 0.5,
					mb: isEndBlock ? 1.5 : 0.5,
					px: 2,
					py: 1
				}}>
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
					<Dot
						style={{ marginLeft: 8, marginBottom: 6 }}
						size={8}
						color={theme.palette.success.main}
					/>
				</div>
			</Card>
		</motion.div>
	)
}

export default _MessageSent
