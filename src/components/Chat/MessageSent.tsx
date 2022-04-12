import { motion } from "framer-motion"
import { DateTime } from "luxon"
import { PropsWithChildren } from "react"

import { Card } from "@mui/material"

import Dot from "../Dot"

const _MessageSent = (
	props: PropsWithChildren<{
		message: iMessage
	}>
) => {
	const { message } = props

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
					<Dot style={{ marginLeft: 8, marginBottom: 6 }} size={8} color={getColor()} />
				</div>
			</Card>
		</motion.div>
	)
}

export default _MessageSent
