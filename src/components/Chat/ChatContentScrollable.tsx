import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren, useRef } from "react"
import ScrollToBottom from "react-scroll-to-bottom"

import { styled } from "@mui/material"

import useCurrentChatId from "../../hooks/useCurrentChatId"
import ChatContentMessages from "./ChatContentMessages"

const Scrollable = styled(ScrollToBottom)(({ theme }) => ({
	width: "100%",
	height: "100%",

	"& > div": {
		width: "100%",
		height: "100%",
		overflow: "hidden scroll",
		overflowAnchor: "auto",

		"&::-webkit-scrollbar": {
			width: 15
		},
		"&::-webkit-scrollbar-track": {
			background: "#181818"
		},
		"&::-webkit-scrollbar-thumb": {
			border: "5px solid #181818",
			background: theme.palette.primary.main,
			backgroundClip: "padding-box",
			borderRadius: 9999
		}
	},

	"& > button": {
		display: "none"
	}
}))

const _ChatContentScrollable = (props: PropsWithChildren<{}>) => {
	const chatId = useCurrentChatId()!
	const motionDiv = useRef<HTMLDivElement>(null)

	const getParent = () =>
		(motionDiv.current?.children.item(0)?.children.item(0) as HTMLDivElement) || null

	return (
		<div
			style={{
				flexGrow: 1,
				position: "relative",
				overflow: "hidden"
			}}>
			<AnimatePresence exitBeforeEnter>
				<motion.div
					key={chatId}
					ref={motionDiv}
					style={{
						position: "absolute",
						width: "100%",
						height: "100%"
					}}
					transition={{ duration: 0.2 }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<Scrollable>
						<ChatContentMessages getParent={getParent} />
					</Scrollable>
				</motion.div>
			</AnimatePresence>
		</div>
	)
}

export default _ChatContentScrollable
