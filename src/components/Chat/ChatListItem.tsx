import { motion } from "framer-motion"
import { Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Avatar, Box, Card, CardActionArea, useTheme } from "@mui/material"

import useChatMessages from "../../hooks/useChatMessages"
import useChatReceiver from "../../hooks/useChatReceiver"
import useUserPresence from "../../hooks/useUserPresence"
import Dot from "../Dot"
import SkeletonImage from "../Skeletons/SkeletonImage"
import SkeletonText from "../Skeletons/SkeletonText"

// TODO Context Menu Actions
// TODO Sent message statuses

const _ChatListItem = (
	props: PropsWithChildren<{
		chat: iChat
		setFilters: Dispatch<SetStateAction<Record<string, (search: string) => boolean>>>
	}>
) => {
	const { chat, setFilters } = props
	const route = `/chat/${chat.id}`

	const navigate = useNavigate()
	const location = useLocation()
	const [dotColor, setDotColor] = useState<string | null>(null)

	const theme = useTheme()
	const receiver = useChatReceiver(chat)
	const presence = useUserPresence(receiver?.id)
	const latestMessage = useChatMessages(chat.id, 1)?.[0]

	const handleClick = () => {
		navigate(location.pathname === route ? `/chat` : route, { replace: true })
	}

	useEffect(() => {
		setFilters(filters => ({
			...filters,
			[chat.id]: search =>
				search && receiver
					? receiver.username.toLowerCase().indexOf(search.toLowerCase()) >= 0
						? true
						: false
					: true
		}))
	}, [receiver])

	useEffect(() => {
		setDotColor(
			presence ? (presence.isOnline ? theme.palette.success.main : "rgba(0, 0, 0, 0)") : null
		)
	}, [presence, theme])

	return (
		<motion.div
			transition={{ duration: 0.25 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			layout>
			<Card sx={{ backgroundColor: location.pathname === route ? "primary.dark" : "" }}>
				<CardActionArea
					onClick={handleClick}
					sx={{
						height: 72,
						display: "grid",
						gridTemplateColumns: "58px auto",
						justifyContent: "normal",
						px: 2
					}}>
					<SkeletonImage
						src={receiver?.photo}
						variant="circular"
						width={56}
						height={56}
						component={[Avatar, src => ({ src })]}
					/>
					<Dot
						style={{
							position: "absolute",
							marginLeft: 64,
							bottom: 8
						}}
						size={10}
						color={dotColor}
					/>
					<Box
						sx={{
							height: "100%",
							minWidth: 0,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							pl: 2
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
							{latestMessage ? latestMessage.content || "" : null}
						</SkeletonText>
					</Box>
				</CardActionArea>
			</Card>
		</motion.div>
	)
}

export default _ChatListItem
