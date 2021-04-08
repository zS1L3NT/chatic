import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { FadeRedirect } from "../../App"
import Groups from "./Groups/Groups"
import Profile from "./Profile/Profile"
import Security from "./Security/Security"
import Sidebar from "./Sidebar/Sidebar"
import Firebase from "../../Firebase"
import Repo from "../../Repository"
import { IUser } from "../../Types"
import "./Settings.scss"

export default function Settings(props: any) {
	const { params } = props.match
	const [menu, SETmenu] = useState<"profile" | "security" | "groups">(
		"profile"
	)
	const [user, SETuser] = useState<IUser>()

	const active = useSelector(state => state.active)
	const reduxuid = useSelector(state => state.uid)
	const history = useHistory()

	useEffect(FadeRedirect, [])

	/**
	 * & Method to redirect user if they are logged in
	 */
	useEffect(() => {
		Firebase.CheckRedirect(history, active)
	}, [history, active, reduxuid])

	useEffect(() => {
		if (reduxuid)
			return Repo.user(reduxuid).observe(SETuser, () =>
				console.error(
					`[Settings.tsx] UID "${reduxuid}" does not exist???`
				)
			)
	}, [history, reduxuid])

	useEffect(() => {
		switch (params.menu) {
			case "profile":
				SETmenu("profile")
				return
			case "security":
				SETmenu("security")
				return
			case "groups":
				SETmenu("groups")
				return
			default:
				history.push("/settings/profile")
		}
	}, [params.menu, history])

	return (
		<article id="settings-page">
			<div className="content">
				<Sidebar menu={menu} user={user} />
				{menu === "profile" ? <Profile user={user} /> : <></>}
				{menu === "security" ? <Security user={user} /> : <></>}
				{menu === "groups" ? <Groups /> : <></>}
			</div>
		</article>
	)
}
