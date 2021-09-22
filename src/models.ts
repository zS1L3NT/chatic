export interface Document {
	id: string
}

export interface User extends Document {
	username: string
	email: string
	photo: string
}

export interface Friendship extends Document {
	users: string[]
	date: number
}

export interface Handshake extends Document {
	users: string[]
	requestId: string
	targetId: string
	date: number
}

export interface Presence extends Document {
	userId: string
	deviceId: string
	isOnline: boolean
	typingTo: string | null
	lastSeen: number
}

export interface Chat extends Document {
	admins: string[] | null
	users: string[]
	photo: string | null
	name: string | null
	type: number
}

export interface Message extends Document {
	content: string
	media: string | null
	date: number
	replyId: string | null
	userId: string
	chatId: string
}

export interface Invite extends Document {
	chatId: string
	expires: number
}

export interface Status extends Document {
	userId: string
	messageId: string
	chatId: string
	state: 0 | 1 | 2 | 3
}