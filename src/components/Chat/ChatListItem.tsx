import { limit, orderBy, where } from "firebase/firestore"
import { motion } from "framer-motion"
import { useContext, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Avatar, Box, Card, CardActionArea, Skeleton } from "@mui/material"

import AuthContext from "../../contexts/AuthContext"
import useAppCollection from "../../hooks/useAppCollection"
import useAppDocument from "../../hooks/useAppDocument"
import SkeletonImage from "../Skeletons/SkeletonImage"
import SkeletonText from "../Skeletons/SkeletonText"

interface Props {
	chat: iChat
}

const ChatListItem = (props: Props) => {
	const { chat } = props
	const route = `#/${chat.id}`

	const navigate = useNavigate()
	const location = useLocation()
	const user = useContext(AuthContext)!
	const isActive = useMemo(() => location.hash === route, [location])

	const [otherUser] = useAppDocument("users", chat.users.filter(id => id !== user.id)[0])
	const [messages] = useAppCollection(
		"messages",
		where("chatId", "==", chat.id),
		orderBy("date", "desc"),
		limit(1)
	)

	const handleClick = () => {
		navigate(isActive ? `/` : route, { replace: true })
	}

	return (
		<motion.div layout>
			<Card sx={{ backgroundColor: isActive ? "primary.dark" : "" }}>
				<CardActionArea
					onClick={handleClick}
					sx={{
						height: 72,
						display: "grid",
						gridTemplateColumns: "56px auto",
						justifyContent: "normal",
						px: 2
					}}>
					<SkeletonImage
						src={otherUser?.photo}
						skeleton={<Skeleton variant="circular" sx={{ width: 56, height: 56 }} />}
						component={url => <Avatar sx={{ width: 56, height: 56 }} src={url} />}
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
						<SkeletonText variant="body1" sx={{ fontWeight: "medium" }}>
							{otherUser?.username}
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

export default ChatListItem
