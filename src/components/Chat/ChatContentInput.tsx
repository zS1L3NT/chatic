import { motion } from "framer-motion"
import { PropsWithChildren, useRef } from "react"

import { Card, styled } from "@mui/material"

const TextAreaWrapper = styled(Card)(({ theme }) => ({
	width: "100%",
	height: 48,
	maxHeight: 218,

	paddingTop: 14,
	paddingBottom: 14,
	paddingLeft: 16,
	paddingRight: 16,

	background: theme.palette.background.default,
	borderRadius: 10,
	cursor: "text"
}))

const TextArea = styled(`textarea`)(({ theme }) => ({
	resize: "none",

	width: "100%",
	height: 20,
	maxHeight: 190,
	padding: 0,
	margin: 0,
	color: theme.palette.primary.contrastText,
	background: theme.palette.background.default,

	outline: 0,
	border: 0,

	fontSize: 16,
	fontFamily: "Roboto",
	fontWeight: "normal",

	"&::-webkit-scrollbar": {
		width: 4
	},
	"&::-webkit-scrollbar-track": {
		background: theme.palette.background.default
	},
	"&::-webkit-scrollbar-thumb": {
		background: theme.palette.primary.main,
		borderRadius: 2
	}
}))

const _ChatContentInput = (props: PropsWithChildren<{}>) => {
	const inputRef = useRef<HTMLTextAreaElement>(null)

	const handleInput = () => {
		const input = inputRef.current
		if (input) {
			input.style.height = "20px"
			input.style.height = input.scrollHeight + "px"
			input.parentElement!.style.height = input.scrollHeight + 28 + "px"
		}
	}

	const handleClick = () => {
		inputRef.current?.focus()
	}

	return (
		<motion.div
			style={{
				padding: 16,
				paddingTop: 8
			}}
			transition={{ duration: 0.2 }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			<TextAreaWrapper onClick={handleClick}>
				<TextArea ref={inputRef} onInput={handleInput} placeholder="Type a message..." />
			</TextAreaWrapper>
		</motion.div>
	)
}

export default _ChatContentInput
