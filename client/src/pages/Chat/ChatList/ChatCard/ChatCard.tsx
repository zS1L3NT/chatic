import React, { useEffect, useState } from "react"
import { Flipped } from "react-flip-toolkit"
import Skeleton from "react-loading-skeleton"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import {
	getOtherDirectUser,
	ListDifference,
	mentionUsers
} from "../../../../App"
import {
	AddUIDToListening,
	RemoveUIDFromListening
} from "../../../../redux/actions/ListenersActions"
import { IPresence, IChat } from "../../../../Types"
import ContextMenu from "../../../../components/ContextMenu/ContextMenu"
import Avatar from "../../Avatar/Avatar"
import "./ChatCard.scss"
import ConfirmMenu from "../../../../components/ConfirmMenu/ConfirmMenu"
import Functions from "../../../../Functions"
import Repo from "../../../../Repository"
import { usePrevious } from "../../../../hooks/usePrevious"

interface props {
	cid?: string
}

export default function ChatCard(props: props) {
	const { cid } = props

	const [chat, SETchat] = useState<IChat>()
	const [display, SETdisplay] = useState<{
		name: string
		icon: string
	}>({
		name: "",
		icon: ""
	})
	const [presence, SETpresence] = useState<IPresence>()
	const [typingToMe, SETtypingToMe] = useState(false)
	const [lastmsg, SETlastmsg] = useState("")
	const [unread, SETunread] = useState(0)

	const [ctm, SETctm] = useState<React.MouseEvent>()
	const [cfm, SETcfm] = useState(false)

	const reduxuid = useSelector(state => state.uid)
	const listeners = useSelector(state => state.listeners)
	const history = useHistory()
	const location = useLocation()
	const dispatch = useDispatch()
	const previousUsers = usePrevious(chat?.users)

	/**
	 * Fill the chat object with updates from the database
	 */
	useEffect(() => {
		if (cid) {
			return Repo.chat(cid).observe(SETchat, () =>
				console.warn(`[ChatCard.tsx] No chat found for "${cid}"`)
			)
		}
	}, [cid])

	useEffect(() => {
		if (chat?.type && chat?.users) {
			if (chat.type === "direct") {
				const _uid_ = getOtherDirectUser(chat.users, reduxuid)
				SETpresence(listeners.presences[_uid_])
			} else {
				SETpresence(undefined)
			}
		}
	}, [listeners.presences, chat?.type, chat?.users, reduxuid])

	/**
	 * Unread message handler
	 */
	useEffect(() => {
		if (cid && chat?.lastmsg && listeners.users[reduxuid]?.unread) {
			SETlastmsg(chat.lastmsg)
			if (location.pathname !== `/chat/~${cid}`) {
				SETunread(listeners.users[reduxuid].unread?.[cid] || 0)
			} else {
				SETunread(0)
			}

			return () => {
				if (location.pathname === `/chat/~${cid}`)
					Repo.user(reduxuid).update({
						unread: {
							[cid]: 0
						}
					})
			}
		}
	}, [reduxuid, cid, chat?.lastmsg, listeners.users, location.pathname])

	/**
	 * & Change listening UIDs
	 */
	useEffect(() => {
		if (chat?.users) {
			if (!previousUsers) {
				for (let i = 0, il = chat.users.length; i < il; i++)
					dispatch(AddUIDToListening(chat.users[i]))
				return
			}

			ListDifference(previousUsers, chat.users)
				.added(added => {
					for (let i = 0, il = added.length; i < il; i++)
						dispatch(AddUIDToListening(added[i]))
				})
				.removed(removed => {
					for (let i = 0, il = removed.length; i < il; i++)
						dispatch(RemoveUIDFromListening(removed[i]))
				})
		}
	}, [dispatch, chat?.users, previousUsers, reduxuid])

	/**
	 * & Handle displaying chat information
	 */
	useEffect(() => {
		if (chat?.type && chat?.users) {
			if (chat.type === "direct") {
				const _uid_ = getOtherDirectUser(chat.users, reduxuid)
				const _user_ = listeners.users[_uid_]
				if (_user_) {
					SETdisplay({
						name: _user_.usnm,
						icon: _user_.pfp
					})
				}
			} else {
				SETdisplay({
					name: chat.name,
					icon: chat.icon
				})
			}
		}
	}, [listeners, chat?.name, chat?.icon, chat?.type, chat?.users, reduxuid])

	/**
	 * & Handle "... is typing"
	 */
	useEffect(() => {
		if (!presence || !chat?.cid) {
			SETtypingToMe(false)
			return
		}

		const presences = Object.values(presence)
		for (let i = 0, il = presences.length; i < il; i++) {
			const presence = presences[i]
			if (
				presence.isOnline &&
				presence.listening === chat.cid &&
				presence.typing
			) {
				SETtypingToMe(true)
				return
			}
		}

		SETtypingToMe(false)
	}, [presence, chat?.cid])

	/**
	 * Function to select chat
	 * If this current chat is already selected, return to main chat page
	 */
	const selectChat = () => {
		if (cid) {
			if (window.location.pathname === `/chat/~${cid}`) {
				history.push(`/chat`)
			} else {
				history.push(`/chat/~${cid}`)
			}
		}
	}

	return (
		<Flipped key={cid} flipId={cid}>
			<div>
				<button
					className={`chatcard ${
						window.location.pathname === `/chat/~${cid}`
							? "selected"
							: ""
					}`}
					onContextMenu={e => {
						e.preventDefault()
						SETctm(e)
					}}
					onClick={selectChat}>
					<div className="chatcard__wrapper">
						<Avatar
							src={display.icon || ""}
							isOnline={
								chat?.type === "direct"
									? presence
										? Object.values(presence)
												.map(ipd => ipd.isOnline)
												.includes(true)
										: false
									: null
							}
						/>
						<h3 className="chatcard__wrapper___usnm_ elipse">
							{display.name || <Skeleton width={140} />}
						</h3>
						<p
							className={
								"chatcard__wrapper__lastmessage elipse" +
								(typingToMe ? " typing" : "")
							}>
							{typingToMe ? (
								`${display.name} is typing...`
							) : lastmsg ? (
								mentionUsers(lastmsg, reduxuid, listeners.users)
							) : (
								<Skeleton width={80} />
							)}
						</p>
						{unread !== 0 && (
							<div className="chatcard__wrapper__unread">
								<p className="chatcard__wrapper__unread__p">
									{unread}
								</p>
							</div>
						)}
					</div>
				</button>
				{ctm && (
					<ContextMenu
						SETctm={SETctm}
						ctm={ctm}
						options={[
							{
								title: "Clear Chat",
								icon: "trash",
								access: !!cid,
								onClick: () => {
									SETcfm(true)
								}
							}
						]}
					/>
				)}
				{cfm && (
					<ConfirmMenu
						SETcfm={SETcfm}
						action="clear this chat"
						trueMsg="Clear it"
						falseMsg="Back"
						onRes={res => {
							if (res && chat) {
								Functions.clearChat(reduxuid, chat.cid)
								history.push("/chat")
							}
						}}
					/>
				)}
			</div>
		</Flipped>
	)
}
