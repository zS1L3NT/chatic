import { PropsWithChildren, useEffect } from "react"

import { usersColl } from "../firebase"
import useAppDispatch from "../hooks/useAppDispatch"
import useAppDocument from "../hooks/useAppDocument"
import { set_auth } from "../slices/AuthSlice"

const _AuthProvider = (props: PropsWithChildren<{}>) => {
	const dispatch = useAppDispatch()

	// const [authUser, _] = useAuthState(auth)
	const [dbUser] = useAppDocument(usersColl, "user-1")

	useEffect(() => {
		dispatch(set_auth(dbUser))
	}, [dbUser])

	return <>{props.children}</>
}

export default _AuthProvider
