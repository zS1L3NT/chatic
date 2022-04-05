import firebaseApp from "../firebaseApp"
import useAppDocument from "../hooks/useAppDocument"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"

const AuthContext = createContext<iUser | null>(null)

const AuthProvider = (props: PropsWithChildren<{}>) => {
	const auth = getAuth(firebaseApp)

	const [user, setUser] = useState<iUser | null>(null)

	const [authUser, _, authError] = useAuthState(auth)
	const [dbUser, dbUserError] = useAppDocument("users", authUser?.uid)

	useEffect(() => {
		setUser(dbUser)
	}, [dbUser])

	return (
		<AuthContext.Provider value={user}>
			{props.children}
		</AuthContext.Provider>
	)
}

export { AuthProvider }
export default AuthContext
