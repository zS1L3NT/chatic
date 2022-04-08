import { limit, orderBy, where } from "firebase/firestore"
import { motion, useAnimation } from "framer-motion"
import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Avatar, Box, Card, CardActionArea, Skeleton, useTheme } from "@mui/material"

import AuthContext from "../../contexts/AuthContext"
import ChatContext from "../../contexts/ChatContext"
import useAppCollection from "../../hooks/useAppCollection"
import useAppDocument from "../../hooks/useAppDocument"
import SkeletonImage from "../Skeletons/SkeletonImage"
import SkeletonText from "../Skeletons/SkeletonText"

interface Props {
	chat: iChat
	setFilters: Dispatch<SetStateAction<Record<string, (search: string) => boolean>>>
}

// TODO Context Menu Actions
// TODO Sent message statuses

const _ChatListItem = (props: Props) => {
	const { chat, setFilters } = props
	const route = `#/${chat.id}`

	const navigate = useNavigate()
	const location = useLocation()
	const user = useContext(AuthContext)!
	const { setChat, setReceiver, setPresence } = useContext(ChatContext)

	const photoBorderControls = useAnimation()
	const theme = useTheme()
	const [receiver] = useAppDocument("users", chat.users.filter(id => id !== user.id)[0])
	const [presences] = useAppCollection(
		"presences",
		where("userId", "==", receiver?.id || "-"),
		orderBy("isOnline", "desc"),
		orderBy("lastSeen", "desc"),
		limit(1)
	)
	const [messages] = useAppCollection(
		"messages",
		where("chatId", "==", chat.id),
		orderBy("date", "desc"),
		limit(1)
	)

	const handleClick = () => {
		navigate(location.hash === route ? `/` : route, { replace: true })
	}

	useEffect(() => {
		setFilters(filters => ({
			...filters,
			[chat.id]: search =>
				search && receiver
					? receiver.username.toLowerCase().indexOf(search) >= 0
						? true
						: false
					: true
		}))
	}, [receiver])

	useEffect(() => {
		if (location.hash === route) {
			setChat(chat)
			setReceiver(receiver)
			setPresence(presences?.[0] || null)
		}
	}, [chat, receiver, location.hash])

	useEffect(() => {
		if (presences?.[0]?.isOnline) {
			photoBorderControls.start({
				backgroundColor: theme.palette.success.main,
				transition: {
					duration: 0.5
				}
			})
		} else {
			photoBorderControls.start({
				backgroundColor: `rgba(0, 0, 0, 0)`,
				transition: {
					duration: 0.5
				}
			})
		}
	}, [presences, theme])

	return (
		<motion.div
			transition={{ duration: 0.25 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			layout>
			<Card sx={{ backgroundColor: location.hash === route ? "primary.dark" : "" }}>
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
						skeleton={<Skeleton variant="circular" sx={{ width: 56, height: 56 }} />}
						component={url => <Avatar sx={{ width: 56, height: 56 }} src={url} />}
					/>
					<motion.div
						animate={photoBorderControls}
						initial={{
							position: "absolute",
							backgroundColor: "transparent",
							borderRadius: "50%",
							width: 10,
							height: 10,
							marginLeft: 64,
							bottom: 10
						}}></motion.div>
					<Box
						sx={{
							height: "100%",
							minWidth: 0,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							pl: 2
						}}>
						<SkeletonText variant="body1" sx={{ fontWeight: "medium" }}>
							{receiver?.username}
						</SkeletonText>
						<SkeletonText variant="body2" sx={{ opacity: 0.75 }}>
							{messages ? (messages[0] ? messages[0].content : "") : null}
						</SkeletonText>
					</Box>
				</CardActionArea>
			</Card>
		</motion.div>
	)
}

export default _ChatListItem
