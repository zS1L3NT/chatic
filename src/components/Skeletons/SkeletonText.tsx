import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren } from "react"

import { Skeleton, SxProps, Theme, Typography } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"

const _SkeletonText = (
	props: PropsWithChildren<{
		sx?: SxProps<Theme>
		variant?: Variant
		textWidth: string | number
		textHeight: string | number
		skeletonWidth: string | number
		skeletonHeight: string | number
	}>
) => {
	const { children, sx, variant, textWidth, textHeight, skeletonWidth, skeletonHeight } = props

	return (
		<motion.span
			style={{
				position: "relative",
				height: textHeight
			}}>
			<AnimatePresence exitBeforeEnter>
				{!!children ? (
					<motion.span
						key="text"
						style={{
							position: "absolute",
							width: textWidth,
							height: textHeight
						}}
						transition={{ duration: 0.5 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<Typography
							variant={variant}
							sx={{
								width: textWidth,
								height: textHeight,
								...sx
							}}>
							{children || "\u200B"}
						</Typography>
					</motion.span>
				) : (
					<motion.span
						key="skeleton"
						style={{
							position: "absolute",
							width: skeletonWidth,
							height: skeletonHeight
						}}
						transition={{ duration: 0.5 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<Skeleton
							variant="text"
							sx={{
								transform: "none",
								width: skeletonWidth,
								height: skeletonHeight
							}}
						/>
					</motion.span>
				)}
			</AnimatePresence>
		</motion.span>
	)
}

export default _SkeletonText
