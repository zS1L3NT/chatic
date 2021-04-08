import React, { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useSelector } from "react-redux"
import { mentionUsers } from "../../../../App"
import SVG0 from "../../../../assets/images/0.svg"
import SVG1 from "../../../../assets/images/1.svg"
import SVG2 from "../../../../assets/images/2.svg"
import SVG3 from "../../../../assets/images/3.svg"
import { IMessage, IUser } from "../../../../Types"
import AsyncImage from "../../../../components/AsyncImage/AsyncImage"
import ConfirmMenu from "../../../../components/ConfirmMenu/ConfirmMenu"
import ContextMenu from "../../../../components/ContextMenu/ContextMenu"
import "./Message.scss"
import Repo from "../../../../Repository"
import firebase from "firebase/app"

interface props {
	message: IMessage
	cid: string
	isAdmin: boolean
	SETreply: React.Dispatch<React.SetStateAction<string>>
	SETedit: React.Dispatch<React.SetStateAction<IMessage | undefined>>
}

export default function Message(props: props) {
	const { message, cid, isAdmin, SETreply, SETedit } = props

	const [user, SETuser] = useState<IUser>()
	const [title, SETtitle] = useState(false)
	const [date, SETdate] = useState("")
	const [time, SETtime] = useState("")
	const [icon, SETicon] = useState(<></>)

	const [cfm_m, SETcfm_m] = useState(false)
	const [cfm_e, SETcfm_e] = useState(false)
	const [ctm, SETctm] = useState<React.MouseEvent>()

	const reduxuid = useSelector(state => state.uid)
	const listeners = useSelector(state => state.listeners)
	const chatmessages = useSelector(state => state.message[cid])
	
	const deleteForMe = () => {
		Repo.chat(cid).message(message.mid).update({
			['status.' + reduxuid]: firebase.firestore.FieldValue.delete()
		})
	}
	
	const deleteForEveryone = () => {
		Repo.chat(cid).message(message.mid).remove()
	}
	
	/**
	 * &
	 */
	useEffect(() => {
		const user = listeners.users[message.sender]
		if (user) {
			SETuser(user)
		}
	}, [listeners, message])
	
	useEffect(() => {
		const keyOfMIDs = Object.keys(chatmessages)

		const icons = [SVG0, SVG1, SVG2, SVG3]
		SETicon(
			<img
				src={icons[Math.min(...Object.values(message.status))]}
				alt="status"
			/>
		)

		if (keyOfMIDs.indexOf(message.mid) < 0) {
			SETtitle(false)
			return
		}

		const IndexofPrevious = keyOfMIDs.indexOf(message.mid) - 1
		const messageDate = new Date(message.time).toDateString()

		if (IndexofPrevious === -1) {
			SETtitle(true)
			if (new Date().toDateString() === messageDate) {
				SETdate("Today")
			} else if (new Date().getTime() - message.time < 86400000) {
				SETdate("Yesterday")
			} else SETdate(messageDate)
			return
		}

		const MIDofPrevious = keyOfMIDs[IndexofPrevious]
		const PreviousMessage = chatmessages[MIDofPrevious]

		/**
		 * ! Fix !
		 * : this :
		 * ^ boolean ^
		 * * As *
		 * ? Soon ?
		 * ~ As ~
		 * & Possible &
		 */
		SETtitle(
			PreviousMessage.sender !== message.sender ||
				new Date(PreviousMessage.time).toDateString() !== messageDate
		)
		if (new Date(PreviousMessage.time).toDateString() !== messageDate) {
			if (new Date().toDateString() === messageDate) {
				SETdate("Today")
			} else if (new Date().getTime() - message.time < 86400000) {
				SETdate("Yesterday")
			} else SETdate(messageDate)
		}
	}, [chatmessages, reduxuid, message])

	useEffect(() => {
		if (message) {
			let time = ""
			const hr = new Date(message.time).getHours()
			const mn = new Date(message.time).getMinutes()
			if (hr > 12) {
				time += hr - 12
			} else {
				time += hr
			}
			time += ":" + (mn < 10 ? "0" + mn : mn) + " "
			if (hr > 12) {
				time += "pm"
			} else {
				time += "am"
			}

			SETtime(time)
		}
	}, [message])

	return (
		<>
			{date && <p className="message__date">{date}</p>}
			{title && (
				<h3 className="message__title">
					{user ? (
						user.usnm + (isAdmin ? " ☆" : "")
					) : (
						<Skeleton width={140} />
					)}
				</h3>
			)}
			<section
				className="message"
				onContextMenu={e => {
					e.preventDefault()
					SETctm(e)
				}}>
				<div className="message__data">
					{message.reply && (
						<p className="message__data__reply">
							{mentionUsers(
								message.reply.replaceAll("\\n", " "),
								reduxuid,
								listeners.users
							)}
						</p>
					)}
					{message.type === "text" && (
						<p className="message__data__text">
							{stringToJSX(message.data)}
						</p>
					)}
					{message.type === "image" && (
						<AsyncImage
							src={message.data}
							className="message__data__image"
						/>
					)}
				</div>
				<div className="message__info">
					{message.sender === reduxuid && (
						<p className="message__info__icon">{icon}</p>
					)}
					<p className="message__info__time">{time}</p>
				</div>
			</section>
			{ctm && (
				<ContextMenu
					ctm={ctm}
					SETctm={SETctm}
					options={[
						{
							title: "Reply",
							icon: "reply",
							access: true,
							onClick: () => {
								SETreply(
									`<!@${message.sender}>: ${message.data}`
								)
								SETedit(undefined)
								SETctm(undefined)
							}
						},
						{
							title: "Edit Message",
							icon: "pencil",
							access:
								message.type === "text" &&
								message.sender === reduxuid,
							onClick: () => {
								SETedit(message)
								SETreply("")
								SETctm(undefined)
							}
						},
						{
							title: "Delete for me",
							icon: "trash",
							access: true,
							onClick: () => {
								SETcfm_m(true)
							}
						},
						{
							title: "Delete for everyone",
							icon: "trash",
							access: message.sender === reduxuid,
							onClick: () => {
								SETcfm_e(true)
							}
						}
					]}
				/>
			)}
			{cfm_m && (
				<ConfirmMenu
					SETcfm={SETcfm_m}
					falseMsg="No"
					trueMsg="Yes"
					action={"delete this message for yourself"}
					onRes={res => res && deleteForMe()}
				/>
			)}
			{cfm_e && (
				<ConfirmMenu
					SETcfm={SETcfm_e}
					falseMsg="No"
					trueMsg="Yes"
					action={"delete this message for everyone"}
					onRes={res => res && deleteForEveryone()}
				/>
			)}
		</>
	)
}

const stringToJSX = (message: string): JSX.Element => {
	return (
		<>
			{message.split("\\n").map((str, i) => {
				if (i + 1 === message.split("\\n").length)
					return <span key={i}>{str}</span>
				return (
					<span key={i}>
						{str}
						<br />
					</span>
				)
			})}
		</>
	)
}
