import { signOut } from "firebase/auth"
import { useEffect } from "react"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"

import { auth } from "../firebase"
import useAppSelector from "../hooks/useAppSelector"

const _Login = () => {
	const navigate = useNavigate()

	const [signInWithGoogle] = useSignInWithGoogle(auth)

	const user = useAppSelector(state => state.auth)

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
