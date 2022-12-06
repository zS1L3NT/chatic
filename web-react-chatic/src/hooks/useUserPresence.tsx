import { limit, orderBy, where } from "firebase/firestore"
import { useDebugValue } from "react"

import { presencesColl } from "../firebase"
import useAppCollection from "./useAppCollection"
import useOnUpdate from "./useOnUpdate"

const useUserPresence = (userId: string | null | undefined) => {
	const [presences] = useAppCollection(
		presencesColl,
		where("userId", "==", userId || "-"),
		orderBy("isOnline", "desc"),
		orderBy("lastSeen", "desc"),
		limit(1)
	)

	useDebugValue(presences?.[0] || null)

	return useOnUpdate(presences?.[0] || null)
}

export default useUserPresence
