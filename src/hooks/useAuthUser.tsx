import firebaseApp from "../firebaseApp"
import useAppDocument from "./useAppDocument"
import { getAuth } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"

const useAuthUser = <T extends boolean = false>(
	assert?: T
): T extends true ? [iUser] : [iUser, null] | [null, Error] | [null, null] => {
	const auth = getAuth(firebaseApp)

	const [authUser, _, authError] = useAuthState(auth)
	const [user, userError] = useAppDocument("users", authUser?.uid)

	if (assert) {
		if (user) {
			// @ts-ignore
			return [user]
		}
		throw new Error("Failed to assert that the current authenticated user exists")
	} else if (user) {
		// @ts-ignore
		return [user, null]
	} else if (authError || userError) {
		// @ts-ignore
		return [null, authError || userError]
	} else {
		// @ts-ignore
		return [null, null]
	}
}

export default useAuthUser
