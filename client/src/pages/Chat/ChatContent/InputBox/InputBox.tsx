import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { getOtherDirectUser, mentionUsers, uploadToStorage } from "../../../../App"
import Firebase from "../../../../Firebase"
import Functions from "../../../../Functions"
import Repo from "../../../../Repository"
import { IChat, IMessage } from "../../../../Types"
import ImageSelector from "../../../../components/ImageSelector/ImageSelector"
import "./InputBox.scss"
import firebase from "firebase/app"

interface props {
	chat: IChat
	reply: string
	SETreply: React.Dispatch<React.SetStateAction<string>>
	edit: IMessage | undefined
	SETedit: React.Dispatch<React.SetStateAction<IMessage | undefined>>
}

export default function InputBox(props: props) {
	const { chat, reply, SETreply, edit, SETedit } = props
	const { users, cid } = chat
	const [text, SETtext] = useState("")
	const [isTyping, SETisTyping] = useState(false)
	const [imgmenu, SETimgmenu] = useState(false)
	const [timeout, SETtimeout] = useState<NodeJS.Timeout>()

	const reduxuid = useSelector(state => state.uid)
	const listeners = useSelector(state => state.listeners)
	const ipv4 = useSelector(state => state.ipv4)
	const history = useHistory()
	const location = useLocation()
	const { storage } = Firebase

	useEffect(() => {
		if (!reduxuid) {
			return
		}
		Repo.user(reduxuid).presenceIP(ipv4).update({
			typing: isTyping
		})
	}, [isTyping, reduxuid, ipv4])

	/**
	 * General function to upload messages to the cloud
	 * @param message Object with all the properties of a Firebase Message
	 * @param string String that shows up on the chat list
	 */
	const send = async (message: IMessage, string: string) => {
		const isTemporaryChat = !!location.pathname.match(/^\/chat\/@.*$/)

		/**
		 * ? If chat is a temporary chat then insert
		 */
		if (isTemporaryChat) {
			await Repo.chat(cid).set(chat)
			Functions.addToChat(reduxuid, cid)
			Functions.addToChat(getOtherDirectUser(chat.users, reduxuid), cid)
		}

		Repo.chat(cid).message(message.mid).set(message)
		Functions.onMessage(
			users.filter(u => u !== reduxuid),
			cid,
			message.mid,
			`<!@${reduxuid}>: ${string}`
		)
		if (isTemporaryChat) history.push(`/chat/~${cid}`)
	}

	const sendImage = async (img: string) => {
		if (img) {
			const mid = Repo.newMessageID(cid)
			const url = await uploadToStorage(storage, `/${cid}/${mid}`, img)
			const message: IMessage = {
				mid,
				data: url,
				sender: reduxuid,
				reply,
				time: new Date().getTime(),
				type: "image",
				status: {}
			}

			send(message, "[image]")
			Repo.chat(cid).update({
				media: firebase.firestore.FieldValue.arrayUnion(mid)
			})
		}
	}

	const sendText = async () => {
		if (text.match(/^\n*$/)) return undefined
		const serializedText = (text.match(/^\n*(.*)\n*$/)?.[1] || text).replaceAll("\n", "\\n")

		SETtext("")
		SETreply("")
		SETisTyping(false)

		const message: IMessage = {
			mid: Repo.newMessageID(cid),
			data: serializedText,
			sender: reduxuid,
			reply,
			time: new Date().getTime(),
			type: "text",
			status: {}
		}

		send(message, text)
	}

	const editText = (message: IMessage) => {
		if (text.match(/^\n*$/)) return undefined
		const serializedText = (text.match(/^\n*(.*)\n*$/)?.[1] || text).replaceAll("\n", "\\n")

		SETtext("")
		SETedit(undefined)

		Repo.chat(cid).message(message.mid).update({ data: serializedText })
	}

	return (
		<section className="inputbox">
			<div className={"inputbox__action" + (reply || edit ? " active" : "")}>
				<p className="inputbox__action__p">
					<i className={"fa fa-" + (reply ? "share" : "pencil")}></i>{" "}
					{reply
						? mentionUsers(reply.replaceAll("\\n", " "), reduxuid, listeners.users)
						: edit
						? edit.data.replaceAll("\\n", " ")
						: null}
				</p>
				<button
					className={"inputbox__action__close" + (reply || edit ? " active" : "")}
					type="button"
					onClick={() => {
						SETreply("")
						SETedit(undefined)
					}}>
					<i className="fa fa-times"></i>
				</button>
			</div>
			<textarea
				value={text}
				className={"inputbox__input" + (reply || edit ? " action" : "")}
				placeholder="Enter a message..."
				onChange={e => {
					SETtext(e.target.value)
				}}
				onKeyUp={() => {
					SETisTyping(true)
					if (timeout) clearTimeout(timeout)
					SETtimeout(setTimeout(() => SETisTyping(false), 3000))
				}}
				onKeyDown={e => {
					SETisTyping(true)
					if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
						e.preventDefault()
						if (edit) editText(edit)
						else sendText()
					}
				}}
			/>
			<button className="inputbox__gallery" onClick={() => SETimgmenu(true)}>
				<i className="fa fa-picture-o"></i>
			</button>
			<ImageSelector open={imgmenu} SETopen={SETimgmenu} SETres={sendImage} />
		</section>
	)
}
