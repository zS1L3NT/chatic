import React, { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { IChat } from "../../../../../Types"
import AsyncImage from "../../../../../components/AsyncImage/AsyncImage"
import "./GroupCard.scss"
import Repo from "../../../../../Repository"

interface props {
	cid?: string
}

export default function GroupCard(props: props) {
	const { cid } = props
	const [chat, SETchat] = useState<IChat>()

	const reduxuid = useSelector(state => state.uid)
	const history = useHistory()

	useEffect(() => {
		if (cid)
			return Repo.chat(cid).observe(SETchat, () => console.warn(`[GroupCard.tsx] No chat found for "${cid}"`))
	}, [cid])

	return chat ? (
		chat.type === "group" ? (
			<section className="groupcard">
				<AsyncImage src={chat.icon} className="groupcard__icon" />
				<h1 className="groupcard__name" onClick={() => history.push(`/settings/groups/${cid}`)}>
					{chat.name}
					{chat.users.indexOf(reduxuid) >= 0 ? " ☆" : ""}
				</h1>
			</section>
		) : (
			<></>
		)
	) : (
		<section className="groupcard">
			<AsyncImage src={""} className="groupcard__icon" />
			<h1 className="groupcard__name">
				<Skeleton width={200} />
			</h1>
		</section>
	)
}
