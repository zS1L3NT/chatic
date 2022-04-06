import { AppBar, Toolbar } from "@mui/material"

import useCurrentChat from "../../hooks/useCurrentChat"

const _ChatContentToolbar = () => {
	const chat = useCurrentChat()

	return (
		<AppBar sx={{ bgcolor: "primary.main" }} position="relative">
			<Toolbar></Toolbar>
		</AppBar>
	)
}

export default _ChatContentToolbar
