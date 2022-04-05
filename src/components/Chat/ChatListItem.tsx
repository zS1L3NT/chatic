import AuthContext from "../../contexts/AuthContext"
import SkeletonImage from "../Skeletons/SkeletonImage"
import SkeletonText from "../Skeletons/SkeletonText"
import useAppCollection from "../../hooks/useAppCollection"
import useAppDocument from "../../hooks/useAppDocument"
import { Avatar, Box, Card, CardActionArea, Skeleton, Typography } from "@mui/material"
import { limit, orderBy, where } from "firebase/firestore"
import { motion } from "framer-motion"
import { useContext } from "react"

interface Props {
	chat: iChat
}

const ChatListItem = (props: Props) => {
	const { chat } = props

	const user = useContext(AuthContext)!

	const [otherUser] = useAppDocument("users", chat.users.filter(id => id !== user.id)[0])
	const [messages] = useAppCollection(
		"messages",
		where("chatId", "==", chat.id),
		orderBy("date", "desc"),
		limit(1)
	)

	return (
		<motion.div layout>
			<Card>
				<CardActionArea
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
						<SkeletonText variant="h6">{otherUser?.username}</SkeletonText>
						<SkeletonText variant="subtitle1">{messages?.[0]?.content}</SkeletonText>
					</Box>
				</CardActionArea>
			</Card>
		</motion.div>
	)
}

export default ChatListItem
