import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import logo from "../../../assets/images/chatlogo.png"
import { IChat, IMessage } from "../../../Types"
import "./ChatContent.scss"
import ChatProfile from "./ChatProfile/ChatProfile"
import CreateGroup from "./CreateGroup/CreateGroup"
import InputBox from "./InputBox/InputBox"
import JoinGroup from "./JoinGroup/JoinGroup"
import Message from "./Message/Message"
import ScrollToBottom from "react-scroll-to-bottom"
import Functions from "../../../Functions"
import Repo from "../../../Repository"
import { SetFirestoreMessages } from "../../../redux/actions/MessageActions"
import firebase from "firebase/app"

interface props {
	chat?: IChat
	error?: string
}

export default function ChatContent(props: props) {
	const { chat, error } = props
	const [reply, SETreply] = useState("")
	const [edit, SETedit] = useState<IMessage>()

	const messages = useSelector(state => state.message[chat?.cid || ""])
	const reduxuid = useSelector(state => state.uid)
	const ipv4 = useSelector(state => state.ipv4)
	const dispatch = useDispatch()
	const location = useLocation()

	useEffect(() => {
		if (chat?.cid) {
			Functions.onChangeChat(reduxuid, chat.cid, ipv4)
			SETreply("")
			SETedit(undefined)
		}
	}, [chat?.cid, reduxuid, ipv4])

	useEffect(() => {
		if (!reduxuid) return
		if (chat?.cid && !messages) {
			Repo.chat(chat.cid)
				.messages()
				.where(new firebase.firestore.FieldPath("status", reduxuid), ">", 0)
				.observe(messages => {
					const sorted = Object.values(messages).sort((a, b) => a.time - b.time)
					dispatch(SetFirestoreMessages(chat.cid, Object.values(sorted)))
				})
		}
	}, [dispatch, reduxuid, chat?.cid, messages])

	return chat ? (
		<main className="chatcontent">
			<ChatProfile chat={chat} />
			<ScrollToBottom className="chatcontent__messages">
				{messages &&
					Object.values(messages).map(message => (
						<Message
							key={message.mid}
							message={message}
							cid={chat.cid}
							SETreply={SETreply}
							SETedit={SETedit}
							isAdmin={chat.admins.indexOf(message.sender) >= 0}
						/>
					))}
			</ScrollToBottom>
			<InputBox chat={chat} reply={reply} SETreply={SETreply} edit={edit} SETedit={SETedit} />
		</main>
	) : location.pathname === `/chat/creategroup` ? (
		<CreateGroup />
	) : location.pathname.startsWith(`/chat/joingroup`) ? (
		<JoinGroup iid={location.pathname.slice(15)} />
	) : (
		<section className="selectchat">
			<div className="selectchat__data">
				<img className="selectchat__data__logo" src={logo} alt="Chatic" />
				<h3 className={"selectchat__data__message" + (error ? " error" : "")}>{error || "Select a chat!"}</h3>
			</div>
		</section>
	)
}
