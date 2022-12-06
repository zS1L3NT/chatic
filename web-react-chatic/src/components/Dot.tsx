import { AnimatePresence, motion, MotionStyle } from "framer-motion"
import { PropsWithChildren } from "react"

import { alpha, Skeleton } from "@mui/material"

const _Dot = (
	props: PropsWithChildren<{
		style?: MotionStyle
		size: number
		color: string | null | undefined
	}>
) => {
	const { style, size, color } = props

	return (
		<motion.div
			style={{
				position: "relative",
				width: size,
				height: size,
				...style
			}}>
			<AnimatePresence exitBeforeEnter>
				{!!color ? (
					<motion.div
						key="dot"
						style={{
							position: "absolute",
							borderRadius: "50%",
							width: size,
							height: size
						}}
						transition={{ duration: 0.5 }}
						initial={{
							opacity: 0,
							backgroundColor: "transparent",
							boxShadow: "none"
						}}
						animate={{
							opacity: 1,
							backgroundColor: color,
							boxShadow: `0 0 6px ${alpha(color, 0.5)}`
						}}
						exit={{ opacity: 0 }}
					/>
				) : (
					<motion.div
						key="skeleton"
						style={{
							position: "absolute",
							width: size,
							height: size
						}}
						transition={{ duration: 0.5 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<Skeleton
							variant="circular"
							style={{
								width: size,
								height: size
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default _Dot
