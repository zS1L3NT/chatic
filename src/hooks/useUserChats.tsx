import { limit, orderBy, where } from "firebase/firestore"
import { useDebugValue } from "react"

import { chatsColl } from "../firebase"
import useAppCollection from "./useAppCollection"
import useAppSelector from "./useAppSelector"

const useUserChats = (max: number) => {
	const user = useAppSelector(state => state.auth)

	const [chats] = useAppCollection(
		chatsColl,
		where("users", "array-contains", user?.id),
		orderBy("lastUpdated", "desc"),
		limit(max)
	)

	useDebugValue(chats)

	return chats
}

export default useUserChats
