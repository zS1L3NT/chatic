import { getAuth, signOut } from "firebase/auth"
import { useContext, useEffect } from "react"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"

import AuthContext from "../contexts/AuthContext"
import firebaseApp from "../firebaseApp"

const Login = () => {
	const auth = getAuth(firebaseApp)

	const navigate = useNavigate()
	const user = useContext(AuthContext)

	const [signInWithGoogle] = useSignInWithGoogle(auth)

	useEffect(() => {
		if (user) {
			navigate("/")
		}
	}, [user])

	return (
		<>
			<button onClick={() => signInWithGoogle()}>Sign In</button>
			<button onClick={() => signOut(auth)}>Sign Out</button>
		</>
	)
}

export default Login
