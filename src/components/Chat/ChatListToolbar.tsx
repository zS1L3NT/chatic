import { MoreVert, Search } from "@mui/icons-material"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"

const _ChatListToolbar = () => {
	return (
		<AppBar sx={{ bgcolor: "primary.main", zIndex: 1 }} position="relative">
			<Toolbar>
				<Typography variant="h6">Chatic</Typography>
				<IconButton onClick={() => {}} sx={{ ml: "auto" }}>
					<Search />
				</IconButton>
				<IconButton onClick={() => {}} edge="end">
					<MoreVert />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}

export default _ChatListToolbar
