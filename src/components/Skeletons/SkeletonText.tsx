import { PropsWithChildren } from "react"

import { Skeleton, SxProps, Theme, Typography } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"

interface Props extends PropsWithChildren<{}> {
	variant?: Variant
	sx?: SxProps<Theme>
	width?: string | number
	height?: string | number
}

const _SkeletonText = (props: Props) => {
	const { children, variant, sx, width, height } = props

	return children !== undefined && children !== null ? (
		<Typography variant={variant} sx={{ width, ...sx }}>
			{children || "\u200B"}
		</Typography>
	) : (
		<Skeleton variant="text" width={width} height={height} />
	)
}

export default _SkeletonText
