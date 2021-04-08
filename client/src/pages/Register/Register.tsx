import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { FadeRedirect, Redirect } from "../../App"
import AnchorButton from "../../components/AnchorButton/AnchorButton"
import Input from "../../components/Input/Input"
import Google from "../../components/SocialAuth/Google/Google"
import Firebase from "../../Firebase"
import Repo from "../../Repository"
import { useFadeState } from "../../hooks/useFadeState"
import { IUser } from "../../Types"
import "./Register.scss"

export default function Register() {
	const [usnm, SETusnm] = useState("")
	const [eml, SETeml] = useState("")
	const [pswd, SETpswd] = useState("")
	const [pswdConf, SETpswdConf] = useState("")
	const [button, SETbutton] = useState("")
	const [err, SETerr] = useFadeState()

	const history = useHistory()
	const reduxuid = useSelector(state => state.uid)
	const active = useSelector(state => state.active)
	useEffect(FadeRedirect, [])

	/**
	 * Function to check if username is alphanumeric, and between 3 ~ 20 characters.
	 * Passwords also need to be identical.
	 * Username also needs to be unique.
	 *
	 * @param event Event
	 */
	const onSubmit = async (event: any) => {
		event.preventDefault()

		SETbutton("shorten")

		if (!usnm.match(/^\w*$/)?.[0])
			return SETerr(
				"Usearname must only contain letters, numbers or underscores"
			)
		if (usnm.length < 3 || usnm.length > 20)
			return SETerr("Username must be between 3 and 20 characters")
		if (pswd !== pswdConf) return SETerr("Passwords not indentical!")

		await Repo.users()
			.where("usnm", "==", usnm)
			.get(users => {
				if (Object.values(users).length > 0)
					return SETerr("Username not available!")

				Firebase.EmailSignUp(eml, pswd)
					.then(async ({ user }) => {
						if (user) {
							const FirebaseUser: IUser = {
								uid: user.uid,
								usnm,
								eml,
								pfp:
									"http://cdn.onlinewebfonts.com/svg/img_83486.png",
								chatorder: [],
								unread: {}
							}

							await Repo.user(user.uid).set(FirebaseUser)
						}
						SETbutton("")
					})
					.catch(err => {
						SETerr(err.message)
						SETbutton("")
					})
			})
	}

	/**
	 * & Method to redirect user if they are logged in
	 */
	useEffect(() => {
		Firebase.CheckRedirect(history, active, '/chat')
	}, [history, active, reduxuid])

	return (
		<article id="register-page">
			<div className="content">
				<div className="content__title">
					<h1 className="content__title__h1">Register</h1>
				</div>

				<form className="content__form" onSubmit={onSubmit}>
					<Input
						label="Username"
						type="text"
						onChange={e => {
							SETusnm(e.target.value)
							SETerr("")
						}}
					/>

					<Input
						label="Email"
						type="email"
						onChange={e => {
							SETeml(e.target.value)
							SETerr("")
						}}
					/>

					<Input
						label="Password"
						type="password"
						onChange={e => {
							SETpswd(e.target.value)
							SETerr("")
						}}
					/>

					<Input
						label="Confirm Password"
						type="password"
						onChange={e => {
							SETpswdConf(e.target.value)
							SETerr("")
						}}
					/>

					<p
						className="content__form__error"
						style={{ animation: err.animation }}>
						{err.value}
					</p>

					<button
						type="submit"
						onClick={onSubmit}
						className={`content__form__register ${
							usnm && eml && pswd && pswdConf ? "" : "disable"
						} ${button}`}
						disabled={!(usnm && eml && pswd && pswdConf)}>
						{button === "shorten" ? "|" : "Register"}
					</button>
				</form>

				<div className="content__other_ways">
					<p className="content__other_ways__or">Or Continue With</p>
					<div className="content__other_ways__icons">
						<Google SETerr={SETerr} />
					</div>
				</div>

				<div className="content__login">
					<p className="content__login__p">
						Already have an account?
					</p>
					<AnchorButton
						className="content__login__button"
						onClick={() => Redirect(history, "/login")}>
						Login here
					</AnchorButton>
				</div>
			</div>
		</article>
	)
}
