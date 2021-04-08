import React from "react"
import Firebase from "../../../Firebase"
import Repo from "../../../Repository"
import { IUser } from "../../../Types"
import AnchorButton from "../../AnchorButton/AnchorButton"
import "./Google.scss"

interface props {
	SETerr: any
}

export default function Google(props: props) {
	const { SETerr } = props

	const onClick = () => {
		Firebase.GoogleSignIn()
			.then(async ({ user: GoogleUser }) => {
				if (!GoogleUser?.uid || !GoogleUser?.displayName || !GoogleUser?.email)
					throw new Error("Authentication error: No details provided")
				const { uid, displayName, email: eml } = GoogleUser

				Repo.user(uid).get(
					() => {},
					async () => {
						const usnm = displayName.replaceAll(" ", "")
						const data: IUser = {
							uid,
							usnm,
							eml,
							pfp: GoogleUser.photoURL || "http://cdn.onlinewebfonts.com/svg/img_83486.png",
							chatorder: [],
							unread: {}
						}

						await Repo.user(uid).set(data)
					}
				)
			})
			.catch(err => {
				SETerr(err.message)
			})
	}

	return (
		<AnchorButton className="icon google" onClick={onClick}>
			<i className="fa fa-google"></i>
		</AnchorButton>
	)
}
