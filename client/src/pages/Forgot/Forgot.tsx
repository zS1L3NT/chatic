import React, { useEffect, useState } from "react"
import { FadeRedirect } from "../../App"
import Input from "../../components/Input/Input"
import Firebase from "../../Firebase"
import { useFadeState } from "../../hooks/useFadeState"
import "./Forgot.scss"

export default function Forgot() {
	const [eml, SETeml] = useState("")
	const [button, SETbutton] = useState("")
	const [res, SETres] = useFadeState()

	useEffect(FadeRedirect, [])

	/**
	 * Function to send recovery email to user
	 * @param event Event
	 */
	const onSubmit = (event: any) => {
		event.preventDefault()

		SETbutton("shorten")

		Firebase.ForgotPassword(eml)
			.then(() => {
				SETres("Email sent successfully!")
				SETbutton("")
			})
			.catch(err => {
				SETres(err.message)
				SETbutton("")
			})
	}

	return (
		<article id="forgot-page">
			<div className="content">
				<div className="content__title">
					<h1 className="content__title__h1">Forgot Password</h1>
				</div>

				<p className="content__desc">
					Type in the registered email address of the account you want
					to reset the password for
				</p>

				<p
					className="content__msg"
					style={{ animation: res.animation }}>
					{res.value}
				</p>

				<form className="content__form" onSubmit={onSubmit}>
					<Input
						label="Email"
						type="email"
						onChange={e => {
							SETeml(e.target.value)
							SETres("")
						}}
					/>

					<button
						type="submit"
						onClick={onSubmit}
						className={`content__form__button ${eml ? "" : "disable"} ${button}`}
						disabled={!eml}>
						{button === "shorten" ? "|" : "Send links"}
					</button>
				</form>
			</div>
		</article>
	)
}
