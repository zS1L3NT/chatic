import {
	IUser,
	IMessage,
	IPresence
} from "../Types"

export interface ISetUID {
	type: "Your UID was set"
	uid: string
}

export interface ISetIPV4 {
	type: "Your IPV4 was set"
	ipv4: string
}

export interface ISetActive {
	type: "Set activity"
	active: boolean
}

export interface IUpdateChatList {
	type: "Got your chat list"
	cids: string[]
}

export interface ISetFirestoreMessages {
	type: "Chat was updated"
	messages: IMessage[]
	cid: string
}

export interface IAddUIDToListening {
	type: "Listening to new UID..."
	uid: string
}

export interface IRemoveUIDFromListening {
	type: "Removed listener for UID"
	uid: string
}

export interface ISetListenedUser {
	type: "User data changed"
	user: IUser
}

export interface ISetListenedPresence {
	type: "User presence changed"
	uid: string
	presence: IPresence
}

export type UIDActions = ISetUID

export type IPV4Actions = ISetIPV4

export type ActiveActions = ISetActive

export type CIDsActions = IUpdateChatList

export type MessageActions = ISetFirestoreMessages

export type ListenerActions =
	| IAddUIDToListening
	| IRemoveUIDFromListening
	| ISetListenedUser
	| ISetListenedPresence

export type AppActions =
	| UIDActions
	| CIDsActions
	| MessageActions
	| ListenerActions
