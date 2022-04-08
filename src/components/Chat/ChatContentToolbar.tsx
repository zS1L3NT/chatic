import { MoreVert } from "@mui/icons-material"
import { AppBar, Avatar, Box, IconButton, Skeleton, Toolbar } from "@mui/material"

import SkeletonImage from "../Skeletons/SkeletonImage"
import SkeletonText from "../Skeletons/SkeletonText"

interface Props {
	receiver: iUser | null
	presence: iPresence | null
}

const _ChatContentToolbar = (props: Props) => {
	const { receiver, presence } = props

	return (
		<AppBar sx={{ bgcolor: "primary.main" }} position="relative">
			<Toolbar sx={{ display: "grid", gridTemplateColumns: "48px auto 28px" }}>
				<SkeletonImage
					src={receiver?.photo}
					skeleton={<Skeleton variant="circular" style={{ width: 48, height: 48 }} />}
					component={url => <Avatar src={url} style={{ width: 48, height: 48 }} />}
				/>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						px: 2
					}}>
					<SkeletonText variant="body1" sx={{ fontWeight: "medium" }}>
						{receiver?.username}
					</SkeletonText>
					<SkeletonText variant="body2" sx={{ opacity: 0.75 }}>
						Last Seen {presence?.lastSeen}
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
