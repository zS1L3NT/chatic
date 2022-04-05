import firebaseApp from "../firebaseApp"
import useAuthUser from "../hooks/useAuthUser"
import { getAuth, signOut } from "firebase/auth"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"

const Login = () => {
	const auth = getAuth(firebaseApp)

	const [user, userError] = useAuthUser()
	const navigate = useNavigate()
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
