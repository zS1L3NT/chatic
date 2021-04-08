import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import Repo from "../../../../Repository"
import GroupCard from "./GroupCard/GroupCard"

export default function GroupList() {
	const [list, SETlist] = useState<string[]>(Array(8).fill(''))

	const reduxuid = useSelector(state => state.uid)
	const location = useLocation()

	useEffect(() => {
		return Repo.user(reduxuid).observe(user => SETlist(user.chatorder), () =>
			console.error(`[GroupList.tsx] No chat order found for "${reduxuid}"???`)
		)
	}, [reduxuid, location.pathname])

	return (
		<section className="grouplist">
			{list.map(item => (
				<GroupCard key={item} cid={item} />
			))}
		</section>
	)
}
