import { IUpdateChatList } from "../ReduxTypes"

export const UpdateChatList = (cids: string[]): IUpdateChatList => ({
	type: "Got your chat list",
	cids
})
