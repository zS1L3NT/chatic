import { limit, orderBy, where } from "firebase/firestore"
import { useContext, useDebugValue } from "react"

import AuthContext from "../contexts/AuthContext"
import useAppCollection from "./useAppCollection"

const useUserChats = (max: number) => {
	const user = useContext(AuthContext)
	const [chats] = useAppCollection(
		"chats",
		where("users", "array-contains", user?.id),
		orderBy("lastUpdated", "desc"),
		limit(max)
	)

	useDebugValue(chats)

	return chats
}

export default useUserChats
