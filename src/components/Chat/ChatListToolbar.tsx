import { motion, useAnimation } from "framer-motion"
import { useRef, useState } from "react"

import { Close, MoreVert, Search } from "@mui/icons-material"
import { AppBar, IconButton, TextField, Toolbar, Typography } from "@mui/material"

const _ChatListToolbar = () => {
	const textFieldRef = useRef<HTMLDivElement | null>(null)
	const [searching, setSearching] = useState(true)

	const defaultControls = useAnimation()
	const searchControls = useAnimation()

	const handleSearch = () => {
		setSearching(true)
		defaultControls.start({
			y: -20,
			zIndex: -1,
			opacity: 0,
			transition: {
				duration: 0.2
			}
		})
		searchControls.start({
			y: 0,
			zIndex: 1,
			opacity: 1,
			transition: {
				duration: 0.2
			}
		})

		// @ts-ignore
		textFieldRef?.current.children[0].children[0].focus()
	}

	const handleCancel = () => {
		setSearching(false)
		defaultControls.start({
			y: 0,
			zIndex: 1,
			opacity: 1,
			transition: {
				duration: 0.2
			}
		})
		searchControls.start({
			y: 20,
			zIndex: -1,
			opacity: 0,
			transition: {
				duration: 0.2
			}
		})
	}

	return (
		<AppBar sx={{ bgcolor: "primary.main", zIndex: 1 }} position="relative">
			<Toolbar sx={{ position: "relative", p: "0 !important" }}>
				<motion.div
					style={{
						width: "100%",
						position: "absolute",
						display: "flex",
						padding: "0 24px"
					}}
					animate={defaultControls}>
					<Typography sx={{ my: "auto" }} variant="h6">
						Chatic
					</Typography>
					<IconButton onClick={handleSearch} sx={{ ml: "auto" }}>
						<Search />
					</IconButton>
					<IconButton onClick={() => {}} edge="end">
						<MoreVert />
					</IconButton>
				</motion.div>
				<motion.div
					style={{
						width: "100%",
						position: "absolute",
						display: "flex",
						padding: "0 24px"
					}}
					animate={searchControls}
					initial={{ y: 20, zIndex: -1, opacity: 0 }}>
					<TextField
						sx={{ mt: 0.25, flexGrow: 1 }}
						variant="standard"
						placeholder="Search for chat"
						color="primary"
						ref={textFieldRef}
					/>
					<IconButton onClick={handleCancel} edge="end">
						<Close />
					</IconButton>
				</motion.div>
			</Toolbar>
		</AppBar>
	)
}

export default _ChatListToolbar
