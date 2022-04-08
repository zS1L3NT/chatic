import { limit, orderBy, where } from "firebase/firestore"
import { useDebugValue } from "react"

import useAppCollection from "./useAppCollection"

const useUserPresence = (userId: string | null | undefined) => {
	const [presences] = useAppCollection(
		"presences",
		where("userId", "==", userId || "-"),
		orderBy("isOnline", "desc"),
		orderBy("lastSeen", "desc"),
		limit(1)
	)

	useDebugValue(presences?.[0] || null)

	return presences?.[0] || null
}

export default useUserPresence
