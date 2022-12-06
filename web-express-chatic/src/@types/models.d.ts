declare interface iUser {
	id: string
	username: string
	email: string
	photo: string
}

declare interface iFriendship {
	id: string
	users: string[]
	date: number
}

declare interface iHandshake {
	id: string
	users: string[]
	requestId: string
	targetId: string
	date: number
}

declare interface iPresence {
	id: string
	userId: string
	deviceId: string
	isOnline: boolean
	typingTo: string | null
	lastSeen: number
}

declare interface iChat {
	id: string
	users: string[]
	lastUpdated: number
}

declare interface iMessage {
	id: string
	content: string
	media: string | null
	date: number
	replyId: string | null
	userId: string
	chatId: string
	status: 0 | 1 | 2 | 3
}
