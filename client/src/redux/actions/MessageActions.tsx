import { IMessage } from "../../Types"
import { ISetFirestoreMessages } from "../ReduxTypes"

export const SetFirestoreMessages = (
	cid: string,
	messages: IMessage[]
): ISetFirestoreMessages => ({
	type: "Chat was updated",
	messages,
	cid
})
