import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import {
	FadeRedirect,
	getOtherDirectUser,
	ListDifference,
	Redirect
} from "../../App"
import ChatContent from "./ChatContent/ChatContent"
import ChatDetails from "./ChatDetails/ChatDetails"
import ChatList from "./ChatList/ChatList"
import Firebase from "../../Firebase"
import Functions from "../../Functions"
import Repo from "../../Repository"
import { usePrevious } from "../../hooks/usePrevious"
import { UpdateChatList } from "../../redux/actions/CIDsActions"
import {
	AddUIDToListening,
	SetListenedPresence,
	SetListenedUser
} from "../../redux/actions/ListenersActions"
import { IChat } from "../../Types"
import "./Chat.scss"
import { useBeforeunload } from "react-beforeunload"

export default function Chat(props: any) {
	const { params } = props.match
	const [chat, SETchat] = useState<IChat>()
	const [error, SETerror] = useState("")
	const [subs, SETsubs] = useState<{ [uid: string]: () => void }>({})

	const ipv4 = useSelector(state => state.ipv4)
	const active = useSelector(state => state.active)
	const reduxuid = useSelector(state => state.uid)
	const listeners = useSelector(state => state.listeners)

	useEffect(FadeRedirect, [])
	const history = useHistory()
	const dispatch = useDispatch()
	const previousUIDs = usePrevious(listeners.uids)
	const previousSubs = usePrevious(subs)
	const { database } = Firebase

	/**
	 * & Method to redirect user if they are logged in
	 */
	useEffect(() => {
		Firebase.CheckRedirect(history, active)
	}, [history, active, reduxuid])

	/**
	 * & Handle user presence
	 */
	useEffect(() => {
		const uid = Firebase.isAuth()
		if (!uid || !ipv4 || active !== false) return

		const presenceRef = database.ref(`/`)

		database.ref(".info/connected").on("value", snap => {
			if (snap.val() === false) {
				Repo.user(uid).presenceIP(ipv4).set(Firebase.offline())
				return
			}

			presenceRef
				.onDisconnect()
				.set(null)
				.then(() => {
					Repo.user(uid).presenceIP(ipv4).set(Firebase.online())
				})
		})

		return () => {
			Repo.user(reduxuid).presenceIP(ipv4).set(Firebase.offline())
		}
	}, [database, history, reduxuid, ipv4, active])

	useBeforeunload(() => {
		if (reduxuid) {
			Repo.user(reduxuid).presenceIP(ipv4).set(Firebase.offline())
		}
	}, [reduxuid, ipv4])

	/**
	 * & Get the current user chat list
	 */
	useEffect(() => {
		if (!reduxuid) return undefined
		Repo.user(reduxuid).observe(list =>
			dispatch(UpdateChatList(list.chatorder || []))
		)
	}, [dispatch, reduxuid, subs, previousSubs])

	/**
	 * & Handle URL
	 */
	useEffect(() => {
		if (!reduxuid) return undefined
		SETerror("")

		/**
		 * If the first uid is not matching the redux uid
		 */
		if (!Firebase.isAuth()) {
			return Redirect(history, `/login`)
		}

		/**
		 * If there is a second uid in the params
		 * This indicates that you are chatting with someone
		 */
		if (params.cid) {
			Repo.user(reduxuid).update({
				unread: {
					[params.cid]: 0
				}
			})
			const unlistener = Repo.chat(params.cid).observe(
				chat => {
					if (chat.users.indexOf(reduxuid) < 0) {
						SETerror(`You aren't a participant of this group :(`)
						SETchat(undefined)
						return
					}
					SETchat(chat)
					SETerror("")
				},
				() => {
					SETerror(`No such chat found in the server...???`)
					SETchat(undefined)
					return
				}
			)

			return () => {
				unlistener()
				Repo.user(reduxuid).update({
					unread: {
						[params.cid]: 0
					}
				})
			}
		}

		/**
		 * If there is a temporary chat with a uid_
		 */
		if (params.uid_) {
			if (reduxuid === params.uid_) {
				SETerror(`You're trying to talk to youself?`)
				SETchat(undefined)
				return
			} else {
				Repo.chats()
					.where("users", "array-contains", reduxuid)
					.where("type", "==", "direct")
					.get(chats => {
						for (const cid in chats) {
							const chat = chats[cid]
							if (
								params.uid_ ===
								getOtherDirectUser(chat.users, reduxuid)
							) {
								history.push(`/chat/~${cid}`)
								return
							}
						}
						Repo.user(params.uid_).get(
							() => {
								dispatch(AddUIDToListening(params.uid_))
								SETchat({
									cid: Repo.newChatID(),
									admins: [],
									users: [reduxuid, params.uid_],
									type: "direct",
									name: "",
									icon: "",
									lastmsg: "",
									media: []
								})
							},
							() => {
								SETerror(
									`No such chat found in the server...???`
								)
								SETchat(undefined)
							}
						)
					})
			}
		}

		if (!params.uid_ && !params.cid) {
			Functions.onChangeChat(reduxuid, "", ipv4)
			SETchat(undefined)
			SETerror("")
		}
	}, [dispatch, history, params, reduxuid, ipv4])

	/**
	 * & Handle user subscriptions
	 */
	useEffect(() => {
		if (listeners.uids && previousUIDs) {
			ListDifference(previousUIDs, listeners.uids)
				.added(added => {
					console.log("added: ", added)
					for (let i = 0; i < added.length; i++) {
						const uid = added[i]
						const usersub = Repo.user(uid).observe(
							user => dispatch(SetListenedUser(user)),
							() =>
								console.error(
									`[Chat.tsx] UID "${uid}" does not exist???`
								)
						)
						if (uid === reduxuid) {
							SETsubs(prev => ({
								...prev,
								[uid]: usersub
							}))
							continue
						}

						const presencesub = Repo.user(uid)
							.presence()
							.observe(presence =>
								dispatch(SetListenedPresence(uid, presence))
							)
						SETsubs(prev => ({
							...prev,
							[uid]: () => {
								usersub()
								presencesub()
							}
						}))
					}
				})
				.removed(removed => {
					console.log("removed: ", removed)
					for (let i = 0, il = removed.length; i < il; i++) {
						const uid = removed[i]
						subs[uid]?.()
					}
				})
		}
	}, [dispatch, listeners.uids, previousUIDs, reduxuid, subs])

	return (
		<article id="chat-page">
			<div className="content">
				<ChatList />
				<ChatContent chat={chat} error={error} />
				<ChatDetails chat={chat} />
			</div>
		</article>
	)
}
