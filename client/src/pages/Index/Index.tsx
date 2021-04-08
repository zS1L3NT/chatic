import React, { useEffect, useState } from "react"
import { FadeRedirect, Redirect } from "../../App"
import reactbase from "../../assets/images/reactbase.svg"
import native from "../../assets/images/native.png"
import "./Index.scss"
import Google from "../../components/SocialAuth/Google/Google"
import Firebase from "../../Firebase"
import { useHistory } from "react-router-dom"
import wall from "../../assets/images/wall.png"

const time = (ms: number) => new Promise(res => setTimeout(res, ms))

export default function Index() {
	const [animate, SETanimate] = useState<{
		reactbase: string
		native: string
		startnow: string
	}>({
		reactbase: "",
		native: "",
		startnow: ""
	})

	useEffect(FadeRedirect, [])
	const history = useHistory()

	// Fade the landing down
	useEffect(() => {
		;(async () => {
			await time(1000)
			SETanimate({
				reactbase: "animate",
				native: "",
				startnow: ""
			})
			await time(1000)
			SETanimate({
				reactbase: "animate",
				native: "animate",
				startnow: ""
			})
			await time(1000)
			SETanimate({
				reactbase: "animate",
				native: "animate",
				startnow: "animate"
			})
		})()
	}, [])

	return (
		<article id="index-page">
			<div className="landing" data-aos="zoom-in">
				<div className="landing__motto">
					<img
						className={"landing__motto__logo " + animate.reactbase}
						src={wall}
						alt=""
					/>
					<h3 className="landing__motto__data">
						Simple. Secure. Fast.
					</h3>
				</div>
				<div className={"landing__reactbase " + animate.reactbase}>
					<img
						className="landing__reactbase__img"
						src={reactbase}
						alt="ReactBase"
					/>
					<p className="landing__reactbase__text">
						Built with Google's Firebase server, Secured by Google
						Cloud's security features
					</p>
				</div>
				<div className={"landing__native " + animate.native}>
					<p className="landing__native__text">
						Native support for Android devices will be coming soon!
						iOS is still currently not supported
					</p>
					<img className="landing__native__img" src={native} alt="" />
				</div>
				<div className={"landing__startnow " + animate.startnow}>
					<h3 className="landing__startnow__text">
						Start chatting now!
					</h3>
					{Firebase.isAuth() ? (
						<button
							type="button"
							className="landing__startnow__tochats"
							onClick={() => {
								Redirect(history, "/chat")
							}}>
							Go To Chats
						</button>
					) : (
						<Google SETerr={() => {}} />
					)}
				</div>
			</div>
		</article>
	)
}
