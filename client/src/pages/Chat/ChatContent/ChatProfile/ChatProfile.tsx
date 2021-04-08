import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useSelector } from "react-redux"
import { DateDiff, getOtherDirectUser } from "../../../../App"
import { IPresence, IChat } from "../../../../Types"
import AsyncImage from "../../../../components/AsyncImage/AsyncImage"
import "./ChatProfile.scss"

interface props {
	chat: IChat
}

export default function User(props: props) {
	const { chat } = props
	const [displayName, SETdisplayName] = useState("")
	const [displayIcon, SETdisplayIcon] = useState("")

	const [presence, SETpresence] = useState<IPresence>()
	const reduxuid = useSelector(state => state.uid)
	const listeners = useSelector(state => state.listeners)

	/**
	 * & Checks for presence in the chat object in props
	 * ? If ChatProfile is a user
	 *     Display a presence status
	 * ? Else
	 *     Don't show any presence status
	 */
	useEffect(() => {
		if (chat.type === "direct") {
			const _uid_ = getOtherDirectUser(chat.users, reduxuid)

			SETpresence(listeners.presences[_uid_])

			SETdisplayName(listeners.users[_uid_]?.usnm)
			SETdisplayIcon(listeners.users[_uid_]?.pfp)
		} else {
			SETdisplayName(chat.name)
			SETdisplayIcon(chat.icon)
		}
	}, [chat, reduxuid, listeners.users, listeners.presences])

	const getLastSeen = () => {
		if (!presence || Object.keys(presence).length === 0)
			return "Not online recently"
		const lastseens = Object.values(presence).map(ipd => ipd.lastseen)
		const earliest = Math.min(...lastseens)
		return "Last seen " + DateDiff(earliest)
	}

	return (
		<section className="chatprofile">
			<AsyncImage src={displayIcon} className="chatprofile__icon" />
			<div className="chatprofile__info">
				<h1 className="chatprofile__info__name">
					{displayName || <Skeleton width={140} />}
				</h1>
				<p className="chatprofile__info__status">
					{chat.type === "direct" ? (
						presence ? (
							presence.isOnline
								? "Online"
								: getLastSeen()
							
						) : (
							<Skeleton width={100} />
						)
					) : (
						`${chat.users.length} member${
							chat.users.length > 1 ? "s" : ""
						}`
					)}
				</p>
			</div>
		</section>
	)
}
