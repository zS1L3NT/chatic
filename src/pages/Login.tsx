import { signOut } from "firebase/auth"
import { useContext, useEffect } from "react"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"

import AuthContext from "../contexts/AuthContext"
import { auth } from "../firebase"

const _Login = () => {
	const navigate = useNavigate()
	const user = useContext(AuthContext)

	const [signInWithGoogle] = useSignInWithGoogle(auth)

	useEffect(() => {
		if (user) {
			navigate("/chat")
		}
	}, [user])

	return (
		<>
			<button onClick={() => signInWithGoogle()}>Sign In</button>
			<button onClick={() => signOut(auth)}>Sign Out</button>
		</>
	)
}

export default _Login
