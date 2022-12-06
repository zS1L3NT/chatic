import { useDebugValue } from "react"

import { usersColl } from "../firebase"
import useAppDocument from "./useAppDocument"
import useAppSelector from "./useAppSelector"
import useOnUpdate from "./useOnUpdate"

const useChatReceiver = (chat: iChat | null | undefined) => {
	const user = useAppSelector(state => state.auth)!

	const [receiver] = useAppDocument(usersColl, chat?.users.filter(id => id !== user?.id)[0])

	useDebugValue(receiver)

	return useOnUpdate(receiver)
}

export default useChatReceiver
