import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren, useEffect, useState } from "react"

import { Skeleton } from "@mui/material"

const _SkeletonImage = <P,>(
	props: PropsWithChildren<{
		src: string | null | undefined
		width: string | number
		height: string | number
		variant: "rectangular" | "circular"
		component: [(props: P) => JSX.Element, (image: string) => P]
	}>
) => {
	const {
		src,
		width,
		height,
		variant,
		component: [Class, ClassProps]
	} = props
	/**
	 * String if loaded successfully,
	 * Null if loaded unsuccessfully,
	 * Undefined if loading in progress
	 */
	const [image, setImage] = useState<string | null>(null)

	useEffect(() => {
		let active = true

		if (!!src) {
			setImage(null)

			const image = new Image()
			image.src = src
			image.onload = () => {
				if (active) {
					setImage(src)
				}
			}
			image.onerror = () => {
				if (active) {
					setImage(null)
				}
			}
		} else {
			setImage(null)
		}

		return () => {
			active = false
		}
	}, [src])

	return (
		<motion.div style={{ position: "relative", width, height }}>
			<AnimatePresence exitBeforeEnter>
				{!!image ? (
					<motion.span
						key="image"
						style={{ position: "absolute", width, height }}
						transition={{ duration: 0.5 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<Class sx={{ width, height }} {...ClassProps(image)} />
					</motion.span>
				) : (
					<motion.span
						key="skeleton"
						style={{ position: "absolute", width, height }}
						transition={{ duration: 0.5 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<Skeleton variant={variant} sx={{ width, height }} />
					</motion.span>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default _SkeletonImage
