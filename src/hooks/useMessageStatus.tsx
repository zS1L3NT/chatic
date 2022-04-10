import { where } from "firebase/firestore"

import useAppCollection from "./useAppCollection"

const useMessageStatus = (messageId: string | null | undefined) => {
	const [statuses] = useAppCollection("statuses", where("messageId", "==", messageId))

	return statuses?.[0] || null
}

export default useMessageStatus
