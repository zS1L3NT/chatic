import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import GroupList from "./GroupList/GroupList"
import GroupProfile from "./GroupProfile/GroupProfile"
import "./Groups.scss"

export default function Groups() {
	const [match, SETmatch] = useState<RegExpMatchArray | null>()

	const location = useLocation()

	useEffect(() => {
		SETmatch(location.pathname.match(/^\/settings\/groups\/(.*)/))
	}, [location.pathname])

	return (
		<main className="groups">
			{match ? (
				<GroupProfile cid={match[1]} />
			) : (
				<GroupList />
			)}
		</main>
	)
}
