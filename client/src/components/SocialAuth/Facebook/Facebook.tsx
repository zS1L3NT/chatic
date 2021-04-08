import React from "react"
// import Firebase from "../../../Firebase"
import AnchorButton from "../../AnchorButton/AnchorButton"
import "./Facebook.scss"
// import firebase from "firebase"
// import { FirebaseUser, User } from "../../../types/AuthTypes"
// import { login } from "../../../actions/AuthActions"

interface props {
	SETerr: React.Dispatch<React.SetStateAction<string>>
}

// const { firestore } = Firebase
// const Users = firestore.collection("users")

export default function Facebook(props: props) {
	const { SETerr } = props

	const onClick = () => {
		// Firebase.FacebookSignIn()
		// 	.then(async response => {
		// 		const FacebookUser = response.user
		// 		const token = (response.credential as firebase.auth.OAuthCredential)
		// 			?.accessToken

		// 		console.log("FacebookUser: ", FacebookUser)
		// 		console.log("Token: ", token)
		// 		if (!FacebookUser?.uid || !FacebookUser?.displayName)
		// 			throw new Error("Detailed not included")
		// 		const { uid, displayName: usnm, email: eml } = FacebookUser

		// 		// Possible for Facebook to return email as null if email is unverified
		// 		if (!eml) throw new Error("Email not verified on Facebook")

		// 		// Get friends or use empty array
		// 		const data: FirebaseUser = {
		// 			usnm,
		// 			eml,
		// 			friends: []
		// 		}

		// 		try {
		// 			// Test if firestore has any user with the same uid
		// 			const doc = await Users.doc(uid).get()
		// 			if (doc.exists) {
		// 				// User with uid found
		// 				// Place friends into the data object
		// 				data.friends = (doc.data() as FirebaseUser).friends
		// 			} else {
		// 				// No user with uid found
		// 				// Create new user with uid and data from Google
		// 				await Users.doc(uid).set(data)
		// 			}
		// 		} catch (err) {
		// 			console.error(err)
		// 		}

		// 		// Create object to place into Redux state
		// 		const ReduxUser: User = {
		// 			...data,
		// 			uid
		// 		}

		// 		// Dispatch Redux login
		// 		dispatch(login(ReduxUser))
		// 	})
		// 	.catch(err => {
		// 		SETerr(err.message)
		// 		console.error(err)
		// 	})
	}

	return (
		<AnchorButton className="icon facebook" onClick={onClick}>
			<i className="fa fa-facebook"></i>
		</AnchorButton>
	)
}
