import { Skeleton, Typography } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"

interface Props {
	children?: string
	variant?: Variant
	width?: string | number
	height?: string | number
}

const SkeletonText = (props: Props) => {
	const { children, variant, width, height } = props

	return children ? (
		<Typography variant={variant} sx={{ width }}>
			{children}
		</Typography>
	) : (
		<Skeleton variant="text" width={width} height={height} />
	)
}

export default SkeletonText
