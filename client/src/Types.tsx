import firebase from "firebase/app"

/**
 * User ID
 * @access /users/**{uid}**
 *
 * @type string
 */
type uid = string

/**
 * Chat ID
 * @access /chats/**{cid}**
 *
 * @type string
 */
type cid = string

/**
 * Message ID
 * @access /chats/{cid}/messages/**{mid}**
 *
 * @type string
 */
type mid = string

/**
 * User information
 * @access /users/{uid}/**{IUser}**
 *
 * @param uid uid
 * @param usnm string
 * @param eml string
 * @param pfp string
 * @param chatorder string[]
 * @param unread cid => number
 */
export interface IUser {
	uid: uid
	usnm: string
	eml: string
	pfp: string
	chatorder: string[]
	unread: { [cid: string]: number }
}

/**
 * Update User information
 * @access /users/{uid}/**{IUser}**
 *
 * @param uid uid
 * @param usnm string
 * @param eml string
 * @param pfp string
 * @param chatorder string[]
 * @param unread cid => number
 */
export interface IUpdateUser {
	uid?: uid
	usnm?: string
	eml?: string
	pfp?: string
	chatorder?: string[] | firebase.firestore.FieldValue
	unread?: { [cid: string]: number | firebase.firestore.FieldValue }
}

/**
 * Chat information
 * @access /chats/{cid}/**{IChat}**
 *
 * @param cid cid
 * @param admins uid[]
 * @param users uid[]
 * @param type "direct" | "group"
 * @param media string[]
 * @param name string
 * @param icon string
 * @param lastmsg string
 * @param media mid[]
 */
export interface IChat {
	cid: cid
	admins: uid[]
	users: uid[]
	type: "direct" | "group"
	name: string
	icon: string
	lastmsg: string
	media: mid[]
}

/**
 * Update Chat information
 * @access /chats/{cid}/**{IChat}**
 *
 * @param cid cid
 * @param admins uid[]
 * @param users uid[]
 * @param type "direct" | "group"
 * @param media string[]
 * @param name string
 * @param icon string
 * @param lastmsg string
 * @param media mid[]
 */
export interface IUpdateChat {
	cid?: cid
	admins?: uid[] | firebase.firestore.FieldValue
	users?: uid[] | firebase.firestore.FieldValue
	type?: "direct" | "group"
	name?: string
	icon?: string
	lastmsg?: string
	media?: mid[] | firebase.firestore.FieldValue
}

/**
 * Message information
 * @access /chats/{cid}/messages/{mid}/**{IMessage}**
 *
 * @param mid mid
 * @param data string
 * @param sender uid
 * @param reply mid
 * @param time number
 * @param type "text" | "image"
 * @param status uid => 1 | 2 | 3
 */
export interface IMessage {
	mid: mid
	data: string
	sender: uid
	reply: mid
	time: number
	type: "text" | "image"
	status: { [uid: string]: 1 | 2 | 3 }
}

/**
 * Update Message information
 * @access /chats/{cid}/messages/{mid}/**{IMessage}**
 *
 * @param mid mid
 * @param data string
 * @param sender uid
 * @param reply mid
 * @param time number
 * @param type "text" | "image"
 * @param status uid => 1 | 2 | 3
 */
export interface IUpdateMessage {
	mid?: mid
	data?: string
	sender?: uid
	reply?: mid
	time?: number | firebase.firestore.FieldValue
	type?: "text" | "image"
	status?: { [uid: string]: 1 | 2 | 3 | firebase.firestore.FieldValue }
}

/**
 * Presence object indexed by IPV4
 * @access /user/{uid}/**{IPresence}**
 *
 * @type ipv4 => IPresenceData
 */
export interface IPresence {
	[ipv4: string]: IPresenceData
}

/**
 * Presence information
 * @access /user/{uid}/presence/{ipv4}/**{IPresenceData}**
 *
 * @param isOnline boolean
 * @param lastseen number
 * @param listening cid
 * @param typing boolean
 */
export interface IPresenceData {
	isOnline: boolean
	lastseen: number
	listening: cid
	typing: boolean
}

/**
 * Update Presence information
 * @access /user/{uid}/presence/{ipv4}/**{IPresenceData}**
 *
 * @param isOnline boolean
 * @param lastseen number
 * @param listening cid
 * @param typing boolean
 */
export interface IUpdatePresenceData {
	isOnline?: boolean
	lastseen?: number | firebase.firestore.FieldValue
	listening?: cid
	typing?: boolean
}

/**
 * Status object indexed by Message ID
 * @access /chats/{cid}/messages/{mid}/>status/**{IStatusMID}**
 *
 * @type uid => IStatusUID
 */
export type IStatusMID = { [uid: string]: IStatusUID }

/**
 * Status of each individual message indexed by User ID
 * @access /chats/{cid}/messages/{mid}/>status/{uid}/**{IStatusUID}**
 *
 * @type 1 | 2 | 3
 */
export type IStatusUID = 1 | 2 | 3

/**
 * Invite object
 * @access /invites/**{IInvites}**
 *
 * @type iid => IInvite
 */
export type IInvites = { [iid: string]: IInvite }

/**
 * Invite information by Invite IDs
 * @access /invites/{iid}/**{IInvite}**
 *
 * @param cid string
 * @param expires number
 * @param uses number
 */
export interface IInvite {
	cid: cid
	expires: number
	uses: number
}

/**
 * Update Invite information by Invite IDs
 * @access /invites/{iid}/**{IInvite}**
 *
 * @param cid string
 * @param expires number
 * @param uses number
 */
export interface IUpdateInvite {
	cid?: cid
	expires?: number | firebase.firestore.FieldValue
	uses?: number | firebase.firestore.FieldValue
}
