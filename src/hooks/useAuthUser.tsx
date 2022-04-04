import firebaseApp from "../firebaseApp"
import useAppDocument from "./useAppDocument"
import { getAuth } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"

const useAuthUser = (): [iUser, null] | [null, Error] | [null, null] => {
	const auth = getAuth(firebaseApp)

	const [authUser, _, authError] = useAuthState(auth)
	const [user, userError] = useAppDocument("users", authUser?.uid)

	if (user) {
		return [user, null]
	} else if (authError || userError) {
		return [null, authError || userError]
	} else {
		return [null, null]
	}
}

export default useAuthUser
