import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { FadeRedirect, Redirect } from "../../App"
import { SetActive } from "../../redux/actions/ActiveActions"
import Repo from "../../Repository"
import "./Active.scss"

export default function Active() {
	const ipv4 = useSelector(state => state.ipv4)
	const reduxuid = useSelector(state => state.uid)
	const dispatch = useDispatch()
	const history = useHistory()

	useEffect(FadeRedirect, [])

	useEffect(() => {
		if (reduxuid && ipv4)
			return Repo.user(reduxuid)
				.presenceIP(ipv4)
				.observe(
					presence => {
						if (!presence.isOnline) {
							dispatch(SetActive(false))
							Redirect(history, "/chat")
						}
					},
					() => {
						dispatch(SetActive(false))
						Redirect(history, "/chat")
					}
				)
	}, [dispatch, history, reduxuid, ipv4])

	return (
		<article id="active-page">
			<div className="content">
				<div className="content__title">
					<h1 className="content__title__h1">
						Already logged in with IP address
					</h1>
				</div>
				<p className="content__desc">
					This is a rare error! Someone else (maybe you) is currently
					logged into your account with the same IP address of "{ipv4}
					". This could cause conflicts with our server since we use
					IP addresses to distinguish between different devices. This
					tab will load immediately after you close the other open tab
				</p>
			</div>
		</article>
	)
}
