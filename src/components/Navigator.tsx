import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Menu, People, PersonAdd, Settings } from "@mui/icons-material"
import {
	AppBar, Avatar, Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText,
	SwipeableDrawer, Toolbar, Typography
} from "@mui/material"

import AuthContext from "../contexts/AuthContext"

const _Navigator = () => {
	const navigate = useNavigate()
	const user = useContext(AuthContext)

	const [open, setOpen] = useState(false)

	const handleSettingsClick = () => {
		setOpen(false)
		navigate("/settings")
	}

	return (
		<>
			<AppBar sx={{ bgcolor: "primary.main" }} position="relative">
				<Toolbar>
					<IconButton onClick={() => setOpen(true)} size="large" edge="start">
						<Menu />
					</IconButton>
					<Typography sx={{ ml: 2 }} variant="h6">
						Chatic
					</Typography>
				</Toolbar>
			</AppBar>
			<SwipeableDrawer
				anchor="left"
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}>
				<Box sx={{ width: 250 }} role="presentation">
					<Box
						sx={{
							bgcolor: "primary.main",
							height: 150,
							p: 2.5,
							display: "flex",
							justifyContent: "space-between",
							flexDirection: "column"
						}}>
						<Avatar sx={{ height: 54, width: 54 }} src={user?.photo} alt="Photo" />
						<Box sx={{ px: 0.5 }}>
							<Typography sx={{ width: "100%" }} variant="body1">
								{user?.username}
							</Typography>
							<Typography sx={{ width: "100%" }} variant="body2">
								{user?.email}
							</Typography>
						</Box>
					</Box>
					<List>
						<ListItemButton>
							<ListItemIcon>
								<PersonAdd />
							</ListItemIcon>
							<ListItemText>Add a Friend</ListItemText>
						</ListItemButton>
						<ListItemButton>
							<ListItemIcon>
								<People />
							</ListItemIcon>
							<ListItemText>Friends</ListItemText>
						</ListItemButton>
						<ListItemButton onClick={handleSettingsClick}>
							<ListItemIcon>
								<Settings />
							</ListItemIcon>
							<ListItemText>Settings</ListItemText>
						</ListItemButton>
					</List>
				</Box>
			</SwipeableDrawer>
		</>
	)
}

export default _Navigator
