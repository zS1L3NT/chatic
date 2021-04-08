import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { FadeRedirect, Redirect } from "../../App"
import AnchorButton from "../../components/AnchorButton/AnchorButton"
import Input from "../../components/Input/Input"
import Google from "../../components/SocialAuth/Google/Google"
import Firebase from "../../Firebase"
import { useFadeState } from "../../hooks/useFadeState"
import "./Login.scss"

export default function Login() {
	const [eml, SETeml] = useState("")
	const [pswd, SETpswd] = useState("")
	const [button, SETbutton] = useState("")
	const [err, SETerr] = useFadeState()

	const history = useHistory()
	const reduxuid = useSelector(state => state.uid)
	const active = useSelector(state => state.active)
	useEffect(FadeRedirect, [])

	/**
	 * Function that signs user into their account
	 * @param event Event
	 */
	const onSubmit = async (event: any) => {
		event.preventDefault()

		SETbutton("shorten")

		Firebase.EmailSignIn(eml, pswd)
			.then(() => {
				SETbutton("")
			})
			.catch(err => {
				SETerr(err.message)
				SETbutton("")
			})
	}

	/**
	 * & Method to redirect user if they are logged in
	 */
	useEffect(() => {
		Firebase.CheckRedirect(history, active, '/chat')
	}, [history, active, reduxuid])

	return (
		<article id="login-page">
			<div className="content">
				<div className="content__title">
					<h1 className="content__title__h1">Login</h1>
				</div>

				<form className="content__form" onSubmit={onSubmit}>
					<Input
						label="Email"
						type="email"
						autoComplete="email"
						onChange={e => {
							SETeml(e.target.value)
							SETerr("")
						}}
					/>

					<Input
						label="Password"
						type="password"
						autoComplete={"password"}
						onChange={e => {
							SETpswd(e.target.value)
							SETerr("")
						}}
					/>

					<AnchorButton
						onClick={() => Redirect(history, "/forgot")}
						className="content__form__forgot">
						Forgot Password
					</AnchorButton>

					<p
						className="content__form__error"
						style={{ animation: err.animation }}>
						{err.value}
					</p>

					<button
						type="submit"
						onClick={onSubmit}
						className={`content__form__login ${
							eml && pswd ? "" : "disable"
						} ${button}`}
						disabled={!(eml && pswd)}>
						{button === "shorten" ? "|" : "Login"}
					</button>
				</form>

				<div className="content__other_ways">
					<p className="content__other_ways__or">Or Continue With</p>
					<div className="content__other_ways__icons">
						<Google SETerr={SETerr} />
					</div>
				</div>

				<div className="content__register">
					<p className="content__register__p">
						Don't have an account?
					</p>
					<AnchorButton
						className="content__register__button"
						onClick={() => Redirect(history, "/register")}>
						Register here
					</AnchorButton>
				</div>
			</div>
		</article>
	)
}
