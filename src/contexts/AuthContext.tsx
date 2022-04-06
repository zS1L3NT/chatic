import { getAuth } from "firebase/auth"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

import firebaseApp from "../firebaseApp"
import useAppDocument from "../hooks/useAppDocument"

const AuthContext = createContext<iUser | null>(null)

const _AuthProvider = (props: PropsWithChildren<{}>) => {
	const auth = getAuth(firebaseApp)

	const [user, setUser] = useState<iUser | null>(null)

	const [authUser, _] = useAuthState(auth)
	const [dbUser] = useAppDocument("users", authUser?.uid)

	useEffect(() => {
		setUser(dbUser)
	}, [dbUser])

	return <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
}

export { _AuthProvider as AuthProvider }
export default AuthContext
