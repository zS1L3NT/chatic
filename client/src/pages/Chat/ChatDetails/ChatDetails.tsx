import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { getOtherDirectUser, Redirect } from "../../../App"
import { IChat } from "../../../Types"
import AsyncImage from "../../../components/AsyncImage/AsyncImage"
import "./ChatDetails.scss"

interface props {
	chat: IChat | undefined
}

export default function ChatDetails(props: props) {
	const { chat } = props
	const [displayName, SETdisplayName] = useState("")
	const [displayIcon, SETdisplayIcon] = useState("")

	const reduxuid = useSelector(state => state.uid)
	const listeners = useSelector(state => state.listeners)
	const history = useHistory()

	/**
	 * & Checks for presence in the chat object in props
	 * ? If ChatProfile is a user
	 *     Display a presence status
	 * ? Else
	 *     Don't show any presence status
	 */
	useEffect(() => {
		if (chat) {
			if (chat.type === "direct") {
				const _uid_ = getOtherDirectUser(chat.users, reduxuid)
				SETdisplayName(listeners.users[_uid_]?.usnm)
				SETdisplayIcon(listeners.users[_uid_]?.pfp)
			} else {
				SETdisplayName(chat.name)
				SETdisplayIcon(chat.icon)
			}
		}
	}, [chat, reduxuid, listeners.users])

	return chat ? (
		<aside className="chatdetails">
			<AsyncImage src={displayIcon} className="chatdetails__icon" />
			<h1 className="chatdetails__name" onClick={() => {
				if (chat.type === "group") Redirect(history, `/settings/groups/${chat.cid}`)
			}}>{displayName}</h1>
			{chat.type === "group" && (
				<ul className="chatdetails__members">
					{chat.users.map(uid => (
						<li className="chatdetails__member" key={uid}>
							<AsyncImage
								src={listeners.users?.[uid]?.pfp}
								className="chatdetails__member__pfp"
							/>
							<div className="chatdetails__member__info">
								<button
									className="chatdetails__member__info__name elipse"
									onClick={() =>
										history.push(`/chat/@${uid}`)
									}>
									{listeners.users?.[uid]?.usnm || (
										<Skeleton width={100} />
									)}
								</button>
								<p className="chatdetails__member__info__access">
									{chat.admins.indexOf(uid) >= 0
										? "Administrator"
										: "Member"}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</aside>
	) : (
		<></>
	)
}
