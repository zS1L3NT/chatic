import { PropsWithChildren } from "react"

import { MoreVert } from "@mui/icons-material"
import { AppBar, Avatar, Box, IconButton, Toolbar } from "@mui/material"

import getStatus from "../../functions/getStatus"
import SkeletonImage from "../Skeletons/SkeletonImage"
import SkeletonText from "../Skeletons/SkeletonText"

const _ChatContentToolbar = (
	props: PropsWithChildren<{
		receiver: iUser | null
		presence: iPresence | null
	}>
) => {
	const { receiver, presence } = props

	return (
		<AppBar sx={{ bgcolor: "primary.main" }} position="relative">
			<Toolbar sx={{ display: "grid", gridTemplateColumns: "48px auto 28px" }}>
				<SkeletonImage
					src={receiver?.photo}
					width={48}
					height={48}
					variant="circular"
					component={[Avatar, src => ({ src })]}
				/>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						px: 2
					}}>
					<SkeletonText
						sx={{ fontWeight: "medium" }}
						variant="body1"
						textWidth="100%"
						textHeight={24}
						skeletonWidth={100}
						skeletonHeight={20}>
						{receiver?.username}
					</SkeletonText>
					<SkeletonText
						sx={{ opacity: 0.75 }}
						variant="body2"
						textWidth="100%"
						textHeight={20}
						skeletonWidth={150}
						skeletonHeight={16}>
						{presence && getStatus(presence)}
					</SkeletonText>
				</Box>
				<IconButton sx={{ width: 40 }} onClick={() => {}} edge="end">
					<MoreVert />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}

export default _ChatContentToolbar
